// website-cloner.js
import fs from "fs";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
import { fileURLToPath } from "url";
import pLimit from "p-limit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const limit = pLimit(10);
const assetMap = new Map();

/**
 * Sanitize filename from URL
 */
function getFilenameFromUrl(url) {
  const parsed = new URL(url);
  let filename = path.basename(parsed.pathname);
  if (!filename || filename === "/") filename = "file";

  if (parsed.search) {
    const params = Object.fromEntries(parsed.searchParams);
    if (params.url) {
      const inner = new URL(params.url, url);
      filename = path.basename(inner.pathname) || filename;
    } else {
      const hash = Buffer.from(parsed.search).toString("base64").slice(0, 6);
      const ext = path.extname(filename) || ".bin";
      filename = path.basename(filename, ext) + "_" + hash + ext;
    }
  }

  if (!path.extname(filename)) filename += ".bin";
  return filename;
}

/**
 * Download asset
 */
async function downloadFile(url, folder) {
  try {
    await fs.promises.mkdir(folder, { recursive: true });

    if (assetMap.has(url)) return assetMap.get(url);

    const filename = getFilenameFromUrl(url);
    const localPath = path.join(folder, filename);

    if (!fs.existsSync(localPath)) {
      const response = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 20000,
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      await fs.promises.writeFile(localPath, response.data);
      console.log(`✅ Asset: ${url} -> ${localPath}`);
    }

    assetMap.set(url, localPath);
    return localPath;
  } catch (err) {
    console.error(`❌ Failed asset: ${url} -> ${err.message}`);
    return null;
  }
}

/**
 * Clone one page (no recursion)
 */
async function clonePage(pageUrl, outputFolder) {
  try {
    const res = await axios.get(pageUrl, {
      timeout: 20000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(res.data);

    const tags = {
      img: "src",
      script: "src",
      link: "href",
      source: "src",
      video: "poster",
    };

    const downloadTasks = [];

    for (const [tag, attr] of Object.entries(tags)) {
      $(tag).each((_, el) => {
        const url = $(el).attr(attr);
        if (!url) return;

        const absUrl = new URL(url, pageUrl).href;
        let folder = "assets";
        if (tag === "img") folder = "img";
        else if (tag === "script") folder = "js";
        else if (tag === "link") folder = "css";
        else if (tag === "source" || tag === "video") folder = "videos";

        const targetFolder = path.join(outputFolder, folder);

        downloadTasks.push(
          limit(async () => {
            const localFile = await downloadFile(absUrl, targetFolder);
            if (localFile) {
              const relPath = path.relative(outputFolder, localFile).replace(/\\/g, "/");
              $(el).attr(attr, relPath);
            }
          })
        );
      });
    }

    await Promise.all(downloadTasks);

    // Fix Next.js image proxies
    $("img").each((_, el) => {
      const $el = $(el);

      let srcset = $el.attr("srcset");
      if (srcset) {
        srcset = srcset.replace(/\/_next\/image\?url=([^&]+)[^ ,]*/g, (match, p1) => {
          try {
            const realPath = decodeURIComponent(p1);
            return "img/" + path.basename(realPath);
          } catch {
            return match;
          }
        });
        $el.attr("srcset", srcset);
      }

      let src = $el.attr("src");
      if (src && src.startsWith("/_next/image")) {
        const urlMatch = src.match(/url=([^&]+)/);
        if (urlMatch) {
          const realPath = decodeURIComponent(urlMatch[1]);
          $el.attr("src", "img/" + path.basename(realPath));
        }
      }
    });

    // Save page
    const pagePath = path.join(outputFolder, "index.html");
    await fs.promises.mkdir(path.dirname(pagePath), { recursive: true });
    await fs.promises.writeFile(pagePath, $.html(), "utf-8");

    console.log(`📄 Page saved: ${pageUrl} -> ${pagePath}`);
  } catch (err) {
    console.error(`❌ Failed page ${pageUrl}: ${err.message}`);
  }
}

/**
 * Exposed tool function
 */
export default async function cloneWebsite(url, folderName) {
  if (!folderName) folderName = "cloned_site";

  // Create a parent 'clone' folder first
  const parentFolder = path.join(__dirname, "clone");
  await fs.promises.mkdir(parentFolder, { recursive: true });

  // Create the actual output folder inside 'clone'
  const outputFolder = path.join(parentFolder, folderName);
  await fs.promises.mkdir(outputFolder, { recursive: true });

  await clonePage(url, outputFolder);

  return `🎯 Website cloned successfully into folder: clone/${outputFolder}`;
}

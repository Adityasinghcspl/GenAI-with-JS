import path from "path";
import { fileURLToPath } from "url";
import webpack from "webpack";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
dotenv.config();

export default {
  entry: "./index.js",
  target: "node",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
    library: {
      type: "module", // force ESM output
    },
  },
  experiments: {
    outputModule: true, // enable ESM output
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.GEMINI_API_KEY": JSON.stringify(process.env.GEMINI_API_KEY),
      "process.env.PERPLEXITY_API_KEY": JSON.stringify(process.env.PERPLEXITY_API_KEY),
    }),
  ],
};

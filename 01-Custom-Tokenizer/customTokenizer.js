
// Function to encode a string into ASCII tokens
function encodeToTokens(str) {
  const tokens = [];
  for (let i = 0; i < str.length; i++) {
    tokens.push(str.charCodeAt(i));
  }
  return tokens;
}

// Function to decode ASCII tokens back into a string
function decodeFromTokens(tokens) {
  let result = "";
  for (let i = 0; i < tokens.length; i++) {
    result += String.fromCharCode(tokens[i]);
  }
  return result;
}

// Example usage
const paragraph = "Welcome to ChaiCode.";
const tokens = encodeToTokens(paragraph);
console.log("Encoded Tokens:", tokens);

const decodedString = decodeFromTokens(tokens);
console.log("Decoded Tokens:", decodedString);

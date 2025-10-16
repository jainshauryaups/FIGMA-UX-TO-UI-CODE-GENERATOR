const fs = require('fs');
const data = JSON.parse(fs.readFileSync('copilot-session.json','utf8'));
function inspect(node, depth = 0) {
  if (!node || depth > 5) return;
  if (Array.isArray(node)) {
    for (const item of node) inspect(item, depth + 1);
  } else if (typeof node === 'object') {
    if (node.type === 'embed' && node.value && typeof node.value === 'string' && node.value.trim().startsWith('{')) {
      console.log('Embed candidate at depth', depth);
      fs.writeFileSync('mcp_raw_embed.json', node.value);
    }
    for (const key of Object.keys(node)) {
      inspect(node[key], depth + 1);
    }
  }
}
inspect(data);

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const MAX_CHARS_PER_FILE = 6000;

function readProjectFiles(files) {
  return files.map(readProjectFile).filter(Boolean);
}

function readProjectFile(relativeFile) {
  const fullPath = path.resolve(PROJECT_ROOT, relativeFile);
  const rootPrefix = `${PROJECT_ROOT}${path.sep}`;

  if (!fullPath.startsWith(rootPrefix) || !fs.existsSync(fullPath)) return null;

  const content = fs.readFileSync(fullPath, "utf8");
  return {
    file: relativeFile,
    content: content.slice(0, MAX_CHARS_PER_FILE),
    truncated: content.length > MAX_CHARS_PER_FILE,
  };
}

function formatSources(contexts) {
  return contexts.map(({ file }) => `- \`${file}\``).join("\n");
}

module.exports = { readProjectFiles, formatSources };

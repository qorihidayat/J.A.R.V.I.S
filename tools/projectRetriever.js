const { createGraphAgent } = require("../graph-agent");

const MAX_FILES = 4;

function normalize(value = "") {
  return String(value).replace(/[{}()[\]]/g, "").replace(/\s+/g, "").toLowerCase();
}

function extractQueries(question) {
  const identifiers = question.match(/[A-Za-z_$][\w$]*(?:\(\))?/g) || [];
  return [...new Set([...identifiers, question])]
    .filter((value) => value.length >= 3)
    .sort((a, b) => b.length - a.length);
}

function isLocationQuestion(question) {
  return /\b(di\w*|where)\b.*\b(pakai|pake|pke|dipakai|used|gunakan)\b|\b(pakai|pake|pke|dipakai|used|gunakan)\b.*\b(di\w*|where)\b/i.test(question);
}

function findSymbolLocations(question) {
  if (!isLocationQuestion(question)) return [];

  const agent = createGraphAgent();
  for (const query of extractQueries(question)) {
    const normalizedQuery = normalize(query);
    const matches = agent.findSymbol(query).filter((match) =>
      normalize(match.name).includes(normalizedQuery)
    );

    if (matches.length) return uniqueLocations(matches);
  }

  return [];
}

function getRelevantFiles(question) {
  const agent = createGraphAgent();
  const files = new Set();

  for (const query of extractQueries(question)) {
    for (const result of agent.findRelated(query)) {
      if (result.file) files.add(result.file);
      for (const neighbor of result.neighbors) {
        if (neighbor.file) files.add(neighbor.file);
      }
    }

    if (files.size >= MAX_FILES) break;
  }

  return [...files].slice(0, MAX_FILES);
}

function uniqueLocations(matches) {
  return [...new Map(
    matches
      .filter((match) => match.file && match.line)
      .map((match) => [`${match.file}:${match.line}`, match])
  ).values()];
}

module.exports = {
  extractQueries,
  findSymbolLocations,
  getRelevantFiles,
  isLocationQuestion,
};

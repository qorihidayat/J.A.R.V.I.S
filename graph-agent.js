const fs = require("fs");
const path = require("path");

const DEFAULT_GRAPH_PATH = path.join(__dirname, "graphify-out", "graph.json");

function normalize(value = "") {
  return String(value)
    .replace(/[{}()[\]]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function lineNumber(sourceLocation) {
  const match = String(sourceLocation || "").match(/\d+/);
  return match ? Number(match[0]) : null;
}

function nodeType(node) {
  if (node._callable) return "function";
  if (node.file_type === "code") return "file";
  return node.file_type || "unknown";
}

function createGraphAgent(graphPath = DEFAULT_GRAPH_PATH) {
  if (!fs.existsSync(graphPath)) {
    throw new Error(`Graph tidak ditemukan: ${graphPath}`);
  }

  const graph = JSON.parse(fs.readFileSync(graphPath, "utf8"));
  const nodes = graph.nodes || [];
  const links = graph.links || graph.edges || [];

  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const nodesByName = new Map();

  for (const node of nodes) {
    const keys = [node.label, node.norm_label, node.id]
      .filter(Boolean)
      .map(normalize);

    for (const key of keys) {
      if (!nodesByName.has(key)) nodesByName.set(key, []);
      const matches = nodesByName.get(key);
      if (!matches.some((match) => match.id === node.id)) {
        matches.push(node);
      }
    }
  }

  function toMetadata(node) {
    return {
      id: node.id,
      name: String(node.label || node.id).replace(/[{}]/g, "").trim(),
      type: nodeType(node),
      file: node.source_file || null,
      line: lineNumber(node.source_location),
      community: node.community_name || node.community || null,
    };
  }

  function findNodes(name) {
    const query = normalize(name);
    if (!query) return [];
    const exact = nodesByName.get(query);

    if (exact?.length) return exact;

    return nodes.filter((node) =>
      [node.label, node.norm_label, node.id]
        .filter(Boolean)
        .some((value) => normalize(value).includes(query))
    );
  }

  function findRelated(name) {
    const matchedNodes = findNodes(name);
    const results = [];

    for (const node of matchedNodes) {
      const neighbors = links
        .filter((link) => link.source === node.id || link.target === node.id)
        .map((link) => {
          const outgoing = link.source === node.id;
          const neighbor = nodesById.get(outgoing ? link.target : link.source);

          return {
            direction: outgoing ? "outgoing" : "incoming",
            relation: link.relation || link.type || "related_to",
            ...toMetadata(neighbor || { id: outgoing ? link.target : link.source }),
          };
        });

      results.push({
        ...toMetadata(node),
        neighbors,
      });
    }

    return results;
  }

  function findSymbol(name) {
    return findRelated(name);
  }

  function findCommunity(name) {
    const matchedNodes = findNodes(name);
    const communityIds = new Set(
      matchedNodes.map((node) => node.community).filter((value) => value !== undefined)
    );

    return [...communityIds].map((communityId) => {
      const members = nodes.filter((node) => node.community === communityId);

      return {
        id: communityId,
        name: members.find((node) => node.community_name)?.community_name ||
          `Community ${communityId}`,
        members: members.map(toMetadata),
      };
    });
  }

  return { findSymbol, findCommunity, findRelated };
}

module.exports = { createGraphAgent };

if (require.main === module) {
  const [commandOrName, maybeName] = process.argv.slice(2);

  if (!commandOrName) {
    console.error(
      "Pakai: node graph-agent.js <symbol>\n" +
      "   atau: node graph-agent.js --community <name>\n" +
      "   atau: node graph-agent.js --related <name>"
    );
    process.exit(1);
  }

  const agent = createGraphAgent();
  const command = maybeName ? commandOrName : "--symbol";
  const name = maybeName || commandOrName;

  const result =
    command === "--community"
      ? agent.findCommunity(name)
      : command === "--related"
        ? agent.findRelated(name)
        : agent.findSymbol(name);

  console.log(JSON.stringify(result, null, 2));
}

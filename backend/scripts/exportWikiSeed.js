const fs = require("fs");
const path = require("path");

const backendPath = path.join(__dirname, "..");
const catalogPath = path.join(backendPath, "../frontend/src/data/wikiGames.json");
const schemaPath = path.join(backendPath, "wiki_jogos.sql");
const outputPath = path.join(backendPath, "wiki_jogos_seed.sql");

function sqlValue(value) {
  if (value === null || value === undefined || value === "") return "NULL";
  const escaped = String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\0/g, "\\0")
    .replace(/\u0008/g, "\\b")
    .replace(/\t/g, "\\t")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\x1a/g, "\\Z")
    .replace(/'/g, "''");
  return `'${escaped}'`;
}

function main() {
  const games = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const schema = fs.readFileSync(schemaPath, "utf8");
  const columns = ["id", "nome", "ano_lancamento", "franquia", "categoria", "nota", "capa_url", "fonte_url", "detalhes_json"];
  const rows = games.map((game) => `(${[
    game.id,
    game.name,
    game.year || null,
    game.franchise || null,
    game.category || null,
    game.score || null,
    game.cover || null,
    game.sourceUrl || null,
    JSON.stringify(game)
  ].map(sqlValue).join(", ")})`);
  const updates = columns.slice(1).map((column) => `${column}=VALUES(${column})`).join(",\n  ");
  const dump = [
    "-- Exportação do catálogo Game Atlas para importação manual pelo phpMyAdmin.",
    `-- Gerado em ${new Date().toISOString()} com ${games.length} fichas.`,
    "SET NAMES utf8mb4;",
    schema,
    `INSERT INTO wiki_jogos (${columns.join(", ")})\nVALUES\n  ${rows.join(",\n  ")}\nON DUPLICATE KEY UPDATE\n  ${updates};`,
    ""
  ].join("\n");
  fs.writeFileSync(outputPath, dump, "utf8");
  console.log(`Arquivo criado: ${outputPath} (${games.length} fichas).`);
}

main();

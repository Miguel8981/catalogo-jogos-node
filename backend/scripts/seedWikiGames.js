const fs = require("fs");
const path = require("path");
const db = require("../model/conexao");

async function main() {
  const file = path.join(__dirname, "../../frontend/src/data/wikiGames.json");
  const games = JSON.parse(fs.readFileSync(file, "utf8"));
  await db.query(`CREATE TABLE IF NOT EXISTS wiki_jogos (
    id VARCHAR(180) NOT NULL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    ano_lancamento SMALLINT NULL,
    franquia VARCHAR(120) NULL,
    categoria VARCHAR(120) NULL,
    nota VARCHAR(20) NULL,
    capa_url TEXT NULL,
    fonte_url TEXT NULL,
    detalhes_json LONGTEXT NOT NULL,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_wiki_nome (nome), INDEX idx_wiki_franquia (franquia), INDEX idx_wiki_ano (ano_lancamento)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  const sql = `INSERT INTO wiki_jogos (id,nome,ano_lancamento,franquia,categoria,nota,capa_url,fonte_url,detalhes_json)
    VALUES (?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE nome=VALUES(nome), ano_lancamento=VALUES(ano_lancamento),
    franquia=VALUES(franquia), categoria=VALUES(categoria), nota=VALUES(nota), capa_url=VALUES(capa_url),
    fonte_url=VALUES(fonte_url), detalhes_json=VALUES(detalhes_json)`;
  for (const g of games) {
    await db.execute(sql, [g.id, g.name, g.year || null, g.franchise || null, g.category || null, g.score || null, g.cover || null, g.sourceUrl || null, JSON.stringify(g)]);
  }
  if (games.length) {
    await db.execute(`DELETE FROM wiki_jogos WHERE id NOT IN (${games.map(() => "?").join(",")})`, games.map((game) => game.id));
  }
  console.log(`Catálogo wiki atualizado: ${games.length} fichas.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => db.end());

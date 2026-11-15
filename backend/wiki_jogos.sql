-- Catálogo editorial para fichas da wiki; não altera a tabela jogos/biblioteca.
CREATE TABLE IF NOT EXISTS wiki_jogos (
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
  INDEX idx_wiki_nome (nome),
  INDEX idx_wiki_franquia (franquia),
  INDEX idx_wiki_ano (ano_lancamento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

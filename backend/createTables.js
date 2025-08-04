require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        role TEXT DEFAULT 'operador',
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS produtos (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        descricao TEXT NOT NULL,
        linha_producao VARCHAR,
        produto_id SERIAL NOT NULL
      );

      CREATE TABLE IF NOT EXISTS producoes (
        id SERIAL PRIMARY KEY,
        produto_id INT REFERENCES produtos(id),
        data_producao DATE NOT NULL,
        quantidade INT NOT NULL,
        linha_producao TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS transportes (
        id SERIAL PRIMARY KEY,
        produto_id INT REFERENCES produtos(id),
        origem TEXT NOT NULL,
        destino TEXT NOT NULL,
        data_envio DATE NOT NULL,
        data_entrega DATE,
        status TEXT DEFAULT 'Em trânsito'
      );

      CREATE TABLE IF NOT EXISTS armazens (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        localizacao TEXT NOT NULL,
        capacidade INT NOT NULL,
        ocupado INT DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS tracking (
        id SERIAL PRIMARY KEY,
        transporte_id INT REFERENCES transportes(id),
        localizacao_atual TEXT NOT NULL,
        status TEXT NOT NULL,
        atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        tipo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        criado_em TIMESTAMP DEFAULT NOW(),
        resolvido BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        titulo TEXT NOT NULL,
        conteudo TEXT NOT NULL,
        criado_em TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS partners (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        cnpj TEXT UNIQUE NOT NULL,
        contato TEXT NOT NULL,
        endereco TEXT NOT NULL
      );
      ALTER TABLE produtos ADD COLUMN id_armazem INTEGER REFERENCES armazens(id);
    `);

    console.log('Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  } finally {
    await pool.end();
  }
};


createTables();

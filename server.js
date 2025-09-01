const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./sugestoes.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado ao banco de dados SQLite.');
});

db.run(`CREATE TABLE IF NOT EXISTS sugestoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  biografia TEXT NOT NULL,
  cidade TEXT NOT NULL,
  data_envio TEXT NOT NULL
)`);

app.post('/api/sugestoes', (req, res) => {
  const { nome, biografia, cidade } = req.body;
  if (!nome || !biografia || !cidade) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const sql = `INSERT INTO sugestoes (nome, biografia, cidade, data_envio) VALUES (?, ?, ?, ?)`;
  const data = [nome, biografia, cidade, new Date().toISOString()];

  db.run(sql, data, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Sugestão enviada com sucesso!' });
  });
});

app.get('/api/sugestoes', (req, res) => {
  const sql = `SELECT * FROM sugestoes ORDER BY data_envio DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
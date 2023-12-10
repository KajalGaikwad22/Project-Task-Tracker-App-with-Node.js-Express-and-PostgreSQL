const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'PDdb',
  password: 'Kajal@701',
  port: 5432,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/addTask', async (req, res) => {
  const taskText = req.body.taskText;
  const client = await pool.connect();

  try {
    const result = await client.query('INSERT INTO tasks (text) VALUES ($1) RETURNING *', [taskText]);
    res.json(result.rows[0]);
  } finally {
    client.release();
  }
});

app.get('/getTasks', async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM tasks');
    res.json(result.rows);
  } finally {
    client.release();
  }
});

app.delete('/deleteTask/:id', async (req, res) => {
  const taskId = req.params.id;
  const client = await pool.connect();

  try {
    const result = await client.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [taskId]);
    res.json(result.rows[0]);
  } finally {
    client.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

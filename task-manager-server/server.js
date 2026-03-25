const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'your_super_secret_jwt_key';

app.use(cors());
app.use(bodyParser.json());

// Mock Database
let tasks = [
  { id: '1', title: 'Learn React', description: 'Master hooks and state', status: 'completed' },
  { id: '2', title: 'Build Express Server', description: 'Create JWT auth', status: 'in-progress' }
];

const USER = { username: 'test', password: 'test123' };

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- ROUTES ---

// POST /login - Returns JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token, user: { username: 'test' } });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

// GET /tasks - Fetch all
app.get('/tasks', authenticateToken, (req, res) => {
  res.json(tasks);
});

// POST /tasks - Create
app.post('/tasks', authenticateToken, (req, res) => {
  const newTask = { 
    id: Date.now().toString(), 
    ...req.body 
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id - Update
app.put('/tasks/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  tasks = tasks.map(t => t.id === id ? { ...t, ...req.body } : t);
  res.json({ message: 'Task updated' });
});

// DELETE /tasks/:id - Delete
app.delete('/tasks/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
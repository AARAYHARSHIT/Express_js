const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// In-memory "database" (an array)
let tasks = [
    { id: 1, title: 'Learn Express.js', completed: false },
    { id: 2, title: 'Build a REST API', completed: false }
];

// --- ROUTES ---

// 1. GET /tasks - Get all tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// 2. GET /tasks/:id - Get a specific task by ID
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
});

// 3. POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
    const { title } = req.body;
    
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    const newTask = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        title: title,
        completed: false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// 4. PUT /tasks/:id - Update an existing task
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, completed } = req.body;

    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields if they are provided in the request body
    if (title !== undefined) tasks[taskIndex].title = title;
    if (completed !== undefined) tasks[taskIndex].completed = completed;

    res.status(200).json(tasks[taskIndex]);
});

// 5. DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    const deletedTask = tasks.splice(taskIndex, 1);
    res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
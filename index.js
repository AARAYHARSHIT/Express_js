const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================================================
   MIDDLEWARE
========================================================= */

// Parse JSON body
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
    console.log(
        `[${new Date().toLocaleString()}] ${req.method} ${req.url}`
    );
    next();
});

/* =========================================================
   IN-MEMORY DATABASE
========================================================= */

let tasks = [
    {
        id: 1,
        title: "Learn Express.js",
        completed: false,
        priority: "high",
        createdAt: new Date(),
    },
    {
        id: 2,
        title: "Build REST API",
        completed: true,
        priority: "medium",
        createdAt: new Date(),
    },
];

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

// Generate next ID
const generateTaskId = () => {
    return tasks.length > 0
        ? Math.max(...tasks.map(task => task.id)) + 1
        : 1;
};

// Find task by ID
const findTaskById = (id) => {
    return tasks.find(task => task.id === id);
};

/* =========================================================
   ROUTES
========================================================= */

/**
 * HOME ROUTE
 */
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Task Manager API is running 🚀",
        endpoints: {
            getAllTasks: "GET /tasks",
            getSingleTask: "GET /tasks/:id",
            createTask: "POST /tasks",
            updateTask: "PUT /tasks/:id",
            deleteTask: "DELETE /tasks/:id",
        },
    });
});

/**
 * GET ALL TASKS
 * Optional query:
 * ?completed=true
 * ?search=express
 */
app.get("/tasks", (req, res) => {
    let filteredTasks = [...tasks];

    // Filter by completion status
    if (req.query.completed !== undefined) {
        const isCompleted = req.query.completed === "true";

        filteredTasks = filteredTasks.filter(
            task => task.completed === isCompleted
        );
    }

    // Search by title
    if (req.query.search) {
        const searchText = req.query.search.toLowerCase();

        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(searchText)
        );
    }

    res.status(200).json({
        success: true,
        count: filteredTasks.length,
        data: filteredTasks,
    });
});

/**
 * GET SINGLE TASK
 */
app.get("/tasks/:id", (req, res) => {
    const taskId = Number(req.params.id);

    if (isNaN(taskId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid task ID",
        });
    }

    const task = findTaskById(taskId);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found",
        });
    }

    res.status(200).json({
        success: true,
        data: task,
    });
});

/**
 * CREATE TASK
 */
app.post("/tasks", (req, res) => {
    const { title, priority } = req.body;

    // Validation
    if (!title || title.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Task title is required",
        });
    }

    const validPriorities = ["low", "medium", "high"];

    if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({
            success: false,
            message: "Priority must be low, medium, or high",
        });
    }

    const newTask = {
        id: generateTaskId(),
        title: title.trim(),
        completed: false,
        priority: priority || "low",
        createdAt: new Date(),
    };

    tasks.push(newTask);

    res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: newTask,
    });
});

/**
 * UPDATE TASK
 */
app.put("/tasks/:id", (req, res) => {
    const taskId = Number(req.params.id);

    const task = findTaskById(taskId);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found",
        });
    }

    const { title, completed, priority } = req.body;

    // Update title
    if (title !== undefined) {
        if (title.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Title cannot be empty",
            });
        }

        task.title = title.trim();
    }

    // Update completed status
    if (completed !== undefined) {
        if (typeof completed !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Completed must be true or false",
            });
        }

        task.completed = completed;
    }

    // Update priority
    if (priority !== undefined) {
        const validPriorities = ["low", "medium", "high"];

        if (!validPriorities.includes(priority)) {
            return res.status(400).json({
                success: false,
                message: "Invalid priority value",
            });
        }

        task.priority = priority;
    }

    res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: task,
    });
});

/**
 * DELETE TASK
 */
app.delete("/tasks/:id", (req, res) => {
    const taskId = Number(req.params.id);

    const task = findTaskById(taskId);

    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found",
        });
    }

    tasks = tasks.filter(task => task.id !== taskId);

    res.status(200).json({
        success: true,
        message: "Task deleted successfully",
        deletedTask: task,
    });
});

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
}););
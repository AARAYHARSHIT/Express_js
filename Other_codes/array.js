const express = require("express");

const app = express();

// Middleware
app.use(express.json());

app.post("/student", (req, res) => {

    const student = req.body;

    res.json({
        message: "Student Added",
        data: student
    });

});

app.listen(3000);
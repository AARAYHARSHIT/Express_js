const express = require("express");
const app = express();

// Dynamic route
app.get("/user/:id", (req, res) => {

    // Read parameter
    const userId = req.params.id;

    res.send(`User ID is ${userId}`);
});

app.listen(3000);
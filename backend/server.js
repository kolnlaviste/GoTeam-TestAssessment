"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var body_parser_1 = require("body-parser");
var app = (0, express_1.default)();
var PORT = 3000;
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(body_parser_1.default.json());
var tasks = [];
app.get('/tasks', function (req, res) {
    res.json(tasks);
});
app.post('/tasks', function (req, res) {
    var newTask = { id: tasks.length + 1, title: req.body.title };
    tasks.push(newTask);
    res.json(newTask);
});
app.listen(PORT, function () {
    console.log("Server running at http:localhost:".concat(PORT));
});

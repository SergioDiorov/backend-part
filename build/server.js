"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.get('/second', (req, res) => {
    res.send('Second page');
});
app.post('/second', (req, res) => {
    res.send({ link: 'http://localhost:3000/' });
});
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

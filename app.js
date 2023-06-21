const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();
app.use(express.json());
app.use(router);
app.listen(3000, () => {
});

const express = require('express');
const mongoose = require('mongoose');
const { login, createUsers } = require('./controllers/users');
const router = require('./routes');
const auth = require('./middlewares/auth')

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();
app.use(express.json());
app.post('/signin', login);
app.post('/signup', createUsers);
app.use(router);
app.use(auth);
app.listen(3000, () => {
});

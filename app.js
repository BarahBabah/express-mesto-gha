const express = require('express');

const mongoose = require('mongoose');
const router = require('./routes');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '648b3b040dac4fd64c1bfc35', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(express.json());
app.use(router);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

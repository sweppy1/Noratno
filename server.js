const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware для парсинга JSON
app.use(express.json());

// Получить всех пользователей
app.get('/users', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка чтения файла' });
    }
    res.json(JSON.parse(data));
  });
});

// Добавить нового пользователя
app.post('/users', (req, res) => {
  const newUser = {
    id: Date.now(),
    ...req.body
  };

  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка чтения файла' });
    }

    const users = JSON.parse(data);
    users.push(newUser);

    fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Ошибка записи файла' });
      }
      res.status(201).json(newUser);
    });
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

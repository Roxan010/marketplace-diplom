const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

let db;

(async () => {
    // Открываем файл базы данных (он создастся сам)
    db = await open({
        filename: path.join(__dirname, 'database.db'),
        driver: sqlite3.Database
    });

    // Создаем таблицы, если их еще нет
    await db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price REAL,
            description TEXT,
            stock INTEGER
        );
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            items TEXT,
            totalAmount REAL,
            date DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
    console.log('База данных SQLite готова (файл database.db)');
})();

app.get('/api/products', async (req, res) => {
    const products = await db.all('SELECT * FROM products');
    res.json(products);
});

app.post('/api/orders', async (req, res) => {
    const { itemIds, total } = req.body;  

    await db.run('INSERT INTO orders (items, totalAmount) VALUES (?, ?)', [JSON.stringify(itemIds), total]);
   
    console.log('-------------------------------------------');
    console.log('УВЕДОМЛЕНИЕ: Получен новый заказ!');
    console.log(`Товары (ID): ${itemIds.join(', ')}`);
    console.log(`Итоговая сумма: ${total} руб.`); 
    console.log('-------------------------------------------');

    res.status(201).json({ message: 'Заказ принят' });
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.listen(3000, () => console.log('Сервер: http://localhost:3000'));

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function seed() {
    const db = await open({
        filename: path.join(__dirname, 'database.db'),
        driver: sqlite3.Database
    });

    await db.run('DELETE FROM products');
    
    const items = [
        { name: 'Умная колонка', price: 5990, description: 'Голосовой помощник', stock: 50 },
        { name: 'Игровая мышь', price: 3500, description: 'RGB подсветка', stock: 100 },
        { name: 'Клавиатура', price: 7200, description: 'Механика', stock: 30 }
    ];

    for (const item of items) {
        await db.run(
            'INSERT INTO products (name, price, description, stock) VALUES (?, ?, ?, ?)',
            [item.name, item.price, item.description, item.stock]
        );
    }

    console.log('SQLite база наполнена товарами!');
    process.exit();
}

seed();
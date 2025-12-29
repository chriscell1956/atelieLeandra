const fs = require('fs');
const path = require('path');
const { db, initDb } = require('./db');

// Ensure tables exist
initDb();

// Read products file
const produtosPath = path.join(__dirname, 'produtos.js');
let produtosContent = fs.readFileSync(produtosPath, 'utf8');

// Mock window to capture the data
const window = {};
eval(produtosContent); // This will populate window.produtos_db

const products = window.produtos_db;

console.log(`Found ${products.length} products to migrate.`);

db.serialize(() => {
    const stmt = db.prepare(`INSERT OR REPLACE INTO products (id, name, price, category, is_highlight, image_url) VALUES (?, ?, ?, ?, ?, ?)`);

    products.forEach(p => {
        // Convert price "52,20" to 52.20
        const price = parseFloat(p.preco.replace(',', '.'));
        const isHighlight = p.destaque ? 1 : 0;

        stmt.run(p.id, p.nome, price, p.categoria, isHighlight, p.image_url);
    });

    stmt.finalize();
    console.log('Migration completed.');
});

db.close();

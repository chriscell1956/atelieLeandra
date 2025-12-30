const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key not found in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read products file
const produtosPath = path.join(__dirname, 'produtos.js');
let produtosContent = fs.readFileSync(produtosPath, 'utf8');

// Mock window to capture the data
const window = {};
eval(produtosContent); // This will populate window.produtos_db

const products = window.produtos_db;

console.log(`Found ${products.length} products to migrate.`);

async function migrate() {
    for (const p of products) {
        const price = parseFloat(p.preco.replace(',', '.'));
        const isHighlight = p.destaque ? true : false;

        // Match the table schema from INSTRUCOES_SUPABASE.md
        const productToSave = {
            id: p.id,
            name: p.nome,
            price: price,
            category: p.categoria || 'Geral',
            is_highlight: isHighlight,
            image_url: p.imagem || p.image_url,
            created_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('products')
            .upsert(productToSave);

        if (error) {
            console.error(`Error migrating product ${p.id}:`, error.message);
        } else {
            console.log(`Migrated product: ${p.nome}`);
        }
    }
    console.log('Migration to Supabase completed.');
}

migrate();

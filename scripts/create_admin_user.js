// Script para criar o usuário admin no Supabase
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Carrega .env manualmente
const envPath = path.resolve(process.cwd(), 'client', '.env');
if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    env.split('\n').forEach(line => {
        const match = line.match(/^\s*([^#=]+)=([^#]*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            process.env[key] = value;
        }
    });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL ou ANON KEY não encontrados no .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdmin() {
    const email = 'leandraribeiro.lr.lr@gmail.com';
    const password = 'Chris195608#';

    console.log('--- Processo de Criação de Admin ---');
    console.log(`Email: ${email}`);

    // 1. Tentar criar o usuário no Auth
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name: 'Leandra', role: 'admin' },
        },
    });

    if (error) {
        if (error.message.includes('already registered')) {
            console.log('✅ Usuário já existe no Auth.');
        } else {
            console.error('❌ Erro ao criar usuário no Auth:', error.message);
            // Se o erro for sobre e-mail não confirmado, avisar
            if (error.status === 400) {
                console.log('\nDICA: Se o erro for "Email not confirmed", você precisa confirmar o e-mail no painel do Supabase ou rodar o comando SQL que deixei nas instruções.');
            }
        }
    } else {
        console.log('✅ Usuário criado com sucesso no Auth!');
    }

    // 2. Tentar inserir na tabela 'users' (pode falhar se a tabela não existir ainda)
    console.log('\nGarantindo registro na tabela public.users...');
    const { error: insertErr } = await supabase.from('users').upsert({
        email: email,
        name: 'Leandra',
    }, { onConflict: 'email' });

    if (insertErr) {
        if (insertErr.message.includes('relation "public.users" does not exist')) {
            console.error('❌ A tabela "public.users" ainda não existe. Por favor, execute o SQL no editor do Supabase primeiro.');
        } else {
            console.error('❌ Erro na tabela users:', insertErr.message);
        }
    } else {
        console.log('✅ Registro na tabela users garantido.');
    }

    console.log('\n--- FIM ---');
    console.log('Se tudo deu "✅", tente logar no site.');
}

createAdmin();

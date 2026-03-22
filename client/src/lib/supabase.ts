
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Key not found. Please check your .env file.');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);

export const logVisit = async (product: { id: string; name: string }) => {
    try {
        const user = await supabase.auth.getUser();
        await supabase.from('access_logs').insert({
            product_id: product.id,
            product_name: product.name,
            user_email: user.data.user?.email || null,
            visited_at: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error logging visit:', error);
    }
};

export const uploadImage = async (file: File, bucket: string = 'products') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

    if (error) {
        throw error;
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return publicUrl;
};

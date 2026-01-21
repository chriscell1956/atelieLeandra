
export const getImageUrl = (url?: string): string => {
    if (!url) return 'https://via.placeholder.com/400x400?text=Sem+Imagem';

    // Base64 or Blob
    if (url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }

    // External URL (http/https)
    if (url.startsWith('http://') || url.startsWith('https://')) {
        // Fix legacy localhost if present (optional, but good for cleanup)
        if (url.includes('localhost:3000')) {
            // If we really want to strip it, but better to just let it be if it's explicitly set?
            // Actually, for production, localhost will fail.
            // Let's rely on the input being correct for http links, 
            // but if it matches the specific legacy pattern, we might warn or strip.
            // For now, return as is is safer than guessing, UNLESS it's the specific pattern we saw.
        }
        return url;
    }

    // Absolute path
    if (url.startsWith('/')) {
        return url;
    }

    // Legacy "stores/" path handling (from previous logic)
    // If it was just "stores/image.jpg", the old code prepended localhost. 
    // We should probably just treat it as a relative path now.
    if (url.startsWith('stores/')) {
        return `/${url}`;
    }

    // Default to root-relative path for filenames
    return `/${url}`;
};

export const optimizeCloudinaryUrl = (url, width = 400) => {
    if (!url || typeof url !== 'string') return url;
    if (!url.includes('/upload/')) return url;

    return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
};
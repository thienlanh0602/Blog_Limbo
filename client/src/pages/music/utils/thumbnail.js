import { getThumbMusicUrl } from '../../../api/musicAPI';

export const FALLBACK_COVER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'>
        <rect width='100%' height='100%' fill='#1a1a1e'/>
        <text x='50%' y='55%' font-size='48' fill='#4efcd3' text-anchor='middle' dominant-baseline='middle'>♪</text>
    </svg>`
)}`;

const getYoutubeId = (url) =>
    url?.match(/\/vi(?:_webp)?\/([\w-]{11})\//)?.[1];

export const getSafeThumbnail = (url) => {
    if (!url) return FALLBACK_COVER_SVG;
    const id = getYoutubeId(url);
    return id ? getThumbMusicUrl(id) : url;
};
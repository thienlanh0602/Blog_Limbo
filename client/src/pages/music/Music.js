import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
    Box, Grid, Typography, Slider, Stack, Skeleton, IconButton,
    useTheme, useMediaQuery
} from '@mui/material';
import PageContainer from "../../components/layout/PageContainer";
import { getPlaylists, getPlaylistDetail } from '../../api/playlistAPI';

const PlayIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000"><path d="M8 5v14l11-7z" /></svg>;
const PauseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>;
const SkipPreviousIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>;
const SkipNextIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6z" /></svg>;
const VolumeUpIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 14V10C4 9.45 4.45 9 5 9H8L13.3 4.7c.4-.3.9 0 .9.5V18.8c0 .5-.5.8-.9.5L8 15H5c-.55 0-1-.45-1-1z" fill="#000000" />
        <path d="M17.5 9.5L19 8M17.5 14.5L19 16M17.5 12H19.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
const VolumeOffIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 14V10C4 9.45 4.45 9 5 9H8L13.3 4.7c.4-.3.9 0 .9.5V18.8c0 .5-.5.8-.9.5L8 15H5c-.55 0-1-.45-1-1z" fill="#000000" />
        <path d="M17.5 10L21.5 14M21.5 10L17.5 14" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ShuffleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
    </svg>
);

const RepeatIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
    </svg>
);

const RepeatOneIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
        <text x="12" y="14.2" fontSize="8" fontWeight="800" textAnchor="middle" fill="currentColor" stroke="none">1</text>
    </svg>
);

const generateDummyWaveform = (count = 300) => {
    const raw = [];
    let value = 45;
    for (let i = 0; i < count; i++) {
        const step = (Math.random() - 0.5) * 16;
        value += step;
        value = Math.max(8, Math.min(95, value));
        raw.push(value);
    }
    const smoothed = raw.map((_, i) => {
        const window = raw.slice(Math.max(0, i - 2), Math.min(count, i + 3));
        return window.reduce((a, b) => a + b, 0) / window.length;
    });
    return smoothed.map(v => Math.max(8, Math.min(100, v + (Math.random() - 0.5) * 8)));
};

const colorCache = new Map();

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            default: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function extractDominantColor(imgUrl) {
    const fallback = { vibrant: '#282828', dark: '#121212', isLight: false };
    if (!imgUrl) return Promise.resolve(fallback);
    if (colorCache.has(imgUrl)) return Promise.resolve(colorCache.get(imgUrl));

    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const size = 32;
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, size, size);
                const data = ctx.getImageData(0, 0, size, size).data;

                let colorMap = [];
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i]; const g = data[i + 1]; const b = data[i + 2]; const a = data[i + 3];
                    if (a < 150) continue;
                    const [h, s, l] = rgbToHsl(r, g, b);
                    if (l < 0.15 || l > 0.85 || s < 0.2) continue;
                    colorMap.push({ h, s, l });
                }

                if (colorMap.length === 0) {
                    colorCache.set(imgUrl, fallback);
                    return resolve(fallback);
                }

                colorMap.sort((a, b) => b.s - a.s);
                let targetColor = colorMap[0];
                let h = targetColor.h;
                let s = Math.min(0.95, Math.max(0.75, targetColor.s * 1.3));

                let lVibrant = Math.min(0.38, Math.max(0.24, targetColor.l));
                const [vr, vg, vb] = hslToRgb(h, s, lVibrant);

                let lDark = Math.min(0.32, Math.max(0.20, lVibrant - 0.05));
                const [dr, dg, db] = hslToRgb(h, s, lDark);

                const result = {
                    vibrant: `rgb(${vr}, ${vg}, ${vb})`,
                    dark: `rgb(${dr}, ${dg}, ${db})`,
                    isLight: lDark > 0.22
                };

                colorCache.set(imgUrl, result);
                resolve(result);
            } catch (e) {
                console.warn('Không lấy được màu chủ đạo từ ảnh:', e);
                colorCache.set(imgUrl, fallback);
                resolve(fallback);
            }
        };
        img.onerror = () => resolve(fallback);
        img.src = imgUrl;
    });
}

function parseDurationToSeconds(durationStr) {
    if (!durationStr) return 0;
    const parts = durationStr.split(':').map(Number);
    if (parts.some(isNaN)) return 0;

    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
}

function calculateTotalPlaylistDuration(tracks) {
    if (!tracks || tracks.length === 0) return "0 ph";

    const totalSeconds = tracks.reduce((sum, track) => {
        return sum + parseDurationToSeconds(track.duration);
    }, 0);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours} giờ ${minutes} phút`;
    }
    if (minutes > 0) {
        return `${minutes} phút ${seconds > 0 ? `${seconds} giây` : ''}`.trim();
    }
    return `${seconds} giây`;
}

function Music() {
    // Ưu tiên đọc dữ liệu đã cache ở localStorage lên trước để hiển thị tức thì (kể cả lúc Offline)
    const [playlists, setPlaylists] = useState(() => {
        const cached = localStorage.getItem('offline_playlists');
        return cached ? JSON.parse(cached) : [];
    });
    const [loading, setLoading] = useState(!playlists.length); // Nếu đã có dữ liệu cache thì không cần hiện skeleton quá lâu

    const [currentTrack, setCurrentTrack] = useState(() => {
        const cachedTrack = localStorage.getItem('offline_last_track');
        return cachedTrack ? JSON.parse(cachedTrack) : null;
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(100);
    const [isMuted, setIsMuted] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState('off');
    const [groupColors, setGroupColors] = useState({});

    const audioRef = useRef(null);
    const cardsScrollRef = useRef(null);
    const pageWrapperRef = useRef(null);
    const shuffleHistoryRef = useRef([]);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const waveformCount = isMobile ? 85 : (isTablet ? 180 : 300);
    const baseWaveformData = useMemo(() => generateDummyWaveform(300), []);

    const activeWaveformData = useMemo(() => {
        return baseWaveformData.slice(1, waveformCount);
    }, [baseWaveformData, waveformCount]);

    const flatTrackList = useMemo(() => {
        return playlists.reduce((acc, pl) => [...acc, ...(pl.tracks || [])], []);
    }, [playlists]);

    const activeTrack = currentTrack || flatTrackList[0] || null;
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    useEffect(() => {
        const fetchAllPlaylists = async () => {
            try {
                const res = await getPlaylists();
                let list = [];
                if (res && res.success && res.data) {
                    list = Array.isArray(res.data) ? res.data : [res.data];
                } else if (Array.isArray(res)) {
                    list = res;
                }

                const fullPlaylists = await Promise.all(
                    list.map(async (pl) => {
                        if (pl.tracks && pl.tracks.length > 0 && typeof pl.tracks[0] === 'object') {
                            return pl;
                        }
                        try {
                            const detailRes = await getPlaylistDetail(pl._id);
                            return detailRes?.data || detailRes || pl;
                        } catch (err) {
                            return pl;
                        }
                    })
                );

                // Lưu dữ liệu mới nhất vào LocalStorage để sử dụng khi offline
                setPlaylists(fullPlaylists);
                localStorage.setItem('offline_playlists', JSON.stringify(fullPlaylists));
            } catch (error) {
                console.warn("Đang offline hoặc lỗi mạng. Sử dụng dữ liệu đã lưu cục bộ.", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllPlaylists();
    }, []);

    // Theo dõi bài nhạc đang chạy để lưu lại, khi F5 lại lúc offline vẫn nhớ bài cũ
    useEffect(() => {
        if (currentTrack) {
            localStorage.setItem('offline_last_track', JSON.stringify(currentTrack));
        }
    }, [currentTrack]);

    useEffect(() => {
        let cancelled = false;
        const loadColors = async () => {
            const entries = await Promise.all(
                playlists.map(async (pl) => {
                    const colors = await extractDominantColor(pl.thumbnail);
                    return [pl._id || pl.name, colors];
                })
            );
            if (!cancelled) {
                setGroupColors(prev => ({ ...prev, ...Object.fromEntries(entries) }));
            }
        };
        if (playlists.length > 0) loadColors();
        return () => { cancelled = true; };
    }, [playlists]);

    useEffect(() => {
        const pageEl = pageWrapperRef.current;
        const cardsEl = cardsScrollRef.current;
        if (!pageEl || !cardsEl) return;
        const onWheel = (e) => {
            if (e.target.closest('[data-vertical-scroll]')) return;
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                cardsEl.scrollLeft += e.deltaY;
            }
        };
        pageEl.addEventListener('wheel', onWheel, { passive: false });
        return () => pageEl.removeEventListener('wheel', onWheel);
    }, [playlists.length]);

    useEffect(() => {
        if (currentTrack && audioRef.current) {
            audioRef.current.load();
            audioRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch((err) => console.log("Lỗi phát tự động:", err));
        }
    }, [currentTrack]);

    const handlePlayPause = useCallback(() => {
        const trackToPlay = currentTrack || activeTrack;
        if (!currentTrack && trackToPlay) {
            setCurrentTrack(trackToPlay);
            return;
        }
        if (!audioRef.current) return;

        if (audioRef.current.paused) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.log("Lỗi khi gọi play():", err));
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, [currentTrack, activeTrack]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === 'Space') {
                const target = event.target;
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.getAttribute('role') === 'slider') return;
                event.preventDefault();
                handlePlayPause();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePlayPause]);

    const handleTimeUpdate = () => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); };
    const handleLoadedMetadata = () => { if (audioRef.current) setDuration(audioRef.current.duration); };

    const handleSliderChange = (e, newValue) => {
        if (audioRef.current) {
            audioRef.current.currentTime = newValue;
            setCurrentTime(newValue);
        }
    };

    const handleVolumeChange = (e, newValue) => {
        setVolume(newValue);
        if (audioRef.current) {
            audioRef.current.volume = newValue / 100;
            setIsMuted(newValue === 0);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            const nextMuted = !isMuted;
            audioRef.current.muted = nextMuted;
            setIsMuted(nextMuted);
        }
    };

    const formatTime = (secs) => {
        if (isNaN(secs)) return "00:00";
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const getRandomTrack = useCallback((excludeId) => {
        if (flatTrackList.length === 0) return null;
        if (flatTrackList.length === 1) return flatTrackList[0];
        const candidates = flatTrackList.filter(t => t._id !== excludeId);
        return candidates[Math.floor(Math.random() * candidates.length)];
    }, [flatTrackList]);

    const handleNextTrack = useCallback(() => {
        if (!activeTrack || flatTrackList.length === 0) return;

        shuffleHistoryRef.current.push(activeTrack._id);

        if (isShuffle) {
            const nextTrack = getRandomTrack(activeTrack._id);
            if (nextTrack) setCurrentTrack(nextTrack);
            return;
        }

        const idx = flatTrackList.findIndex(t => t._id === activeTrack._id);
        if (idx === -1) return;

        if (idx < flatTrackList.length - 1) {
            setCurrentTrack(flatTrackList[idx + 1]);
        } else if (repeatMode === 'all') {
            setCurrentTrack(flatTrackList[0]);
        }
    }, [activeTrack, flatTrackList, isShuffle, repeatMode, getRandomTrack]);

    const handleTrackEnd = useCallback(() => {
        const idx = flatTrackList.findIndex(track => track._id === currentTrack?._id);
        const isLastTrack = idx === -1 || idx === flatTrackList.length - 1;

        if (!isShuffle && isLastTrack && repeatMode !== 'all') {
            setIsPlaying(false);
            setCurrentTime(0);
            return;
        }

        handleNextTrack();
    }, [repeatMode, isShuffle, flatTrackList, currentTrack, handleNextTrack]);

    const handlePrevTrack = useCallback(() => {
        if (!activeTrack) return;

        if (isShuffle && shuffleHistoryRef.current.length > 0) {
            const prevId = shuffleHistoryRef.current.pop();
            const prevTrack = flatTrackList.find(t => t._id === prevId);
            if (prevTrack) {
                setCurrentTrack(prevTrack);
                return;
            }
        }

        const idx = flatTrackList.findIndex(t => t._id === activeTrack._id);
        if (idx > 0) {
            setCurrentTrack(flatTrackList[idx - 1]);
        } else if (repeatMode === 'all' && flatTrackList.length > 0) {
            setCurrentTrack(flatTrackList[flatTrackList.length - 1]);
        }
    }, [activeTrack, flatTrackList, isShuffle, repeatMode]);

    const cycleRepeatMode = () => {
        setRepeatMode(prev => {
            if (prev === 'off') return 'all';
            if (prev === 'all') return 'one';
            return 'off';
        });
    };

    // ==========================================
    // TÍCH HỢP MEDIA SESSION API CHO IPHONE (iOS)
    // ==========================================
    useEffect(() => {
        if (!('mediaSession' in navigator) || !activeTrack) return;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: activeTrack.title || 'Không có tiêu đề',
            artist: activeTrack.artist || 'Không rõ nghệ sĩ',
            album: 'My Playlist',
            artwork: [
                {
                    src: activeTrack.thumbnail || 'https://via.placeholder.com/300x300?text=No+Image',
                    sizes: '300x300',
                    type: 'image/jpeg'
                },
                {
                    src: activeTrack.thumbnail || 'https://via.placeholder.com/512x512?text=No+Image',
                    sizes: '512x512',
                    type: 'image/jpeg'
                }
            ]
        });

        try {
            navigator.mediaSession.setActionHandler('play', handlePlayPause);
            navigator.mediaSession.setActionHandler('pause', handlePlayPause);
            navigator.mediaSession.setActionHandler('previoustrack', handlePrevTrack);
            navigator.mediaSession.setActionHandler('nexttrack', handleNextTrack);

            navigator.mediaSession.setActionHandler('seekto', (details) => {
                if (details.seekTime !== undefined && audioRef.current) {
                    audioRef.current.currentTime = details.seekTime;
                    setCurrentTime(details.seekTime);
                }
            });
        } catch (error) {
            console.warn("Trình duyệt không hỗ trợ một số Action của Media Session", error);
        }

        return () => {
            const actions = ['play', 'pause', 'previoustrack', 'nexttrack', 'seekto'];
            actions.forEach(action => {
                try {
                    navigator.mediaSession.setActionHandler(action, null);
                } catch (e) {}
            });
        };
    }, [activeTrack, handlePlayPause, handlePrevTrack, handleNextTrack]);

    useEffect(() => {
        if (!('mediaSession' in navigator)) return;
        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }, [isPlaying]);

    useEffect(() => {
        if (!('mediaSession' in navigator) || !audioRef.current) return;
        if (typeof navigator.mediaSession.setPositionState === 'function') {
            try {
                navigator.mediaSession.setPositionState({
                    duration: duration || 0,
                    playbackRate: audioRef.current.playbackRate || 1,
                    position: currentTime || 0
                });
            } catch (err) {
                console.warn("Không thể cập nhật PositionState:", err);
            }
        }
    }, [currentTime, duration]);

    return (
        <PageContainer maxWidth={1800} disableGutters>
            {activeTrack?.cloudinaryUrl && (
                <audio
                    ref={audioRef}
                    src={activeTrack.cloudinaryUrl}
                    playsInline  
                    preload="auto"       
                    loop={repeatMode === 'one'}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleTrackEnd}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />
            )}

            <Box ref={pageWrapperRef} sx={{
                height: '100dvh',
                backgroundColor: 'white',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                p: { xs: 2, md: 4 },
                boxSizing: 'border-box'
            }}>
                <Box
                    ref={cardsScrollRef}
                    sx={{
                        mt: 6,
                        pr: { xs: 0, md: 2 },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: playlists.length === 1 ? 'center' : 'flex-start',
                        gap: 6,
                        width: '100%',
                        maxWidth: 1800,
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        scrollBehavior: 'smooth',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        '&::-webkit-scrollbar': { display: 'none' }
                    }}
                >
                    {playlists.map((playlist) => {
                        const playlistId = playlist._id || playlist.name;
                        const hasColorLoaded = groupColors[playlistId];
                        const colors = hasColorLoaded || { vibrant: 'rgba(255,255,255,0.05)', dark: 'rgba(255,255,255,0.02)' };
                        const playlistCover = playlist.thumbnail || 'https://via.placeholder.com/300x300?text=No+Image';

                        return (
                            <Box
                                key={playlistId}
                                sx={{
                                    flex: '0 0 auto',
                                    width: { xs: "90vw", sm: 600, md: 500 },
                                    height: '55vh',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backgroundColor: colors.vibrant,
                                    transition: 'background-color 0.6s ease',
                                    border: "1px solid black",
                                }}
                            >
                                <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                                    <Grid container spacing={3} alignItems="center" wrap="nowrap">
                                        <Grid item xs="auto" sx={{ flexShrink: 0 }}>
                                            <Box
                                                component="img"
                                                src={playlistCover}
                                                sx={{
                                                    width: { xs: 90, sm: 110 },
                                                    height: { xs: 90, sm: 110 },
                                                    borderRadius: '12px',
                                                    objectFit: 'cover',
                                                    border: "1px solid black",
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: 0.8, minWidth: 0 }}>
                                            <Typography
                                                noWrap
                                                sx={{
                                                    color: 'white',
                                                    fontWeight: 800,
                                                    fontSize: { xs: 22, sm: 26, md: 40 },
                                                    width: '100%',
                                                    lineHeight: 1.2
                                                }}
                                            >
                                                {playlist.name || "Không rõ tên"}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontSize: { xs: 12, sm: 13 },
                                                    color: 'rgba(255,255,255,0.7)',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    lineHeight: 1.3,
                                                    minHeight: playlist.description ? 'auto' : '18px'
                                                }}
                                            >
                                                {playlist.description || "Chưa có mô tả cho playlist này."}
                                            </Typography>

                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                                <Typography sx={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>
                                                    {playlist.tracks?.length || 0} bài hát • {calculateTotalPlaylistDuration(playlist.tracks)}
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box data-vertical-scroll="true" sx={{
                                    flex: 1,
                                    minHeight: 0,
                                    overflowY: 'auto',
                                    backgroundColor: colors.dark,
                                    transition: 'background-color 0.6s ease',
                                    p: 1,
                                    '&::-webkit-scrollbar': { width: '6px' },
                                    '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '10px' },
                                }}>
                                    {loading ? (
                                        Array.from({ length: 1 }).map((_, idx) => (
                                            <Box key={idx} sx={{ px: 2, py: 1.4, display: 'flex', gap: 2 }}>
                                                <Skeleton variant="rectangular" width={40} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }} />
                                                <Box sx={{ flex: 1 }}>
                                                    <Skeleton width="40%" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                                                    <Skeleton width="20%" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                                                </Box>
                                            </Box>
                                        ))
                                    ) : (
                                        playlist.tracks?.map((track, index) => {
                                            const isCurrent = currentTrack?._id === track._id;
                                            const isLightBg = colors.isLight;

                                            return (
                                                <Box
                                                    key={track._id}
                                                    onClick={() => setCurrentTrack(track)}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 2,
                                                        px: { xs: 2, sm: 2.5 },
                                                        py: 1,
                                                        cursor: 'pointer',
                                                        borderRadius: '8px',
                                                        mb: 0.5,
                                                        backgroundColor: isCurrent
                                                            ? (isLightBg ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.12)')
                                                            : 'transparent',
                                                        '&:hover': {
                                                            backgroundColor: isLightBg ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.05)'
                                                        },
                                                    }}
                                                >
                                                    <Typography sx={{
                                                        width: 20, fontWeight: 500, fontSize: 13,
                                                        color: isCurrent ? '#4efcd3' : 'rgba(255,255,255,0.4)',
                                                        flexShrink: 0,
                                                        textAlign: 'center'
                                                    }}>
                                                        {isCurrent && isPlaying ? '♪' : index + 1}
                                                    </Typography>
                                                    <Box
                                                        component="img"
                                                        src={track.thumbnail || 'https://via.placeholder.com/80x80?text=No+Image'}
                                                        sx={{ width: 40, height: 40, borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }}
                                                    />
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography noWrap sx={{ textAlign: 'left', fontWeight: 600, fontSize: 14, color: isCurrent ? '#4efcd3' : 'white' }}>
                                                            {track.title || 'Không có tiêu đề'}
                                                        </Typography>
                                                        <Typography noWrap sx={{ textAlign: 'left', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                                                            {track.artist || 'Không rõ nghệ sĩ'}
                                                        </Typography>
                                                    </Box>
                                                    <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                                                        {track.duration || '--:--'}
                                                    </Typography>
                                                </Box>
                                            );
                                        })
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>

                {activeTrack && (
                    <Box sx={{ pt: 2.5, pb: { xs: 3, md: 1.5 }, mt: 'auto', flexShrink: 0, width: '100%' }}>
                        <Box sx={{ position: 'relative', width: '100%', height: '28px', display: 'flex', alignItems: 'center', mb: { xs: 4, md: 4 } }}>
                            <Box sx={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', gap: '2px', pointerEvents: 'none' }}>
                                {activeWaveformData.map((height, index) => {
                                    const isActive = ((index / activeWaveformData.length) * 100) <= progressPercent;
                                    return (
                                        <Box key={index} sx={{
                                            flex: 1,
                                            height: `${height}%`,
                                            backgroundColor: isActive ? '#4efcd3' : 'rgba(127, 127, 127, 0.25)',
                                            borderRadius: '1px',
                                            transition: 'background-color 0.1s ease'
                                        }} />
                                    );
                                })}
                            </Box>

                            <Slider
                                size="small"
                                min={0}
                                max={duration || 100}
                                value={currentTime}
                                onChange={handleSliderChange}
                                sx={{
                                    position: 'absolute', width: '100%', height: { xs: 10, md: 50 }, padding: 0,
                                    '& .MuiSlider-track': { display: 'none' },
                                    '& .MuiSlider-rail': { display: 'none' },
                                    '& .MuiSlider-thumb': {
                                        width: '2px',
                                        height: '100%',
                                        borderRadius: 0,
                                        backgroundColor: '#4efcd3',
                                        boxShadow: '0px 0px 8px rgba(255,255,255,0.5)',
                                        opacity: 1,
                                        transition: 'none',
                                        '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                            boxShadow: '0px 0px 14px #4efcd3',
                                            backgroundColor: '#4efcd3'
                                        }
                                    }
                                }}
                            />
                        </Box>

                        <Grid container alignItems="center" spacing={{ xs: 2, md: 0 }}>
                            <Grid item xs={6} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                <Typography
                                    component="div"
                                    sx={{
                                        fontVariantNumeric: 'tabular-nums',
                                        color: '#000000',
                                        fontSize: '0.8rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {formatTime(currentTime).split('').map((char, index) => (
                                        <span key={`current-${index}`} style={{ display: 'inline-block', width: char === ':' ? '6px' : '7.5px', textAlign: 'center' }}>
                                            {char}
                                        </span>
                                    ))}
                                    <span style={{ margin: '0 6px', color: '#000000' }}>/</span>
                                    {formatTime(duration).split('').map((char, index) => (
                                        <span key={`duration-${index}`} style={{ display: 'inline-block', width: char === ':' ? '6px' : '7.5px', textAlign: 'center' }}>
                                            {char}
                                        </span>
                                    ))}
                                </Typography>
                            </Grid>

                            <Grid item xs={false} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
                                <Stack direction="row" gap={2} justifyContent="center" alignItems="center">
                                    <IconButton
                                        onClick={() => setIsShuffle(s => !s)}
                                        disableRipple
                                        sx={{
                                            color: isShuffle ? '#4efcd3' : 'rgba(0,0,0,0.4)',
                                            '&:hover': { color: isShuffle ? '#4efcd3' : '#000000', transform: 'scale(1.15)' }
                                        }}
                                    >
                                        <ShuffleIcon />
                                    </IconButton>

                                    <IconButton onClick={handlePrevTrack} disableRipple
                                        sx={{
                                            color: 'rgba(0,0,0,0.6)',
                                            '&:hover': { color: '#000', transform: 'scale(1.15)' }
                                        }}>
                                        <SkipPreviousIcon />
                                    </IconButton>

                                    <IconButton onClick={handlePlayPause} disableRipple
                                        sx={{
                                            color: 'rgba(0,0,0,0.8)',
                                            '&:hover': { color: '#000', transform: 'scale(1.15)' }
                                        }}>
                                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                                    </IconButton>

                                    <IconButton onClick={handleNextTrack} disableRipple
                                        sx={{
                                            color: 'rgba(0,0,0,0.6)',
                                            '&:hover': { color: '#000', transform: 'scale(1.15)' }
                                        }}>
                                        <SkipNextIcon />
                                    </IconButton>

                                    <IconButton
                                        onClick={cycleRepeatMode}
                                        disableRipple
                                        sx={{
                                            color: repeatMode !== 'off' ? '#4efcd3' : 'rgba(0,0,0,0.4)',
                                            '&:hover': { color: repeatMode !== 'off' ? '#4efcd3' : '#000000', transform: 'scale(1.15)' }
                                        }}
                                    >
                                        {repeatMode === 'one' ? <RepeatOneIcon /> : <RepeatIcon />}
                                    </IconButton>
                                </Stack>
                            </Grid>

                            <Grid item xs={6} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <IconButton
                                        onClick={toggleMute}
                                        size="small"
                                        disableRipple
                                        sx={{
                                            color: 'rgba(0, 0, 0, 0.6)',
                                            transition: 'transform 0.2s ease',
                                            '&:hover': { color: '#000000', transform: 'scale(1.15)' }
                                        }}
                                    >
                                        {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                                    </IconButton>
                                    <Slider
                                        size="small"
                                        value={isMuted ? 0 : volume}
                                        onChange={handleVolumeChange}
                                        min={0}
                                        max={100}
                                        sx={{
                                            width: { xs: 70, sm: 90 },
                                            color: '#000000',
                                            height: 2,
                                            '& .MuiSlider-track': { backgroundColor: '#000000' },
                                            '& .MuiSlider-rail': { backgroundColor: 'rgba(0, 0, 0, 0.15)' },
                                            '& .MuiSlider-thumb': {
                                                width: '2px',
                                                height: '12px',
                                                borderRadius: 0,
                                                backgroundColor: '#000000',
                                                transition: 'none',
                                                '&:hover, &.Mui-focusVisible, &.Mui-active': { boxShadow: 'none', width: '4px' }
                                            }
                                        }}
                                    />
                                </Stack>
                            </Grid>

                            <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' }, mt: 1 }}>
                                <Stack direction="row" gap={4} justifyContent="center" alignItems="center">
                                    <IconButton
                                        onClick={() => setIsShuffle(s => !s)}
                                        disableRipple
                                        sx={{
                                            color: isShuffle ? '#4efcd3' : 'rgba(0,0,0,0.4)',
                                            '&:hover': { color: isShuffle ? '#4efcd3' : '#000000' }
                                        }}
                                    >
                                        <ShuffleIcon />
                                    </IconButton>

                                    <IconButton onClick={handlePrevTrack} disableRipple
                                        sx={{
                                            color: 'rgba(0,0,0,0.6)',
                                            '&:hover': { color: '#000' }
                                        }}>
                                        <SkipPreviousIcon />
                                    </IconButton>

                                    <IconButton onClick={handlePlayPause} disableRipple
                                        sx={{
                                            color: 'rgba(0,0,0,0.8)',
                                            '&:hover': { color: '#000' }
                                        }}>
                                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                                    </IconButton>

                                    <IconButton onClick={handleNextTrack} disableRipple
                                        sx={{
                                            color: 'rgba(0,0,0,0.6)',
                                            '&:hover': { color: '#000' }
                                        }}>
                                        <SkipNextIcon />
                                    </IconButton>

                                    <IconButton
                                        onClick={cycleRepeatMode}
                                        disableRipple
                                        sx={{
                                            color: repeatMode !== 'off' ? '#4efcd3' : 'rgba(0,0,0,0.4)',
                                            '&:hover': { color: repeatMode !== 'off' ? '#4efcd3' : '#000000' }
                                        }}
                                    >
                                        {repeatMode === 'one' ? <RepeatOneIcon /> : <RepeatIcon />}
                                    </IconButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Box>
        </PageContainer>
    );
}

export default Music;
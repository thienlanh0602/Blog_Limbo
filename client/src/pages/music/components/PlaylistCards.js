import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, Typography, Skeleton, Stack } from '@mui/material';
import { getThumbMusicUrl } from '../../../api/musicAPI';

// SVG ảnh tạm (hình nốt nhạc) thay thế khi ảnh gốc 404 hoặc lỗi
const FALLBACK_COVER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'>
        <rect width='100%' height='100%' fill='#1a1a1e'/>
        <text x='50%' y='55%' font-size='48' fill='#4efcd3' text-anchor='middle' dominant-baseline='middle'>♪</text>
    </svg>`
)}`;

// Nhớ các URL đã lỗi trong suốt phiên làm việc để không request lại (tránh 404 lặp khi re-render/remount)
const badImageUrls = new Set();

const FIXED_PLAYLIST_COLORS = {
    vibrant: '#1c1c1e',
    dark: '#151516',
    isLight: false
};

const getYoutubeId = (url) =>
    url?.match(/\/vi(?:_webp)?\/([\w-]{11})\//)?.[1];

const getSafeThumbnail = (url) => {
    if (!url) return FALLBACK_COVER_SVG;
    const id = getYoutubeId(url);
    if (id) return getThumbMusicUrl(id);
    return url;
};

// Ảnh tự động chuyển sang SVG khi bị lỗi (404, hết hạn, ...)
const SafeImage = ({ src, onLoaded, sx }) => {
    const safeSrc = getSafeThumbnail(src);
    const [failedSrc, setFailedSrc] = useState(null);
    const isFailed = badImageUrls.has(safeSrc) || failedSrc === safeSrc;
    const finalSrc = isFailed ? FALLBACK_COVER_SVG : safeSrc;

    const handleError = () => {
        if (finalSrc === FALLBACK_COVER_SVG) return; // tránh lặp vô hạn
        badImageUrls.add(safeSrc);
        setFailedSrc(safeSrc);
        onLoaded?.(); // tắt skeleton, hiện SVG ngay
    };

    return (
        <Box
            component="img"
            src={finalSrc}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={handleError}
            onLoad={() => onLoaded?.()}
            sx={sx}
        />
    );
};

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

export const PlaylistCards = ({
    playlists,
    loading,
    currentTrack,
    isPlaying,
    setCurrentTrack,
    cardsScrollRef,
    loadedCovers,
    handleCoverLoad,
    loadedTrackThumbs,
    handleTrackThumbLoad
}) => {
    const trackRefs = useRef({});
    useEffect(() => {
        if (currentTrack && trackRefs.current[currentTrack._id]) {
            trackRefs.current[currentTrack._id].scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }
    }, [currentTrack]);

    return (
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
                const colors = FIXED_PLAYLIST_COLORS;
                const isCoverLoaded = !!loadedCovers[playlistId];

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
                            border: "1px solid black",
                        }}
                    >
                        <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                            <Grid container spacing={3} alignItems="center" wrap="nowrap">
                                <Grid item xs="auto" sx={{ flexShrink: 0 }}>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: { xs: 90, sm: 110 },
                                            height: { xs: 90, sm: 110 },
                                            flexShrink: 0
                                        }}
                                    >
                                        {!isCoverLoaded && (
                                            <Skeleton
                                                variant="rectangular"
                                                width="100%"
                                                height="100%"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    borderRadius: '12px',
                                                    bgcolor: 'rgba(255,255,255,0.12)'
                                                }}
                                            />
                                        )}
                                        <SafeImage
                                            src={playlist.thumbnail}
                                            onLoaded={() => handleCoverLoad(playlistId)}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '12px',
                                                objectFit: 'cover',
                                                border: "1px solid black",
                                                display: 'block',
                                                opacity: isCoverLoaded ? 1 : 0,
                                                transition: 'opacity 0.25s ease'
                                            }}
                                        />
                                    </Box>
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
                                    const isThumbLoaded = !!loadedTrackThumbs[track._id];

                                    return (
                                        <Box
                                            key={track._id}
                                            ref={(el) => {
                                                if (el) trackRefs.current[track._id] = el;
                                            }}
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
                                            <Box sx={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
                                                {!isThumbLoaded && (
                                                    <Skeleton
                                                        variant="rectangular"
                                                        width="100%"
                                                        height="100%"
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            borderRadius: '4px',
                                                            bgcolor: 'rgba(255,255,255,0.1)'
                                                        }}
                                                    />
                                                )}
                                                <SafeImage
                                                    src={track.thumbnail}
                                                    onLoaded={() => handleTrackThumbLoad(track._id)}
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        borderRadius: '4px',
                                                        objectFit: 'cover',
                                                        display: 'block',
                                                        opacity: isThumbLoaded ? 1 : 0,
                                                        transition: 'opacity 0.2s ease'
                                                    }}
                                                />
                                            </Box>
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
    );
};
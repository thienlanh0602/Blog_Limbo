import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Box, useTheme, useMediaQuery, GlobalStyles } from '@mui/material';
import PageContainer from "../../components/layout/PageContainer";
import { getPlaylists, getPlaylistDetail } from '../../api/playlistAPI';
import { getSafeThumbnail, FALLBACK_COVER_SVG } from '../music/utils/thumbnail';
import { useAudioEQ } from '../../pages/homepage/selections/useAudioEq';

import { PlaylistCards } from './components/PlaylistCards';
import { MusicPlayerBar } from './components/MusicPlayerBar';

// Đọc/ghi localStorage an toàn (dữ liệu hỏng hoặc đầy bộ nhớ sẽ không làm sập trang)
const readCache = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

const writeCache = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
        console.warn(`Không thể lưu cache "${key}":`, err);
    }
};

function Music() {
    const [playlists, setPlaylists] = useState(() => readCache('offline_playlists', []) || []);
    const [loading, setLoading] = useState(() => (readCache('offline_playlists', []) || []).length === 0);

    const [currentTrack, setCurrentTrack] = useState(() => readCache('offline_last_track', null));
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(100);
    const [isMuted, setIsMuted] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState('off');

    const [loadedCovers, setLoadedCovers] = useState({});
    const [loadedTrackThumbs, setLoadedTrackThumbs] = useState({});

    const audioRef = useRef(null);
    const pageWrapperRef = useRef(null);
    const shuffleHistoryRef = useRef([]);
    const { resume, setPreset } = useAudioEQ(audioRef);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const flatTrackList = useMemo(
        () => (Array.isArray(playlists) ? playlists.flatMap(pl => pl?.tracks || []) : []),
        [playlists]
    );

    const activeTrack = currentTrack || flatTrackList[0] || null;
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    const handleCoverLoad = useCallback((id) => {
        setLoadedCovers(prev => (prev[id] ? prev : { ...prev, [id]: true }));
    }, []);

    const handleTrackThumbLoad = useCallback((id) => {
        setLoadedTrackThumbs(prev => (prev[id] ? prev : { ...prev, [id]: true }));
    }, []);

    // Tự động khôi phục AudioEQ và ép phát lại khi người dùng quay lại ứng dụng / mở sáng màn hình
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (!document.hidden) {
                if (typeof resume === 'function') {
                    try {
                        await resume();
                    } catch (e) {
                        console.warn("Không thể resume AudioContext:", e);
                    }
                }
                if (audioRef.current && isPlaying) {
                    audioRef.current.play().catch(() => {});
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [resume, isPlaying]);

    useEffect(() => {
        let isMounted = true;
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
                        if (pl?.tracks && pl.tracks.length > 0 && typeof pl.tracks[0] === 'object') {
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

                if (isMounted) {
                    setPlaylists(fullPlaylists);
                    writeCache('offline_playlists', fullPlaylists);
                }
            } catch (error) {
                console.warn("Đang offline hoặc lỗi mạng. Sử dụng dữ liệu đã lưu cục bộ.", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchAllPlaylists();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        if (currentTrack) {
            writeCache('offline_last_track', currentTrack);
        }
    }, [currentTrack]);

    // Tự phát khi đổi bài: đợi "canplay", bỏ qua AbortError, xử lý NotAllowedError
    useEffect(() => {
        const audio = audioRef.current;
        if (!currentTrack || !audio) return;

        let cancelled = false;

        // Reset tiến trình của bài cũ để thanh chạy không bị giật
        setCurrentTime(0);
        setDuration(0);

        const tryPlay = async () => {
            try {
                await audio.play();
                if (!cancelled) setIsPlaying(true);
            } catch (err) {
                if (cancelled) return;
                if (err.name === "AbortError") return;
                if (err.name === "NotAllowedError") {
                    setIsPlaying(false);
                    return;
                }
                console.error("Lỗi phát nhạc:", err);
                setIsPlaying(false);
            }
        };

        audio.addEventListener("canplay", tryPlay, { once: true });

        return () => {
            cancelled = true;
            audio.removeEventListener("canplay", tryPlay);
        };
    }, [currentTrack]);

    const handlePlayPause = useCallback(() => {
        resume();
        setPreset("spotifyBass");
        const trackToPlay = currentTrack || activeTrack;
        if (!currentTrack && trackToPlay) {
            setCurrentTrack(trackToPlay);
            return;
        }
        if (!audioRef.current) return;

        if (audioRef.current.paused) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(err => {
                        if (err.name === "AbortError") return;
                        console.warn("Không thể phát nhạc:", err.message);
                        setIsPlaying(false);
                    });
            }
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, [currentTrack, activeTrack, resume, setPreset]);

    const handleSelectTrack = useCallback((track) => {
        resume();
        setPreset("spotifyBass");
        setCurrentTrack(track);
    }, [resume, setPreset]);

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

    // Kéo thanh âm lượng sẽ tự bỏ tắt tiếng (đồng bộ cả audio.muted)
    const handleVolumeChange = (e, newValue) => {
        setVolume(newValue);
        const muted = newValue === 0;
        setIsMuted(muted);
        if (audioRef.current) {
            audioRef.current.volume = newValue / 100;
            audioRef.current.muted = muted;
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
        const candidates = flatTrackList.filter(t => t?._id !== excludeId);
        return candidates[Math.floor(Math.random() * candidates.length)];
    }, [flatTrackList]);

    const handleNextTrack = useCallback(() => {
        if (!activeTrack || flatTrackList.length === 0) return;

        if (isShuffle) {
            // Chỉ lưu lịch sử khi đang shuffle để không phình bộ nhớ vô ích
            shuffleHistoryRef.current.push(activeTrack._id);
            const nextTrack = getRandomTrack(activeTrack._id);
            if (nextTrack) setCurrentTrack(nextTrack);
            return;
        }

        const idx = flatTrackList.findIndex(t => t?._id === activeTrack._id);
        if (idx === -1) return;

        if (idx < flatTrackList.length - 1) {
            setCurrentTrack(flatTrackList[idx + 1]);
        } else if (repeatMode === 'all') {
            setCurrentTrack(flatTrackList[0]);
        }
    }, [activeTrack, flatTrackList, isShuffle, repeatMode, getRandomTrack]);

    const handleTrackEnd = useCallback(() => {
        const idx = flatTrackList.findIndex(track => track?._id === currentTrack?._id);
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
            const prevTrack = flatTrackList.find(t => t?._id === prevId);
            if (prevTrack) {
                setCurrentTrack(prevTrack);
                return;
            }
        }

        const idx = flatTrackList.findIndex(t => t?._id === activeTrack._id);
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

    useEffect(() => {
        if (!('mediaSession' in navigator) || !activeTrack) return;

        // Media Session cần URL tuyệt đối; ảnh đi qua backend nên không còn 404 từ ytimg
        const artSrc = new URL(getSafeThumbnail(activeTrack.thumbnail), window.location.href).href;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: activeTrack.title || 'Không có tiêu đề',
            artist: activeTrack.artist || 'Không rõ nghệ sĩ',
            album: 'My Playlist',
            artwork: [{ src: artSrc, sizes: '480x360' }]
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
                } catch (e) { }
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
                // duration có thể là NaN/Infinity khi chưa tải xong -> bỏ qua để tránh lỗi
                if (!Number.isFinite(duration) || duration <= 0) return;
                navigator.mediaSession.setPositionState({
                    duration,
                    playbackRate: audioRef.current.playbackRate || 1,
                    position: Math.min(currentTime || 0, duration)
                });
            } catch (err) {
                console.warn("Không thể cập nhật PositionState:", err);
            }
        }
    }, [currentTime, duration]);

    return (
        <PageContainer maxWidth={2000} disableGutters>
            <GlobalStyles styles={{
                'html, body': {
                    overflow: 'hidden !important',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none !important',
                        width: '0px !important'
                    }
                }
            }} />

            {activeTrack?.cloudinaryUrl && (
                <audio
                    ref={audioRef}
                    src={activeTrack.cloudinaryUrl}
                    crossOrigin="anonymous"
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

            <Box
                ref={pageWrapperRef}
                sx={{
                    position: 'relative',
                    height: '100dvh',
                    width: '100vw',
                    backgroundColor: '#0a0a0c',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    p: { xs: 2, md: 4 },
                    boxSizing: 'border-box',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0.075,
                        pointerEvents: 'none',
                        zIndex: 2,
                    }}
                />

                <Box sx={{
                    position: 'relative',
                    zIndex: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    overflow: 'hidden',
                    width: '100%',
                    maxWidth: '1400px',
                    mx: 'auto',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <PlaylistCards
                        playlists={playlists}
                        loading={loading}
                        currentTrack={currentTrack}
                        isPlaying={isPlaying}
                        setCurrentTrack={handleSelectTrack}
                        loadedCovers={loadedCovers}
                        handleCoverLoad={handleCoverLoad}
                        loadedTrackThumbs={loadedTrackThumbs}
                        handleTrackThumbLoad={handleTrackThumbLoad}
                    />

                    {activeTrack && (
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                            {/* Thanh ngang 1px thay thế cho sóng nhạc */}
                            <Box sx={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.2)', mb: 1, position: 'relative' }}>
                                <Box sx={{ width: `${progressPercent}%`, height: '100%', backgroundColor: '#ffffff' }} />
                            </Box>

                            <MusicPlayerBar
                                progressPercent={progressPercent}
                                duration={duration}
                                currentTime={currentTime}
                                handleSliderChange={handleSliderChange}
                                formatTime={formatTime}
                                isShuffle={isShuffle}
                                setIsShuffle={setIsShuffle}
                                handlePrevTrack={handlePrevTrack}
                                handlePlayPause={handlePlayPause}
                                isPlaying={isPlaying}
                                handleNextTrack={handleNextTrack}
                                repeatMode={repeatMode}
                                cycleRepeatMode={cycleRepeatMode}
                                toggleMute={toggleMute}
                                isMuted={isMuted}
                                volume={volume}
                                handleVolumeChange={handleVolumeChange}
                            />
                        </Box>
                    )}
                </Box>
            </Box>
        </PageContainer>
    );
}

export default Music;
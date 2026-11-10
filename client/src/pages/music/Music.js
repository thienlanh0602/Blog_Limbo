import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Box, useTheme, useMediaQuery, GlobalStyles } from '@mui/material';
import PageContainer from "../../components/layout/PageContainer";
import { getPlaylists, getPlaylistDetail } from '../../api/playlistAPI';
import { getSafeThumbnail, FALLBACK_COVER_SVG } from '../music/utils/thumbnail';
import { useAudioEQ } from '../../pages/homepage/selections/useAudioEq';

import { PlaylistCards } from './components/PlaylistCards';
import { MusicPlayerBar } from './components/MusicPlayerBar';

// Đọc/ghi localStorage an toàn, giới hạn dung lượng lưu trữ tránh tràn bộ nhớ trình duyệt
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
        const serialized = JSON.stringify(value);
        // Kiểm tra nếu dữ liệu quá lớn (> 2MB) thì bỏ qua không lưu cứng để tránh nghẽn localStorage
        if (serialized.length < 2 * 1024 * 1024) {
            localStorage.setItem(key, serialized);
        }
    } catch (err) {
        console.warn(`Không thể lưu cache "${key}" (có thể đầy bộ nhớ):`, err);
    }
};

const generateDummyWaveform = (count = 150) => {
    const raw = [];
    let value = 45;
    for (let i = 0; i < count; i++) {
        const step = (Math.random() - 0.5) * 16;
        value += step;
        value = Math.max(8, Math.min(95, value));
        raw.push(Math.round(value));
    }
    return raw;
};

function Music() {
    const [playlists, setPlaylists] = useState(() => readCache('offline_playlists', []));
    const [loading, setLoading] = useState(() => readCache('offline_playlists', []).length === 0);

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

    const waveformCount = isMobile ? 50 : (isTablet ? 100 : 150);
    const baseWaveformData = useMemo(() => generateDummyWaveform(150), []);

    const activeWaveformData = useMemo(() => {
        return baseWaveformData.slice(0, waveformCount);
    }, [baseWaveformData, waveformCount]);

    const flatTrackList = useMemo(
        () => playlists.flatMap(pl => pl.tracks || []),
        [playlists]
    );

    const activeTrack = currentTrack || flatTrackList[0] || null;
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    const currentPlaylistCover = useMemo(() => {
        if (!activeTrack || playlists.length === 0) return FALLBACK_COVER_SVG;
        const matchedPlaylist = playlists.find(pl =>
            pl.tracks && pl.tracks.some(track => track._id === activeTrack._id)
        );
        return getSafeThumbnail(matchedPlaylist?.thumbnail || playlists[0]?.thumbnail);
    }, [activeTrack, playlists]);

    const handleCoverLoad = useCallback((id) => {
        setLoadedCovers(prev => (prev[id] ? prev : { ...prev, [id]: true }));
    }, []);

    const handleTrackThumbLoad = useCallback((id) => {
        setLoadedTrackThumbs(prev => (prev[id] ? prev : { ...prev, [id]: true }));
    }, []);

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

                if (isMounted) {
                    setPlaylists(fullPlaylists);
                    writeCache('offline_playlists', fullPlaylists);
                }
            } catch (error) {
                console.warn("Lỗi mạng, dùng cache cục bộ.", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchAllPlaylists();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        if (currentTrack) {
            writeCache('offline_last_track', { _id: currentTrack._id, title: currentTrack.title, cloudinaryUrl: currentTrack.cloudinaryUrl });
        }
    }, [currentTrack]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!currentTrack || !audio) return;

        let cancelled = false;
        setCurrentTime(0);
        setDuration(0);

        const tryPlay = async () => {
            try {
                await audio.play();
                if (!cancelled) setIsPlaying(true);
            } catch (err) {
                if (cancelled || err.name === "AbortError") return;
                if (err.name === "NotAllowedError") {
                    setIsPlaying(false);
                    return;
                }
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
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => {
                    if (err.name !== "AbortError") setIsPlaying(false);
                });
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
                if (['INPUT', 'TEXTAREA'].includes(target.tagName) || target.getAttribute('role') === 'slider') return;
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
        const candidates = flatTrackList.filter(t => t._id !== excludeId);
        return candidates[Math.floor(Math.random() * candidates.length)];
    }, [flatTrackList]);

    const handleNextTrack = useCallback(() => {
        if (!activeTrack || flatTrackList.length === 0) return;

        if (isShuffle) {
            // Giới hạn lịch sử shuffle tối đa 50 phần tử để tránh tràn bộ nhớ mảng
            if (shuffleHistoryRef.current.length > 50) {
                shuffleHistoryRef.current.shift();
            }
            shuffleHistoryRef.current.push(activeTrack._id);
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

                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url("${currentPlaylistCover}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'grayscale(80%) contrast(140%) brightness(80%) blur(7px)',
                        zIndex: 0,
                        willChange: 'background-image',
                        transform: 'translateZ(0)',
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(180deg, rgba(5,5,5,0.45) 0%, rgba(5,5,5,0.7) 55%, rgba(0,0,0,0.96) 100%)',
                        zIndex: 1,
                        pointerEvents: 'none',
                    }
                }}
            >
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
                        <MusicPlayerBar
                            activeWaveformData={activeWaveformData}
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
                    )}
                </Box>
            </Box>
        </PageContainer>
    );
}

export default Music;
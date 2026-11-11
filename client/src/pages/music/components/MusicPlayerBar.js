import React from 'react';
import { Box, Grid, Typography, Slider, Stack, IconButton } from '@mui/material';
import {
    PlayIcon, PauseIcon, SkipPreviousIcon, SkipNextIcon,
    VolumeUpIcon, VolumeOffIcon, ShuffleIcon, RepeatIcon, RepeatOneIcon
} from './MusicIcons';

// Màu icon mặc định (đổi 1 chỗ này là đổi tất cả icon)
const ICON_COLOR = '#000000';
const ACTIVE_COLOR = '#4efcd3';

export const MusicPlayerBar = ({
    progressPercent,
    duration,
    currentTime,
    handleSliderChange,
    formatTime,
    isShuffle,
    setIsShuffle,
    handlePrevTrack,
    handlePlayPause,
    isPlaying,
    handleNextTrack,
    repeatMode,
    cycleRepeatMode,
    toggleMute,
    isMuted,
    volume,
    handleVolumeChange
}) => {
    return (
        <Box sx={{ pt: 2.5, pb: { xs: 3, md: 1.5 }, mt: 'auto', flexShrink: 0, width: '100%' }}>
            {/* Thanh trượt thời gian bài hát */}
            <Box sx={{ position: 'relative', width: '100%', height: '28px', display: 'flex', alignItems: 'center', mb: { xs: 4, md: 4 } }}>
                <Box sx={{ width: '100%', height: '1px', backgroundColor: 'rgba(109, 106, 106, 0.2)', mb: 1, position: 'relative' }}>
                    <Box sx={{ width: `${progressPercent}%`, height: '100%', backgroundColor: '#1b1a1a' }} />
                </Box>

                <Slider
                    size="small"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSliderChange}
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',          // giữ vùng bấm cao để dễ chạm
                        padding: 0,
                        color: 'transparent',
                        cursor: 'pointer',
                        '& .MuiSlider-track': { display: 'none' },
                        '& .MuiSlider-rail': { display: 'none' },
                        '& .MuiSlider-thumb': {
                            opacity: 0,
                            width: '2px',
                            height: '100%',
                            boxShadow: 'none',
                            backgroundColor: 'transparent',
                            transition: 'none',
                            '&::before, &::after': { display: 'none' },
                            '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                boxShadow: 'none',
                                backgroundColor: 'transparent',
                            },
                        },
                    }}
                />
            </Box>

            <Grid container alignItems="center" spacing={{ xs: 2, md: 0 }}>
                <Grid item xs={6} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <Typography
                        component="div"
                        sx={{
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
                                color: isShuffle ? ACTIVE_COLOR : ICON_COLOR,
                                '&:hover': { color: ACTIVE_COLOR, transform: 'scale(1.15)' },
                                '& svg': { fill: 'currentColor' }
                            }}
                        >
                            <ShuffleIcon />
                        </IconButton>

                        <IconButton onClick={handlePrevTrack} disableRipple
                            sx={{
                                color: ICON_COLOR,
                                '&:hover': { color: ACTIVE_COLOR, transform: 'scale(1.15)' },
                                '& svg': { fill: 'currentColor' }
                            }}>
                            <SkipPreviousIcon />
                        </IconButton>

                        <IconButton onClick={handlePlayPause} disableRipple
                            sx={{
                                color: ICON_COLOR,
                                '&:hover': { color: ACTIVE_COLOR, transform: 'scale(1.15)' },
                                '& svg': { fill: 'currentColor' }
                            }}>
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </IconButton>

                        <IconButton onClick={handleNextTrack} disableRipple
                            sx={{
                                color: ICON_COLOR,
                                '&:hover': { color: ACTIVE_COLOR, transform: 'scale(1.15)' },
                                '& svg': { fill: 'currentColor' }
                            }}>
                            <SkipNextIcon />
                        </IconButton>

                        <IconButton
                            onClick={cycleRepeatMode}
                            disableRipple
                            sx={{
                                color: repeatMode !== 'off' ? ACTIVE_COLOR : ICON_COLOR,
                                '&:hover': { color: ACTIVE_COLOR, transform: 'scale(1.15)' },
                                '& svg': { fill: 'currentColor' }
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
                                color: ICON_COLOR,
                                transition: 'transform 0.2s ease',
                                '& svg': { fill: 'currentColor', stroke: 'currentColor' }
                            }}
                        >
                            {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                        </IconButton>
                        <Box sx={{
                            position: 'relative',
                            width: { xs: 70, sm: 90 },
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            {/* Phần nhìn thấy: giống hệt thanh thời gian */}
                            <Box sx={{ width: '100%', height: '1px', backgroundColor: 'rgba(109, 106, 106, 0.2)', position: 'relative' }}>
                                <Box sx={{ width: `${isMuted ? 0 : volume}%`, height: '100%', backgroundColor: '#1b1a1a' }} />
                            </Box>

                            {/* Phần bấm: vô hình */}
                            <Slider
                                size="small"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                min={0}
                                max={100}
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    padding: 0,
                                    color: 'transparent',
                                    cursor: 'pointer',
                                    '& .MuiSlider-track': { display: 'none' },
                                    '& .MuiSlider-rail': { display: 'none' },
                                    '& .MuiSlider-thumb': {
                                        opacity: 0,
                                        width: '2px',
                                        height: '100%',
                                        boxShadow: 'none',
                                        backgroundColor: 'transparent',
                                        transition: 'none',
                                        '&::before, &::after': { display: 'none' },
                                        '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                            boxShadow: 'none',
                                            backgroundColor: 'transparent',
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Stack>
                </Grid>

                <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' }, mt: 1 }}>
                    <Stack direction="row" gap={4} justifyContent="center" alignItems="center">
                        <IconButton
                            onClick={() => setIsShuffle(s => !s)}
                            disableRipple
                            sx={{
                                color: isShuffle ? ACTIVE_COLOR : ICON_COLOR,
                                '&:hover': { color: ACTIVE_COLOR },
                                '& svg': { fill: 'currentColor' }
                            }}
                        >
                            <ShuffleIcon />
                        </IconButton>

                        <IconButton onClick={handlePrevTrack} disableRipple
                            sx={{
                                color: ICON_COLOR,
                                '&:hover': { color: ACTIVE_COLOR },
                                '& svg': { fill: 'currentColor' }
                            }}>
                            <SkipPreviousIcon />
                        </IconButton>

                        <IconButton onClick={handlePlayPause} disableRipple
                            sx={{
                                color: ICON_COLOR,
                                '&:hover': { color: ACTIVE_COLOR },
                                '& svg': { fill: 'currentColor' }
                            }}>
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </IconButton>

                        <IconButton onClick={handleNextTrack} disableRipple
                            sx={{
                                color: ICON_COLOR,
                                '&:hover': { color: ACTIVE_COLOR },
                                '& svg': { fill: 'currentColor' }
                            }}>
                            <SkipNextIcon />
                        </IconButton>

                        <IconButton
                            onClick={cycleRepeatMode}
                            disableRipple
                            sx={{
                                color: repeatMode !== 'off' ? ACTIVE_COLOR : ICON_COLOR,
                                '&:hover': { color: ACTIVE_COLOR },
                                '& svg': { fill: 'currentColor' }
                            }}
                        >
                            {repeatMode === 'one' ? <RepeatOneIcon /> : <RepeatIcon />}
                        </IconButton>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};
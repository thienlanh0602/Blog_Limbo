import React from 'react';
import { Box, Grid, Typography, Slider, Stack, IconButton } from '@mui/material';
import {
    PlayIcon, PauseIcon, SkipPreviousIcon, SkipNextIcon,
    VolumeUpIcon, VolumeOffIcon, ShuffleIcon, RepeatIcon, RepeatOneIcon
} from './MusicIcons';

export const MusicPlayerBar = ({
    activeWaveformData,
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
            <Box sx={{ position: 'relative', width: '100%', height: '28px', display: 'flex', alignItems: 'center', mb: { xs: 4, md: 4 } }}>
                <Box sx={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                    <svg 
                        width="100%" 
                        height="100%" 
                        viewBox={`0 0 ${activeWaveformData.length * 6} 40`} 
                        preserveAspectRatio="none"
                        style={{ overflow: 'visible' }}
                    >
                        {activeWaveformData.map((heightValue, index) => {
                            const barHeight = Math.max(6, (heightValue / 100) * 34);
                            const isPassed = (index / activeWaveformData.length) * 100 <= progressPercent;
                            
                            const xCoord = index * 6;
                            const yCoord = (40 - barHeight) / 2;

                            return (
                                <rect
                                    key={index}
                                    x={xCoord}
                                    y={yCoord}
                                    width="3.5"
                                    height={barHeight}
                                    rx="1.5"
                                    fill={isPassed ? "#4efcd3" : "rgba(127, 127, 127, 0.25)"}
                                />
                            );
                        })}
                    </svg>
                </Box>

                <Slider
                    size="small"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSliderChange}
                    sx={{
                        position: 'absolute', width: '100%', height: { xs: 2, md: 30 }, padding: 0,
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
                            color: '#ffffff', // Đổi màu chữ thời gian thành trắng cho đồng bộ
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
                        <span style={{ margin: '0 6px', color: '#ffffff' }}>/</span>
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
                                color: isShuffle ? '#4efcd3' : '#ffffff',
                                '&:hover': { color: '#4efcd3', transform: 'scale(1.15)' },
                                '& svg': { fill: 'currentColor' }
                            }}
                        >
                            <ShuffleIcon />
                        </IconButton>

                        <IconButton onClick={handlePrevTrack} disableRipple
                            sx={{
                                color: '#ffffff',
                                '&:hover': { color: '#4efcd3', transform: 'scale(1.15)' },
                                '& svg': { fill: 'currentColor' }
                            }}>
                            <SkipPreviousIcon />
                        </IconButton>

                        <IconButton onClick={handlePlayPause} disableRipple
                            sx={{
                                color: '#ffffff',
                                '&:hover': { color: '#4efcd3', transform: 'scale(1.15)' },
                                '& svg': { fill: 'currentColor' }
                            }}>
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </IconButton>

                        <IconButton onClick={handleNextTrack} disableRipple
                            sx={{
                                color: '#ffffff',
                                '&:hover': { color: '#4efcd3', transform: 'scale(1.15)' },
                                '& svg': { fill: 'currentColor' }
                            }}>
                            <SkipNextIcon />
                        </IconButton>

                        <IconButton
                            onClick={cycleRepeatMode}
                            disableRipple
                            sx={{
                                color: repeatMode !== 'off' ? '#4efcd3' : '#ffffff',
                                '&:hover': { color: '#4efcd3', transform: 'scale(1.15)' },
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
                                color: '#ffffff',
                                transition: 'transform 0.2s ease',
                                '&:hover': { color: '#4efcd3', transform: 'scale(1.15)' },
                                '& svg': { fill: 'currentColor', stroke: 'currentColor' }
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
                                color: '#ffffff',
                                height: 2,
                                '& .MuiSlider-track': { backgroundColor: '#ffffff' },
                                '& .MuiSlider-rail': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                                '& .MuiSlider-thumb': {
                                    width: '2px',
                                    height: '12px',
                                    borderRadius: 0,
                                    backgroundColor: '#ffffff',
                                    transition: 'none',
                                    '&:hover, &.Mui-focusVisible, &.Mui-active': { boxShadow: 'none', width: '4px', backgroundColor: '#4efcd3' }
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
                                color: isShuffle ? '#4efcd3' : '#ffffff',
                                '&:hover': { color: '#4efcd3' },
                                '& svg': { fill: 'currentColor' }
                            }}
                        >
                            <ShuffleIcon />
                        </IconButton>

                        <IconButton onClick={handlePrevTrack} disableRipple
                            sx={{
                                color: '#ffffff',
                                '&:hover': { color: '#4efcd3' },
                                '& svg': { fill: 'currentColor' }
                            }}>
                            <SkipPreviousIcon />
                        </IconButton>

                        <IconButton onClick={handlePlayPause} disableRipple
                            sx={{
                                color: '#ffffff',
                                '&:hover': { color: '#4efcd3' },
                                '& svg': { fill: 'currentColor' }
                            }}>
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </IconButton>

                        <IconButton onClick={handleNextTrack} disableRipple
                            sx={{
                                color: '#ffffff',
                                '&:hover': { color: '#4efcd3' },
                                '& svg': { fill: 'currentColor' }
                            }}>
                            <SkipNextIcon />
                        </IconButton>

                        <IconButton
                            onClick={cycleRepeatMode}
                            disableRipple
                            sx={{
                                color: repeatMode !== 'off' ? '#4efcd3' : '#ffffff',
                                '&:hover': { color: '#4efcd3' },
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
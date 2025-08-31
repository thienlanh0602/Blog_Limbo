import React, { useRef, useState } from "react";
import { Box, Typography, CardMedia, Slider, IconButton, Button } from "@mui/material";
import Play from "../../../assets/play.svg";
import Pause from "../../../assets/pause.svg";
import Repeat from "../../../assets/repeat.svg";
import Arrow from "../../../assets/Arrow_1.svg";


import Audio from "../../../assets/music/no-way-back.mp3";

// ===================== Helpers =====================
const formatTime = (time) => {
  if (!time || isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};

// Highlight chữ "âm nhạc"
const formatTextWithHighlight = (text) => {
  if (!text.includes("âm nhạc")) return text;

  const [before, after] = text.split("âm nhạc");
  return (
    <>
      {before.split(".").map((part, idx, arr) => (
        <React.Fragment key={idx}>
          {part.trim()}
          {idx < arr.length - 1 && <br />}
        </React.Fragment>
      ))}
      {" "}
      <Box component="span" sx={{ fontWeight: "bold", fontStyle: "italic" }}>
        âm nhạc
      </Box>
      {" "}
      {after?.split(".").map((part, idx, arr) => (
        <React.Fragment key={idx}>
          {part.trim()}
          {idx < arr.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
};

// ===================== Audio Player =====================
const AudioPlayer = ({ audioRef, isPlaying, togglePlay, progress, duration, handleSeek, ended }) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: 300, gap: 1 }}>
    {/* Time + Play/Pause */}
    <Box sx={{ display: "flex", alignItems: "flex-end", width: "100%" }}>
      <Typography sx={{ fontWeight: 300, fontSize: 12, flex: 1, textAlign: "left" }}>
        {formatTime(progress)}
      </Typography>

      <IconButton
        onClick={togglePlay}
        disableRipple
        sx={{
          p: 0,
          width: 36,
          height: 26,
          borderRadius: "9999px",
          border: "1px solid black",
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: 1,
          "&:hover": { backgroundColor: "#f5f5f5" },
        }}
      >
        <Box component="img" src={ended ? Repeat : isPlaying ? Pause : Play} sx={{ width: 8, height: 8 }} />
      </IconButton>

      <Typography sx={{ fontWeight: 300, fontSize: 12, flex: 1, textAlign: "right" }}>
        {formatTime(duration)}
      </Typography>
    </Box>

    {/* Progress Slider */}
    <Slider
      value={progress}
      min={0}
      max={duration || 0}
      onChangeCommitted={handleSeek}
      sx={{
        p: 0,
        height: 8,
        color: "black",
        "& .MuiSlider-rail": {
          backgroundColor: "transparent",
          border: "1px solid black",
          opacity: 1,
        },
        "& .MuiSlider-track": {
          backgroundColor: "#4efcd3",
          minWidth: "8px",
        },
        "& .MuiSlider-thumb": { display: "none" },
      }}
    />
  </Box>
);

// ===================== Main Component =====================
const Nav6 = ({ item }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ended, setEnded] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (ended) {
      // nếu đã hết bài -> phát lại từ đầu
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setEnded(false);
      setIsPlaying(true);
    } else if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (_, value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 12,
        p: 4,
        maxWidth: 700,
        mx: "auto",
      }}
    >
      {/* Nội dung text */}
      <Typography sx={{ fontWeight: 200, fontSize: 34, textTransform: 'uppercase' }}>
        {formatTextWithHighlight(item.title)}
        <Button
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => e.currentTarget.blur()}
          sx={{
            minWidth: 36,
            minHeight: 24,
            mb: 1,
            ml: 2,
            borderRadius: 0,
            color: "black",
            backgroundColor: "#4efcd3",
            border: "1px solid black",
            boxShadow: "2px 2px 0px black",
            "&:hover": { backgroundColor: "#4efcd3" },
            "&:active": {
              backgroundColor: "#4efcd3",
              boxShadow: "1px 1px 0px black",
              transform: "translate(1px, 1px)",
            },
          }}
        >

          <Box sx={() => ({
            width: 10,
            height: 10,
          })} component="img" src={Arrow} />
        </Button>
      </Typography>

      {/* Cover + Player */}
      {Array.isArray(item.image) && item.image.length > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          {/* Cover Image */}
          <Box
            sx={{
              height: 200,
              width: 260,
              backgroundColor: "#4efcd3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "3px 3px 0px black",
              border: "1px solid black",
            }}
          >
            <CardMedia
              component="img"
              src={`http://localhost:5000${item.image[0]}`}
              sx={{ width: "100%", maxWidth: "150px", height: "auto" }}
            />
          </Box>

          {/* Song Info + Player */}
          <Box display="flex" flexDirection="column" alignItems="flex-start" gap={8}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 34, textAlign: "left" }}>
                NO WAY BACK
              </Typography>
              <Typography sx={{ fontWeight: 300, fontSize: 16, textAlign: "left" }}>
                Lil Wuyn (feat. B-Wine)
              </Typography>
            </Box>

            {/* Audio Element */}
            <audio
              ref={audioRef}
              src={Audio}
              onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
              onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)}
              onEnded={() => {
                setIsPlaying(false);
                setEnded(true); // khi hết bài -> bật trạng thái repeat
              }}
            />

            {/* Player */}
            <AudioPlayer
              audioRef={audioRef}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              progress={progress}
              duration={duration}
              handleSeek={handleSeek}
              ended={ended}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Nav6;

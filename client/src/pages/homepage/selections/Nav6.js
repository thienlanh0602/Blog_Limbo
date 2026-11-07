import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { optimizeCloudinaryUrl } from "../../../utils/Cloudinaryhelper";
import { getPlaylists, getPlaylistDetail } from "../../../api/playlistAPI";
import { useAudioEQ } from "../selections/useAudioEq";


const MAX_TRACKS = 6;

// Thời điểm tạo bài: ưu tiên createdAt, không có thì lấy từ _id của MongoDB (8 ký tự hex đầu là timestamp)
// const getTrackTime = (t) => {
//   if (t.createdAt) return new Date(t.createdAt).getTime() || 0;
//   if (t._id) return (parseInt(String(t._id).substring(0, 8), 16) || 0) * 1000;
//   return 0;
// };

// // Lấy n bài mới nhất, không làm thay đổi mảng gốc
// const getLatest = (arr, n) =>
//   [...arr].sort((a, b) => getTrackTime(b) - getTrackTime(a)).slice(0, n);


const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};


/* ---------- Icon SVG tự tạo ---------- */
const PlayIcon = ({ size = 24 }) => (
  <Box
    component="svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden="true"
    sx={{ width: size, height: size, fill: "currentColor", display: "block" }}
  >
    <path d="M7 4.5v15a1 1 0 0 0 1.52.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5z" />
  </Box>
);

const PauseIcon = ({ size = 24 }) => (
  <Box
    component="svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden="true"
    sx={{ width: size, height: size, fill: "currentColor", display: "block" }}
  >
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </Box>
);

const formatTextWithHighlight = (text, onMusicClick) => {
  if (!text || !text.includes("âm nhạc")) return text || "";
  const [before, after] = text.split("âm nhạc");

  return (
    <>
      {before.split(".").map((part, idx, arr) => (
        <React.Fragment key={idx}>
          {part.trim()}
          {idx < arr.length - 1 && <br />}
        </React.Fragment>
      ))}{" "}
      <Box
        component="span"
        role="button"
        tabIndex={0}
        onClick={onMusicClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onMusicClick?.();
        }}
        sx={{
          fontWeight: "bold",
          fontStyle: "italic",
          cursor: "pointer",
          textDecoration: "none",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        âm nhạc
      </Box>{" "}
      <Box component="span">
        {after?.split(".").map((part, idx, arr) => (
          <React.Fragment key={idx}>
            {part.trim()}
            {idx < arr.length - 1 && <br />}
          </React.Fragment>
        ))}
      </Box>
    </>
  );
};

const textSx = {
  flex: "0 1 auto", // cho phép co lại khi hết chỗ
  minWidth: 0,      // bắt buộc để noWrap + "..." hoạt động trong flex
  fontWeight: 500,
  fontSize: { xs: 20, md: 24 },
  textAlign: "left",
};

const TrackRow = ({ track, cover, isCurrent, isPlaying, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
      minWidth: 0,
      gap: { xs: 1.5, md: 2 }, // khoảng cách giữa tiêu đề - hình - nghệ sĩ - icon
      mb: { xs: 3, md: 4 },
      cursor: "pointer",
      "&:hover .track-cover": { transform: "scale(1.05)" },
      "&:hover .track-text": { textDecoration: "underline" }, // gạch dưới khi hover
    }}
  >
    {/* 1. Tên bài hát */}
    <Typography noWrap className="track-text" sx={textSx}>
      {track.title}
    </Typography>

    {/* 2. Hình ảnh */}
    <Box
      className="track-cover"
      sx={{
        position: "relative",
        flexShrink: 0,
        width: 40,
        height: 40,
        borderRadius: "6px",
        overflow: "hidden",
        transition: "transform 0.3s ease",
      }}
    >
      {cover && (
        <Box
          component="img"
          src={optimizeCloudinaryUrl(cover, 200)}
          alt=""
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </Box>

    {/* 3. Nghệ sĩ */}
    <Typography noWrap className="track-text" sx={textSx}>
      {track.artist}
    </Typography>

    {/* 4. Icon play / pause ở cuối hàng (chỉ hiện ở bài đang chọn) */}
    {isCurrent && (
      <Box
        sx={{
          flexShrink: 0,
          ml: "auto", // đẩy icon về cuối hàng
          display: "flex",
          alignItems: "center",
        }}
      >
        {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
      </Box>
    )}
  </Box>
);

const TrackSkeleton = () => (
  <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 2 }, mb: { xs: 3, md: 4 } }}>
    <Skeleton sx={{ width: { xs: 90, md: 160 } }} height={28} />
    <Skeleton variant="rounded" sx={{ width: 40, height: 40, flexShrink: 0 }} />
    <Skeleton sx={{ width: { xs: 60, md: 100 } }} height={28} />
  </Box>
);

const Nav6 = ({ item }) => {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [playlistCover, setPlaylistCover] = useState(null);
  const [tracks, setTracks] = useState([]);
  const { resume, setPreset } = useAudioEQ(audioRef);

  const [currentId, setCurrentId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await getPlaylists();
        let firstPlaylist = null;

        if (res && res.success && res.data) {
          firstPlaylist = Array.isArray(res.data) ? res.data[0] : res.data;
        } else if (Array.isArray(res) && res.length > 0) {
          firstPlaylist = res[0];
        }

        if (firstPlaylist) {
          setPlaylistCover(firstPlaylist.thumbnail);

          let list = firstPlaylist.tracks || [];
          if (list.length === 0 || typeof list[0] !== "object") {
            const detailRes = await getPlaylistDetail(firstPlaylist._id);
            const detailedData = detailRes?.data || detailRes;
            list = detailedData?.tracks || [];
          }

          setTracks(shuffle(list).slice(0, MAX_TRACKS)); // lấy ngẫu nhiên 6 bài

        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bài hát tại Nav6:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  // Dừng nhạc khi rời khỏi component
  useEffect(() => {
    const audio = audioRef.current;
    return () => audio?.pause();
  }, []);

  const handlePlay = (track, id) => {
    const audio = audioRef.current;
    if (!audio || !track.cloudinaryUrl) return;
    resume();
    setPreset("spotifyBass");

    if (currentId === id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().then(() => setIsPlaying(true)).catch(() => { });
      }
      return;
    }

    // Bấm bài khác: chuyển bài
    audio.src = track.cloudinaryUrl;
    setCurrentId(id);
    audio.play().then(() => setIsPlaying(true)).catch((err) => {
      console.log("Lỗi phát nhạc:", err);
      setIsPlaying(false);
    });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <audio ref={audioRef} crossOrigin="anonymous" onEnded={() => setIsPlaying(false)} />

      <Box
        sx={{
          width: "100%",
          maxWidth: 1440,
          mx: "auto",
          boxSizing: "border-box",
          py: { xs: 6, md: 24 },
          px: { xs: 4, sm: 3, md: 10 },
          display: "grid",
          // minmax(0, ...) để cột không bị chữ dài đẩy tràn ra ngoài
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 2fr)" },
          columnGap: { md: 6 },
          rowGap: { xs: 4, md: 0 },
          alignItems: "start",
        }}
      >
        {/* Cột 1: tiêu đề */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            position: { md: "sticky" },
            top: { md: 100 },
          }}
        >
          <Typography
            component="span"
            sx={{
              alignSelf: "flex-start",
              py: 0.5,
              borderRadius: "3px",
              fontSize: 20,
              letterSpacing: 0.3,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {formatTextWithHighlight(item?.title)}
          </Typography>

          <Typography
            component="span"
            sx={{
              alignSelf: "flex-start",
              py: 0.5,
              borderRadius: "3px",
              fontSize: { xs: 28, md: 32 },
              letterSpacing: 0.3,
              fontWeight: 300,
              textAlign: "left",
            }}
          >
            {formatTextWithHighlight(item?.title_2, () => navigate("/music"))}
          </Typography>
        </Box>

        {/* Cột 2: danh sách 6 bài, mỗi bài một hàng */}
        <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          {loading
            ? Array.from({ length: MAX_TRACKS }).map((_, i) => <TrackSkeleton key={i} />)
            : tracks.map((track, index) => {
              const id = track._id || index;
              return (
                <TrackRow
                  key={id}
                  track={track}
                  cover={track.thumbnail || track.cover || track.image || playlistCover}
                  isCurrent={currentId === id}
                  isPlaying={isPlaying}
                  onClick={() => handlePlay(track, id)}
                />
              );
            })}
        </Box>
      </Box>
    </Box>
  );
};

export default Nav6;
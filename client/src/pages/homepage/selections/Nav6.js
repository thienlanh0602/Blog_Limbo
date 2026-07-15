import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, CardMedia, Button, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { STATIC_IMAGES } from '../../../utils/Staticimages';
import { optimizeCloudinaryUrl } from '../../../utils/Cloudinaryhelper';
import { commonSxDisplay } from "../../../components/homepage/home";
// Import các hàm API của bạn
import { getPlaylists, getPlaylistDetail } from '../../../api/playlistAPI';

const formatTextWithHighlight = (text) => {
  if (!text || !text.includes("âm nhạc")) return text || "";
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

const Nav6 = ({ item }) => {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [playlistName, setPlaylistName] = useState("PLAYLIST");
  const [playlistCover, setPlaylistCover] = useState(null);
  const [playlistDescription, setPlaylistDescription] = useState("");

  const [randomTrack, setRandomTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchRandomTrackFromPlaylist = async () => {
      try {
        const res = await getPlaylists();
        let firstPlaylist = null;

        if (res && res.success && res.data) {
          firstPlaylist = Array.isArray(res.data) ? res.data[0] : res.data;
        } else if (Array.isArray(res) && res.length > 0) {
          firstPlaylist = res[0];
        }

        if (firstPlaylist) {
          setPlaylistName(firstPlaylist.name || "PLAYLIST");
          setPlaylistCover(firstPlaylist.thumbnail);
          // Lưu mô tả ban đầu nếu có sẵn từ API list
          setPlaylistDescription(firstPlaylist.description || "");

          let tracks = firstPlaylist.tracks || [];
          if (tracks.length === 0 || typeof tracks[0] !== 'object') {
            const detailRes = await getPlaylistDetail(firstPlaylist._id);
            const detailedData = detailRes?.data || detailRes;
            tracks = detailedData?.tracks || [];

            if (detailedData?.description) {
              setPlaylistDescription(detailedData.description);
            }
          }

          if (tracks.length > 0) {
            const randomIndex = Math.floor(Math.random() * tracks.length);
            setRandomTrack(tracks[randomIndex]);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy bài hát ngẫu nhiên tại Nav6:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomTrackFromPlaylist();
  }, []);

  const handleTogglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log("Lỗi phát nhạc:", err));
    }
  };

  return (
    <Box
      sx={{
        ...commonSxDisplay,
        flexDirection: "column",
        gap: { xs: 6, sm: 8, md: 12 },
        p: { xs: 2, sm: 3, md: 4 },
        mb: { xs: 24, sm: 18, md: 20 },
        maxWidth: 700,
        width: '100%',
        mx: "auto",
        boxSizing: 'border-box',
      }}
    >
      {randomTrack?.cloudinaryUrl && (
        <audio
          ref={audioRef}
          src={randomTrack.cloudinaryUrl}
          crossOrigin="anonymous"
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <Typography
        sx={{
          fontWeight: 200,
          fontSize: { xs: 20, sm: 26, md: 34 },
          textTransform: 'uppercase',
          px: { xs: 1, md: 0 },
          lineHeight: 1.3,
        }}
      >
        {formatTextWithHighlight(item?.title)}
        <Button
          onClick={() => navigate("/music")}
          sx={{
            minWidth: { xs: 32, sm: 34, md: 36 },
            minHeight: { xs: 20, sm: 22, md: 24 },
            mb: 1,
            ml: { xs: 1, sm: 1.5, md: 2 },
            borderRadius: 0,
            color: "black",
            backgroundColor: "#4efcd3",
            border: "1px solid black",
            boxShadow: "2px 2px 0px black",
            verticalAlign: "middle",
            "&:hover": { backgroundColor: "#4efcd3" },
            "&:active": {
              backgroundColor: "#4efcd3",
              boxShadow: "1px 1px 0px black",
              transform: "translate(1px, 1px)",
            },
          }}
        >
          <Box sx={{ width: 10, height: 10 }} component="img" src={optimizeCloudinaryUrl(STATIC_IMAGES.arrow, 30)} />
        </Button>
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 2, sm: 4, md: 6 },
          flexDirection: { xs: 'column', sm: 'column', md: 'row' },
          width: '100%',
          backgroundColor: "#4efcd3",
          border: "1px solid black",
          height: { xs: 'auto', sm: 'auto', md: 260 },
          minHeight: { xs: 440, sm: 400, md: 'auto' },
          borderRadius: 8,
          p: { xs: 6, md: 0 },
          boxSizing: 'border-box'
        }}
      >
        <Box
          sx={{
            height: { xs: 180, sm: 200, md: 200 },
            width: { xs: "100%", sm: 200, md: 260 },
            maxWidth: 240,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <Skeleton variant="rectangular" width={220} height={190} sx={{ borderRadius: '16px', ml: { xs: 0, md: 5 } }} />
          ) : (
            (playlistCover || item?.image?.[0]) && (
              <CardMedia
                component="img"
                src={optimizeCloudinaryUrl(playlistCover || item.image[0], 400)}
                sx={{
                  boxShadow: "3px 3px 0px black",
                  borderRadius: '16px',
                  width: "100%",  
                  maxWidth: "220px",
                  height: "190px",
                  objectFit: "cover",
                  border: "1px solid black",
                  ml: { xs: 0, md: 5 },
                }}
              />
            )
          )}
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          alignItems={{ xs: "center", md: "flex-start" }}
          gap={2}
          width={{ xs: '100%', md: 'auto' }}
          sx={{ mt: { xs: 1, md: 0 }, minWidth: 0, pr: { md: 4 } }}
        >
          <Box textAlign={{ xs: 'center', md: 'left' }} sx={{ width: '100%', minWidth: 0 }}>
            <Typography noWrap sx={{ fontWeight: 700, fontSize: { xs: 20, sm: 24, md: 34 } }}>
              {loading ? <Skeleton width={180} /> : playlistName}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: 12, sm: 13 },
                color: "rgba(0, 0, 0, 0.6)",
                mt: 0.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.4,
                maxWidth: { xs: 280, sm: 350, md: 350 },
                mx: { xs: 'auto', md: 0 }
              }}
            >
              {loading ? <Skeleton width="100%" /> : (playlistDescription || "Chưa có mô tả cho playlist này.")}
            </Typography>

            {randomTrack && !loading && (
              <Typography
                noWrap
                sx={{
                  fontWeight: 600,
                  fontSize: 13,
                  color: "rgba(0, 0, 0, 0.8)",
                  mt: 1.5,
                  maxWidth: { xs: 270, sm: 300, md: 320 },
                  textAlign: { xs: 'center', md: 'left' },
                  mx: { xs: 'auto', md: 0 }
                }}
              >
                <span style={{ fontWeight: 400 }}>{randomTrack.title} - {randomTrack.artist}</span>
              </Typography>
            )}
          </Box>

          <Box display="flex" alignItems="center" gap={2} sx={{ mt: 0.5 }}>
            <Button
              onClick={handleTogglePlay}
              variant="contained"
              disabled={!randomTrack}
              disableRipple
              sx={{
                backgroundColor: "black",
                color: "#4efcd3",
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
                width: { xs: 110, sm: 120 },
                flexShrink: 0,
                transition: "all 0.2s ease",

                "&:focus, &:focus-within": {
                  backgroundColor: "black !important",
                  color: "#4efcd3 !important",
                },

                "&.MuiButton-contained": {
                  backgroundColor: "black",
                  color: "#4efcd3",
                },

                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.8) !important",
                  color: "#4efcd3 !important"
                },

                "&:active": {
                  backgroundColor: "black !important",
                  color: "#4efcd3 !important"
                },

                "&.Mui-focusVisible": {
                  backgroundColor: "black !important",
                  color: "#4efcd3 !important"
                }
              }}
            >
              {isPlaying ? "Dừng" : "Nghe"}
            </Button>
            <Button
              onClick={() => navigate("/music")}
              variant="outlined"
              sx={{
                borderColor: "black",
                color: "black",
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
                flexShrink: 0,
                "&:hover": {
                  borderColor: "black",
                  backgroundColor: "rgba(0,0,0,0.05)"
                }
              }}
            >
              Xem tất cả
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Nav6;
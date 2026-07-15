import React, { useEffect, useState } from 'react';
import {
    Box, Container, Skeleton, Dialog,
    DialogTitle, Snackbar, SnackbarContent,
} from '@mui/material';
import {
    getMusicAdmin,
    createMusicFromYoutube,
    deleteMusicAdmin,
} from '../../../api/musicAPI';
import {
    getPlaylists,
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
} from '../../../api/playlistAPI';

import { SectionHeader } from '../../../components/admin/selectionHeader';
import {
    StyleButton, StyleButton_2, StyleTyp,
    BoxTextField, TypTextField, StyleTextField,
    BoxStyle, StyleDailog, StyleContainerDailog, StyleDialogContent,
    StyleCardContainer, StyleCard,
} from '../../../components/admin/homepage';

function MusicAdmin() {
    const [musicList, setMusicList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [playlists, setPlaylists] = useState([]);
    const [playlistId, setPlaylistId] = useState(''); 
    const [openPlaylistManager, setOpenPlaylistManager] = useState(false); 
    const [openCreatePlaylist, setOpenCreatePlaylist] = useState(false); 
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
    const [newPlaylistThumbnail, setNewPlaylistThumbnail] = useState(null);
    const [isPlaylistProcessing, setIsPlaylistProcessing] = useState(false);
    
    const [editingPlaylist, setEditingPlaylist] = useState(null); 

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getMusicAdmin();

                if (!isMounted) return;

                if (res) {
                    if (res.data) {
                        const targetData = res.data.music || res.data;
                        setMusicList(Array.isArray(targetData) ? targetData : [targetData]);
                    }
                    else if (Array.isArray(res)) {
                        setMusicList(res);
                    }
                    else {
                        setMusicList([]);
                    }
                } else {
                    setMusicList([]);
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách nhạc khi refresh:", error);
                if (isMounted) {
                    handleMessage(error.response?.data?.message || "Không thể tải danh sách nhạc từ hệ thống!");
                    setMusicList([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        const fetchPlaylistsData = async () => {
            try {
                const res = await getPlaylists();
                if (isMounted && res && res.data) {
                    setPlaylists(res.data);
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách playlist:", error);
            }
        };

        const timer = setTimeout(() => {
            fetchData();
            fetchPlaylistsData();
        }, 100);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, []);

    const refreshPlaylists = async () => {
        try {
            const res = await getPlaylists();
            if (res && res.data) setPlaylists(res.data);
        } catch (error) {
            console.error("Lỗi làm mới playlist:", error);
        }
    };

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const handleMessage = (message) => {
        setSnackbarMessage(message);
        setOpenSnackbar(true);
    };

    const [openAdd, setOpenAdd] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCloseDialog = () => {
        if (isProcessing) return;
        setYoutubeUrl('');
        setPlaylistId(''); 
        setOpenAdd(false);
    };

    const handleSaveCreate = async () => {
        if (!youtubeUrl.trim()) {
            return handleMessage('Vui lòng nhập link YouTube!');
        }

        try {
            setIsProcessing(true);
            handleMessage('Hệ thống đang tải và chuyển đổi MP3... Vui lòng đợi.');

            const response = await createMusicFromYoutube(youtubeUrl, playlistId || null);

            if (response && (response.success || response._id)) {
                const newMusicData = response.data || response;
                setMusicList(prev => [newMusicData, ...prev]);
                setOpenAdd(false);
                setYoutubeUrl('');
                setPlaylistId('');
                handleMessage('Chuyển đổi và thêm nhạc thành công! 🎉');
            } else {
                handleMessage(response?.message || 'Chuyển đổi thất bại');
            }
        } catch (error) {
            console.error('Lỗi khi lưu bài hát:', error);
            handleMessage(error.response?.data?.message || 'Có lỗi xảy ra, thêm thất bại ❌');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài hát này không?")) {
            try {
                await deleteMusicAdmin(id);
                setMusicList(prev => prev.filter(item => item._id !== id));
                handleMessage('Đã xóa bài hát thành công!');
            } catch (error) {
                console.error('Xoá bài hát thất bại', error);
                handleMessage('Xoá bài hát thất bại');
            }
        }
    };

    const handleEditPlaylistClick = (playlist) => {
        setEditingPlaylist(playlist);
        setNewPlaylistName(playlist.name);
        setNewPlaylistDescription(playlist.description || ''); 
        setNewPlaylistThumbnail(null); 
        setOpenCreatePlaylist(true);
    };

    const handleOpenCreatePlaylistClick = () => {
        setEditingPlaylist(null);
        setNewPlaylistName('');
        setNewPlaylistDescription(''); 
        setNewPlaylistThumbnail(null);
        setOpenCreatePlaylist(true);
    };

    const handleCreateOrUpdatePlaylistSubmit = async () => {
        if (!newPlaylistName.trim()) {
            return handleMessage('Vui lòng nhập tên Playlist!');
        }
        try {
            setIsPlaylistProcessing(true);
            
            const formData = new FormData();
            formData.append('name', newPlaylistName);
            formData.append('description', newPlaylistDescription); 
            if (newPlaylistThumbnail) {
                formData.append('thumbnail', newPlaylistThumbnail);
            }

            if (editingPlaylist) {
                handleMessage('Đang cập nhật Playlist... Vui lòng đợi.');
                const res = await updatePlaylist(editingPlaylist._id, formData);

                if (res && res.success) {
                    handleMessage('Cập nhật Playlist thành công! 🎉');
                    setNewPlaylistName('');
                    setNewPlaylistDescription('');
                    setNewPlaylistThumbnail(null);
                    setEditingPlaylist(null);
                    setOpenCreatePlaylist(false);
                    refreshPlaylists(); 
                } else {
                    handleMessage(res?.message || 'Cập nhật playlist thất bại từ hệ thống!');
                }
            } else {
                handleMessage('Đang tải ảnh và khởi tạo Playlist... Vui lòng đợi.');
                const res = await createPlaylist(formData);

                if (res && res.success) {
                    handleMessage('Tạo Playlist mới thành công! 🎉');
                    setNewPlaylistName('');
                    setNewPlaylistDescription('');
                    setNewPlaylistThumbnail(null);
                    setOpenCreatePlaylist(false);
                    refreshPlaylists(); 
                } else {
                    handleMessage(res?.message || 'Tạo playlist thất bại từ hệ thống!');
                }
            }
        } catch (error) {
            console.error("Lỗi chi tiết khi xử lý playlist:", error);
            const serverErrorMessage = error.response?.data?.message || error.message || 'Thao tác playlist thất bại ❌';
            handleMessage(serverErrorMessage);
        } finally {
            setIsPlaylistProcessing(false);
        }
    };

    const handleDeletePlaylist = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa Playlist này không? (Các bài hát bên trong không bị mất)")) {
            try {
                const res = await deletePlaylist(id);
                if (res && res.success) {
                    handleMessage('Xóa danh sách thành công! 🗑️');
                    refreshPlaylists();
                } else {
                    handleMessage(res?.message || 'Xóa playlist thất bại!');
                }
            } catch (error) {
                console.error("Lỗi chi tiết khi xóa playlist:", error);
                const serverErrorMessage = error.response?.data?.message || error.message || 'Xóa playlist thất bại!';
                handleMessage(serverErrorMessage);
            }
        }
    };

    return (
        <React.Fragment>
            <SectionHeader
                title={<StyleTyp>Music Manager</StyleTyp>}
                action={
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <StyleButton_2 onClick={() => setOpenPlaylistManager(true)}>Danh Sách Playlist</StyleButton_2>
                        <StyleButton onClick={() => setOpenAdd(true)}>Thêm Nhạc +</StyleButton>
                    </Box>
                }
            />

            <StyleDailog open={openAdd} onClose={handleCloseDialog}>
                <StyleContainerDailog>
                    <DialogTitle>Thêm nhạc từ YouTube</DialogTitle>
                    <StyleDialogContent>
                        <BoxTextField>
                            <TypTextField>Dán Link YouTube (Video hoặc Rút gọn)</TypTextField>
                            <StyleTextField
                                fullWidth
                                placeholder="https://youtu.be/... hoặc https://www.youtube.com/watch?v=..."
                                value={youtubeUrl}
                                disabled={isProcessing}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                            />
                        </BoxTextField>

                        <BoxTextField sx={{ mt: 2 }}>
                            <TypTextField>Chọn Playlist muốn gán (Không bắt buộc)</TypTextField>
                            <select
                                value={playlistId}
                                onChange={(e) => setPlaylistId(e.target.value)}
                                disabled={isProcessing}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid black',
                                    borderRadius: 0,
                                    fontSize: '15px',
                                    fontFamily: 'inherit',
                                    outline: 'none',
                                    backgroundColor: 'white',
                                    boxShadow: '3px 3px 0px black',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="">-- Chọn Playlist phát --</option>
                                {playlists.map((pl) => (
                                    <option key={pl._id} value={pl._id}>
                                        {pl.name}
                                    </option>
                                ))}
                            </select>
                        </BoxTextField>

                        <BoxStyle sx={{ mt: 3 }}>
                            <StyleButton
                                onClick={handleSaveCreate}
                                disabled={isProcessing}
                                sx={{ opacity: isProcessing ? 0.6 : 1 }}
                            >
                                {isProcessing ? 'Đang xử lý...' : 'Xác nhận tải'}
                            </StyleButton>
                            <StyleButton_2
                                onClick={handleCloseDialog}
                                disabled={isProcessing}
                            >
                                Hủy
                            </StyleButton_2>
                        </BoxStyle>
                    </StyleDialogContent>
                </StyleContainerDailog>
            </StyleDailog>

            <StyleDailog open={openPlaylistManager} onClose={() => setOpenPlaylistManager(false)} maxWidth="sm" fullWidth>
                <StyleContainerDailog>
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Quản Lý Danh Sách Playlist</span>
                        <StyleButton onClick={handleOpenCreatePlaylistClick}>+ Tạo mới Playlist</StyleButton>
                    </DialogTitle>
                    <StyleDialogContent>
                        {playlists.length === 0 ? (
                            <Box sx={{ p: 2, textAlign: 'center', color: '#666' }}>Chưa có playlist nào được tạo.</Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
                                {playlists.map((pl) => (
                                    <Box key={pl._id} sx={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        p: 1.5, border: '2px solid black', boxShadow: '2px 2px 0px black',
                                        backgroundColor: '#fafafa'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <img
                                                src={pl.thumbnail || 'https://via.placeholder.com/50'}
                                                alt={pl.name}
                                                style={{ width: 50, height: 50, objectFit: 'cover', border: '1px solid black' }}
                                            />
                                            <Box>
                                                <Box sx={{ fontWeight: 'bold' }}>{pl.name}</Box>
                                                {/* --- HIỂN THỊ THÊM: Dòng mô tả ngắn trong danh sách quản lý (Nếu có) --- */}
                                                {pl.description && (
                                                    <Box sx={{ fontSize: '11px', color: '#888', maxWidh: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {pl.description}
                                                    </Box>
                                                )}
                                                <Box sx={{ fontSize: '12px', color: '#666' }}>Bài hát: {pl.tracks?.length || 0}</Box>
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <StyleButton
                                                onClick={() => handleEditPlaylistClick(pl)}
                                                sx={{ p: '4px 10px', fontSize: '12px', minWidth: 'unset', backgroundColor: '#e2f0cb', color: 'black' }}
                                            >
                                                Sửa
                                            </StyleButton>
                                            <StyleButton_2
                                                onClick={() => handleDeletePlaylist(pl._id)}
                                                sx={{ p: '4px 10px', fontSize: '12px', minWidth: 'unset', backgroundColor: '#ffcccc' }}
                                            >
                                                Xóa
                                            </StyleButton_2>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                        <BoxStyle sx={{ mt: 3, justifyContent: 'flex-end' }}>
                            <StyleButton_2 onClick={() => setOpenPlaylistManager(false)}>Đóng</StyleButton_2>
                        </BoxStyle>
                    </StyleDialogContent>
                </StyleContainerDailog>
            </StyleDailog>

            <StyleDailog open={openCreatePlaylist} onClose={() => setOpenCreatePlaylist(false)}>
                <StyleContainerDailog>
                    <DialogTitle>{editingPlaylist ? 'Cập Nhật Playlist' : 'Tạo Mới Playlist'}</DialogTitle>
                    <StyleDialogContent>
                        <BoxTextField>
                            <TypTextField>Tên Playlist</TypTextField>
                            <StyleTextField
                                fullWidth
                                placeholder="Nhập tên danh sách nhạc..."
                                value={newPlaylistName}
                                disabled={isPlaylistProcessing}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                            />
                        </BoxTextField>

                        <BoxTextField sx={{ mt: 2 }}>
                            <TypTextField>Mô tả Playlist</TypTextField>
                            <StyleTextField
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="Nhập mô tả hoặc ghi chú cho playlist..."
                                value={newPlaylistDescription}
                                disabled={isPlaylistProcessing}
                                onChange={(e) => setNewPlaylistDescription(e.target.value)}
                            />
                        </BoxTextField>

                        <BoxTextField sx={{ mt: 2 }}>
                            <TypTextField>Ảnh đại diện Playlist (Thumbnail) {editingPlaylist && '(Để trống nếu giữ nguyên)'}</TypTextField>
                            <input
                                type="file"
                                accept="image/*"
                                disabled={isPlaylistProcessing}
                                onChange={(e) => setNewPlaylistThumbnail(e.target.files[0])}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '2px dashed black',
                                    cursor: 'pointer'
                                }}
                            />
                        </BoxTextField>

                        <BoxStyle sx={{ mt: 3 }}>
                            <StyleButton onClick={handleCreateOrUpdatePlaylistSubmit} disabled={isPlaylistProcessing}>
                                {isPlaylistProcessing ? 'Đang xử lý...' : editingPlaylist ? 'Lưu cập nhật' : 'Tạo Playlist'}
                            </StyleButton>
                            <StyleButton_2 onClick={() => setOpenCreatePlaylist(false)} disabled={isPlaylistProcessing}>
                                Hủy
                            </StyleButton_2>
                        </BoxStyle>
                    </StyleDialogContent>
                </StyleContainerDailog>
            </StyleDailog>

            <StyleCardContainer>
                {loading ? (
                    <Container sx={{ mt: 4 }}>
                        <Skeleton variant="text" width={300} height={40} />
                        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2 }} />
                    </Container>
                ) : musicList.length === 0 ? (
                    <Container sx={{ mt: 4, textAlign: 'center' }}>
                        <Box sx={{ color: '#888' }}>Chưa có bài hát nào trong danh sách.</Box>
                    </Container>
                ) : (
                    musicList.map((item) => (
                        <StyleCard key={item._id}>
                            <Box sx={{
                                display: 'flex', justifyContent: 'center',
                                alignItems: 'center', borderBottom: 2, height: 180,
                                backgroundColor: '#f0f0f0', overflow: 'hidden'
                            }}>
                                <Box
                                    component="img"
                                    src={item.thumbnail || 'https://via.placeholder.com/300x180?text=No+Thumbnail'}
                                    alt={item.title || 'music thumbnail'}
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Box>

                            <Box sx={{ p: 1.5 }}>
                                <Box sx={{
                                    fontWeight: 600,
                                    mb: 0.5,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    height: '42px'
                                }}>
                                    {item.title || '(Không có tiêu đề)'}
                                </Box>

                                <Box sx={{ fontSize: '13px', color: '#555', mb: 1.5 }}>
                                    Thời lượng: <strong>{item.duration || 'N/A'}</strong>
                                </Box>

                                <StyleButton_2 onClick={() => handleDelete(item._id)} fullWidth>
                                    Xoá Bài Hát
                                </StyleButton_2>
                            </Box>
                        </StyleCard>
                    ))
                )}
            </StyleCardContainer>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <SnackbarContent
                    sx={{
                        backgroundColor: snackbarMessage.includes('thành công') || snackbarMessage.includes('Thành Công') ? '#4efcd3' : '#D9D9D9',
                        color: 'black',
                        borderRadius: 0,
                        border: '2px solid black',
                        boxShadow: '3px 3px 0px black',
                        fontWeight: 500,
                        display: 'inline-flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        minWidth: 'unset',
                        padding: '10px 20px',
                    }}
                    message={snackbarMessage}
                />
            </Snackbar>
        </React.Fragment>
    );
}

export default MusicAdmin;
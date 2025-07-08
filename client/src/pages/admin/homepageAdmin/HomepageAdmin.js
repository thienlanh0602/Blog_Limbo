import {
    Typography, Box, Container, Skeleton,
    Button, Dialog, TextField, Stack, Card,
    CardContent, CardMedia, DialogContent,
    DialogTitle, DialogActions, Menu, MenuItem,
    IconButton, Snackbar,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { getHomepageAdmin, updateHomepageAdmin, deleteHomepageAdmin, createHomePageAdmin } from '../../../api/adminAPI';
import { StyleButton, StyleTyp } from '../../../components/admin/homepage';


const HomepageAdmin = () => {

    // lấy bài viết
    const [getAdmin, setAdmin] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getHomepageAdmin();
                setAdmin(res);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [])

    //xử lý mở button chỉnh sửa
    const [open, setOpen] = useState(false);

    // state dành cho tạo bài 
    const [createPost, setCreatePost] = useState({ type: '', title: '', title_2: '', image: [] });
    const [openAdd, setOpenAdd] = useState(false);

    //lấy dữ liệu
    const handleCreatePost = (item) => {
        setCreatePost({ ...item })
        setOpenAdd(true);
    }

    //handle image input
    const [imageReviewAdd, setimageReviewAdd] = useState(null);
    const handleInputImage = (e) => {
        const files = Array.from(e.target.files);
        if (files.length) {
            setCreatePost(prev => ({
                ...prev,
                image: [...(prev.image || []), ...files]  // nối thêm!
            }));
            setimageReviewAdd(prev => [...(prev || []), ...files.map(file => URL.createObjectURL(file))]);
        }
    }

    //handle thêm 
    const handleSaveCreate = async () => {
        try {
            const newpost = new FormData();
            newpost.append('title', createPost.title);
            newpost.append('title_2', createPost.title_2);
            newpost.append('type', createPost.type);
            if (createPost.image && Array.isArray(createPost.image)) {
                createPost.image.forEach(file => {
                    newpost.append('image', file);
                });
            }

            const list = await createHomePageAdmin(newpost);
            // refresh
            // setAdmin trả về danh sách và tất cả thuộc tính có trong danh sách dùng để refresh 
            setAdmin(e => [list, ...e]);

            setOpenAdd(false);
            handleMessage('Thêm Thành Công');
            setOpenSnackbar(true);

        } catch (error) {
            console.error('Thêm thất bại', error);
        }

    }

    // state dành cho chỉnh sửa
    const [editItem, setEditItem] = useState({});
    const [imageReviewUpdate, setImageReviewUpdate] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    // xử lý trạng thái thông báo
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleMessage = (message) => {
        setSnackbarMessage(message);
        setOpenSnackbar(true);
    }

    const handleCLoseSna = () => {
        setOpenSnackbar(false);
    }

    //handle del img while del img
    const handleDelImg = (index) => {

        setImageReviewUpdate(prev => {
            const update = prev.filter((_, i) => i !== index);
            return update.length === 0 ? null : update
        })

        setEditItem(prev => {
            const updatedImages = prev.existingImages.filter((_, i) => i !== index);
            return {
                ...prev,
                existingImages: updatedImages
            };
        });

    }
    // xử lý cho form chỉnh sửa
    const handleEdit = (item) => {

        setEditItem({ ...item, existingImages: item.image });
        // xử lý ảnh khi có và không
        if (Array.isArray(item.image) && item.image.length > 0) {
            setImageReviewUpdate(item.image.map(img => `http://localhost:5000${img}`));
        } else {
            setImageReviewUpdate([]);
        }
        setImageFiles([]);
        setOpen(true);
    }

    //xy ly chon anh bang file
    const handleImageUpdate = (e) => {
        const files = Array.from(e.target.files);
        if (files.length) {
            setImageFiles(prev => (
                [...prev,
                ...files]
            ));
            setImageReviewUpdate(prev => [...(prev || []), ...files.map(file => URL.createObjectURL(file))]);
        }
    }



    //xu ly update
    const handleUpdateSave = async () => {
        try {
            const formData = new FormData();
            formData.append('title', editItem.title);
            formData.append('title_2', editItem.title_2);

            if (editItem.existingImages && editItem.existingImages.length) {
                editItem.existingImages.forEach(url => {
                    formData.append('existingImages[]', url);
                });
            }
            if (imageFiles.length) {
                imageFiles.forEach(file => {
                    formData.append('image', file);
                });
            }

            const update = await updateHomepageAdmin(editItem._id, formData);

            // cập nhật lại new list
            const newlist = getAdmin.map(item =>
                item._id === update._id ? update : item
            );
            setAdmin(newlist);
            setOpen(false);
            handleMessage('Đã chỉnh sửa thành công');
            setOpenSnackbar(true);
            setImageFiles([]);
            setImageReviewUpdate([]);
        } catch (error) {
            console.error('Cập nhật thất bại', error);
        }
    }

    const [openDailogDel, setOpenDailogDel] = useState(false);

    //xu lý xóa 
    const handleDelete = async () => {
        try {
            await deleteHomepageAdmin(editItem._id)
            const newList = getAdmin.filter(e => e._id !== editItem._id)
            setAdmin(newList);
            setOpenDailogDel(false);
            setSnackbarMessage('Đã xóa thành công');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Xóa thất bại', error);
        }
    }

    //Không cần set open vị trí dùng chung với anchor
    //set vị trí của menu
    const [anchorE, setAnchoE] = useState(null);
    //dùng riêng item cho menu tránh menu nhận sai item
    const [menuItem, setMenuItem] = useState(null);


    const handleClickButton = (e, item) => {
        setAnchoE(e.currentTarget);
        setMenuItem({ ...item });
    }

    return (
        <Container>

            {/* nút thêm */}
            <Container>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <StyleTyp>
                        Home page admin.
                    </StyleTyp>
                    <StyleButton onClick={handleCreatePost}>
                        Thêm +
                    </StyleButton>
                </Box>

                {/* mở nút thêm title n image  */}
                <Dialog open={openAdd} onClose={() => { setOpenAdd(false); setimageReviewAdd('') }} fullWidth maxWidth='md'>
                    <DialogContent >
                        <TextField
                            fullWidth
                            margin='normal'
                            label='type'
                            value={createPost.type || ''}
                            onChange={(e) => {
                                setCreatePost(pre => ({ ...pre, type: e.target.value }))
                            }} />
                        <TextField
                            fullWidth
                            margin='normal'
                            label='title1'
                            value={createPost?.title || ''}
                            onChange={(e) => {
                                setCreatePost(pre => ({ ...pre, title: e.target.value }))
                            }} />
                        <TextField fullWidth
                            margin='normal'
                            label='title2'
                            value={createPost?.title_2 || ''}
                            onChange={(e) => {
                                setCreatePost(pre => ({ ...pre, title_2: e.target.value }))
                            }} />

                        {/* 3 thẻ image */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            {/* thẻ image */}
                            <Box sx={{
                                border: '2px dashed #d1d5db',
                                width: '100%',
                                height: 230,
                                borderRadius: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                            }}>
                                {/* thay đổi khi có hình ảnh */}
                                {Array.isArray(imageReviewAdd) ? (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                            {imageReviewAdd.map((url, index) => (
                                                <Box key={index}>
                                                    {/* button xóa hiện trên ảnh */}
                                                    <Button onClick={() => {
                                                        setimageReviewAdd(prev => {
                                                            const update = prev.filter((_, i) => i !== index);
                                                            return update.length === 0 ? null : update
                                                        })
                                                    }}
                                                        sx={{
                                                            border: '1px solid #d1d5db',
                                                            width: 30,
                                                            height: 30,
                                                            borderRadius: '50%',
                                                            color: 'black',
                                                        }}>
                                                        X
                                                    </Button>
                                                    <img
                                                        src={url}
                                                        alt={`Preview ${index}`}
                                                        style={{
                                                            width: 200,
                                                            height: 200,
                                                            objectFit: 'contain',
                                                            display: 'block',
                                                            borderRadius: 8,
                                                        }}
                                                    />
                                                    {/* thêm ở đây thêm 1 cái nút thêm ảnh khi muốn chỉnh sửa */}

                                                </Box>

                                            ))}
                                        </Box>
                                        {/* khi muốn thêm ảnh thì hiện nút add để thêm */}
                                        <Box
                                            sx={{
                                                width: 200,
                                                height: 200,
                                                borderRadius: '10%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                backgroundColor: '#f9fafb',
                                                '&:hover': {
                                                    backgroundColor: '#f3f4f6',
                                                },
                                                position: 'relative',
                                                p: 0.5
                                            }}
                                        >
                                            <label htmlFor="upload-image-add"> {/* html for liên kết với id của input nha */}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="upload-image-add"
                                                    multiple
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        opacity: 0,
                                                        cursor: 'pointer',
                                                    }}
                                                    onChange={handleInputImage}
                                                />
                                            </label>

                                            {/* icon */}
                                            <Box
                                                component="svg"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="#9ca3af"
                                                sx={{ width: 40, height: 40, mb: 1 }}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 4.5v15m7.5-7.5h-15"
                                                />
                                            </Box>

                                            <Typography variant="body1" sx={{ color: '#9ca3af' }}>
                                                Upload photo
                                            </Typography>
                                        </Box>
                                    </Box>
                                ) : (
                                    <>
                                        {/* nếu khác imageReview hoặc null thì ẩn */}
                                        <Box
                                            sx={{
                                                width: 200,
                                                height: 200,
                                                borderRadius: '10%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                backgroundColor: '#f9fafb',
                                                '&:hover': {
                                                    backgroundColor: '#f3f4f6',
                                                },
                                                position: 'relative',
                                                p: 0.5
                                            }}
                                        >
                                            <label htmlFor="upload-image-add"> {/* html for liên kết với id của input nha */}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="upload-image-add"
                                                    multiple
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        opacity: 0,
                                                        cursor: 'pointer',
                                                    }}
                                                    onChange={handleInputImage}
                                                />
                                            </label>

                                            {/* icon */}
                                            <Box
                                                component="svg"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="#9ca3af"
                                                sx={{ width: 40, height: 40, mb: 1 }}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 4.5v15m7.5-7.5h-15"
                                                />
                                            </Box>

                                            <Typography variant="body1" sx={{ color: '#9ca3af' }}>
                                                Upload photo
                                            </Typography>
                                        </Box>
                                    </>
                                )}
                            </Box>
                        </Box>
                        <StyleButton onClick={handleSaveCreate}> Thêm </StyleButton>
                    </DialogContent>
                </Dialog>

            </Container>
            <Container sx={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {getAdmin.length === 0 ? (
                    <Container sx={{ mt: 4 }}>
                        <Skeleton variant="text" width={300} height={40} />
                        <Skeleton variant="rectangular" width={600} height={300} sx={{ mt: 2 }} />
                    </Container>
                ) : (
                    getAdmin.map((item) => (
                        <Card key={item._id} sx={{ width: 340, borderRadius: 3, overflow: 'hidden' }}>
                            {/* Ảnh section */}

                            <Box sx={{ display: 'flex', height: 100, gap: 1 }}>
                                {item.image.length === 1 && (
                                    <CardMedia
                                        component="img"
                                        image={`http://localhost:5000${item.image[0]}`}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: 2,
                                        }}
                                    />
                                )}

                                {item.image.length === 2 && (
                                    <>
                                        {item.image.map((img, idx) => (
                                            <CardMedia
                                                key={idx}
                                                component="img"
                                                image={`http://localhost:5000${img}`}
                                                sx={{
                                                    flex: 1,
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: 2,
                                                }}
                                            />
                                        ))}
                                    </>
                                )}

                                {item.image.length >= 3 && (
                                    <>
                                        {item.image.slice(0, 3).map((img, idx) => (
                                            <CardMedia
                                                key={idx}
                                                component="img"
                                                image={`http://localhost:5000${img}`}
                                                sx={{
                                                    flex: 1,
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: 2,
                                                }}
                                            />
                                        ))}
                                    </>
                                )}
                            </Box>

                            {/* {item.image[1] && (
                                        <CardMedia
                                            component="img"
                                            image={`http://localhost:5000${item.image[1]}`}
                                            sx={{ width: '100%', height: 'calc(50% - 4px)', objectFit: 'cover' }}
                                        />
                                    )}
                                    {item.image[2] && (
                                        <CardMedia
                                            component="img"
                                            image={`http://localhost:5000${item.image[2]}`}
                                            sx={{ width: '100%', height: 'calc(50% - 4px)', borderRadius: 2, objectFit: 'cover' }}
                                        />
                                    )} */}





                            {/* Info section */}
                            < CardContent >
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    mb: 1
                                }}>
                                    <Typography variant="h6">{item.type}</Typography>
                                    <Button onClick={(e) => handleClickButton(e, item)}>Menu Item</Button>
                                </Box>

                                <Typography variant="body1" gutterBottom>{item.title}</Typography>
                                <Typography variant="body2" gutterBottom>{item.title_2}</Typography>
                            </CardContent>

                            {/* Menu */}
                            <Menu anchorEl={anchorE} open={Boolean(anchorE)} onClose={() => setAnchoE(null)}>
                                <MenuItem onClick={() => { handleEdit(menuItem); setAnchoE(null) }}>Chỉnh sửa</MenuItem>
                                <MenuItem onClick={() => { setEditItem(menuItem); setOpenDailogDel(true); setAnchoE(null) }}>Xóa</MenuItem>
                            </Menu>
                        </Card>
                    ))
                )}
            </Container >

            {/* mở form chỉnh sửa */}
            < Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='sm' >
                <DialogTitle> Chỉnh sửa bài viết</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin='nomal'
                        value={editItem?.title}
                        onChange={(e) => setEditItem((prev) => ({ ...prev, title: e.target.value }))} />
                    <TextField
                        fullWidth
                        margin='nomal'
                        value={editItem?.title_2}
                        onChange={(e) => setEditItem((prev) => ({ ...prev, title_2: e.target.value }))} />
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        {/* thẻ image */}
                        <Box sx={{
                            border: '2px dashed #d1d5db',
                            width: '100%',
                            height: 230,
                            borderRadius: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                        }}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                {Array.isArray(imageReviewUpdate) ? (
                                    imageReviewUpdate.map((url, index) => (
                                        <Box key={index}>
                                            <Button onClick={() => {
                                                handleDelImg(index)
                                            }}
                                                sx={{
                                                    border: '1px solid #d1d5db',
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: '50%',
                                                    color: 'black',
                                                }}>
                                                X
                                            </Button>
                                            <img key={index} src={url} alt={`Preview ${index}`}
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    objectFit: 'contain',
                                                    display: 'block',
                                                    borderRadius: 8,
                                                }} />
                                        </Box>
                                    ))
                                ) : (
                                    imageReviewUpdate && <img src={imageReviewUpdate} alt="Preview" />
                                )}

                                <Box
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: '10%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        backgroundColor: '#f9fafb',
                                        '&:hover': {
                                            backgroundColor: '#f3f4f6',
                                        },
                                        position: 'relative',
                                        p: 0.5
                                    }}
                                >
                                    <label htmlFor="upload-image-add"> {/* html for liên kết với id của input nha */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="upload-image-add"
                                            multiple
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                opacity: 0,
                                                cursor: 'pointer',
                                            }}
                                            onChange={handleImageUpdate}
                                        />
                                    </label>

                                    {/* icon */}
                                    <Box
                                        component="svg"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="#9ca3af"
                                        sx={{ width: 40, height: 40, mb: 1 }}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4.5v15m7.5-7.5h-15"
                                        />
                                    </Box>

                                    <Typography variant="body1" sx={{ color: '#9ca3af' }}>
                                        Upload photo
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>


                    <StyleButton onClick={handleUpdateSave}>
                        Lưu Chỉnh Sửa
                    </StyleButton>

                </DialogContent>
            </Dialog >



            {/* mở form confirm xóa */}
            < Dialog open={openDailogDel} onClose={() => setOpenDailogDel(false)}>

                <DialogContent>
                    Bạn có muốn xóa ?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDailogDel(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog >
            <Snackbar open={openSnackbar} autoHideDuration={3000}
                onClose={handleCLoseSna} message={snackbarMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
        </Container >

    );
};

export default HomepageAdmin;
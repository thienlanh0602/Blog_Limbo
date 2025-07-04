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
    const [createPost, setCreatePost] = useState({ type: '', title: '', title_2: '', image: null });
    const [openAdd, setOpenAdd] = useState(false);
    //state image review
    const [imageReviewAdd, setimageReviewAdd] = useState('');

    //lấy dữ liệu
    const handleCreatePost = (item) => {
        setCreatePost({ ...item })
        setOpenAdd(true);
    }

    //handle image input
    const handleInputImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCreatePost((prev) => ({ ...prev, image: file }));
            setimageReviewAdd(URL.createObjectURL(file));
        }

    }

    //handle save post
    const handleSaveCreate = async () => {
        try {
            const newpost = new FormData();
            newpost.append('title', createPost.title);
            newpost.append('title_2', createPost.title_2);
            newpost.append('type', createPost.type);
            if (createPost.image) {
                newpost.append('image', createPost.image);
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
    const [imageReview, setimageReview] = useState(null);
    const [delImage, setDelImage] = useState(false);

    //handle del img while del img
    const handleDelImg = () => {
        setimageReview(null);
        setDelImage(true);
        setEditItem(pre => ({
            ...pre,
            image: '',
        }))
    }
    const handleEdit = (item) => {
        setEditItem({ ...item });

        // xử lý ảnh khi có và không
        if (item.image) {
            setimageReview(`http://localhost:5000${item.image}`);
        } else {
            setimageReview(null);
        }
        setOpen(true);
    }

    //xy ly chon anh bang file
    const handleImage = (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (file) {
            setEditItem((pre) => ({ ...pre, image: file }));
            setimageReview(URL.createObjectURL(file)); // chọn ảnh tạm review set vào image review
            console.log(URL.createObjectURL(file))
        }
    }

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

    //xu ly update
    const handleUpdateSave = async () => {
        try {
            const formData = new FormData();
            formData.append('title', editItem.title);
            formData.append('title_2', editItem.title_2);

            if (editItem.image instanceof File) {
                formData.append('image', editItem.image)
            }
            if (delImage) {
                formData.append('delImg', true)
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
        setAnchoE(e.currentTarget)
        setMenuItem({ ...item });
    }

    return (
        <Box>
            <StyleTyp>
                Home page admin.
            </StyleTyp>

            {/* nút thêm */}
            <Container>
                <StyleButton onClick={handleCreatePost}>
                    Thêm +
                </StyleButton>

                {/* mở nút thêm title n image  */}
                <Dialog open={openAdd} onClose={() => { setOpenAdd(false); setimageReviewAdd('') }} fullWidth maxWidth='sm'>
                    <DialogContent>
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
                        {/* thẻ image */}
                        <>
                            <input
                                accept="image/*"
                                id="upload-image-add"  // Thằng này liên kết với htmlfor 
                                hidden
                                type="file"
                                onChange={handleInputImage}
                            />
                            <label htmlFor="upload-image-add"> {/* html for liên kết với id của input nha */}
                                <StyleButton component="span">
                                    Thêm ảnh
                                </StyleButton>

                            </label>

                            {imageReviewAdd && (
                                <img
                                    src={imageReviewAdd}
                                    alt="Preview"
                                    style={{ marginTop: 10, width: 200 }}
                                />
                            )}
                        </>

                    </DialogContent>
                    <Button onClick={handleSaveCreate}> Thêm </Button>
                </Dialog>

            </Container>
            <Container>
                {/* reload giao diện => để kiểm tra dữ liệu */}
                {getAdmin.length === 0 ? (
                    // giao diện reload của mui đang tải dữ liệu
                    <Container sx={{ mt: 4 }}>
                        <Skeleton variant="text" width={300} height={40} />
                        <Skeleton variant="rectangular" width={600} height={300} sx={{ mt: 2 }} />
                    </Container>
                ) : (
                    getAdmin.map((item) => (
                        <Stack key={item._id} spacing={2} mt={1}>

                            <Card>
                                {/* này là của inert */}
                                {/* <div ref={appRef}> */}

                                <CardContent >
                                    <Typography display={'block'} variant="h6" gutterBottom>{item.type}</Typography>
                                    <Typography display={'block'} variant="h7" gutterBottom>{item.title}</Typography>
                                    <Typography display={'block'} variant="h7" gutterBottom>{item.title_2}</Typography>
                                </CardContent>

                                {/* bỏ thuộc tính image nếu nó mảng đó không có image */}
                                {item.image && (
                                    <CardMedia component="img"
                                        src={`http://localhost:5000${item.image}`}
                                        sx={{ width: '10%', maxWidth: 600, borderRadius: 2 }}
                                    />
                                )}

                                {/* e ở đây là truyền event vào để thêm e vào menu */}
                                <IconButton onClick={(e) => handleClickButton(e, item)}>
                                    Menu Item
                                </IconButton>

                                <Menu anchorEl={anchorE} open={Boolean(anchorE)} onClose={() => setAnchoE(null)}>
                                    {/* button mang theo dữ liệu trong handleEdit */}
                                    {/* phân cấp nếu menu là phải dùng state khác với state dùng để chỉnh sửa dữ liệu vẫn tham chiếu chung */}
                                    <MenuItem onClick={() => { handleEdit(menuItem); setAnchoE(null) }}>
                                        Chỉnh sửa
                                    </MenuItem>
                                    {/* phải setItem lại tại vì item đang undefined và đang nằm trong map nữa  */}
                                    <MenuItem color='error' onClick={() => { setEditItem(menuItem); setOpenDailogDel(true); setAnchoE(null) }}>
                                        Xóa
                                    </MenuItem>
                                </Menu>

                            </Card>
                        </Stack>
                    ))
                )}
            </Container>

            {/* mở form confirm xóa */}
            <Dialog open={openDailogDel} onClose={() => setOpenDailogDel(false)}>

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
            </Dialog>

            {/* </div> */}
            {/* mở form chỉnh sửa */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='sm'>
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
                    <Box mt={3}>
                        <>
                            <input
                                accept="image/*"
                                id="upload-image"  // Thằng này liên kết với htmlfor 
                                hidden
                                type="file"
                                onChange={handleImage}
                            />
                            <label htmlFor="upload-image"> {/* html for liên kết với id của input nha */}
                                <StyleButton component="span">
                                    Tải ảnh lên
                                </StyleButton>
                            </label>

                            {/* tạo vùng riêng để ẩn và hiện thị button và hình ảnh */}

                            <Box>
                                {imageReview ? (
                                    <>
                                        <Button onClick={handleDelImg}>
                                            Xóa ảnh
                                        </Button>
                                        <img
                                            src={imageReview}
                                            alt="Preview"
                                            style={{ marginTop: 10, width: 200 }}
                                        />
                                    </>

                                ) : null}
                            </Box>
                        </>

                    </Box>
                    <StyleButton onClick={handleUpdateSave}>
                        Lưu Chỉnh Sửa
                    </StyleButton>

                </DialogContent>
            </Dialog>
            <Snackbar open={openSnackbar} autoHideDuration={3000}
                onClose={handleCLoseSna} message={snackbarMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
        </Box>

    );
};

export default HomepageAdmin;
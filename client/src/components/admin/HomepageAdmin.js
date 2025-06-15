import {
    Typography, Box, Container, Skeleton,
    Button, Dialog, TextField, Stack, Card,
    CardContent, CardMedia, DialogContent,
    DialogTitle, DialogActions, Menu, MenuItem,
    IconButton, Snackbar
} from '@mui/material';

import { useEffect, useState, useRef } from 'react';
import { getHomepageAdmin, updateHomepageAdmin, deleteHomepageAdmin } from '../../api/adminAPI';


const HomepageAdmin = () => {

    // lấy bài viết
    const [getAdmin, setAdmin] = useState([])
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
    // const appRef = useRef();

    // //Bắt sự kiện inert
    // useEffect(() => {
    //     const elenment = appRef.current;
    //     if (elenment) {
    //         if (open) {
    //              document.activeElement.blur();
    //             elenment.setAttribute('inert', '');
    //         } else {
    //             elenment.removeAttribute('inert');
    //         }
    //     }  
    // }, [open])

    const [editItem, setEditItem] = useState({});
    const [imageReview, setimageReview] = useState('');

    const handleEdit = (item) => {
        setEditItem({ ...item });
        setimageReview(`http://localhost:5000${item.image}`);
        setOpen(true);
    }

    //xy ly chon anh bang file
    const handleImage = (e) => {
        const file = e.target.files[0];
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

    //xu ly save change
    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('title', editItem.title);
            if (editItem.image instanceof File) {
                formData.append('image', editItem.image)
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
            <Typography variant="h1" style={{ flexGrow: 1 }}>
                Home page admin.
            </Typography>
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
                                    <Typography variant="h7" gutterBottom>{item.title}</Typography>
                                </CardContent>

                                <CardMedia component="img"
                                    src={`http://localhost:5000${item.image}`}
                                    sx={{ width: '10%', maxWidth: 600, borderRadius: 2 }}
                                />

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
                                    <MenuItem color='error' onClick={() => { setEditItem(menuItem); setOpenDailogDel(true); setAnchoE(null)  }}>
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
                        value={editItem?.title}
                        onChange={(e) => setEditItem((prev) => ({ ...prev, title: e.target.value }))} />
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
                                <Button variant="contained" component="span">
                                    Tải ảnh lên
                                </Button>
                            </label>
                        </>
                        {/* nếu imageReview có dữ liệu thì hiện ra thẻ image không thì không có giá trị  */}
                        {imageReview && (
                            <img
                                src={imageReview}
                                alt="Preview"
                                style={{ marginTop: 10, width: 200 }}
                            />
                        )}
                    </Box>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Lưu Chỉnh Sửa
                    </Button>
                </DialogContent>
            </Dialog>
            <Snackbar open={openSnackbar} autoHideDuration={3000}
                onClose={handleCLoseSna} message={snackbarMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
        </Box>

    );
};

export default HomepageAdmin;
import { Typography, Box, Container, Skeleton, Button, Dialog, TextField, Stack, Card, CardContent, CardMedia, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { getHomepageAdmin } from '../../api/adminAPI';


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
    const appRef = useRef();

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

    return (
        <Box>
            <Typography variant="h1" style={{ flexGrow: 1 }}>
                Home page admin.
            </Typography>
            <Container>
                {/* reload giao diện => để kiểm tra dữ liệu */}
                {getAdmin.length === 0 ? (
                    // giao diện reload của mui
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
                                    {/* button mang theo dữ liệu trong handleEdit */}
                                    <Button onClick={() => handleEdit(item)}> EDIT </Button>
                                {/* </div> */}
                                {/* mở form chỉnh sửa */}
                                <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='sm'>
                                    <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
                                    <DialogContent>
                                        <TextField value={editItem?.title} />
                                        <Box mt={3}>
                                            <>
                                                <input
                                                    accept="image/*"
                                                    id="upload-image"
                                                    type="file"
                                                    hidden
                                                    onChange={handleImage}
                                                />
                                                <label htmlFor="upload-image">
                                                    <Button variant="contained" component="span">
                                                        Tải ảnh lên
                                                    </Button>
                                                </label>
                                            </>
                                            {/* nếu imageReview có dữ liệu thì hiện ra thẻ image */}
                                            {imageReview && (
                                                <img
                                                    src={imageReview}
                                                    alt="Preview"
                                                    style={{ marginTop: 10, width: 200 }}
                                                />
                                            )}

                                        </Box>
                                    </DialogContent>

                                </Dialog>
                            </Card>
                        </Stack>




                    ))
                )}
            </Container>



        </Box>

    );
};

export default HomepageAdmin;
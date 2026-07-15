import {
    Box, Container, Skeleton, Dialog,
    DialogTitle, Snackbar, SnackbarContent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
    getImageAdmin,
    createImageAdmin,
    deleteImageAdmin,
} from '../../../api/imageAPI';
import { SectionHeader } from '../../../components/admin/selectionHeader';
import {
    StyleButton, StyleButton_2, StyleTyp,
    BoxTextField, TypTextField, StyleTextField,
    BoxImgUpload, BoxImgAdd, BoxIcon, StyleInput,
    ImgStyle, ButtonImgUpload, BoxStyle,
    StyleDailog, StyleContainerDailog, StyleDialogContent,
    StyleCardContainer, StyleCard,
} from '../../../components/admin/homepage';

function ImageAdmin() {
    // lấy danh sách ảnh
    const [images, setImages] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getImageAdmin();
                setImages(res);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    // xử lý thông báo
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const handleMessage = (message) => {
        setSnackbarMessage(message);
        setOpenSnackbar(true);
    };

    // state form thêm ảnh
    const [openAdd, setOpenAdd] = useState(false);
    const [createPost, setCreatePost] = useState({ title: '', description: '', image: null });
    const [imagePreview, setImagePreview] = useState(null);

    const handleInputImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCreatePost(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const resetCreateForm = () => {
        setCreatePost({ title: '', description: '', image: null });
        setImagePreview(null);
    };

    const handleCloseDialog = () => {
        resetCreateForm();
        setOpenAdd(false);
    };

    const handleSaveCreate = async () => {
        try {
            const formData = new FormData();
            formData.append('title', createPost.title);
            formData.append('description', createPost.description);
            if (createPost.image) {
                formData.append('image', createPost.image);
            }

            const newImage = await createImageAdmin(formData);
            setImages(prev => [newImage, ...prev]);

            setOpenAdd(false);
            resetCreateForm();
            handleMessage('Thêm Thành Công');
        } catch (error) {
            console.error('Thêm thất bại', error);
            handleMessage('Thêm Thất Bại');
        }
    };

    // xoá ảnh
    const handleDelete = async (id) => {
        try {
            await deleteImageAdmin(id);
            setImages(prev => prev.filter(img => img._id !== id));
            handleMessage('Đã Xoá Thành Công');
        } catch (error) {
            console.error('Xoá thất bại', error);
            handleMessage('Xoá Thất Bại');
        }
    };

    return (
        <>
            <SectionHeader
                title={<StyleTyp>Image</StyleTyp>}
                action={<StyleButton onClick={() => setOpenAdd(true)}>Thêm +</StyleButton>}
            />

            {/* form thêm ảnh */}
            <StyleDailog open={openAdd} onClose={handleCloseDialog}>
                <StyleContainerDailog>
                    <DialogTitle>Thêm ảnh</DialogTitle>
                    <StyleDialogContent>
                        <BoxTextField>
                            <TypTextField>Title</TypTextField>
                            <StyleTextField
                                placeholder="Title"
                                value={createPost.title}
                                onChange={(e) => setCreatePost(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </BoxTextField>

                        <BoxTextField>
                            <TypTextField>Mô tả</TypTextField>
                            <StyleTextField
                                placeholder="Mô tả"
                                value={createPost.description}
                                onChange={(e) => setCreatePost(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </BoxTextField>

                        <TypTextField>Hình ảnh</TypTextField>
                        <BoxImgUpload>
                            {imagePreview ? (
                                <Box sx={{ position: 'relative' }}>
                                    <ButtonImgUpload
                                        onClick={() => {
                                            setImagePreview(null);
                                            setCreatePost(prev => ({ ...prev, image: null }));
                                        }}
                                    >
                                        ✕
                                    </ButtonImgUpload>
                                    <ImgStyle src={imagePreview} alt="Preview" />
                                </Box>
                            ) : (
                                <BoxImgAdd>
                                    <label htmlFor="upload-image-add">
                                        <StyleInput
                                            type="file"
                                            accept="image/*"
                                            id="upload-image-add"
                                            onChange={handleInputImage}
                                        />
                                    </label>
                                    <BoxIcon />
                                </BoxImgAdd>
                            )}
                        </BoxImgUpload>

                        <BoxStyle>
                            <StyleButton onClick={handleSaveCreate}>Thêm</StyleButton>
                            <StyleButton_2 onClick={handleCloseDialog}>Hủy</StyleButton_2>
                        </BoxStyle>
                    </StyleDialogContent>
                </StyleContainerDailog>
            </StyleDailog>

            {/* danh sách ảnh */}
            <StyleCardContainer>
                {images.length === 0 ? (
                    <Container sx={{ mt: 4 }}>
                        <Skeleton variant="text" width={300} height={40} />
                        <Skeleton variant="rectangular" width={600} height={300} sx={{ mt: 2 }} />
                    </Container>
                ) : (
                    images.map((item) => (
                        <StyleCard key={item._id}>
                            <Box sx={{
                                display: 'flex', justifyContent: 'center',
                                alignItems: 'center', borderBottom: 2, height: 180,
                            }}>
                                <Box
                                    component="img"
                                    src={item.image}
                                    alt={item.title || 'image'}
                                    sx={{ width: '80%', height: '100%', objectFit: 'cover' }}
                                />
                            </Box>

                            <Box sx={{ p: 1.5 }}>
                                <Box sx={{ fontWeight: 600, mb: 1 }}>{item.title || '(Không có tiêu đề)'}</Box>
                                <StyleButton_2 onClick={() => handleDelete(item._id)}>
                                    Xoá
                                </StyleButton_2>
                            </Box>
                        </StyleCard>
                    ))
                )}
            </StyleCardContainer>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <SnackbarContent
                    sx={{
                        backgroundColor: snackbarMessage.includes('Thành Công') ? '#4efcd3' : '#D9D9D9',
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
                        padding: '1px 1px !important',
                    }}
                    message={snackbarMessage}
                />
            </Snackbar>
        </>
    );
}

export default ImageAdmin;
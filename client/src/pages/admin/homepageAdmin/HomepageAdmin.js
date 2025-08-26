import {
    Typography, Box, Container, Skeleton,
    Dialog, CardContent, DialogContent,
    DialogTitle, Snackbar,
    SnackbarContent,
} from '@mui/material';

import { useEffect, useState } from 'react';
import {
    getHomepageAdmin,
    updateHomepageAdmin,
    deleteHomepageAdmin,
    createHomePageAdmin
}
    from '../../../api/adminAPI';
import {
    BoxIcon,
    BoxImgAdd,
    BoxImgMore,
    BoxImgUpload,
    BoxStyle,
    BoxTextField,
    ButtonImgUpload,
    ButtonMenu, ImgStyle, StyleButton, StyleButton_2,
    StyleCard, StyleCardContainer, StyleContainerDailog, StyleDailog, StyleDialogContent, StyleInput, StyleMenu,
    StyleMenuItem,
    StyleTextField, StyleTyp,
    TypTextField
} from '../../../components/admin/homepage';
import { ReactComponent as IconMenu } from '../../../assets/icon_menu.svg'


import { SectionHeader } from '../../../components/admin/selectionHeader';

const HomepageAdmin = () => {

    // lấy bài viết
    const [getAdmin, setAdmin] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getHomepageAdmin();

                // Sắp xếp theo type (ví dụ: nav_1, nav_2, nav_3,...)
                const sorted = [...res].sort((a, b) => {
                    const getNumber = (str) => {
                        const match = str?.match(/\d+/); // Lấy số trong 'nav_1'
                        return match ? parseInt(match[0], 10) : 0;
                    };

                    return getNumber(a.type) - getNumber(b.type);
                });

                setAdmin(sorted);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    //xử lý mở button chỉnh sửa
    const [open, setOpen] = useState(false);

    // state dành cho tạo bài 
    const [createPost, setCreatePost] = useState({ type: 'nav_', title: '', title_2: '', image: [] });
    const [openAdd, setOpenAdd] = useState(false);

    //lấy dữ liệu
    const handleCreatePost = () => {
        setCreatePost(createPost)
        setOpenAdd(true);
    }

    //handle image input
    const [imageReviewAdd, setimageReviewAdd] = useState(null);
    const handleInputImage = (e) => {
        const files = Array.from(e.target.files);
        if (files.length) {
            setCreatePost(prev => ({
                ...prev,
                image: [...(prev.image || []), ...files]
            }));
            setimageReviewAdd(prev => [...(prev || []), ...files.map(file => URL.createObjectURL(file))]);
        }
    }

    //handle thêm 
    const handleSaveCreate = async () => {
        try {
            const newpost = new FormData();
            newpost.append('type', createPost.type);
            newpost.append('title', createPost.title);
            newpost.append('title_2', createPost.title_2);
            if (createPost.image && Array.isArray(createPost.image)) {
                createPost.image.forEach(file => {
                    newpost.append('image', file);
                });
            }

            const list = await createHomePageAdmin(newpost);
            // refresh
            // setAdmin trả về danh sách và tất cả thuộc tính có trong danh sách dùng để refresh 
            setAdmin(prev => {
                const updated = [list, ...prev];

                // Sắp xếp
                const sorted = [...updated].sort((a, b) => {
                    const getNumber = (str) => {
                        const match = str?.match(/\d+/);
                        return match ? parseInt(match[0], 10) : 0;
                    };
                    return getNumber(a.type) - getNumber(b.type);
                });

                return sorted;
            });


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
            handleMessage('Đã Chỉnh Sửa Thành Công');
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
            setSnackbarMessage('Đã Xóa Thành Công');
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

    const handleCloseDialog = () => {
        setimageReviewAdd('');
        setOpenAdd(false);
    };

    return (
        <>
            <SectionHeader
                title={<StyleTyp>Home page admin</StyleTyp>}
                action={<StyleButton onClick={handleCreatePost}>Thêm +</StyleButton>}
            />

            {/* mở nút thêm title n image  */}
            <StyleDailog open={openAdd}
                onClose={() => { setOpenAdd(true) }}
            >
                <StyleContainerDailog >
                    <DialogTitle> Thêm bài viết</DialogTitle>

                    <StyleDialogContent >
                        {/* Type */}
                        <BoxTextField>
                            <TypTextField >Type</TypTextField>
                            <StyleTextField
                                value={createPost?.type || 'nav_'}
                                onChange={(e) =>
                                    setCreatePost((pre) => ({ ...pre, type: e.target.value }))
                                }
                            />
                        </BoxTextField>

                        {/* Title 1 */}
                        <BoxTextField>
                            <TypTextField>Title 1</TypTextField>
                            <StyleTextField
                                placeholder="Title 1"
                                value={createPost?.title || ''}
                                onChange={(e) =>
                                    setCreatePost((pre) => ({ ...pre, title: e.target.value }))
                                }
                            />
                        </BoxTextField>

                        {/* Title 2 */}
                        <BoxTextField>
                            <TypTextField>Title 2</TypTextField>
                            <StyleTextField
                                fullWidth
                                placeholder="Title 2"
                                value={createPost?.title_2 || ''}
                                onChange={(e) =>
                                    setCreatePost((pre) => ({ ...pre, title_2: e.target.value }))
                                }
                            />
                        </BoxTextField>

                        {/* Upload Image */}
                        <TypTextField >Hình ảnh</TypTextField>
                        <BoxImgUpload>
                            {Array.isArray(imageReviewAdd) && imageReviewAdd.length > 0 ? (
                                <>
                                    {imageReviewAdd.map((url, index) => (
                                        <Box key={index} sx={{ position: 'relative' }}>
                                            <ButtonImgUpload
                                                onClick={() => {
                                                    setimageReviewAdd((prev) =>
                                                        prev.filter((_, i) => i !== index)
                                                    );
                                                }}>
                                                ✕
                                            </ButtonImgUpload>
                                            <ImgStyle key={index} src={url} alt={`Preview ${index}`} />
                                        </Box>
                                    ))}

                                    {/* Add more */}
                                    <BoxImgMore>
                                        <label htmlFor="upload-image-add">
                                            <StyleInput
                                                type="file"
                                                accept="image/*"
                                                id="upload-image-add"
                                                onChange={handleInputImage}
                                            />
                                        </label>
                                        <BoxIcon />
                                    </BoxImgMore>
                                </>
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

                        {/* Buttons */}
                        <BoxStyle>
                            <StyleButton onClick={handleSaveCreate}>Thêm</StyleButton>
                            <StyleButton_2
                                onClick={handleCloseDialog}
                            >
                                Hủy
                            </StyleButton_2>

                        </BoxStyle>
                    </StyleDialogContent>
                </StyleContainerDailog>

            </StyleDailog>

            <StyleCardContainer>
                {getAdmin.length === 0 ? (
                    <Container sx={{ mt: 4 }}>
                        <Skeleton variant="text" width={300} height={40} />
                        <Skeleton variant="rectangular" width={600} height={300} sx={{ mt: 2 }} />
                    </Container>
                ) : (
                    getAdmin.map((item) => (
                        <StyleCard key={item._id}>
                            {/* Ảnh section */}

                            <Box sx={{
                                display: 'flex', justifyContent: 'center',
                                alignItems: 'center', flexWrap: 'wrap',
                                borderBottom: 2, height: 120
                            }}>
                                {item.image && item.image.length === 1 && (
                                    <Box
                                        component="img"
                                        src={`http://localhost:5000${item.image[0]}`}
                                        alt="image-0"
                                        sx={{
                                            width: '30%',
                                            objectFit: 'cover',
                                            borderRadius: 2,
                                        }}
                                    />
                                )}

                                {item.image && item.image.length >= 2 && (
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: `repeat(${item.image.length >= 3 ? 3 : 2}, 1fr)`,
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    >
                                        {item.image.slice(0, 3).map((img, idx, arr) => (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    borderRight: idx !== arr.length - 1 ? '2px solid black' : 'none',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={`http://localhost:5000${img}`}
                                                    alt={`image-${idx}`}
                                                    sx={{
                                                        width: item.image.length !== 1 ? '60%' : 'auto',

                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                )}

                                {(!item.image || item.image.length === 0) && (
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            border: '2px dashed black',
                                            borderRadius: 2,
                                            backgroundColor: '#d9d9d9',
                                        }}
                                    />
                                )}
                            </Box>

                            {/* Info section */}
                            < CardContent  >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 1,
                                    }}
                                >
                                    <Typography fontWeight={600}>{item.type}</Typography>
                                    <ButtonMenu onClick={(e) => handleClickButton(e, item)}>
                                        <IconMenu style={{ height: 12, width: 12 }} />
                                    </ButtonMenu>
                                </Box>

                                <Typography gutterBottom>{item.title || ''}</Typography>
                                <Typography gutterBottom>{item.title_2 || ''}</Typography>
                            </CardContent>

                            {/* Menu */}
                            <StyleMenu anchorEl={anchorE} open={Boolean(anchorE)} onClose={() => setAnchoE(null)}>
                                <StyleMenuItem onClick={() => { handleEdit(menuItem); setAnchoE(null) }}>Chỉnh sửa</StyleMenuItem>
                                <Box sx={{
                                    borderTop: '2px solid black',
                                    width: '100%',
                                    my: 0.5,
                                }} />
                                <StyleMenuItem onClick={() => { setEditItem(menuItem); setOpenDailogDel(true); setAnchoE(null) }}>Xóa</StyleMenuItem>
                            </StyleMenu>
                        </StyleCard>
                    ))
                )}
            </StyleCardContainer >

            {/* mở form chỉnh sửa */}
            < StyleDailog
                open={open}
                onClose={() => setOpen(true)}
                disableRestoreFocus
            >
                <StyleContainerDailog>
                    <DialogTitle> Chỉnh sửa bài viết</DialogTitle>
                    <StyleDialogContent>
                        <BoxTextField>
                            <StyleTextField
                                fullWidth
                                margin='nomal'
                                value={editItem?.title}
                                onChange={(e) => setEditItem((prev) => ({ ...prev, title: e.target.value }))} />
                        </BoxTextField>
                        <BoxTextField>
                            <StyleTextField
                                fullWidth
                                margin='nomal'
                                value={editItem?.title_2}
                                onChange={(e) => setEditItem((prev) => ({ ...prev, title_2: e.target.value }))} />
                        </BoxTextField>
                        {/* Upload Image */}
                        {/* thẻ image */}
                        <BoxImgUpload>
                            {Array.isArray(imageReviewUpdate) && imageReviewUpdate.length > 0 ? (
                                <>
                                    {imageReviewUpdate.map((url, index) => (
                                        <Box key={index} sx={{ position: 'relative' }}>
                                            <ButtonImgUpload onClick={() => {
                                                handleDelImg(index)
                                            }}>
                                                ✕
                                            </ButtonImgUpload>
                                            <ImgStyle key={index} src={url} alt={`Preview ${index}`} />
                                        </Box>
                                    ))}
                                    <BoxImgMore>
                                        <label htmlFor="upload-image-add">
                                            <StyleInput
                                                type="file"
                                                accept="image/*"
                                                id="upload-image-add"
                                                onChange={handleImageUpdate}
                                            />

                                        </label>
                                        <BoxIcon />
                                    </BoxImgMore>
                                </>


                            ) : (
                                <BoxImgAdd>
                                    <label htmlFor="upload-image-edit"> {/* html for liên kết với id của input nha */}
                                        <StyleInput
                                            type="file"
                                            accept="image/*"
                                            id="upload-image-edit"
                                            onChange={handleImageUpdate}
                                        />
                                    </label>
                                    <BoxIcon />
                                </BoxImgAdd>
                            )}

                        </BoxImgUpload>

                        <BoxStyle>
                            <StyleButton onClick={handleUpdateSave}>Lưu</StyleButton>
                            <StyleButton_2 onClick={() => setOpen(false)}>Hủy</StyleButton_2>
                        </BoxStyle>

                    </StyleDialogContent>
                </StyleContainerDailog>
            </StyleDailog >

            {/* mở form confirm xóa */}
            < Dialog
                open={openDailogDel}
                onClose={() => setOpenDailogDel(false)}
                PaperProps={{
                    sx: {
                        boxShadow: 'none', // Tắt shadow
                        border: '2px solid black', // (tùy chọn) thay bằng viền
                        borderRadius: '0px', // (tùy chọn)
                    },
                }}
            >
                <Container sx={{ py: 1 }}>

                    <DialogContent sx={{ textAlign: 'center' }}>
                        Bạn có muốn xóa ?
                    </DialogContent>

                    <BoxStyle>
                        <StyleButton onClick={handleDelete}>
                            Xóa
                        </StyleButton>
                        <StyleButton_2 onClick={() => setOpenDailogDel(false)}>
                            Hủy
                        </StyleButton_2>
                    </BoxStyle>
                </Container>
            </Dialog >
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCLoseSna}
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
};

export default HomepageAdmin;
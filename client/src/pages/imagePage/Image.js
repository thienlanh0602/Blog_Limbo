import React, { useEffect, useState } from 'react';
import { Box, Typography, Skeleton, Modal, Fade, Backdrop } from '@mui/material';
import PageContainer from "../../components/layout/PageContainer";
import { optimizeCloudinaryUrl } from '../../utils/Cloudinaryhelper';
import { getImageAdmin } from '../../api/imageAPI';

const getImageSrc = (item) => item?.image || item?.imageUrl || item?.url || item?.cloudinaryUrl || item?.thumbnail || '';

const getSkeletonHeight = (index) => {
    const heights = [400, 300, 440, 340, 280, 420];
    return heights[index % heights.length];
};

function Image() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [hoveredIdx, setHoveredIdx] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await getImageAdmin();
                let list = [];
                if (res && res.success && res.data) {
                    list = Array.isArray(res.data) ? res.data : [res.data];
                } else if (Array.isArray(res)) {
                    list = res;
                }
                
                // 👉 Đảo ngược mảng một cách an toàn để ảnh mới nằm ở cuối trang
                setImages([...list].reverse());
            } catch (error) {
                console.error('Lỗi khi tải danh sách ảnh:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    const handleMouseMove = (e, index) => {
        const card = e.currentTarget;
        const img = card.querySelector('.gallery-img');
        if (!img) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPercent = (x / rect.width) - 0.5;
        const yPercent = (y / rect.height) - 0.5;

        img.style.transform = `scale(1.08) translate(${xPercent * -15}px, ${yPercent * -15}px)`;
    };

    const handleMouseLeave = (e) => {
        setHoveredIdx(null);
        const img = e.currentTarget.querySelector('.gallery-img');
        if (img) {
            img.style.transform = 'scale(1) translate(0px, 0px)';
        }
    };

    const renderSkeletons = (columnCount) => {
        const columns = Array.from({ length: columnCount }, () => []);
        Array.from({ length: 6 }).forEach((_, index) => {
            columns[index % columnCount].push(index);
        });

        return columns.map((col, colIdx) => (
            <Box key={`sk-col-${colIdx}`} sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {col.map((idx) => (
                    <Box
                        key={`sk-${idx}`}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%'
                        }}
                    >
                        <Skeleton
                            variant="rectangular"
                            width="75%"
                            height={getSkeletonHeight(idx)}
                            sx={{
                                bgcolor: 'rgba(0,0,0,0.08)',
                                border: '1px solid black',
                                borderRadius: '16px'
                            }}
                        />
                    </Box>
                ))}
            </Box>
        ));
    };

    const renderColumns = (columnCount) => {
        const columns = Array.from({ length: columnCount }, () => []);
        images.forEach((item, index) => {
            columns[index % columnCount].push({ item, originalIdx: index });
        });

        return columns.map((col, colIdx) => (
            <Box
                key={`img-col-${colIdx}`}
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: '16px', sm: '24px', md: '96px' }
                }}
            >
                {col.map(({ item, originalIdx }) => {
                    let marginTopStyle = 0;

                    if (originalIdx === 0 || originalIdx === 1) {
                        marginTopStyle = {
                            xs: '80px',
                            md: originalIdx === 1 ? '100px' : 0
                        };
                    }

                    return (
                        <Box
                            key={item._id || `img-${originalIdx}`}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%',
                                mt: marginTopStyle,
                            }}
                        >
                            <Box
                                onMouseEnter={() => setHoveredIdx(originalIdx)}
                                onMouseMove={(e) => handleMouseMove(e, originalIdx)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => setSelected(item)} // Thêm sự kiện click để mở modal xem ảnh to (nếu cần)
                                sx={{
                                    position: 'relative',
                                    width: { xs: '90%', sm: '80%', md: '80%' },
                                    overflow: 'hidden',
                                    borderRadius: '8px',
                                    backgroundColor: '#111',
                                    cursor: 'pointer',
                                    transition: 'opacity 0.4s ease, filter 0.4s ease',
                                    opacity: hoveredIdx !== null && hoveredIdx !== originalIdx ? 0.4 : 1,
                                    filter: hoveredIdx !== null && hoveredIdx !== originalIdx ? 'blur(1.5px) grayscale(20%)' : 'none',
                                    '&:hover .gradient-overlay': { height: '60%', opacity: 1 },
                                    '&:hover .caption-box': { transform: 'translateY(0)', opacity: 1 }
                                }}
                            >
                                <img
                                    className="gallery-img"
                                    src={optimizeCloudinaryUrl(getImageSrc(item), 700)}
                                    alt={item.title || 'Ảnh'}
                                    loading="lazy"
                                    style={{
                                        width: '100%',
                                        display: 'block',
                                        objectFit: 'cover',
                                        transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
                                        willChange: 'transform'
                                    }}
                                />
                                <Box
                                    className="gradient-overlay"
                                    sx={{
                                        position: 'absolute',
                                        left: 0, right: 0, bottom: 0,
                                        height: '40%',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
                                        pointerEvents: 'none',
                                        transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
                                    }}
                                />
                                <Box
                                    className="caption-box"
                                    sx={{
                                        position: 'absolute',
                                        left: 0, right: 0, bottom: 0,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-end',
                                        gap: 1.5,
                                        px: { xs: 2, md: 2.5 },
                                        py: { xs: 2, md: 2.5 },
                                        transform: 'translateY(8px)',
                                        opacity: 0.85,
                                        transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease',
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: 0, right: 0, bottom: 0,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-end',
                                        gap: 1.5,
                                        px: { xs: 2, md: 2.5 },
                                        py: { xs: 2, md: 2.5 },
                                        zIndex: 2
                                    }}
                                >
                                    <Typography sx={{
                                        color: '#fff',
                                        fontWeight: 800,
                                        fontSize: { xs: 11, md: 13 },
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.6px',
                                        lineHeight: 1.3,
                                    }}>
                                        {item.title || 'Không có tiêu đề'}
                                    </Typography>

                                    {item.description && (
                                        <Typography noWrap sx={{
                                            color: 'rgba(255,255,255,0.75)',
                                            fontWeight: 400,
                                            fontSize: { xs: 9, md: 12 },
                                            letterSpacing: '0.4px',
                                            maxWidth: '50%',
                                            flexShrink: 0,
                                        }}>
                                            {item.description}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        ));
    };

    return (
        <PageContainer maxWidth={1800}>
            <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 8 }, boxSizing: 'border-box' }}>
                {!loading && images.length === 0 ? (
                    <Box sx={{ borderRadius: '0px', py: 10, px: 4, textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 1, textTransform: 'uppercase' }}>Chưa có ảnh nào</Typography>
                        <Typography sx={{ fontSize: 14, color: 'rgba(0,0,0,0.6)' }}>Thêm ảnh mới để chúng xuất hiện tại đây.</Typography>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: { xs: '20px', sm: '28px' }, width: '100%', alignItems: 'flex-start' }}>
                            {loading ? renderSkeletons(2) : renderColumns(2)}
                        </Box>

                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '40px', width: '100%', alignItems: 'flex-start' }}>
                            {loading ? renderSkeletons(3) : renderColumns(3)}
                        </Box>
                    </>
                )}
            </Box>

            <Modal
                open={!!selected}
                onClose={() => setSelected(null)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 500 } }}
            >
                <Fade in={!!selected}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 1,
                        borderRadius: '8px',
                        outline: 'none'
                    }}>
                        {selected && (
                            <img
                                src={optimizeCloudinaryUrl(getImageSrc(selected), 1200)}
                                alt="Chi tiết"
                                style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', display: 'block' }}
                            />
                        )}
                    </Box>
                </Fade>
            </Modal>
        </PageContainer>
    );
}

export default Image;
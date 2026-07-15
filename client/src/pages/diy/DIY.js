import { Box, Typography } from "@mui/material";
import PageContainer from "../../components/layout/PageContainer";

function DIY() {
    return (
        /* Để trống title của PageContainer để tắt tiêu đề bị lệch bên trái đi */
        <PageContainer title="">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column', // Đổi sang cột để xếp tiêu đề ở trên, nội dung ở dưới
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '70vh',
                    width: '100%',
                    padding: 2
                }}
            >
                {/* Tự tạo chữ Resume căn giữa hoàn hảo */}
                <Typography
                    variant="h4"
                    fontWeight={600}
                    sx={{
                        textAlign: 'center',
                        fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }
                    }}
                >
                    DIY
                </Typography>

                {/* Nội dung bên dưới */}
                <Typography
                    sx={{
                        fontSize: '1rem',
                        fontWeight: 300,
                        textAlign: 'center'
                    }}
                >
                    laziness /ˈleɪzinəs/: Sự lười biếng
                </Typography>
            </Box>
        </PageContainer>
    );
}

export default DIY;
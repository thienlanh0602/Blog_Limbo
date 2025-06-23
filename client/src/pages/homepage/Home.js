import { useEffect, useState } from 'react';
import { Container, Typography, Skeleton, Box } from '@mui/material';
import { getHomepage } from '../../api/homepageAPI'
import { StyleTypography_1, StyleTypography_2, StyleSkeleton_1, StyleSkeleton_2 } from '../../components/homepage/home';
import useResponsive from '../../hook/useResponsive';



function Home() {
  const [data, setData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHomepage();
        setData(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);


  return (
    <>
      <Container>
        {data.length === 0 ? (
          <Container sx={{ mt: 4 }}>
            <StyleSkeleton_1 />
            <StyleSkeleton_2 />
          </Container>
        ) : (
          data.map((item, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <StyleTypography_1>{item.title}</StyleTypography_1>
              <StyleTypography_2>{item.title_2}</StyleTypography_2>

              {item.image && (
                <Box
                  component="img"
                  src={`http://localhost:5000${item.image}`}
                  alt={'Logo'}
                  sx={{ width: '100%', maxWidth: 600, borderRadius: 2 }}
                />
              )}
            </Box>
          ))
        )}
      </Container>

    </>




  );
}

export default Home;
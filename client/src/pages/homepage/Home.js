import { useEffect, useState } from 'react';
import { Container, Box } from '@mui/material';
import { getHomepage } from '../../api/homepageAPI'
import { StyleTypography_1, StyleTypography_2, StyleSkeleton_1, StyleSkeleton_2, ButtonHomeImage, BoxImageHome, StyleTypography_3, StyleTypography_4 } from '../../components/homepage/home';
import Arrow from "../../assets/Arrow_1.svg"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
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
    <Container>
      {data.length === 0 ? (
        <Container sx={{ mt: 4 }}>
          <StyleSkeleton_1 />
          <StyleSkeleton_2 />
        </Container>
      ) : (
        <Box >
          {data.map((item, index) => {
            switch (item.type) {
              case 'nav_1':
                return (
                  <Box height={'100vh'} key={index} sx={{ mb: 4 }}>
                    <StyleTypography_1>{item.title}</StyleTypography_1>
                    <StyleTypography_2>{item.title_2}</StyleTypography_2>

                    <Box>
                      <ButtonHomeImage>
                        <BoxImageHome component="img" src={Arrow} />
                      </ButtonHomeImage>
                    </Box>
                  </Box>

                );

              case 'nav_2':
                return (

                  <Box height={'100vh'} key={index} sx={{ mb: 4 }}>
                    <StyleTypography_3>{item.title}</StyleTypography_3>
                    <StyleTypography_4>{item.title_2}</StyleTypography_4>
                    {item.image && (
                      <Box
                        component="img"
                        src={`http://localhost:5000${item.image}`}
                        alt={'Logo'}
                        sx={{ width: '100%', maxWidth: 600, borderRadius: 2 }}
                      />
                    )}
                  </Box>

                );

              case 'nav_3':
              case 'nav_4':
              case 'nav_5':
                return (
                  <Box
                    key={index}
                    sx={{
                      height: '100vh',
                      scrollSnapAlign: 'start',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {item.image && (
                      <Box
                        component="img"
                        src={`http://localhost:5000${item.image}`}
                        alt={'Logo'}
                        sx={{ width: '100%', maxWidth: 200, borderRadius: 2 }}
                      />
                    )}
                  </Box>
                );


              default:
                return null;
            }
          })
          }
        </Box>
      )}
    </Container>

  );
}

export default Home;
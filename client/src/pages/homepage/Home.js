import { useEffect, useState } from 'react';
import { Container, Box, CardMedia } from '@mui/material';
import { getHomepage } from '../../api/homepageAPI'
import { StyleTypography_1, StyleTypography_2, StyleSkeleton_1, StyleSkeleton_2, ButtonHomeImage, BoxImageHome, StyleTypography_3, StyleTypography_4 } from '../../components/homepage/home';
import Arrow from "../../assets/Arrow_1.svg"

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
  let renderedNav4 = false

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
                    {Array.isArray(item.image) && item.image.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, }}>
                        {item.image.map((img, idx) => {
                          switch (idx) {
                            case 0:
                              return (
                                <CardMedia
                                  key={idx}
                                  component="img"
                                  src={`http://localhost:5000${img}`}
                                  sx={{
                                    width: '30%',
                                    height: '30%',
                                  }}
                                />
                              );
                            case 1:
                              return (
                                <CardMedia
                                  key={idx}
                                  component="img"
                                  src={`http://localhost:5000${img}`}
                                  sx={{
                                    width: '30%',
                                    height: '30%',
                                  }}
                                />
                              );
                            case 2:
                              return (
                                <CardMedia
                                  key={idx}
                                  component="img"
                                  src={`http://localhost:5000${img}`}
                                  sx={{
                                    width: '30%',
                                    height: '30%',
                                  }}
                                />
                              );
                            default:
                              return null;
                          };
                        })}
                      </Box>
                    )}
                  </Box>
                );
              case 'nav_4':
                if (!renderedNav4) {
                  renderedNav4 = true;
                  return (
                    <Box key={'nav4-page'} height="100vh" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {data
                        .filter((i) => i.type === 'nav_4')
                        .map((i, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: 'black' }} />
                            <Box>
                              <StyleTypography_3>{i.title}</StyleTypography_3>
                              <StyleTypography_4>{i.title_2}</StyleTypography_4>
                            </Box>
                          </Box>
                        ))}
                    </Box>
                  );
                }
                return null;

              case 'nav_5':
                return (
                    <Box key={index} height={'100vh'} sx={{ mb: 4 }}>
                      <StyleTypography_3>{item.title}</StyleTypography_3>
                    </Box>
                )

              default:
                return null;
            }
          })
          }
          {/* <Box height={'100vh'}>
            {data.filter(item => item.type === 'nav_4').map((item, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <StyleTypography_3>{item.title}</StyleTypography_3>
                <StyleTypography_4>{item.title_2}</StyleTypography_4>
              </Box>
            ))}
          </Box> */}
        </Box>
      )}
    </Container>

  );
}

export default Home;
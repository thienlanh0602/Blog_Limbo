import { useEffect, useState } from 'react';
import { Container, Box, CardMedia, Typography, Button } from '@mui/material';
import { getHomepage } from '../../api/homepageAPI'
import { StyleTypography_1, StyleTypography_2, StyleSkeleton_1, StyleSkeleton_2, ButtonHomeImage, BoxImageHome, StyleTypography_3, StyleTypography_4 } from '../../components/homepage/home';
import Arrow from "../../assets/Arrow_1.svg"
import AOS from 'aos';
import 'aos/dist/aos.css'

import SvgNav1 from "../../assets/square_dashed.svg"
import Frame_nav2 from "../../assets/frame.svg"

import { StyleButton } from '../../components/admin/homepage';

function Home() {
  const [data, setData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHomepage();

        const sorted = [...res].sort((a, b) => {
          const getNumber = (str) => {
            const match = str?.match(/\d+/); // Lấy số trong 'nav_1'
            return match ? parseInt(match[0], 10) : 0;
          };

          return getNumber(a.type) - getNumber(b.type);
        });
        setData(sorted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   AOS.init({
  //     duration: 1000,
  //     once: true,
  //   });
  // }, [])

  let renderedNav4 = false;
  let renderedNav5 = false;


  return (
    <>
      <Box sx={{
        display: 'grid', rowGap: 30,
      }}>
        {data.map((item, index) => {
          switch (item.type) {
            case 'nav_1':
              return (
                <Box key={index}
                  sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={SvgNav1}
                    alt="decor"
                    sx={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      pointerEvents: "none",
                      zIndex: 0,
                      opacity: 0.7,
                      objectFit: "contain",
                      maxWidth: "100%",
                    }}
                  />

                  <StyleTypography_1>{item.title}</StyleTypography_1>
                  <Typography
                    variant="h6"
                    sx={{
                      position: "relative",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "#4DF4C8",
                      textDecorationThickness: "2px",
                      textUnderlineOffset: "4px",
                      display: "inline-block",
                    }}
                  >
                    @ IM THIEN LANH
                  </Typography>
                  <StyleTypography_2>{item.title_2}</StyleTypography_2>

                 <Button onMouseDown={(e) => e.preventDefault()} // chặn focus ngay từ đầu
                          onClick={(e) => {
                            e.currentTarget.blur(); // đảm bảo mất focus sau click
                            console.log("clicked");
                          }} sx={{
                            backgroundColor: '#4efcd3',
                            border: '2px solid black',
                            boxShadow: '3px 3px 0px black',
                            borderRadius: 0,
                            minWidth: 150,
                            minHeight: 50,
                            mt: 1,
                            color: 'black',
                            fontSize: 16,
                            '&:hover': {
                              backgroundColor: '#4efcd3',
                              boxShadow: '3px 3px 0px black',
                            },
                            '&:active': {
                              backgroundColor: '#4efcd3',
                              boxShadow: '1px 1px 0px black',
                              transform: 'translate(1px, 1px)',
                            },
                          }}>
                          <BoxImageHome component="img" src={Arrow} />
                        </Button>
                </Box>


              );

            case 'nav_2':
              return (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    background: "linear-gradient(180deg, #E2FDE9, #29f0c4)",
                    height: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}

                >
                  <Container
                    sx={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* SVG khung */}
                    <Box
                      component="img"
                      src={Frame_nav2}
                      alt="decor"
                      sx={{
                        width: "80%",
                        height: "auto",
                        position: "relative",
                        zIndex: 0,
                      }}
                    />

                    {/* Chat 1 */}
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      position: "absolute",
                      justifyContent: "center",
                      alignItems: "flex-end",
                      top: "30%",
                      right: "5%",
                      transform: "translateX(-50%)",
                      gap: 2

                    }} >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: 2,
                          backgroundColor: "#fff",
                          border: "1px solid #000",
                          borderRadius: "30px",
                          p: 2.5,
                          justifyContent: "center",
                          alignItems: "center",
                          width: "fit-content",
                          zIndex: 2,
                        }}
                      >
                        <Typography sx={{ fontWeight: 300 }}>{item.title}</Typography>
                        <Box
                          component="img"
                          src={`http://localhost:5000${item.image}`}
                          alt="Avatar"
                          sx={{
                            width: 55,
                            height: 55,
                          }}
                        />
                      </Box>
                      <Typography sx={{ fontWeight: 300, zIndex: 2, fontSize: 14, mr: 2 }}>00:00</Typography>
                    </Box>

                    {/* Chat 2 */}
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      position: "absolute",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      top: "60%",
                      left: "29%",
                      transform: "translateX(-50%)",
                      gap: 2

                    }} >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: 2,
                          backgroundColor: "#fff",
                          border: "1px solid #000",
                          borderRadius: "30px",
                          p: 2.5,
                          justifyContent: "center",
                          alignItems: "center",
                          width: "fit-content",
                          zIndex: 2,
                        }}
                      >
                        <Box
                          component="img"
                          src={`http://localhost:5000${item.image}`}
                          alt="Avatar"
                          sx={{
                            width: 55,
                            height: 55,
                            transform: "scaleX(-1)",
                          }}
                        />
                        <Typography sx={{ fontWeight: 300 }}>{item.title_2}</Typography>
                      </Box>

                      <Typography sx={{ fontWeight: 300, zIndex: 2, fontSize: 14, ml: 2 }}>00:01</Typography>
                    </Box>

                    {/* Avatar */}
                    <Box
                      sx={{
                        display: "flex",
                        position: "absolute",
                        top: "6%",
                        left: "16%",
                        zIndex: 2,

                      }}
                    >
                      {/* Avatar */}
                      <Box
                        component="img"
                        src={`http://localhost:5000${item.image}`}
                        alt="Avatar"
                        sx={{
                          width: 60,
                          height: 60,
                          mr: 2,
                          transform: 'scaleX(-1)'
                        }}
                      />

                      {/* Text block */}


                      <Box sx={{
                        display: "flex", flexDirection: 'column', alignItems: "flex-start",
                        justifyContent: "center",
                      }}>
                        <Typography sx={{ fontWeight: "bold", fontSize: '16px', fontWeight: 600 }}>
                          Thiên Lảnh
                        </Typography>
                        <Typography sx={{ color: "gray", fontSize: '12px', fontWeight: 300 }}>
                          Đang nhập...
                        </Typography>
                      </Box>
                    </Box>


                  </Container>

                </Box>

              );

            case 'nav_3':
              return (

                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <Box textAlign="center">
                    <Typography
                      fontWeight={800}
                      fontSize={34}
                      textTransform="uppercase"
                    >
                      {item.title}
                    </Typography>

                    <StyleTypography_2>
                      {item.title_2}
                    </StyleTypography_2>
                  </Box>
                  {Array.isArray(item.image) && item.image.length > 0 && (
                    <Box sx={{
                      display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <Box
                        sx={{
                          display: 'flex',
                          width: '99.6vw',
                        }}
                      >
                        {item.image.map((img, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              flex: '0 0 33.33%',   // mỗi ảnh chiếm 1/3 hàng
                              maxWidth: '33.33%',
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                          >
                            {/* Khung giữ tỷ lệ */}
                            <Box
                              sx={{
                                width: '99%',
                                paddingTop: '75%',   // 4:3 (3 / 4 = 0.75 → 75%)
                              }}
                            />
                            {/* Ảnh fill khung */}
                            <Box
                              component="img"
                              src={`http://localhost:5000${img}`}
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </Box>
                        ))}

                      </Box>


                    </Box>
                  )}
                </Box>
              );

            case 'nav_4':
              if (!renderedNav4) {
                renderedNav4 = true;
                const nav4Items = data.filter((i) => i.type === "nav_4");
                return (
                  <Box
                    key="nav_4"
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    {/* Title section */}
                    {nav4Items[0] && (
                      <Box>
                        <Typography fontWeight={800} fontSize={34} textTransform="uppercase">
                          {nav4Items[0].title}
                        </Typography>
                        <StyleTypography_2>
                          {nav4Items[0].title_2}
                        </StyleTypography_2>
                      </Box>
                    )}

                    {/* Cards section */}
                    <Box display="flex" justifyContent="center" gap={20} flexWrap="wrap">
                      {nav4Items.slice(1).map((card, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            width: 300,
                            bgcolor: "white",
                            boxShadow: "3px 3px 0px black",
                            border: "1px solid black",
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            textAlign: "center",
                            gap: 2,
                          }}
                        >
                          {/* Hình ảnh */}
                          <Box>
                            <Box
                              sx={{
                                height: 300,
                                background: idx === 0
                                  ? "linear-gradient(180deg, #CECECE, #6D6D6D)"
                                  : "linear-gradient(180deg, #F9E2FD, #29F0C4)",
                                display: "flex",              // bật flex
                                alignItems: "center",         // canh giữa theo chiều dọc
                                justifyContent: "center",     // canh giữa theo chiều ngang
                              }}
                            >
                              <CardMedia
                                component="img"
                                src={`http://localhost:5000${card.image}`}
                                sx={{
                                  width: "50%",
                                  objectFit: "contain",
                                }}
                              />
                            </Box>
                          </Box>

                          {/* text */}

                          <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            textAlign: "center",
                            gap: 2,
                            mx: 2
                          }}>

                            <Typography fontWeight="bold" textTransform="uppercase">
                              {card.title}
                            </Typography>
                            <Typography sx={{ fontWeight: 200, textAlign: "left" }}>
                              {card.title_2.includes("Ân") ? (
                                <>
                                  {card.title_2.split("Ân")[0]} <br />
                                  {"Ân" + card.title_2.split("Ân")[1]}
                                </>
                              ) : (
                                card.title_2
                              )}
                            </Typography>

                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                );
              }
              return null;


            case 'nav_5':
              if (!renderedNav5) {
                renderedNav5 = true;
                return (
                  <Container
                    key={'nav4-page'}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 10,
                      borderWidth: 1.9,
                      borderStyle: 'dashed',
                      borderColor: '#ccc',
                      borderRadius: 5,
                      maxWidth: 800,
                      mx: 'auto'
                    }}
                  >
                    {data
                      .filter((i) => i.type === 'nav_5')
                      .map((i, idx, arr) => (
                        <Box key={idx}>
                          <StyleTypography_3>{i.title}</StyleTypography_3>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 2,
                              position: 'relative',
                              pb: idx < arr.length - 1 ? 4 : 0, // khoảng cách cho đường nối
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}
                          >
                            {/* Chấm tròn */}
                            <Box
                              sx={{
                                width: 14,
                                height: 14,
                                borderRadius: '50%',
                                bgcolor: 'black',
                                flexShrink: 0,
                                position: 'relative',
                                zIndex: 1
                              }}
                            />

                            {/* Đường nối (nếu không phải mục cuối) */}
                            <Box
                              sx={{
                                position: 'absolute',
                                left: '50%', // canh giữa
                                transform: 'translateX(-50%)', // dịch ngược lại 50% để chuẩn tâm
                                top: 14,
                                width: 2,
                                height: '10px',
                                bgcolor: 'black',
                                zIndex: 0
                              }}
                            />

                            {/* Nội dung */}
                            <Box>
                              <StyleTypography_2>{i.title_2}</StyleTypography_2>
                            </Box>
                          </Box>
                        </Box>
                      )
                      )}

                  </Container>
                );
              }
              return null;

            case 'nav_6':
              return (
                <Box
                  key={index}
                  sx={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",   // canh giữa theo chiều dọc
                    justifyContent: "center", // canh giữa theo chiều ngang
                  }}
                >
                  {Array.isArray(item.image) && item.image.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" }, // mobile dọc, desktop ngang
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
                      <Box sx={{
                        height: 300, 
                        width: 300,
                        borderRadius: '20%',
                        background: "linear-gradient(180deg, #CECECE, #6D6D6D)",
                        display: "flex",              // bật flex
                        alignItems: "center",         // canh giữa theo chiều dọc
                        justifyContent: "center",     // canh giữa theo chiều ngang
                      }}>
                        Thêm mấy cái icon âm nhạc ở đây, và bg màu sáng thể hiện có âm nhạc vui hơn 
                        {/* Ảnh bên trái */}
                        <CardMedia
                          component="img"
                          src={`http://localhost:5000${item.image[0]}`}
                          sx={{
                            width: "100%",
                            maxWidth: "150px", // ảnh không vượt quá 120px
                            height: "auto",
                          }}
                        />

                      </Box>

                      {/* Text + Button bên phải */}
                      <Box
                        sx={{
                          maxWidth: 400,
                          display: "flex",
                          flexDirection: { xs: "column" },
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4

                        }}
                      >
                        <Typography sx={{ fontWeight: 200, fontSize: 20 }}>
                          {item.title.split("âm nhạc")[0]}
                          <Box
                            component="span"
                            sx={{ fontWeight: "bold", fontStyle: "italic" }}
                          >
                            âm nhạc
                          </Box>
                          {item.title.split("âm nhạc")[1]}
                        </Typography>

                        <Button onMouseDown={(e) => e.preventDefault()} // chặn focus ngay từ đầu
                          onClick={(e) => {
                            e.currentTarget.blur(); // đảm bảo mất focus sau click
                            console.log("clicked");
                          }} sx={{
                            backgroundColor: '#4efcd3',
                            border: '2px solid black',
                            boxShadow: '3px 3px 0px black',
                            borderRadius: 0,
                            minWidth: 120,
                            minHeight: 50,
                            color: 'black',
                            fontSize: 16,
                            '&:hover': {
                              backgroundColor: '#4efcd3',
                              boxShadow: '3px 3px 0px black',
                            },
                            '&:active': {
                              backgroundColor: '#4efcd3',
                              boxShadow: '1px 1px 0px black',
                              transform: 'translate(1px, 1px)',
                            },
                          }}>
                          <BoxImageHome component="img" src={Arrow} />
                        </Button>
                      </Box>
                    </Box>
                  )}
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
    </>

  );
}

export default Home;
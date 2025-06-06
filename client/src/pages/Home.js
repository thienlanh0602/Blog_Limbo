import React, { useEffect, useState } from 'react';
import { Container, Typography, Skeleton, Box } from '@mui/material';
import { getHomepage } from '../api/homepageAPI'



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

  // if (!data) {
  //   return (
  //     <Container sx={{ mt: 4 }}>
  //       <Skeleton variant="text" width={300} height={40} />
  //       <Skeleton variant="rectangular" width={600} height={300} sx={{ mt: 2 }} />
  //     </Container>
  //   );
  // }

  return (

    // <Container>
    //   <Typography variant="h4" gutterBottom>{data.title}</Typography>
    //   <Box
    //     component="img"
    //     src={`http://localhost:5000${data.image}`}
    //     alt="Homepage"
    //     sx={{ width: '100%', maxWidth: 600, borderRadius: 2 }}
    //   />
    // </Container>
    <Container>
      {data.length === 0 ? (
        <Container sx={{ mt: 4 }}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="rectangular" width={600} height={300} sx={{ mt: 2 }} />
        </Container>
      ) : (
        data.map((item, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>{item.title}</Typography>
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



  );
}

export default Home;
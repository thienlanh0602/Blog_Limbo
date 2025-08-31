import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { getHomepage } from '../../api/homepageAPI'

import 'aos/dist/aos.css'

import Nav1 from './selections/Nav1';
import Nav2 from './selections/Nav2';
import Nav3 from './selections/Nav3';
import Nav4 from './selections/Nav4';
import Nav5 from './selections/Nav5';
import Nav6 from './selections/Nav6';

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
                <Nav1 key={index} item={item} />

              );

            case 'nav_2':
              return (
                <Nav2 key={index} item={item} />
              );

            case 'nav_3':
              return (

                <Nav3 key={index} item={item} />
              );

            case 'nav_4':
              if (!renderedNav4) {
                renderedNav4 = true;
                const nav4Items = data.filter((i) => i.type === "nav_4");
                return <Nav4 key="nav_4" items={nav4Items} />;
              }
              return null;

            case 'nav_5':
              if (!renderedNav5) {
                renderedNav5 = true;
                const nav5Items = data.filter((i) => i.type === "nav_5");
                return <Nav5 key="nav_5" items={nav5Items} />;
              }
              return null;

            case 'nav_6':
              return (
                <Nav6 key={index} item={item} />
              )
            default:
              return null;
          }
        })
        }
      </Box>
    </>

  );
}

export default Home;
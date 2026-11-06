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

// Thứ tự hiển thị các khối trên trang chủ, muốn đổi thì chỉ cần xếp lại mảng này
const NAV_ORDER = ['nav_1', 'nav_2', 'nav_4', 'nav_5', 'nav_3', 'nav_6'];

// nav_4_header / nav_4_card -> nav_4, nav_5_header / nav_5_item -> nav_5
const getGroup = (type = '') => type.replace(/_(header|card|item)$/, '');

function Home() {
  const [data, setData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHomepage();

        const sorted = res.toSorted((a, b) => {
          const ia = NAV_ORDER.indexOf(getGroup(a.type));
          const ib = NAV_ORDER.indexOf(getGroup(b.type));
          return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
        });
        setData(sorted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  let renderedNav4 = false;
  let renderedNav5 = false;

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          width: '100%',
          overflowX: 'hidden',
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.08,
            height: {xs: 900, md: 1000},
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,.35) 1.6px, transparent 1px)`,
            backgroundSize: "10px 10px",
          },
        }}
      >
        {data.map((item) => {
          switch (item.type) {
            case 'nav_1':
              return <Nav1 key={item._id} item={item} />;

            case 'nav_2':
              return <Nav2 key={item._id} item={item} />;

            case 'nav_6':
              return <Nav6 key={item._id} item={item} />;

            case 'nav_3':
              return <Nav3 key={item._id} item={item} />;

            case 'nav_4_header':
              if (!renderedNav4) {
                renderedNav4 = true;

                const nav4Header = data.find((i) => i.type === 'nav_4_header');
                const nav4Cards = data
                  .filter((i) => i.type === 'nav_4_card')
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                return <Nav4 key="nav_4" header={nav4Header} cards={nav4Cards} />;
              }
              return null;

            case 'nav_5_header':
              if (!renderedNav5) {
                renderedNav5 = true;

                const nav5Header = data.find((i) => i.type === 'nav_5_header');
                const nav5Items = data.filter((i) => i.type === 'nav_5_item');

                return <Nav5 key="nav_5" header={nav5Header} items={nav5Items} />;
              }
              return null;

            default:
              return null;
          }
        })}
      </Box>
    </>
  );
}

export default Home;
const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3000;

// public 폴더의 정적 파일 (map.html 등) 사용
app.use(express.static(path.join(__dirname, 'public'), { index: 'map.html' }));
// JSON 요청 본문 파싱 미들웨어
app.use(express.json());

// 네이버 API 클라이언트 ID 및 시크릿 (네이버 지도 API 사용)
const clientId = 'id0ukwormz';
const clientSecret = 'HxKH1lUskVbdg2Wa9EVGqraebl9umfZ7tUy7YNzo';
// Google Places API 키 (맛집 검색용)
const googleApiKey = 'AIzaSyBLFKT4csgikH-xFcNh2-yKVk2rS5G6uYQ';

// POST /get-route: 출발지, 목적지 좌표를 받아 네이버 지도 경로 API 호출
app.post('/get-route', async (req, res) => {
  const { start, end } = req.body;
  const url = `https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${start.lng},${start.lat}&goal=${end.lng},${end.lat}&option=traoptimal`;
  try {
    const response = await axios.get(url, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': clientSecret
      }
    });
    console.log("네이버 API 응답:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('경로 요청 실패');
  }
});

// GET /get-restaurants: 지정 좌표 주변 음식점 검색 (Google Places API)
// radius 파라미터가 있으면 사용 (기본 250m)
app.get('/get-restaurants', async (req, res) => {
  const { lat, lng, radius = 250 } = req.query;
  const type = 'restaurant';
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${googleApiKey}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).send('Error fetching restaurants');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// server.js
const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3000;

// 정적 파일 제공 (map.html 등)
// public 폴더 내의 파일을 정적 파일로 제공합니다.
app.use(express.static(path.join(__dirname, 'public'), { index: 'map.html' }));
app.use(express.json());

// 네이버 지도 API용 클라이언트 ID 및 시크릿
const clientId = 'id0ukwormz';
const clientSecret = 'HxKH1lUskVbdg2Wa9EVGqraebl9umfZ7tUy7YNzo';
// Google Places API 키
const googleApiKey = 'AIzaSyBLFKT4csgikH-xFcNh2-yKVk2rS5G6uYQ';

// POST /get-route: 출발지와 목적지 좌표로 네이버 지도 경로 API 호출
app.post('/get-route', async (req, res) => {
  const { start, end } = req.body;
  // 네이버 지도 경로 API는 lng,lat 순서로 좌표를 전달합니다.
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
    console.error("경로 요청 실패:", error);
    res.status(500).send('경로 요청 실패');
  }
});

// GET /get-restaurants: 지정 좌표 주변 음식점 검색 (기본 반경 250m)
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

// GET /get-attractions: 지정 좌표 주변 명소 검색 (기본 반경 7000m)
app.get('/get-attractions', async (req, res) => {
  const { lat, lng, radius = 500 } = req.query;
  const type = 'tourist_attraction';
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${googleApiKey}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching attractions:", error);
    res.status(500).send('Error fetching attractions');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

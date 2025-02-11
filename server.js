const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3000;

// public 폴더의 정적 파일을 사용 (index.html, 관련 자바스크립트, CSS 등)
app.use(express.static(path.join(__dirname, 'public'),{index:'map.html'}));
// JSON 형태의 요청 본문을 파싱하기 위한 미들웨어
app.use(express.json());

// 네이버 API 클라이언트 ID와 시크릿 (네이버 지도 API 사용)
const clientId = 'id0ukwormz';
const clientSecret = 'HxKH1lUskVbdg2Wa9EVGqraebl9umfZ7tUy7YNzo';
// Google Places API 키 (맛집 검색용; 실제 키로 교체)
const googleApiKey = 'AIzaSyBLFKT4csgikH-xFcNh2-yKVk2rS5G6uYQ';

// POST /get-route 엔드포인트: 출발지와 목적지 좌표를 받아 네이버 지도 경로 API 호출
app.post('/get-route', async (req, res) => {
  // 요청 본문에서 출발지(start)와 목적지(end) 좌표 추출
  const { start, end } = req.body;
  // 네이버 지도 경로 API URL 구성 (출발: start, 도착: goal)
  const url = `https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${start.lng},${start.lat}&goal=${end.lng},${end.lat}&option=traoptimal`;
  try {
    // 네이버 API에 GET 요청 (헤더에 클라이언트 ID와 시크릿 추가)
    const response = await axios.get(url, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': clientSecret
      }
    });
    console.log("네이버 API 응답:", response.data);
    // 클라이언트로 네이버 API 응답 데이터를 전달
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('경로 요청 실패');
  }
});

// GET /get-restaurants 엔드포인트: 지정된 좌표 주변의 맛집 정보를 Google Places API로 검색
app.get('/get-restaurants', async (req, res) => {
  // 쿼리 파라미터에서 위도(lat)와 경도(lng) 추출
  const { lat, lng } = req.query;
  const radius = 250; // 검색 반경 250m
  const type = 'restaurant'; // 검색 타입: 음식점
  // Google Places Nearby Search API URL 구성
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${googleApiKey}`;
  try {
    // Google Places API에 GET 요청
    const response = await axios.get(url);
    // API 응답 데이터를 클라이언트로 전달
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).send('Error fetching restaurants');
  }
});

// 서버를 PORT 3000에서 실행
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

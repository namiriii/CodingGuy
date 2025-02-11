const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const clientId = 'id0ukwormz';
const clientSecret = 'HxKH1lUskVbdg2Wa9EVGqraebl9umfZ7tUy7YNzo';

app.post('/get-route', async (req, res) => {
  const { start, end, mode } = req.body;
  let url;

  if (mode === 'DRIVING') {
    // 아래 option 값은 클라이언트의 drawRoute 함수와 맞춰주세요.
    url = `https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${start.lng},${start.lat}&goal=${end.lng},${end.lat}&option=traoptimal`;
  } else if (mode === 'WALKING') {
    url = `https://naveropenapi.apigw.ntruss.com/map-direction/v1/walking?start=${start.lng},${start.lat}&goal=${end.lng},${end.lat}`;
  } else {
    return res.status(400).json({ error: '대중교통 경로 API는 지원하지 않습니다.' });
  }

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

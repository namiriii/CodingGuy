import fetch from "node-fetch";
import { CONFIG } from "./config.js";
import { NAVERCONFIG } from "./config.js";

// 📌 1️⃣ 주소 자동완성 기능 (Nominatim API)
export async function getAddressSuggestions(req, res) {
  const { query } = req.query;

  if (!query) {
      return res.status(400).json({ error: "검색어를 입력하세요." });
  }

  try {
      const url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=5&start=1&sort=random`;

      console.log("[🔎] 네이버 API 요청 URL:", url);

      const response = await fetch(url, {
          method: "GET",
          headers: {
              "X-Naver-Client-Id": NAVERCONFIG.NAVER_CLIENT_ID,
              "X-Naver-Client-Secret": NAVERCONFIG.NAVER_CLIENT_SECRET
          }
      });

      const data = await response.json();
      console.log("[🗺️] 네이버 API 응답:", JSON.stringify(data, null, 2));

      if (data.items && Array.isArray(data.items) && data.items.length > 0) {
          const suggestions = data.items.map(item => ({
              name: item.title.replace(/<b>|<\/b>/g, ""), // HTML 태그 제거
              address: item.roadAddress || item.address
          }));

          console.log("[✅] 자동완성 결과:", suggestions);
          res.json(suggestions);
      } else {
          console.log("[❌] 네이버 API에서 결과 없음");
          res.status(404).json({ error: "자동완성 결과가 없습니다." });
      }
  } catch (error) {
      console.error("[⚠️] 주소 자동완성 오류:", error);
      res.status(500).json({ error: "주소 자동완성 요청 중 오류 발생" });
  }
}


// 📌 2️⃣ 주변 장소 추천 기능 (Overpass API)
export async function getPlaces(req, res) {
  const { lat, lon, category } = req.query;

  if (!lat || !lon || !category) {
    return res.status(400).json({ error: "위도, 경도, 카테고리를 입력하세요." });
  }

  const overpassQuery = `
    [out:json];
    (
      node["amenity"="${category}"](around:1000,${lat},${lon});
      way["amenity"="${category}"](around:1000,${lat},${lon});
      relation["amenity"="${category}"](around:1000,${lat},${lon});
    );
    out center;
  `;

  try {
    const response = await fetch(`${CONFIG.OVERPASS_API_URL}?data=${encodeURIComponent(overpassQuery)}`);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "장소 검색 중 오류 발생" });
  }
}


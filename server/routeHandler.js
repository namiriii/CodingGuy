import fetch from "node-fetch";
import { CONFIG } from "./config.js"; // API 키 설정 파일
import { NAVERCONFIG } from "./config.js"; // 네이버 API 키 설정 파일

// ✅ 네이버 지도 API를 사용하여 주소 -> 좌표 변환 (Nominatim 주소 처리 포함)
export async function geocodeAddress(req, res) {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: "주소를 입력하세요." });
    }

    try {
        // 🔹 1️⃣ Nominatim API에서 주소 검색
        const nominatimUrl = `${CONFIG.MAP_API_URL}/search?format=json&q=${encodeURIComponent(query)}&countrycodes=KR`;
        const nominatimResponse = await fetch(nominatimUrl);
        const nominatimData = await nominatimResponse.json();

        if (!nominatimData.length) {
            console.log("[❌] Nominatim에서 주소를 찾을 수 없음:", query);
            return res.status(404).json({ error: "주소를 찾을 수 없습니다. (Nominatim)" });
        }

        // 🔹 2️⃣ Nominatim에서 반환된 주소에서 도로명 주소만 추출
        const rawAddress = nominatimData[0].display_name.split(",").slice(1, 4).join(",").trim();  
        console.log("[📍] 가공된 주소:", rawAddress); // 예: "이촌로, 용산구, 서울특별시"

        // 🔹 3️⃣ 네이버 지도 API 요청
        const naverUrl = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(rawAddress)}`;
        console.log("[🔎] 네이버 지도 API 요청 URL:", naverUrl);

        const naverResponse = await fetch(naverUrl, {
            method: "GET",
            headers: {
                "X-NCP-APIGW-API-KEY-ID": NAVERCONFIG.NAVER_CLIENT_ID,
                "X-NCP-APIGW-API-KEY": NAVERCONFIG.NAVER_CLIENT_SECRET
            }
        });

        const naverData = await naverResponse.json();

        // 🔹 4️⃣ 네이버 API 응답 확인
        console.log("[🗺️] 네이버 지도 API 응답:", JSON.stringify(naverData, null, 2));

        if (naverData.addresses && naverData.addresses.length > 0) {
            res.json({
                lat: parseFloat(naverData.addresses[0].y),
                lon: parseFloat(naverData.addresses[0].x)
            });
        } else {
            console.log("[❌] 네이버 지도 API에서 주소를 찾을 수 없음:", rawAddress);
            res.status(404).json({ error: "주소를 찾을 수 없습니다. (네이버)" });
        }
    } catch (error) {
        console.error("[⚠️] 주소 변환 오류:", error);
        res.status(500).json({ error: "주소 변환 중 오류 발생" });
    }
}


export async function getRoute(req, res) {
    const { start, end } = req.query;
    
    if (!start || !end) {
        return res.status(400).json({ error: "출발지와 도착지를 입력하세요." });
    }

    try {
        // 🔹 주소 -> 좌표 변환
        const startCoords = await geocodeAddress(start);
        const endCoords = await geocodeAddress(end);

        const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (!data.routes || data.routes.length === 0) {
            return res.status(400).json({ error: "경로를 찾을 수 없습니다." });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "경로 검색 중 오류 발생" });
    }
}
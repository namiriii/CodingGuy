let map; // 네이버 지도 객체 저장 변수
let markers = []; // 마커 배열 (출발/도착 마커 저장)

async function geocodeAddress(address) {
    const url = `http://localhost:3000/geocode?query=${encodeURIComponent(address)}`;

    try {
        console.log(`[주소 변환 요청] ${url}`);

        const response = await fetch(url);
        const data = await response.json();
        console.log("[주소 변환 응답]", data);

        if (data.lat && data.lon) {
            return { lat: data.lat, lon: data.lon };
        } else {
            throw new Error("주소를 찾을 수 없습니다.");
        }
    } catch (error) {
        console.error("주소 변환 오류:", error);
        throw error;
    }
}

// 🔹 문서 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
    const startInput = document.getElementById("start");
    const endInput = document.getElementById("end");

    startInput.addEventListener("keyup", () => getAddressSuggestions(startInput.value, "startSuggestions"));
    endInput.addEventListener("keyup", () => getAddressSuggestions(endInput.value, "endSuggestions"));

    // ✅ 네이버 지도 초기화
    map = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(37.5665, 126.9780), // 서울 시청 좌표 (기본값)
        zoom: 14
    });
});

// 🔹 주소 자동완성 기능 
async function getAddressSuggestions(query, targetId) {
    if (!query) return;

    try {
        const response = await fetch(`/autocomplete?query=${query}`);
        const suggestions = await response.json();
        
        const targetDiv = document.getElementById(targetId);
        targetDiv.innerHTML = suggestions.map(s => 
            `<div onclick="setAddress('${s.address}', '${targetId}')">${s.name} (${s.address})</div>`
        ).join("");
    } catch (error) {
        console.error("주소 자동완성 오류:", error);
    }
}

// 🔹 주소 선택 시 input에 값 입력
function setAddress(address, targetId) {
    document.getElementById(targetId.replace("Suggestions", "")).value = address;
    document.getElementById(targetId).innerHTML = "";
}

// 🔹 길찾기 실행
async function searchRoute() {
    const startInput = document.getElementById("start").value;
    const endInput = document.getElementById("end").value;

    if (!startInput || !endInput) {
        alert("출발지와 도착지를 입력하세요.");
        return;
    }

    try {
        // (1) 입력된 주소를 네이버 지도 API를 사용해 변환
        const startCoords = await geocodeAddress(startInput);
        const endCoords = await geocodeAddress(endInput);

        if (!startCoords || !endCoords) {
            alert("출발지 또는 도착지를 찾을 수 없습니다.");
            return;
        }

        console.log("출발지 좌표:", startCoords);
        console.log("도착지 좌표:", endCoords);

        // (2) 변환된 좌표를 이용해 경로 검색 API 호출
        const response = await fetch(`/route?start=${startCoords.lat},${startCoords.lon}&end=${endCoords.lat},${endCoords.lon}`);
        const data = await response.json();

        console.log(data); // 지도에 표시하는 로직 추가
    } catch (error) {
        console.error("경로 탐색 오류:", error);
    }
}

// 🔹 지도에 경로 표시
function drawRouteOnMap(routeData) {
    // 기존 마커 초기화
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    const route = routeData.routes[0]; // 첫 번째 경로 사용
    const path = route.geometry.coordinates.map(coord => new naver.maps.LatLng(coord[1], coord[0]));

    // ✅ 지도 중심을 경로의 첫 번째 좌표로 설정
    map.setCenter(path[0]);
    map.setZoom(14);

    // ✅ 출발지 마커
    const startMarker = new naver.maps.Marker({
        position: path[0],
        map: map,
        title: "출발지",
        icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
            scaledSize: new naver.maps.Size(30, 30)
        }
    });

    // ✅ 도착지 마커
    const endMarker = new naver.maps.Marker({
        position: path[path.length - 1],
        map: map,
        title: "도착지",
        icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new naver.maps.Size(30, 30)
        }
    });

    markers.push(startMarker, endMarker);

    // ✅ 네이버 지도에 경로 그리기
    new naver.maps.Polyline({
        path: path,
        map: map,
        strokeColor: "#FF0000",
        strokeWeight: 4
    });
}

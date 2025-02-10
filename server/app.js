import express from "express";
import cors from "cors";
import { getRoute, geocodeAddress } from "./routeHandler.js";
import { getPlaces, getAddressSuggestions } from "./placeHandler.js";

const app = express();
app.use(cors());
app.use(express.static("public"));

app.get("/route", getRoute);
app.get("/places", getPlaces);
app.get("/autocomplete", getAddressSuggestions);
app.get("/geocode", geocodeAddress)

app.listen(3000, () => {
  console.log("서버 실행 중: http://localhost:3000");
});

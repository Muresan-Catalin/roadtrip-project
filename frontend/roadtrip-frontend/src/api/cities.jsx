import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export function getCountries() {
  return api.get("/countries/").then((res) => res.data);
}

export function getCities() {
  return api.get("/cities/").then((res) => res.data);
}

// src/pages/BuildItineraryPage.jsx
import React, { useState, useEffect } from "react";
import CityAutocomplete from "../components/CityAutocomplete";
import { getCities } from "../api/cities";
import CityCard from "../components/CityCard";
import AiTest from "../components/AiTest";

export default function BuildItineraryPage() {
  // 1) All cities fetched from the API
  const [allCities, setAllCities] = useState([]);
  // 2) The ID of the chosen start city
  const [startCityId, setStartCityId] = useState(null);
  // 3) The full object for that city once chosen
  const [startCity, setStartCity] = useState(null);
  const [stopCityId, setStopCityId] = useState(null);
  const [stops, setStops] = useState([]);
  const [distance, setDistance] = useState([]);

  // Fetch cities once
  useEffect(() => {
    getCities().then(setAllCities);
  }, []);

  // Whenever startCityId or allCities changes, find its object
  useEffect(() => {
    if (startCityId != null) {
      setStartCity(allCities.find((c) => c.id === startCityId) || null);
    } else {
      setStartCity(null);
    }
  }, [startCityId, allCities]);

  useEffect(() => {
    // only kick off a distance lookup once there’s at least one stop
    if (stops.length === 0) return;

    // figure out the “from” and “to” for the latest leg
    const fromCity = stops.length === 1 ? startCity : stops[stops.length - 2];
    const toCity = stops[stops.length - 1];

    // guard against missing data
    if (!fromCity || !toCity) return;

    async function lookupDistance() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/distance/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city_a: fromCity.name,
            city_b: toCity.name,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          console.log(
            `Distance ${fromCity.name}→${toCity.name}:`,
            data.distance_km
          );
          setDistance((prev) => [
            ...prev,
            {
              from: fromCity,
              to: toCity,
              km: data.distance_km,
            },
          ]);
        } else {
          console.error("Error:", data.detail);
        }
      } catch (e) {
        console.error("Fetch error:", e);
      }
    }

    lookupDistance();
  }, [startCity, stops]); // rerun whenever the stops array or startCity changes

  function handleAddStop(id) {
    const city = allCities.find((c) => c.id === id);
    if (city && stops.length < 5 && !stops.some((s) => s.id === id)) {
      setStops([...stops, city]);
    }
  }

  function handleDeleteStop(id) {
    setStops(stops.filter((s) => s.id !== id));
  }

  return (
    <div style={{ padding: "2rem" }}>
      <AiTest />
      <h1>Plan Your Roadtrip</h1>

      {/* --- Start Location Picker --- */}
      <div style={{ margin: "1rem 0" }}>
        <label style={{ display: "block", marginBottom: ".5rem" }}>
          Start Location:
        </label>
        <CityAutocomplete
          value={startCityId}
          onChange={setStartCityId}
          label=""
        />
      </div>

      {/* --- Display the Selected City --- */}
      {startCity && <CityCard city={startCity} />}

      {startCity && (
        <div>
          <h1>Select stops</h1>
          <CityAutocomplete
            value={stopCityId}
            onChange={handleAddStop}
            label=""
          />
          <h2>Stops</h2>
          {console.log(stops)}
          {stops.map((c) => (
            <>
              <CityCard key={c.id} city={c} />
              <button onClick={() => handleDeleteStop(c.id)}>Delete</button>
            </>
          ))}
        </div>
      )}
    </div>
  );
}

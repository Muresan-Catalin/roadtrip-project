// src/pages/BuildItineraryPage.jsx
import React, { useState, useEffect, useRef } from "react";
import CityAutocomplete from "../components/CityAutocomplete";
import { getCities } from "../api/cities";
import CityCard from "../components/CityCard";

export default function BuildItineraryPage() {
  const [allCities, setAllCities] = useState([]);
  const [startCityId, setStartCityId] = useState(null);
  const [startCity, setStartCity] = useState(null);
  const [stops, setStops] = useState([]);
  const [distance, setDistance] = useState([]);

  // Track previous stops length so we know when it's an add vs delete
  const prevStopsLenRef = useRef(0);

  // 1) Fetch cities once
  useEffect(() => {
    getCities().then(setAllCities);
  }, []);

  // 2) When startCity changes, reset everything
  useEffect(() => {
    if (startCityId != null) {
      setStartCity(allCities.find((c) => c.id === startCityId) || null);
    } else {
      setStartCity(null);
    }
    setStops([]);
    setDistance([]);
    prevStopsLenRef.current = 0;
  }, [startCityId, allCities]);

  // 3) Only run on **add** (stops.length > previous), calculate that new leg
  useEffect(() => {
    const prevLen = prevStopsLenRef.current;
    const currLen = stops.length;
    // Update the ref for next time
    prevStopsLenRef.current = currLen;

    // If no stops or this was a delete, bail out
    if (currLen === 0 || currLen <= prevLen) return;

    // Calculate the latest leg
    const fromCity = currLen === 1 ? startCity : stops[currLen - 2];
    const toCity = stops[currLen - 1];
    if (!fromCity || !toCity) return;

    (async () => {
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
          setDistance((prev) => [
            ...prev,
            { from: fromCity, to: toCity, km: data.distance_km },
          ]);
        } else {
          console.error("Error fetching distance:", data.detail);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    })();
  }, [startCity, stops]);

  // 4) Your original add-stop stays exactly the same
  function handleAddStop(id) {
    const city = allCities.find((c) => c.id === id);
    if (city && stops.length < 5 && !stops.some((s) => s.id === id)) {
      setStops([...stops, city]);
    }
  }

  // 5) On delete: clear old distances and recalc **all** legs
  async function handleDeleteStop(id) {
    const newStops = stops.filter((s) => s.id !== id);
    setStops(newStops);
    setDistance([]); // wipe prior distances

    // Rebuild every leg in order
    for (let i = 0; i < newStops.length; i++) {
      const fromCity = i === 0 ? startCity : newStops[i - 1];
      const toCity = newStops[i];
      if (!fromCity || !toCity) continue;

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
          setDistance((prev) => [
            ...prev,
            { from: fromCity, to: toCity, km: data.distance_km },
          ]);
        } else {
          console.error("Error fetching distance:", data.detail);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
    // Reset the previous-length ref so the add-effect stays in sync
    prevStopsLenRef.current = newStops.length;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Plan Your Roadtrip</h1>

      {/* Start Location Picker */}
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
      {startCity && <CityCard city={startCity} />}

      {startCity && (
        <div>
          <h2>Select stops</h2>
          <CityAutocomplete value={null} onChange={handleAddStop} label="" />

          <h3>Stops</h3>
          {stops.map((c, idx) => (
            <div key={c.id} style={{ marginBottom: "1rem" }}>
              <CityCard city={c} distance={distance} index={idx} />
              <button onClick={() => handleDeleteStop(c.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

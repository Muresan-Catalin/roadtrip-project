// src/pages/BuildItineraryPage.jsx
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import CityAutocomplete from "../components/CityAutocomplete";
import CityCard from "../components/CityCard";
import Info from "../components/Info";
import { getCities } from "../api/cities";

import "../styles/BuildItineraryStyle.css";

export default function BuildItineraryPage() {
  const [allCities, setAllCities] = useState([]);
  const [startCityId, setStartCityId] = useState(null);
  const [startCity, setStartCity] = useState(null);
  const [stops, setStops] = useState([]);
  const [distance, setDistance] = useState([]);
  const prevStopsLenRef = useRef(0);

  // ref + state for measuring the full height of the cards container
  const contentRef = useRef(null);
  const [citiesHeight, setCitiesHeight] = useState(0);

  // 1) Fetch once
  useEffect(() => {
    getCities().then(setAllCities);
  }, []);

  // 2) Reset when startCity changes
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

  // 3) Only on **add** stops, fetch that leg
  useEffect(() => {
    const prev = prevStopsLenRef.current;
    const curr = stops.length;
    prevStopsLenRef.current = curr;
    if (curr === 0 || curr <= prev) return;

    const from = curr === 1 ? startCity : stops[curr - 2];
    const to = stops[curr - 1];
    if (!from || !to) return;

    (async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/distance/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city_a: from.name,
            city_b: to.name,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setDistance((d) => [...d, { from, to, km: data.distance_km }]);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [startCity, stops]);

  // 4) Add / delete handlers
  function handleAddStop(id) {
    const city = allCities.find((c) => c.id === id);
    if (city && stops.length < 5 && !stops.some((s) => s.id === id)) {
      setStops([...stops, city]);
    }
  }
  async function handleDeleteStop(id) {
    const newStops = stops.filter((s) => s.id !== id);
    setStops(newStops);
    setDistance([]);
    for (let i = 0; i < newStops.length; i++) {
      const from = i === 0 ? startCity : newStops[i - 1];
      const to = newStops[i];
      if (!from || !to) continue;
      try {
        const res = await fetch("http://127.0.0.1:8000/api/distance/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city_a: from.name,
            city_b: to.name,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setDistance((d) => [...d, { from, to, km: data.distance_km }]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    prevStopsLenRef.current = newStops.length;
  }
  function ClearAll() {
    setStartCity(null);
    setStartCityId(null);
    setStops([]);
    setDistance([]);
  }

  // — animation constants —
  const SLIDE_DURATION = 0.6; // seconds

  // measure cards-container height any time the list changes
  useLayoutEffect(() => {
    if (contentRef.current) {
      setCitiesHeight(contentRef.current.getBoundingClientRect().height);
    }
  }, [startCity, stops]);

  const hasCities = startCity != null;

  // variants for the wrapper that reveals via height
  const wrapperVariants = {
    hidden: { height: 0 },
    visible: {
      height: citiesHeight,
      transition: { duration: SLIDE_DURATION, ease: "easeInOut" },
    },
  };

  // variants for the cards themselves
  const cardsVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: SLIDE_DURATION, duration: 0.4 },
    },
  };

  return (
    <div className="page-container">
      <div className="header-container">
        <div className="title-input">
          <h1>Plan Your Roadtrip</h1>
          <p>
            Your roadtrip plan is a few clicks away
            <br />
            Start adding cities and begin your adventure
          </p>
          <div className="search">
            {startCityId === null ? (
              <CityAutocomplete
                value={startCityId}
                onChange={setStartCityId}
                label=""
              />
            ) : (
              <CityAutocomplete value={null} onChange={handleAddStop} />
            )}
            {startCity && (
              <button className="clear-button" onClick={ClearAll}>
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* if no cities, just show Info */}
      {!hasCities && <Info />}

      {/* when cities exist, reveal wrapper → fade in cards → Info sits below and is pushed by wrapper height */}
      {hasCities && (
        <>
          <motion.div
            className="cities-display-wrapper"
            initial="hidden"
            animate="visible"
            variants={wrapperVariants}
            style={{ overflow: "hidden" }}
          >
            <motion.div
              ref={contentRef}
              className="cities-display"
              initial="hidden"
              animate="visible"
              variants={cardsVariants}
            >
              <AnimatePresence>
                {startCity && (
                  <motion.div
                    key={`start-${startCity.id}`}
                    layout
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <CityCard city={startCity} />
                  </motion.div>
                )}
                {stops.map((c, idx) => (
                  <motion.div
                    key={c.id}
                    layout
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <CityCard
                      city={c}
                      distance={distance}
                      index={idx}
                      onDelete={() => handleDeleteStop(c.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Info just lives below the wrapper and is pushed down smoothly */}
          <Info />
        </>
      )}
    </div>
  );
}

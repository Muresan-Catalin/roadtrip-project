// src/components/CityAutocomplete.jsx

import React, { useState, useEffect } from "react";
import { getCities } from "../api/cities";

export default function CityAutocomplete({
  countryName,
  value,
  onChange,
  label,
}) {
  const [allCities, setAllCities] = useState([]);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const europeFlags = {
    AL: "🇦🇱",
    AD: "🇦🇩",
    AM: "🇦🇲",
    AT: "🇦🇹",
    AZ: "🇦🇿",
    BY: "🇧🇾",
    BE: "🇧🇪",
    BA: "🇧🇦",
    BG: "🇧🇬",
    HR: "🇭🇷",
    CY: "🇨🇾",
    CZ: "🇨🇿",
    DK: "🇩🇰",
    EE: "🇪🇪",
    FI: "🇫🇮",
    FR: "🇫🇷",
    GE: "🇬🇪",
    DE: "🇩🇪",
    GR: "🇬🇷",
    HU: "🇭🇺",
    IS: "🇮🇸",
    IE: "🇮🇪",
    IT: "🇮🇹",
    KZ: "🇰🇿",
    XK: "🇽🇰", // Kosovo
    LV: "🇱🇻",
    LI: "🇱🇮",
    LT: "🇱🇹",
    LU: "🇱🇺",
    MT: "🇲🇹",
    MD: "🇲🇩",
    MC: "🇲🇨",
    ME: "🇲🇪",
    NL: "🇳🇱",
    MK: "🇲🇰",
    NO: "🇳🇴",
    PL: "🇵🇱",
    PT: "🇵🇹",
    RO: "🇷🇴",
    RU: "🇷🇺",
    SM: "🇸🇲",
    RS: "🇷🇸",
    SK: "🇸🇰",
    SI: "🇸🇮",
    ES: "🇪🇸",
    SE: "🇸🇪",
    CH: "🇨🇭",
    TR: "🇹🇷",
    UA: "🇺🇦",
    GB: "🇬🇧",
    VA: "🇻🇦",
  };

  useEffect(() => {
    getCities().then(setAllCities);
  }, []);

  const filtered = countryName
    ? allCities.filter(
        (c) => c.country.toLowerCase() === countryName.toLowerCase()
      )
    : allCities;

  const suggestions = query
    ? filtered.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div style={{ position: "relative" }}>
      <label>
        {label}
        <input
          type="text"
          placeholder="search a city"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
            if (
              (e.key === "Enter" || e.key === "Tab") &&
              suggestions.length > 0
            ) {
              e.preventDefault();
              const first = suggestions[0];
              setQuery(first.name);
              onChange(first.id);
              setShowSuggestions(false);
              setQuery("");
            }
          }}
          autoComplete="off"
        />
      </label>

      {query && showSuggestions && (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: "0.5rem",
            border: "1px solid #ccc",
            position: "absolute",
            background: "white",
            width: "100%",
            maxHeight: "150px",
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          {suggestions.length > 0 ? (
            suggestions.map((c) => (
              <li
                key={c.id}
                style={{ padding: "0.25rem 0", cursor: "pointer" }}
                onClick={() => {
                  setQuery(c.name);
                  onChange(c.id);
                  setShowSuggestions(false);
                }}
              >
                <span style={{ marginRight: "0.5em" }}>
                  {europeFlags[c.country_code]}
                </span>
                {c.name}, {c.country}
              </li>
            ))
          ) : (
            <li style={{ color: "#888", padding: "0.25rem 0" }}>
              No city with this name available
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

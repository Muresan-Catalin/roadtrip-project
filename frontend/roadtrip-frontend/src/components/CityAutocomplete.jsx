import React, { useState, useEffect } from "react";
import { getCities } from "../api/cities";
import "../styles/CityAutocompleteStyle.css";

export default function CityAutocomplete({ countryName, onChange }) {
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
    <div className="city-autocomplete-wrapper">
      <input
        className="input"
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

      {query && showSuggestions && (
        <div className="suggestions-container">
          {suggestions.length > 0 ? (
            suggestions.map((c) => (
              <p
                key={c.id}
                className="suggestions"
                onClick={() => {
                  setQuery(c.name);
                  onChange(c.id);
                  setShowSuggestions(false);
                }}
              >
                <span>
                  {europeFlags[c.country_code]} {c.name}, {c.country}
                </span>
              </p>
            ))
          ) : (
            <p className="suggestions">No city with this name available</p>
          )}
        </div>
      )}
    </div>
  );
}

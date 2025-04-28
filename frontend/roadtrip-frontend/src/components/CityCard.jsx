import React, { useState, useEffect } from "react";

// Helper to turn 'RO' → '🇷🇴'
function emojiFlag(countryCode) {
  if (!countryCode) return "";
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65)
    );
}

export default function CityCard({ city, distance = [], index }) {
  const { name, country, country_code, photo } = city;

  // build the photo URL if one exists
  const photoUrl = photo
    ? photo.startsWith("http")
      ? photo
      : `http://127.0.0.1:8000${photo}`
    : null;

  // find the matching leg
  const leg = typeof index === "number" ? distance[index] : null;
  const km = leg?.km;
  const fromName = leg?.from?.name;

  // loading state: true until we have that leg
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // whenever distance array or index changes, update loading
    if (typeof index !== "number") {
      setLoading(false);
    } else if (leg && km != null) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [leg, km, index]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
        marginTop: "2rem",
      }}
    >
      {photoUrl && (
        <img
          src={photoUrl}
          alt={name}
          style={{ width: "100px", height: "auto", borderRadius: "8px" }}
        />
      )}

      <div>
        <h2 style={{ margin: 0 }}>
          {emojiFlag(country_code)} {name}, {country}
        </h2>

        {/* distance display */}
        {typeof index === "number" &&
          (loading ? (
            <p style={{ margin: "0.5rem 0 0", fontStyle: "italic" }}>
              Loading distance…
            </p>
          ) : (
            fromName &&
            km && (
              <p style={{ margin: "0.5rem 0 0" }}>
                {km} km from <strong>{fromName}</strong>
              </p>
            )
          ))}
      </div>
    </div>
  );
}

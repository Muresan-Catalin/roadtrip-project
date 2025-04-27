import React from "react";

// Helper to turn 'RO' → '🇷🇴'
function emojiFlag(countryCode) {
  if (!countryCode) return "";
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65)
    );
}

export default function CityCard({ city }) {
  const { name, country, country_code, latitude, longitude, photo } = city;
  let photoUrl = null;
  if (photo) {
    photoUrl = `http://127.0.0.1:8000${photo}`;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginTop: "2rem",
      }}
    >
      {photo && (
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
      </div>
    </div>
  );
}

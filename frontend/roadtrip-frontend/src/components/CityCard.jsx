import React, { useState, useEffect } from "react";
import "../styles/CityCardStyle.css";

export default function CityCard({ city, distance = [], index, onDelete }) {
  const { name, country, photo, interestPoints } = city;

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

  const interestPointsArray = interestPoints.split(",");

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
      className="city-card-container"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
        marginTop: "2rem",
      }}
    >
      {photoUrl && <img src={photoUrl} alt={name} />}

      <div className="text-container">
        <div>
          <h2 className="city-name">
            {name}, {country}
          </h2>

          <div>
            {interestPointsArray.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </div>
        </div>

        {/* distance display */}
        <div className="card-footer">
          <div>
            {typeof index === "number" &&
              (loading ? (
                <p
                  className="loading-distance"
                  style={{ margin: "0.5rem 0 0", fontStyle: "italic" }}
                >
                  Loading distance…
                </p>
              ) : (
                fromName &&
                km && (
                  <p className="distance" style={{ margin: "0.5rem 0 0" }}>
                    {km} km from <strong>{fromName}</strong>
                  </p>
                )
              ))}
          </div>

          <div>
            {onDelete && (
              <button className="delete-button" onClick={onDelete}>
                Remove city
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

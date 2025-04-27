import React from "react";

export default function AiTest() {
  async function handleSend() {
    const a = "Prague";
    const b = "Hamburg";

    const res = await fetch("http://127.0.0.1:8000/api/distance/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city_a: a, city_b: b }),
    });

    const data = await res.json();
    if (res.ok) {
      console.log(data.distance_km); // e.g. "823"
    } else {
      console.error("Error:", data.detail);
    }
  }

  return (
    <div>
      <button onClick={handleSend}>Send Message</button>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getCountries } from "../api/cities";

export default function HomePage() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    getCountries().then(setCountries);
  }, []);

  return (
    <div>
      <h1>Roadtrip Planner</h1>
      <ul>
        {countries.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}

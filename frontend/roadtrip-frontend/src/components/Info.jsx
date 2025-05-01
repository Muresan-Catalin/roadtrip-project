import "../styles/Info.css";
import React from "react";
import anim1 from "../assets/anim1.webm";
import anim2 from "../assets/anim2.webm";
import anim3 from "../assets/anim3.webm";

function Info() {
  return (
    <>
      <div className="info-container">
        <h1>Why Choose us?</h1>
        <div className="line-divider"></div>
        <div className="cards-container">
          <div className="card">
            <video
              src={anim1}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              style={{
                width: "50%", // or whatever sizing you need
                height: "auto",
                display: "block", // removes any inline whitespace
                objectFit: "cover", // if you want to cover a container
              }}
            />
            <h2>Pick the City</h2>
            <p>Choose from hundreds of destinations across Europe</p>
          </div>
          <div className="card">
            <video
              src={anim2}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              style={{
                width: "50%", // or whatever sizing you need
                height: "auto",
                display: "block", // removes any inline whitespace
                objectFit: "cover", // if you want to cover a container
              }}
            />
            <h2>Extensive Database</h2>
            <p>Over 300 cities, each with full details and photos</p>
          </div>
          <div className="card">
            <video
              src={anim3}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              style={{
                width: "50%", // or whatever sizing you need
                height: "auto",
                display: "block", // removes any inline whitespace
                objectFit: "cover", // if you want to cover a container
              }}
            />
            <h2>Download as PDF</h2>
            <p>Export your trip plan and keep it handy-offline too</p>
          </div>
          {/* <div className="display-of-info">
            <video
              src={anim2}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              style={{
                width: "30%", // or whatever sizing you need
                height: "auto",
                display: "block", // removes any inline whitespace
                objectFit: "cover", // if you want to cover a container
              }}
            />
            <h2>Over 300 cities from Europe in our Database</h2>
          </div>
          <div className="display-of-info">
            <video
              src={anim3}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              style={{
                width: "30%", // or whatever sizing you need
                height: "auto",
                display: "block", // removes any inline whitespace
                objectFit: "cover", // if you want to cover a container
              }}
            />
            <h2>Convert your Roadtrip in pdf and never lose it</h2>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default Info;

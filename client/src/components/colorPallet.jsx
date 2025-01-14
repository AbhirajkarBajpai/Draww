import React from "react";
import "./colorPallet.css";

const ColorPallet = (props) => {
  const PalletSvg = ({ colorCode }) => (
    <>
      {props.selColor === colorCode && (
        <div style={{ position: "relative", marginTop: "2px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
          >
            <circle cx="20" cy="20" r="19" stroke="white" strokeWidth="2" />
          </svg>
          <svg
            style={{
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              position: "absolute",
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            onClick={() => {
              props.onChangeColor(colorCode);
            }}
          >
            <circle cx="16" cy="16" r="16" fill={colorCode} />
            <circle
              cx="16"
              cy="16"
              r="15.5"
              stroke="white"
              strokeOpacity="0.7"
            />
          </svg>
          <svg
            style={{
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              position: "absolute",
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="9"
            viewBox="0 0 12 9"
            fill="none"
          >
            <path
              d="M1 4.5L4.33427 8L11 1"
              stroke="white"
              strokeWidth="2"
               strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
      {props.selColor != colorCode && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          onClick={() => {
            props.onChangeColor(colorCode);
          }}
        >
          <circle cx="16" cy="16" r="16" fill={colorCode} />
          <circle cx="16" cy="16" r="15.5" stroke="white" strokeOpacity="0.7" />
        </svg>
      )}
    </>
  );

  const colors = [
    "#FDA700",
    "#96BDFF",
    "#8B423B",
    "#FE0000",
    "black",
    "#FF00FE",
    "#00FF01",
    "#0000FE",
  ];

  return (
    <div className="color_pallet">
      {colors.map((color) => (
        <div className="color_g6" key={color}>
          <PalletSvg key={color} colorCode={color} />
        </div>
      ))}
    </div>
  );
};

export default ColorPallet;

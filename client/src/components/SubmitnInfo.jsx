import React from "react";
import "./SubmitnInfo.css";

const SubmitnInfo = (props) => {
  return (
    <div
      className="submitInfo_wrapper"
      style={props.isGiveUp ? { marginTop: "-1.8vh" } : {}}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {props.isGiveUp ? (
          <div onClick={props.onSubmitClick} className="submitBtn GiveUp">
          Give up
        </div>
        ) : (
          <div onClick={props.onSubmitClick} className="submitBtn">
            Submit
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitnInfo;

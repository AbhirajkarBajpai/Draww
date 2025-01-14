"use client";
import React, { createContext, useEffect, useState } from "react";

const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [videoURL, setVideoURL] = useState(null);
  const [imgString, setImgString] = useState(null);
  const [isDrawn, setIsDrawn] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const [isChallenge, setIsChallenge] = useState(false);
  const [challengeId, setChallengeId] = useState("");
  const [genActivityID, setGenActivityID] = useState("");
  const [selectedWord, setSelectedWord] = useState("");
  const [challengeTopic, setChallengeTopic] = useState();
  const [isPaintVisible, setIsPaintVisible] = useState(false);
  const words = [
    "House",
    "Bonfire",
    "Tree",
    "Hoist",
    "Habitat",
    "Rabbit",
    "Football",
    "Fan",
    "Open",
    "Money",
  ];

  useEffect(() => {
    if (isChallenge) {
      fetch(
        `http://localhost:5000/api/v1/challengeData/getChallengeData/${challengeId}`
      )
        .then((response) => response.json())
        .then((data) => {
          const reqJSON = data;
          console.log("Fetched data:", reqJSON);

          setChallengeTopic(reqJSON.topic);
          setImgString(reqJSON.image);
          setVideoURL(reqJSON.video);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [isChallenge, challengeId]);

  async function uploadFile(blob, fileName, fileType) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/challengeData/getUploadUrl?fileType=${encodeURIComponent(
          fileType
        )}&fileName=${encodeURIComponent(fileName)}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`Error fetching signed URL: ${response.statusText}`);
      }

      const { signedUrl, key } = await response.json();

      console.log("new blob", blob);

      const putResponse = await fetch(signedUrl, {
        method: "PUT",
        body: blob,
        headers: {
          "Content-Type": fileType,
        },
      });

      if (!putResponse.ok) {
        throw new Error(`Error uploading file: ${putResponse.statusText}`);
      }

      console.log("File uploaded successfully:", key);
      return "success";
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }

  return (
    <GameContext.Provider
      value={{
        videoURL,
        setVideoURL,
        imgString,
        setImgString,
        isDrawn,
        setIsDrawn,
        playTime,
        setPlayTime,
        selectedWord,
        setSelectedWord,
        isChallenge,
        setIsChallenge,
        setChallengeId,
        genActivityID,
        setGenActivityID,
        words,
        challengeTopic,
        isPaintVisible,
        setIsPaintVisible,
        setChallengeTopic,
        uploadFile,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider };

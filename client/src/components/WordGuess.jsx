import React, { useState, useEffect } from "react";
import "./WordGuess.css";
import shuffle_btn from "../../public/Shuffle2.png";
import Image from "next/image";

const WordGuess = ({ word, isWinner, setIsWinner }) => {
  const [guess, setGuess] = useState(Array(word.length).fill(""));
  const [letterUsed, setLetterUsed] = useState([]);
  const [gameStatus, setGameStatus] = useState(null);
  const [clickedIndices, setClickedIndices] = useState([]);
  const [isGuessedWrong, setIsGuessedWrong] = useState(false);
  const [isGuessedCorrect, setIsGuessedCorrect] = useState(false);

  useEffect(() => {
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const wordLetters = word.toUpperCase().split("");
    const randomLetters = Array(word.length)
      .fill()
      .map(() => alphabet[Math.floor(Math.random() * alphabet.length)]);

    setLetterUsed(shuffleArray([...wordLetters, ...randomLetters]));
  }, [word]);

  function handleShuffleArray() {
    const newLetterUsed = [...letterUsed];
    const unclickedLetters = newLetterUsed.filter(
      (_, index) => !clickedIndices.includes(index)
    );
    for (let i = unclickedLetters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unclickedLetters[i], unclickedLetters[j]] = [
        unclickedLetters[j],
        unclickedLetters[i],
      ];
    }
    let unclickedIndex = 0;
    for (let i = 0; i < newLetterUsed.length; i++) {
      if (!clickedIndices.includes(i)) {
        newLetterUsed[i] = unclickedLetters[unclickedIndex++];
      }
    }
    setLetterUsed(newLetterUsed);
  }

  function handleClearGuess() {
    setGuess(Array(word.length).fill(""));
    setClickedIndices([]);
    setGameStatus(null);
  }

  function handleGuessBoxClick(index) {
    if (isGuessedWrong === true) {
      setIsGuessedWrong(false);
    }
    if (!guess[index]) return;

    const updatedGuess = [...guess];
    const updatedLetterUsed = [...letterUsed];

    const currentIndice = clickedIndices[0];
    if (currentIndice !== undefined) {
      updatedLetterUsed[currentIndice] = guess[index];
      setLetterUsed(updatedLetterUsed);

      const updatedClickedIndices = clickedIndices.slice(1); //this slice method is used to remove 1st element from array...
      setClickedIndices(updatedClickedIndices);
    }

    updatedGuess[index] = "";
    setGuess(updatedGuess);
  }

  const handleLetterClick = (letter, index) => {
    const newGuess = [...guess];
    const isNotFilled = guess.some((letter) => letter === "");
    if (!isNotFilled) {
      console.log("All Blanks Filled!!");
      return;
    }
    if (!clickedIndices.includes(index)) {
      setClickedIndices([...clickedIndices, index]);
    }
    const emptyIndex = newGuess.findIndex((l) => l === "");
    if (emptyIndex !== -1) {
      newGuess[emptyIndex] = letter;
      setGuess(newGuess);

      if (newGuess.join("") === word.toUpperCase()) {
        setIsGuessedCorrect(true);
        setGameStatus("correct");
        setTimeout(() => {
          setIsWinner(true);
        }, 2000);
      } else if (!newGuess.includes("")) {
        setIsGuessedWrong(true);
        setGameStatus("wrong");
      }
    }
  };

  const resetGame = () => {
    setGuess(Array(word.length).fill(""));
    setClickedIndices([]);
    setGameStatus(null);
  };

  useEffect(() => {
    if (gameStatus === "wrong") {
      setTimeout(() => {
        setGameStatus(null);
      }, 2000);
    }
  }, [gameStatus]);

  return (
    <div className="word-guess-game">
      <div className="guess-boxes">
        {guess.map((letter, index) => (
          <div
            key={index}
            onClick={() => handleGuessBoxClick(index)}
            className={`guess-box ${
              isGuessedCorrect ? "letter-button-correct" : ""
            } ${isGuessedWrong ? "letter-button-wrong" : ""}`}
          >
            {letter}
          </div>
        ))}
      </div>
      {isWinner === null && (
        <>
          <div className="letter-grid">
            {letterUsed.map((letter, index) => (
              <button
                key={index}
                onClick={() => handleLetterClick(letter, index)}
                className={`letter-button ${
                  clickedIndices.includes(index) ? "letter-button-done" : ""
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
          {gameStatus && (
            <div className={`game-status ${gameStatus}`}>
              {gameStatus === "correct" ? "Correct" : "Wrong"}
            </div>
          )}
          <div className="guess_manage_btn_cont">
            <Image
              onClick={handleShuffleArray}
              className="guess_manage_btn"
              src={shuffle_btn}
              alt="shuffle"
            />
            <svg
              onClick={handleClearGuess}
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              className="guess_manage_btn2"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M732.1 399.3C534.6 356 696.5 82.1 425.9 104.8s-527.2 645.8-46.8 791.7 728-415 353-497.2z"
                  fill="#d84646"
                ></path>
                <path
                  d="M597.8 806.3c-1.3 0-2.7-0.3-3.9-0.9l-27.5-12.7a9.28 9.28 0 0 1-5-10.9l9.4-33.8-20.6 28.9a9.3 9.3 0 0 1-11.5 3l-20.5-9.5a9.4 9.4 0 0 1-5.4-8.4l-0.1-17.9-14.5 11.4c-1.7 1.3-3.7 2-5.7 2-1.3 0-2.7-0.3-3.9-0.9l-126.5-58.7a9.25 9.25 0 0 1-5.1-10.7l15.1-58.3-32 50a9.4 9.4 0 0 1-7.8 4.3c-1.3 0-2.6-0.3-3.9-0.9l-47.5-22a9.38 9.38 0 0 1-4.2-13l126.7-224.9a9.24 9.24 0 0 1 12-3.8l275.1 127.7c4.4 2 6.5 7.1 4.8 11.6l-89.1 242.4c-0.9 2.4-2.8 4.4-5.2 5.4-0.8 0.4-2 0.6-3.2 0.6z"
                  fill="#FFFFFF"
                ></path>
                <path
                  d="M411.7 427l275.1 127.7-89.1 242.4-27.5-12.7 13.9-49.9a6.3 6.3 0 0 0-6.1-8c-2 0-3.9 0.9-5.2 2.7l-30.2 42.4-20.5-9.5-0.1-20.2c0.4-3.3-1.4-6.5-4.4-7.9-1-0.5-2.1-0.7-3.2-0.7-1.7 0-3.4 0.6-4.8 1.6l-17.1 13.5L366 689.7l18.5-71.2c0.9-3.3-0.8-6.8-3.9-8.3-1-0.4-2-0.7-3-0.7-2.4 0-4.7 1.2-6 3.3l-39.2 61.3-47.5-22L411.7 427m0.1-18.6c-6.5 0-12.8 3.4-16.2 9.4l-126.7 225c-2.5 4.5-3.1 9.9-1.5 14.8s5.2 9 9.8 11.1l47.5 22c2.5 1.2 5.2 1.7 7.8 1.7 6.2 0 12.1-3.1 15.6-8.6l0.6-0.9-0.5 1.9c-2.2 8.7 2 17.7 10.1 21.5L484.8 765c2.5 1.2 5.2 1.7 7.8 1.7 3.9 0 7.8-1.3 11.1-3.7 0.4 6.8 4.5 12.8 10.7 15.7l20.5 9.5c2.5 1.2 5.2 1.7 7.8 1.7 3.3 0 6.5-0.9 9.4-2.5 1 5.8 4.8 11 10.5 13.7l27.5 12.7c2.5 1.1 5.1 1.7 7.8 1.7 2.4 0 4.8-0.5 7.1-1.4 4.8-2 8.5-5.9 10.3-10.7l89-242.4c3.3-9.1-0.8-19.1-9.6-23.2L419.6 410.1c-2.6-1.1-5.2-1.7-7.8-1.7z"
                  fill="#151B28"
                ></path>
                <path
                  d="M676.9 581.7L439.2 471.4c-7.6-3.5-16.7-0.6-20.8 6.7L313.2 665l19.3 9 39.2-61.3c1.9-3 5.8-4.1 9-2.6 3.1 1.5 4.8 4.9 3.9 8.3l-14.9 57.5 16-24.9c1.9-3 5.8-4.1 9-2.6 3.1 1.5 4.8 4.9 3.9 8.3l-11.1 43 105.2 48.8 17.1-13.5c2.3-1.8 5.4-2.2 8-0.9 3 1.4 4.8 4.6 4.4 7.9l0.1 20.2 20.5 9.5 30.2-42.4a6.3 6.3 0 0 1 7.8-2.1c2.8 1.3 4.3 4.5 3.4 7.4l-13.9 49.9 3.3 1.5 13.3-18.6a6.3 6.3 0 0 1 7.8-2.1c2.8 1.3 4.3 4.5 3.4 7.4l-6.1 21.8 5.7 2.6 79.2-215.4z"
                  fill="#2AEFC8"
                ></path>
                <path
                  d="M720 518.8c-2.4 0-4.7-0.5-6.9-1.5L423 382.6a16.54 16.54 0 0 1-8-21.9l22.8-49.1a6.68 6.68 0 0 1 8.9-3.3c0.1 0 0.1 0.1 0.2 0.1 26.4 12.3 54.2 19 78.1 19 22.9 0 40.3-6.1 49-17.1 0.5-1 0.9-1.9 1.4-2.9 0.5-1.1 1.1-2.1 1.6-3.2l2.9-6 1.2-2.5c2.5-5.3 4.9-10.7 7.4-16.7 3.3-7.8 6.2-15.3 8.6-22.1a84.3 84.3 0 0 1 5.9-19.5c0.1-0.3 0.2-0.6 0.3-0.8l0.4-0.8c12.3-26.4 37-44.1 61.5-44.1 7.3 0 14.2 1.5 20.7 4.5 14.3 6.6 24.5 19.7 28.7 36.7 4.1 16.5 2 34.8-5.8 51.7l-0.4 0.8c-0.1 0.3-0.3 0.5-0.4 0.8-3 6.2-6.7 11.9-11.1 17.1-3.6 6.2-7.4 13.2-11.3 20.9-2.9 5.7-5.5 11.1-7.9 16.4l-1.2 2.6-2.7 6c-0.5 1.1-0.9 2.1-1.4 3.2-0.4 1-0.9 2-1.3 3-5.9 29.3 30.6 71.3 83.5 95.8 1.6 0.8 2.9 2.1 3.5 3.8 0.6 1.7 0.6 3.6-0.2 5.2L735 509.3c-2.7 5.8-8.6 9.5-15 9.5z"
                  fill="#FFFFFF"
                ></path>
                <path
                  d="M665.1 198.5c6.1 0 12.1 1.2 17.8 3.9 25.6 11.9 34.3 47.4 19.5 79.4l-0.4 0.8s-0.1 0.1-0.1 0.2c-3 6.2-6.6 11.7-10.8 16.6a491.43 491.43 0 0 0-19.9 38.3l-1.2 2.6-2.7 6.1c-1 2.4-2 4.6-3 6.9-7.2 32.5 29.6 77.3 87.2 104.1l-22.8 49.1a9.65 9.65 0 0 1-8.8 5.6c-1.4 0-2.7-0.3-4.1-0.9l-145.1-67.3-145.1-67.3a9.7 9.7 0 0 1-4.7-12.8l22.8-49.1c28.4 13.2 56.9 19.7 80.9 19.7 24.7 0 44.6-6.8 54.8-20.2 1.1-2.2 2.2-4.5 3.4-6.8l2.9-6 1.2-2.6c2.7-5.8 5.2-11.4 7.5-16.9 3.5-8.2 6.5-16 9-23 1.1-6.3 2.9-12.7 5.7-18.9v-0.2l0.4-0.8c11.8-25.1 34.2-40.5 55.6-40.5m0-13.6v13.6-13.6c-13.5 0-27.1 4.6-39.3 13.3-12 8.6-21.8 20.6-28.4 34.8l-0.4 0.8c-0.2 0.4-0.4 0.8-0.5 1.2a90.4 90.4 0 0 0-6.1 20.2c-2.3 6.5-5.1 13.6-8.3 21.2-2.5 5.8-4.9 11.2-7.3 16.4l-1.2 2.5-2.8 5.9c-0.5 1.1-1.1 2.1-1.6 3.2-0.4 0.7-0.7 1.5-1.1 2.2-7.5 8.9-23.2 14-43.3 14-22.9 0-49.7-6.5-75.2-18.4-1.8-0.8-3.8-1.3-5.7-1.3a13.6 13.6 0 0 0-12.3 7.8l-22.8 49.1c-5.4 11.6-0.3 25.5 11.3 30.9L565.2 456l145.1 67.3c3.1 1.4 6.4 2.2 9.8 2.2 9 0 17.3-5.3 21.1-13.5l22.8-49.1c1.5-3.3 1.7-7 0.4-10.4-1.2-3.4-3.8-6.1-7.1-7.7-25.9-12-48.3-28.4-63.1-46.2-12.6-15.1-18.6-30.1-16.7-41.4 0.3-0.7 0.7-1.5 1-2.2 0.5-1.1 0.9-2.2 1.4-3.3l2.7-5.9 1.2-2.5c2.4-5.2 5-10.5 7.8-16.2 3.7-7.3 7.4-14 10.8-20a86.3 86.3 0 0 0 11.4-17.7l0.6-1.2 0.4-0.8c8.5-18.2 10.7-38.2 6.3-56.2-4.7-19.1-16.2-33.7-32.4-41.2-7.4-3.4-15.3-5.1-23.6-5.1z"
                  fill="#151B28"
                ></path>
                <path
                  d="M720 521.3c-2.8 0-5.4-0.6-8-1.8L421.9 384.8a18.9 18.9 0 0 1-9.2-25.1l22.8-49.1a9.28 9.28 0 0 1 12-4.7c0.1 0 0.2 0.1 0.3 0.1 26.1 12.1 53.5 18.8 77 18.8 21.7 0 38.7-5.8 46.9-15.9 0.4-0.9 0.9-1.8 1.3-2.6 0.5-1.1 1.1-2.1 1.6-3.2l2.8-5.9 1.2-2.6c2.4-5.3 4.9-10.7 7.4-16.6 3.2-7.7 6.1-15 8.5-21.7 1.2-6.7 3.2-13.4 6-19.7 0.1-0.3 0.2-0.7 0.4-1l0.4-0.8c12.8-27.7 37.9-45.6 63.8-45.6 7.6 0 14.9 1.6 21.7 4.7 15 7 25.6 20.6 30 38.3 4.2 17 2.1 36-6 53.3l-0.4 0.8c-0.1 0.3-0.3 0.6-0.5 0.9-3.1 6.2-6.8 12-11.2 17.3-3.5 6.1-7.3 13-11.1 20.6-2.9 5.7-5.5 11-7.9 16.3l-1.2 2.6-2.7 6c-0.5 1.1-2.2 5.1-2.6 6-4.7 24.9 24.5 66.1 82.2 92.8 2.2 1 4 2.9 4.8 5.2 0.8 2.3 0.7 4.9-0.3 7.1l-22.8 49.1c-3 6.8-9.7 11.1-17.1 11.1z"
                  fill="#FFFFFF"
                ></path>
                <path
                  d="M665.1 198.5c6.1 0 12.1 1.2 17.8 3.9 25.6 11.9 34.3 47.4 19.5 79.4l-0.4 0.8s-0.1 0.1-0.1 0.2c-3 6.2-6.6 11.7-10.8 16.6a491.43 491.43 0 0 0-19.9 38.3l-1.2 2.6-2.7 6.1c-1 2.4-2 4.6-3 6.9-7.2 32.5 29.6 77.3 87.2 104.1l-22.8 49.1a9.65 9.65 0 0 1-8.8 5.6c-1.4 0-2.7-0.3-4.1-0.9l-145.1-67.3-145.1-67.3a9.7 9.7 0 0 1-4.7-12.8l22.8-49.1c28.4 13.2 56.9 19.7 80.9 19.7 24.7 0 44.6-6.8 54.8-20.2 1.1-2.2 2.2-4.5 3.4-6.8l2.9-6 1.2-2.6c2.7-5.8 5.2-11.4 7.5-16.9 3.5-8.2 6.5-16 9-23 1.1-6.3 2.9-12.7 5.7-18.9v-0.2l0.4-0.8c11.8-25.1 34.2-40.5 55.6-40.5m0-18.5c-14.5 0-29.1 4.9-42.2 14.2-12.7 9.1-23.1 21.8-30 36.7l-0.4 0.8-0.6 1.5c-2.9 6.7-5 13.6-6.3 20.7a476.68 476.68 0 0 1-15.3 36.9l-1.2 2.5-2.8 5.8c-0.5 1.1-1.1 2.1-1.6 3.2-0.3 0.5-0.5 1.1-0.8 1.6-6.7 7.4-21.1 11.8-39.1 11.8-22.2 0-48.2-6.4-73.1-17.9-2.5-1.2-5.2-1.7-7.9-1.7-2.1 0-4.3 0.4-6.3 1.1-4.6 1.7-8.4 5.1-10.5 9.6l-22.8 49.1c-6.5 14.1-0.4 30.9 13.7 37.5L563 460.7 708.1 528a28.36 28.36 0 0 0 37.5-13.7l22.8-49.1a18.43 18.43 0 0 0-9.1-24.6c-50.5-23.5-80.1-60.7-77.1-81.8 0.2-0.6 0.5-1.1 0.7-1.7 0.5-1.1 0.9-2.2 1.4-3.2l2.6-5.8 1.2-2.5c2.4-5.2 4.9-10.4 7.8-16 3.6-7.1 7.1-13.6 10.5-19.4 4.6-5.6 8.5-11.7 11.7-18.2 0.3-0.5 0.5-0.9 0.7-1.4l0.4-0.8c8.9-19.3 11.3-40.4 6.6-59.4-5-20.3-17.8-36.5-35.1-44.5-8-4-16.6-5.9-25.6-5.9z"
                  fill="#151B28"
                ></path>
                <path
                  d="M666.4 418.6c-18.5-23.1-27-47.9-22.2-69.8l0.4-1.9 3.9-9.1 4-8.9c2.8-6 5.6-11.7 8.4-17.3 4.3-8.4 8.4-16 12.3-22.7l0.9-1.6 1.2-1.4c3.1-3.6 5.7-7.7 7.8-11.9l1.1-2.3c9-20.8 4.5-43.7-10.1-50.5-14.7-6.8-35.1 4.6-45.1 25l-0.9 2c-2 4.5-3.4 9.1-4.2 13.9l-0.3 1.8-0.6 1.7c-2.6 7.4-5.8 15.5-9.4 24.2-2.4 5.6-5 11.5-7.8 17.5l-1.3 2.8-3 6.3-4.2 8.6-1.2 1.5c-13.6 17.9-38.1 27.4-67.7 28.2l138 63.9z"
                  fill="#514DDF"
                ></path>
                <path
                  d="M664.4 268.1c-3.7 0-7.4-0.8-10.8-2.4-12.4-5.8-18.1-20.2-12.5-32.1 3.8-8.3 12.4-13.6 21.8-13.6 3.7 0 7.4 0.8 10.8 2.4 6 2.8 10.6 7.6 12.9 13.6 2.4 6.1 2.3 12.7-0.4 18.6a24.24 24.24 0 0 1-21.8 13.5z"
                  fill="#FFFFFF"
                ></path>
                <path
                  d="M662.9 226.7c2.6 0 5.4 0.6 8 1.8 9.1 4.2 13.2 14.6 9.2 23.1-2.8 6.1-9 9.7-15.7 9.7-2.6 0-5.4-0.6-8-1.8-9.1-4.2-13.2-14.6-9.2-23.1 2.8-6.1 9-9.7 15.7-9.7"
                  fill="#151B28"
                ></path>
                <path
                  d="M448.672 376.116l10.947-23.583 259.959 120.669-10.947 23.583z"
                  fill="#2AEFC8"
                ></path>
                <path
                  d="M459.6 343.1l259.9 120.7-11 23.6-259.8-120.7 10.9-23.6m0-11a11.2 11.2 0 0 0-10 6.4l-11 23.6c-2.6 5.5-0.2 12.1 5.4 14.7l260 120.6a10.92 10.92 0 0 0 8.4 0.3c2.7-1 5-3.1 6.2-5.7l11-23.6c2.6-5.5 0.2-12.1-5.4-14.7L464.3 333.1c-1.5-0.7-3.1-1-4.7-1zM537.6 673.5c-1.3 0-2.6-0.3-3.9-0.9a9.28 9.28 0 0 1-4.5-12.3l41.8-90c2.2-4.6 7.7-6.7 12.3-4.5 4.6 2.2 6.7 7.7 4.5 12.3l-41.8 90a9.17 9.17 0 0 1-8.4 5.4zM448.4 632.1c-1.3 0-2.6-0.3-3.9-0.9a9.28 9.28 0 0 1-4.5-12.3l16-34.4c2.2-4.6 7.7-6.7 12.3-4.5 4.6 2.2 6.7 7.7 4.5 12.3l-16 34.4a9.17 9.17 0 0 1-8.4 5.4z"
                  fill="#151B28"
                ></path>
              </g>
            </svg>
          </div>
        </>
      )}
    </div>
  );
};

export default WordGuess;

"use client";

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { GameContext } from "../context/context";
import picking_contn from "../../public/choose_rectangle.png";
import SubmitnInfo from "../components/SubmitnInfo";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

const WordSelection = (props) => {
  const {
    selectedWord,
    setSelectedWord,
    isChallenge,
    words,
    isPaintVisible,
    setIsPaintVisible,
  } = useContext(GameContext);

  const [options, setOptions] = useState([]);
  const router = useRouter()

  const handleWordSelect = (word) => {
    setSelectedWord(word);
  };

  const selectRandomWords = () => {
    const shuffledWords = words.sort(() => Math.random() - 0.5);
    return shuffledWords.slice(0, 3);
  };

  useEffect(() => {
    setOptions(selectRandomWords());
  }, []);

  const getNewOptions = () => {
    const optionsSet = new Set(options);
    const newOptions = [];
    const shuffledWords = words.sort(() => Math.random() - 0.5);
    for (const word of shuffledWords) {
      if (!optionsSet.has(word)) {
        newOptions.push(word);
      }
      if (newOptions.length === 3) {
        setOptions(newOptions);
        setSelectedWord("");
        break;
      }
    }
    return;
  };

  const handleStart = () => {
    if (selectedWord) {
      setIsPaintVisible(true);
    } else {
      alert("Please select a word first!");
    }
  };

  if (options === undefined) {
    return <>loading</>;
  }

  useEffect(() => {
    if (isPaintVisible) {
      router.push("/ChallengeCreation");
    }
  }, [isPaintVisible, router]);

  return (
    <div className={styles.App}>
      <div className={styles.wordSelectionPage}>
        <span className={styles.draww_text}>Draww</span>
        <div className={styles.WSP_head}>
          draw something and challenge your Friend to Guess!!
        </div>
        <div className={styles.picking_contn}>
          <Image
            className={styles.box}
            src={picking_contn}
            alt="container_box"
          />
          <div>
            <span>Choose a word to Draw</span>
            <div className={styles.wordsCont}>
              {options.map((word, index) => (
                <div
                  key={index}
                  className={`${word === selectedWord ? `${styles.wordSelDiv} ${styles.wordActive}` : styles.wordSelDiv}`}
                  onClick={() => handleWordSelect(word)}
                >
                  {word}
                </div>
              ))}
            </div>
            <div
              onClick={getNewOptions}
              className={styles.new_option_btn}
            >
              change options
            </div>
          </div>
        </div>
        <SubmitnInfo onSubmitClick={handleStart} />
      </div>
    </div>
  );
};

export default WordSelection;

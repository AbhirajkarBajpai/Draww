"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { GameContext } from "../../context/context";
import WordGuess from "../../components/WordGuess";
import SubmitnInfo from "../../components/SubmitnInfo";
import Modal from "../../components/Modal";
import styles from "./page.module.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRouter } from "next/navigation";

const ChallengePlaying = ({ params }) => {
  const {
    imgString,
    challengeTopic,
    videoURL,
    setIsChallenge,
    setChallengeId,
  } = useContext(GameContext);
  const [isWinner, setIsWinner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef(null);
  const router = useRouter();

  const handleVideoEnd = () => {
    const video = videoRef.current;
    if (video) {
      setTimeout(() => {
        video.play();
      }, 2000);
    }
  };

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setChallengeId(resolvedParams.id);
      setIsChallenge(true);
    };
    fetchParams();
  }, [params]);

  useEffect(() => {
    handleVideoEnd();
  }, [videoURL]);

  if (!challengeTopic)
    return (
      <div className={styles.cpSkeleton}>
        <Skeleton
          height={20}
          width='60vw'
          borderRadius={8}
          baseColor="rgba(73, 36, 186, 0.4)"
          highlightColor="rgba(73, 36, 186, 0.2)"
        />
        <Skeleton
          height={200}
          width='95vw'
          borderRadius={8}
          baseColor="rgba(73, 36, 186, 0.4)"
          highlightColor="rgba(73, 36, 186, 0.2)"
        />
        <Skeleton
          height={35}
          width="90vw"
          borderRadius={8}
          baseColor="rgba(73, 36, 186, 0.4)"
          highlightColor="rgba(73, 36, 186, 0.2)"
        />
        <Skeleton
          height={25}
          width="40vw"
          borderRadius={8}
          baseColor="rgba(73, 36, 186, 0.4)"
          highlightColor="rgba(73, 36, 186, 0.2)"
        />
      </div>
    );

  return (
    <div className={styles.challenge_Play_container}>
      <div className={styles.instr_P2}>Guess drawing!</div>
      <img
        src={imgString}
        alt="Challenge"
        className={styles.image}
      />
      <div className={styles.videoContainer}>
        <div className={styles.drawingBoard}></div>
        {videoURL && (
          <video
            ref={videoRef}
            src={videoURL}
            className={styles.video}
            autoPlay
            muted
            loop={false}
            onEnded={handleVideoEnd}
          />
        )}
      </div>
      {isWinner === null ? (
        <>
          <WordGuess
            word={challengeTopic}
            isWinner={isWinner}
            setIsWinner={setIsWinner}
          />
          <SubmitnInfo
            isGiveUp={true}
            onSubmitClick={() => {
              setShowModal(true);
            }}
          />
        </>
      ) : (
        <div className={styles.resultContainer}>
          <span className={styles.resultStatus}>
            Status:{" "}
            <strong style={{ color: isWinner ? "#123524" : "#ff356b" }}>
              {isWinner ? "Won" : "Lose"}
            </strong>
          </span>
          <div className={styles.createGameBtn} onClick={()=>router.push('/')}>
            Click here to Create Your Challenge
          </div>
        </div>
      )}
      <Modal
        showModal={showModal}
        onConfirm={setIsWinner}
        closeModal={() => setShowModal(false)}
      />
    </div>
  );
};

export default ChallengePlaying;

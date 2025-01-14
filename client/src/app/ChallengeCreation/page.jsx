"use client";
import React, { useRef, useState, useEffect, useContext } from "react";
import ColorPallet from "../../components/colorPallet";
import back_btn from "../../../public/bkSpace.png";
import styles from "./page.module.css";
import { GameContext } from "../../context/context";
import CanvaOption from "../../components/Canvaoption";
import SubmitnInfo from "../../components/SubmitnInfo";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Paint = () => {
  const {
    videoURL,
    setVideoURL,
    selectedWord,
    setImgString,
    isDrawn,
    setIsDrawn,
    playTime,
    setPlayTime,
    setIsPaintVisible,
    uploadFile,
    genActivityID,
    setGenActivityID,
  } = useContext(GameContext);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);
  const [recording, setRecording] = useState(false);
  const [isDrawingDone, setIsDrawingDone] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [history, setHistory] = useState([]);
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45);
  const [isPaintActive, setIsPaintActive] = useState(true);
  const drawStartTimeRef = useRef(0);
  const totalDrawTimeRef = useRef(0);
  const [colorBeforeErase, setColorBeforeErase] = useState("black");
  const [isPenSelected, setIsPenSelected] = useState(true);
  const [isFillSelected, setIsFillSelected] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState("");
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.86;
    canvas.height = window.innerHeight * 0.39;

    const context = canvas.getContext("2d", { willReadFrequently: true });

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    contextRef.current = context;
  }, []);

  useEffect(() => {
    if (!selectedWord) router.push("/");
    startRecording();
  }, []);

  useEffect(() => {
    if (!isPaintActive) return;

    if (timeRemaining === 0) {
      handleSeeSequence();
    } else {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, isPaintActive]);

  const handleBack = () => {
    setIsPaintVisible(false);
    setIsDrawn(false);
    router.push("/");
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prevHistory) => [...prevHistory, imageData]);
  };
  const undo = () => {
    if (history.length === 0) return;
    setHistory((prevHistory) => {
      const newHistory = prevHistory.slice(0, -1);

      if (newHistory.length > 0) {
        const previousState = newHistory[newHistory.length - 1];
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.putImageData(previousState, 0, 0);
      } else {
        clearCanvas();
      }
      return newHistory;
    });
  };

  const handleFillColor = (color) => {
    setIsFillSelected(true);
    setIsPenSelected(true);
    handleLineWidthChange(0);
  };

  const handleFill = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const selectedColor = color;
    const rgbColor = hexToRgb(selectedColor);

    // Pause the recording while flood filling
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      setIsRecordingPaused(true);
    }

    // Perform flood fill
    floodFill(ctx, Math.floor(x), Math.floor(y), rgbColor);

    // Resume recording after flood fill is complete
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      setIsRecordingPaused(false);
    }

    setTimeout(() => {
      finishDrawing();
    }, 1000);
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  const getPixelColor = (ctx, x, y) => {
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    return { r: pixel[0], g: pixel[1], b: pixel[2], a: pixel[3] };
  };

  const matchColor = (pixelColor, targetColor) => {
    return (
      pixelColor.r === targetColor.r &&
      pixelColor.g === targetColor.g &&
      pixelColor.b === targetColor.b &&
      pixelColor.a === targetColor.a
    );
  };

  const floodFill = (ctx, startX, startY, fillColor) => {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    const startColor = getPixelColor(ctx, startX, startY);

    const stack = [[startX, startY]];

    const { r: fr, g: fg, b: fb } = fillColor; 

    while (stack.length) {
      const [x, y] = stack.pop();

      if (x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) continue;

      const currentColor = getPixelColor(ctx, x, y);

      if (matchColor(currentColor, startColor)) {
        // Set new color using fillRect
        ctx.fillStyle = `rgb(${fr}, ${fg}, ${fb})`;
        ctx.fillRect(x, y, 1, 1);

        // Add neighboring pixels to stack
        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
      }
    }
  };


  const startDrawing = (event) => {
    setIsDrawn(true);
    const nativeEvent = event.nativeEvent;
    const { offsetX, offsetY } =
      nativeEvent.type === "touchstart"
        ? getTouchPos(nativeEvent)
        : nativeEvent;

    if (!recording) return;

    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    drawStartTimeRef.current = Date.now();

    // Resume recording if it was paused
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      setIsRecordingPaused(false);
    }
  };

  const draw = (event) => {
    if (!isDrawing) return;

    const nativeEvent = event.nativeEvent;

    const { offsetX, offsetY } =
      nativeEvent.type === "touchmove" ? getTouchPos(nativeEvent) : nativeEvent;

    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    saveToHistory();

    if (drawStartTimeRef.current) {
      const drawTime = Date.now() - drawStartTimeRef.current;
      totalDrawTimeRef.current += drawTime;
      setPlayTime(totalDrawTimeRef.current / 1000); 
    }

    // Pause the recording when drawing stops
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      setIsRecordingPaused(true);
    }
  };

  const getTouchPos = (touchEvent) => {
    const touch = touchEvent.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
    };
  };

  const handleErase = () => {
    if (isFillSelected) {
      setIsFillSelected(false);
    }
    if (isPenSelected && !isFillSelected) {
      console.log("color before", color);
      setColorBeforeErase(color);
      handleColorChange("white");
      setIsPenSelected(false);
    } else if (isPenSelected && isFillSelected) {
      handleColorChange("white");
      setIsPenSelected(false);
    } else {
      console.log("changing Width!!");
    }
  };

  const handleColorChange = (color) => {
    if (isPenSelected) {
      setColor(color);
      contextRef.current.strokeStyle = color;
    }
  };

  const handleSelectBrush = () => {
    if (isFillSelected) {
      setIsFillSelected(false);
      setTimeout(() => {
        setColor(colorBeforeErase);
        contextRef.current.strokeStyle = colorBeforeErase;
      }, 500);
    }
    if (isPenSelected) {
      setColor(color);
      contextRef.current.strokeStyle = color;
    } else {
      setIsPenSelected(true);
      console.log("setting color before");
      setColor(colorBeforeErase);
      contextRef.current.strokeStyle = colorBeforeErase;
    }
  };

  const handleLineWidthChange = (width) => {
    setLineWidth(width);
    contextRef.current.lineWidth = width;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    contextRef.current.fillStyle = "white";
    contextRef.current.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadImage = async () => {
    if (isDrawn === true) {
      const canvas = canvasRef.current;
      const image = canvas.toDataURL("image/png");
      const base64Drawing = image.split(",")[1];
      setImgString(base64Drawing);
      const blobtoRet = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });

      console.log("againMy Blob", blobtoRet);
      return blobtoRet;
    } else {
      console.log("You Haven't Drawn Anything!!!");
    }
  };

  const startRecording = () => {
    setRecording(true);
    const stream = canvasRef.current.captureStream(30);
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.start();

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      setIsRecordingPaused(true);
    }
  };

  const stopRecording = async () => {
    const imgUrlToSent = await downloadImage();
    setRecording(false);
    setIsDrawingDone(true);

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    // Disable drawing
    setIsDrawing(false);

    if (isDrawn === true) {
      mediaRecorderRef.current.onstop = async () => {
        const videoBlob = new Blob(chunksRef.current, {
          type: "video/webm; codecs=vp9",
        });

        console.log("one", videoBlob);

        const fastForwardedVideo = await createFastForwardedVideo(videoBlob);
        chunksRef.current = [];

        const randomimgfileName =
          "Draww" + Math.random().toString(36).substring(2, 10);
        const randomvdofileName =
          "Draww" + Math.random().toString(36).substring(2, 10);

        await uploadFile(fastForwardedVideo, randomvdofileName, "video/webm");
        await uploadFile(imgUrlToSent, randomimgfileName, "image/png");

        await sendDataToLocalAPI(randomvdofileName, randomimgfileName);
        console.log("success");
      };
    }
  };

  // Function to send S3 links and other data to local API
  const sendDataToLocalAPI = async (videoLocS3, imgLocS3) => {
    const Data = {
      type: "drawSomething",
      img: imgLocS3,
      vdo: videoLocS3,
      topic: selectedWord,
    };

    await fetch("http://localhost:5000/api/v1/challengeData/uploadChallengeData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data sent successfully to local API:", data);
        setGenActivityID(data.id);
      })
      .catch((error) => {
        console.error("Error sending data to local API:", error);
      });
  };

  // Utility function to convert a Blob to Base64
  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const createFastForwardedVideo = (videoBlob) => {
    return new Promise((resolve) => {
      const videoElement = document.createElement("video");
      videoElement.src = URL.createObjectURL(videoBlob);

      videoElement.onloadedmetadata = () => {
        const offscreenCanvas = document.createElement("canvas");
        const offscreenContext = offscreenCanvas.getContext("2d");
        offscreenCanvas.width = videoElement.videoWidth;
        offscreenCanvas.height = videoElement.videoHeight;

        const stream = offscreenCanvas.captureStream(30); // Capture at 30fps
        const fastForwardedRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm; codecs=vp9",
        });
        const fastForwardedChunks = [];

        fastForwardedRecorder.ondataavailable = (e) => {
          fastForwardedChunks.push(e.data);
        };

        fastForwardedRecorder.onstop = async () => {
          const fastForwardedBlob = new Blob(fastForwardedChunks, {
            type: "video/webm; codecs=vp9",
          });

          const fastForwardedBase64 = await convertBlobToBase64(
            fastForwardedBlob
          );
          setVideoURL(fastForwardedBase64);
          resolve(fastForwardedBlob);
        };

        let playbackRate = 1.0;
        console.log("finding duration", playTime);
        if (playTime > 10) {
          playbackRate = 2;
        } else if (playTime > 20) {
          playbackRate = 3;
        } else if (playTime > 30) {
          playbackRate = 4;
        }
        fastForwardedRecorder.start();
        videoElement.playbackRate = playbackRate;
        videoElement.play();
        videoElement.onplay = () => {
          const drawFrame = () => {
            offscreenContext.drawImage(videoElement, 0, 0);
            if (!videoElement.paused && !videoElement.ended) {
              requestAnimationFrame(drawFrame);
            } else {
              fastForwardedRecorder.stop();
            }
          };
          drawFrame();
        };
      };
    });
  };

  const downloadFastForwardedVideo = (fastForwardedVideoURL) => {
    console.log("url", fastForwardedVideoURL);
    const link = document.createElement("a");
    link.href = fastForwardedVideoURL;
    link.download = "YourDrawing.webm";
    link.click();
  };

  const handleSeeSequence = () => {
    stopRecording();
    setIsPaintActive(false);
  };

  const handleCopy = () => {
    const url = `http://localhost:3000/${genActivityID}`;
    navigator.clipboard
      .writeText(url)
      .then(() => setCopyFeedback("Copied!"))
      .catch(() => setCopyFeedback("Copy failed. Please try again."));
  };

  if (isDrawingDone) {
    if (!isDrawn) {
      return (
        <div className={styles.NoDrawCont}>
          <span>You Haven't Drawn Anything!!</span>
          <div
            className={styles.playAgain}
            onClick={() => {
              router.push("/");
            }}
          >
            {" "}
            click here to play Again{" "}
          </div>
        </div>
      );
    }

    return (
      <div className={styles.AfterDrawn}>
        <span>{selectedWord} drawn!</span>
        {videoURL ? (
          <div className={styles.watchingSeq}>
            <video
              src={videoURL}
              controls
              autoPlay
              loop
              className={styles.drawnVdo}
            />
            <strong>Copy and send Below Link To challenge Your Friend!</strong>
            <div className={styles.copyBox}>
              {genActivityID ? (
                <div className={styles.copyText}>
                  {`http://localhost:3000/${genActivityID}`}
                </div>
              ) : (
                <>wait generating Link</>
              )}
              <button className={styles.copyButton} onClick={handleCopy}>
                Copy
              </button>
              {copyFeedback && (
                <div className={styles.copyFeedback}>{copyFeedback}</div>
              )}
            </div>
            <div
              className={styles.playAgain}
              onClick={() => {
                router.push("/");
              }}
            >
              {" "}
              click here to play Again{" "}
            </div>
          </div>
        ) : (
          <div className={styles.afterAnalysis}>
            <span>Analyzing Drawing</span>
            <span>Organizing Sequence</span>
            <div className={styles.loaderContainer}>
              <div className={styles.loader}></div>
            </div>
            <span>Hold Tight! creating Your Challenge..</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.CreationLanding}>
      <Image
        onClick={handleBack}
        className={styles.bck_btn}
        src={back_btn}
        alt="back"
      />
      <div className={styles.timerComp}>
        <span>Time Left: </span>
        <span> {timeRemaining} sec</span>
      </div>
      <div className={styles.greet_creation}>
        Draw <span>{selectedWord}</span>
      </div>
      <div className={styles.draw_Board_wrapper}>
        <div className={styles.drawingBoard}></div>
        <canvas
          ref={canvasRef}
          // onMouseDown={startDrawing}
          onMouseDown={isFillSelected ? null : startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          onMouseLeave={finishDrawing}
          onTouchStart={isFillSelected ? null : startDrawing}
          onTouchEnd={finishDrawing}
          onTouchMove={draw}
          onTouchCancel={finishDrawing}
          onClick={isFillSelected ? handleFill : null}
          className={styles.canvas}
        />
      </div>
      <ColorPallet onChangeColor={handleColorChange} selColor={color} />
      <CanvaOption
        onErase={handleErase}
        onSelectBrush={handleSelectBrush}
        onClear={clearCanvas}
        onUndo={undo}
        onFill={handleFillColor}
        setWidth={handleLineWidthChange}
        width={lineWidth}
        isPenSelected={isPenSelected}
        isFillSelected={isFillSelected}
      />
      <SubmitnInfo onSubmitClick={handleSeeSequence} />
    </div>
  );
};

export default Paint;

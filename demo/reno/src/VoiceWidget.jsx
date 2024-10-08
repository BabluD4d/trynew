import { useState, useEffect } from "react";
import { useRhino } from "@picovoice/rhino-react";

import rhinoModel from "./lib/rhinoModel";
import rhinoContext from "./lib/rhinoContext";
import Renoimg from "./img/reno.gif"
export default function VoiceWidget() {
  const [accessKey, setAccessKey] = useState("9EXkduRw4yjnEXOHk8pp0MI+r53/sisWFsWhNxoQuzdbU8d2RXblWg==");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wrongWordIndex, setwrongWordIndex] = useState([]);
  const [wrongWord, setwrongWord] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [spokenText, setSpokenText] = useState("");
  const [showImg, setshowImg] = useState(false);
  const paragraph = ["americano","cappuccino","coffee","espresso","latte","mocha"]
  const words = paragraph;
  const currentWord = words[currentWordIndex] || "";

  const {
    inference,
    contextInfo,
    isLoaded,
    isListening,
    error,
    init,
    process,
    release,
  } = useRhino();

  useEffect(() => {
    if (inference) {
      const spokenWord = inference.intent; // Adjust this based on your inference result
      console.log("Inference received:", inference); // Log the entire inference object
      const spokenWord1 = inference.intent || inference.transcript || ""; // Adjust this based on the actual inference structure
      console.log("Spoken Word:", spokenWord1);
      setSpokenText(prev => `${prev} ${spokenWord}`);
      if (spokenWord === currentWord) {
        setCurrentWordIndex(prevIndex => prevIndex + 1);
        setAttempts(0);
        setWordCount(0)
      } else {
        if (inference?.slots?.beverage == currentWord) {
          if (currentWord) {
            setWordCount(0)
            setCurrentWordIndex(prevIndex => prevIndex + 1)
            rhnProcess()
          }
        } else {
          if (wordCount == 2) {
            setWordCount(0)
            wrongWordIndex.push(currentWordIndex)
            setwrongWordIndex(wrongWordIndex)
            wrongWord.push(currentWord)
            setCurrentWordIndex(prevIndex => prevIndex + 1)
            if (currentWord) {
              rhnProcess()
            }
          } else {
            if (currentWord) {
              rhnProcess()
              // setwrongWordIndex([])
              setWordCount(prevIndex => prevIndex + 1)
            }
            else{
              // setWordCount(0)
              // setwrongWordIndex([])
              setshowImg(true)
              rhnInit()
            }
          }
        }
        // setAttempts(prevAttempts => prevAttempts + 1);
        // if (attempts >= 1) {
        //   setCurrentWordIndex(prevIndex => prevIndex + 1);
        //   setAttempts(0);
        // }
      }
      console.log({currentWord})
    }
  }, [inference, attempts, currentWord]);

  const rhnInit = async () => {
    try {
      await init(accessKey, rhinoContext, rhinoModel);
    } catch (err) {
      console.error('Error initializing Rhino:', err);
    }
  };

  const rhnProcess = async () => {
    try {
      await process();
    } catch (err) {
      console.error('Error processing audio:', err);
    }
  };

  const rhnRelease = async () => {
    try {
      setCurrentWordIndex(0)
      setWordCount(0)
      setwrongWordIndex([])
      await release();
    } catch (err) {
      console.error('Error releasing resources:', err);
    }
  };
const rest=()=>{
  window.location.reload()
  // setshowImg(false)
  // rhnRelease()
}
  return (
    <>
    <div className="voice-widget" style={{position:"relative",}}>
      {!showImg?
      <>
      <h2>VoiceWidget</h2>
      <h3>
        {/* <label>
          AccessKey obtained from{" "}
          <a href="https://console.picovoice.ai/">Picovoice Console</a>:
          <input
            type="text"
            name="accessKey"
            onChange={(e) => setAccessKey(e.target.value)}
            disabled={isLoaded}
          />
        </label> */}
        <button className="start-button" onClick={rhnInit} disabled={isLoaded || accessKey.length === 0}>
          Init Rhino
        </button>
      </h3>
      <h3>Rhino Loaded: {JSON.stringify(isLoaded)}</h3>
      <h3>Listening: {JSON.stringify(isListening)}</h3>
      <h3>Error: {JSON.stringify(error !== null)}</h3>
      {error && accessKey && (
        <p className="error-message">{error.message}</p>
      )}
      {console.log({ wrongWordIndex })}
      <br />
      <button
        onClick={rhnProcess}
        disabled={error !== null || !isLoaded || isListening}
      >
        Process
      </button>
      <button
        onClick={rhnRelease}
        disabled={error !== null || !isLoaded || isListening}
      >
        Release
      </button>

      {/* <h3>Spoken Text:</h3>
      <pre>{spokenText}</pre> Display the spoken text */}

      <h3>Current Word:</h3>
      <p>{currentWord}</p>
      {/* <h3>Inference:</h3>
      {inference && <pre>{JSON.stringify(inference, null, 2)}</pre>}
      <hr /> */}
      {/* <h3>Context Info:</h3>
      <pre>{contextInfo}</pre> */}

      <h3>Paragraph Status:</h3>
      <p>
        {words.map((word, index) => (
          <span
            key={index}
            style={{
              backgroundColor:
                (index === currentWordIndex
                  ? 'lightblue' : wrongWordIndex.includes(index) ? "red"
                    : index < currentWordIndex
                      ? 'lightgreen'
                      : 'transparent'),color: (index === currentWordIndex
                        ? 'black' : wrongWordIndex.includes(index) ? "white"
                          : index < currentWordIndex
                            ? 'black'
                            : 'black')
            }}
          >
            {word}{' '}
          </span>
        ))}
      </p>
      </>:
      <div style={{position:"relative",justifyContent:"center",alignItems:"center", textAlign:"center"}}>
        
        <img  src={Renoimg}/>
        <div style={{marginBlock:"15px"}}>
        {words.map((word, index) => (
          <span
          key={index}
          style={{
            backgroundColor:
                      (index === currentWordIndex
                        ? 'lightblue' : wrongWordIndex.includes(index) ? "red"
                          : index < currentWordIndex
                            ? 'lightgreen'
                            : 'transparent'), color: (index === currentWordIndex
                              ? 'black' : wrongWordIndex.includes(index) ? "white"
                                : index < currentWordIndex
                                  ? 'black'
                                  : 'black')
                  }}
                  >
                  {word}{' '}
                </span>
              ))}
                    </div>
                  <div>
      <button style={{fontSize:"16px",fontWeight:"bold",borderRadius:"30px",borderWidth:"0",
        marginTop:"15px",padding:"10px 32px"
      }} onClick={()=>{rest(false)}}>Reset</button>
      </div>
      </div>
      }
    </div>
    </>
  );
}

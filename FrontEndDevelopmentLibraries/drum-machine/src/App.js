import "./App.scss";
import React, { useEffect, useState, useRef } from "react";
import RangeSlider from "react-bootstrap-range-slider";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCarrot } from "@fortawesome/free-solid-svg-icons";

const bankOne = [
  {
    keyCode: 81,
    keyTrigger: "Q",
    id: "Heater-1",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
  },
  {
    keyCode: 87,
    keyTrigger: "W",
    id: "Heater-2",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
  },
  {
    keyCode: 69,
    keyTrigger: "E",
    id: "Heater-3",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
  },
  {
    keyCode: 65,
    keyTrigger: "A",
    id: "Heater-4",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
  },
  {
    keyCode: 83,
    keyTrigger: "S",
    id: "Clap",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
  },
  {
    keyCode: 68,
    keyTrigger: "D",
    id: "Open-HH",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
  },
  {
    keyCode: 90,
    keyTrigger: "Z",
    id: "Kick-n'-Hat",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
  },
  {
    keyCode: 88,
    keyTrigger: "X",
    id: "Kick",
    url: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
  },
  {
    keyCode: 67,
    keyTrigger: "C",
    id: "Closed-HH",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3",
  },
];

const bankTwo = [
  {
    keyCode: 81,
    keyTrigger: "Q",
    id: "Chord-1",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3",
  },
  {
    keyCode: 87,
    keyTrigger: "W",
    id: "Chord-2",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3",
  },
  {
    keyCode: 69,
    keyTrigger: "E",
    id: "Chord-3",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3",
  },
  {
    keyCode: 65,
    keyTrigger: "A",
    id: "Shaker",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3",
  },
  {
    keyCode: 83,
    keyTrigger: "S",
    id: "Open-HH",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3",
  },
  {
    keyCode: 68,
    keyTrigger: "D",
    id: "Closed-HH",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3",
  },
  {
    keyCode: 90,
    keyTrigger: "Z",
    id: "Punchy-Kick",
    url: "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3",
  },
  {
    keyCode: 88,
    keyTrigger: "X",
    id: "Side-Stick",
    url: "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3",
  },
  {
    keyCode: 67,
    keyTrigger: "C",
    id: "Snare",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3",
  },
];

const activeStyle = {
  backgroundColor: "#0d6efd",
  boxShadow: "0 3px #0d6efd",
  height: 77,
  marginTop: 13,
};

const inactiveStyle = {
  backgroundColor: "#2c7ff8",
  marginTop: 10,
  boxShadow: "3px 3px 5px black",
};

function DrumPad(props) {
  const [padStyle, setPadStyle] = useState(inactiveStyle);

  const padStyleRef = useRef(padStyle);

  function activatePad() {
    if (props.power) {
      if (padStyleRef.current.backgroundColor === "#0d6efd") {
        padStyleRef.current = inactiveStyle;
        setPadStyle(padStyleRef.current);
      } else {
        padStyleRef.current = activeStyle;
        setPadStyle(padStyleRef.current);
      }
    } else if (padStyle.marginTop === 13) {
      padStyleRef.current = inactiveStyle;
      setPadStyle(padStyleRef.current);
    } else {
      padStyleRef.current = {
        height: 77,
        marginTop: 13,
        backgroundColor: "#2c7ff8",
        boxShadow: "0 3px #2c7ff8",
      };
      setPadStyle(padStyleRef.current);
    }
  }

  function playSound() {
    const sound = document.getElementById(props.keyTrigger);
    sound.currentTime = 0;
    sound.play();
    activatePad();
    setTimeout(() => {
      activatePad();
    }, 100);
    props.updateDisplay(props.clipId.replace(/-/g, " "));
  }

  function handleKeyPress(e) {
    if (e.keyCode === props.keyCode) {
      playSound();
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  });

  return (
    <div
      className="drum-pad"
      id={props.clipId}
      onClick={playSound}
      style={padStyleRef.current}
    >
      <audio className="clip" id={props.keyTrigger} src={props.clip} />
      {props.keyTrigger}
    </div>
  );
}

function PadBank(props) {
  let padBank;

  if (props.power) {
    padBank = props.currentPadBank.map((drumObj, i, padBankArr) => {
      return (
        <DrumPad
          clip={padBankArr[i].url}
          clipId={padBankArr[i].id}
          keyCode={padBankArr[i].keyCode}
          keyTrigger={padBankArr[i].keyTrigger}
          power={props.power}
          updateDisplay={props.updateDisplay}
        />
      );
    });
  } else {
    padBank = props.currentPadBank.map((drumObj, i, padBankArr) => {
      return (
        <DrumPad
          clip="#"
          clipId={padBankArr[i].id}
          keyCode={padBankArr[i].keyCode}
          keyTrigger={padBankArr[i].keyTrigger}
          updateDisplay={props.updateDisplay}
          power={props.power}
        />
      );
    });
  }

  return <div className="pad-bank">{padBank}</div>;
}

function App() {
  const [power, setPower] = useState(true);
  const [display, setDisplay] = useState(String.fromCharCode(160));
  const [currentPadBank, setCurrentPadBank] = useState([...bankOne]);
  const [currentPadBankId, setCurrentPadBankId] = useState("Heater Kit");
  const [sliderVal, setSliderVal] = useState(0.3);

  function powerControl() {
    setPower(!power);
    setDisplay(String.fromCharCode(160));
  }

  function selectBank() {
    if (power) {
      if (currentPadBankId === "Heater Kit") {
        setCurrentPadBank([...bankTwo]);
        setDisplay("Smooth Piano Kit");
        setCurrentPadBankId("Smooth Piano Kit");
      } else {
        setCurrentPadBank([...bankOne]);
        setDisplay("HeaterKit");
        setCurrentPadBankId("Heater Kit");
      }
    }
  }

  function displayClipName(name) {
    if (power) {
      setDisplay(name);
    }
  }

  function adjustVolume(e) {
    if (power) {
      setSliderVal(e.target.value);
      setDisplay("Volume: " + Math.round(e.target.value * 100));
      setTimeout(() => clearDisplay(), 1000);
    }
  }

  function clearDisplay() {
    setDisplay(String.fromCharCode(160));
  }

  useEffect(() => {
    const clips = [].slice.call(document.getElementsByClassName("clip"));

    clips.forEach((sound) => {
      sound.volume = sliderVal;
    });
  });

  return (
    <div className="inner-container" id="drum-machine">
      <div className="logo">
        <div className="inner-logo ">
          {"Drum Machine" + String.fromCharCode(160)}
        </div>
        <FontAwesomeIcon icon={faCarrot} />
      </div>
      <div className="controls-container">
        <div className="control">
          <div className="select">
            <BootstrapSwitchButton onChange={powerControl} checked={power} />
          </div>
        </div>
        <p id="display">{display}</p>
        <div className="volume-slider">
          <RangeSlider
            value={sliderVal}
            onChange={adjustVolume}
            max="1"
            min="0"
            step="0.01"
            tooltip="off"
          />
        </div>
        <div className="select-bank">
          <BootstrapSwitchButton
            onlabel="Heater Kit"
            onstyle="primary"
            offlabel="Smooth Piano Kit"
            offstyle="success"
            onChange={selectBank}
            checked={true}
            style="w-100"
          />
        </div>
      </div>
      <PadBank
        clipVolume={sliderVal}
        currentPadBank={currentPadBank}
        power={power}
        updateDisplay={displayClipName}
      />
    </div>
  );
}

export default App;

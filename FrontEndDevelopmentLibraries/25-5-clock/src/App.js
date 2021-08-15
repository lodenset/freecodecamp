import "./App.scss";
import { Container, Row, Col, Button, ProgressBar } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faHistory,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  const audioElement = React.useRef(null);
  const [intervalId, SetIntervalId] = useState(null);
  const [sessionTime, SetSessionTime] = useState(25 * 60);
  const [breakTime, SetBreakTime] = useState(5 * 60);
  const [displayTime, SetDisplayTime] = useState(25 * 60);
  const [timerOnBreak, SetTimerOnBreak] = useState(false);

  useEffect(() => {
    SetDisplayTime(sessionTime);
  }, [sessionTime]);

  useEffect(() => {
    if (displayTime === 0) {
      audioElement.current.currentTime = 0;
      audioElement.current.play();
      if (!timerOnBreak) {
        SetTimerOnBreak(true);
        SetDisplayTime(breakTime);
      } else if (timerOnBreak) {
        SetTimerOnBreak(false);
        SetDisplayTime(sessionTime);
      }
    }
  }, [displayTime, timerOnBreak, breakTime, sessionTime]);

  const StartStopTimer = () => {
    if (intervalId === null) {
      const interval = setInterval(() => {
        SetDisplayTime((previousdisplayTime) => previousdisplayTime - 1);
      }, 1000);
      SetIntervalId(interval);
    } else {
      clearInterval(intervalId);
      SetIntervalId(null);
    }
  };

  function DecBreak() {
    SetBreakTime(breakTime <= 60 ? breakTime : breakTime - 60);
  }

  function IncBreak() {
    SetBreakTime(breakTime >= 60 * 60 ? breakTime : breakTime + 60);
  }

  function DecSession() {
    SetSessionTime(sessionTime <= 60 ? sessionTime : sessionTime - 60);
  }

  function IncSession() {
    SetSessionTime(sessionTime >= 60 * 60 ? sessionTime : sessionTime + 60);
  }

  function Reset() {
    audioElement.current.pause();
    audioElement.current.currentTime = 0;
    clearInterval(intervalId);
    SetIntervalId(null);
    SetBreakTime(5 * 60);
    SetSessionTime(25 * 60);
    SetTimerOnBreak(false);
    SetDisplayTime(25 * 60);
  }

  function secondsToTime(sec) {
    let m = Math.floor(sec / 60)
        .toString()
        .padStart(2, "0"),
      s = Math.floor(sec % 60)
        .toString()
        .padStart(2, "0");

    return m + ":" + s;
  }

  return (
    <div className="container">
      <Container className="text-center">
        <Row>
          <Col className="pomodoro-title">POMODORO</Col>
        </Row>
        <Row className="prgs-bar mb-3">
          <ProgressBar
            variant="info"
            now={displayTime}
            max={timerOnBreak ? breakTime : sessionTime}
            min={0}
          />
        </Row>
        <Row className="time-row">
          <Col>
            <Row>
              <label id="timer-label">
                {timerOnBreak ? "Break" : "Session"}
              </label>
            </Row>
            <Row>
              <label id="time-left">{secondsToTime(displayTime)}</label>
            </Row>
          </Col>
        </Row>
        <Row className="mb-3 align-items-center">
          <Col>
            <Button size="lg" id="session-increment" onClick={IncSession}>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </Col>
          <Col xs={3} md={3}>
            <Row>
              <label id="session-label">Session</label>
            </Row>
            <Row>
              <label id="session-length">{sessionTime / 60}</label>
            </Row>
          </Col>
          <Col>
            <Button size="lg" id="session-decrement" onClick={DecSession}>
              <FontAwesomeIcon icon={faMinus} />
            </Button>
          </Col>
        </Row>
        <Row className="mb-3 align-items-center">
          <Col>
            <Button size="lg" id="break-increment" onClick={IncBreak}>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </Col>
          <Col xs={3} md={3}>
            <Row>
              <label id="break-label">Break</label>
            </Row>
            <Row>
              <label id="break-length">{breakTime / 60}</label>
            </Row>
          </Col>
          <Col>
            <Button size="lg" id="break-decrement" onClick={DecBreak}>
              <FontAwesomeIcon icon={faMinus} />
            </Button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs>
            <Button
              className="mx-4"
              size="lg"
              id="start_stop"
              onClick={StartStopTimer}
            >
              <FontAwesomeIcon icon={faPlay} />
            </Button>
            <Button className="mx-4" size="lg" id="reset" onClick={Reset}>
              <FontAwesomeIcon icon={faHistory} />
            </Button>
          </Col>
        </Row>
      </Container>
      <audio
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        id="beep"
        ref={audioElement}
      ></audio>
    </div>
  );
}

export default App;

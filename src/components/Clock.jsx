import { IoMdArrowRoundDown, IoMdArrowRoundUp } from "react-icons/io";
import { FaPlay, FaPause } from "react-icons/fa";
import { TbRefresh } from "react-icons/tb";
import React, { useState, useEffect, useRef } from "react";

const Clock = () => {
    const [breakLength, setBreakLength] = useState(5);
    const [sessionLength, setSessionLength] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isSession, setIsSession] = useState(true);
    const timerRef = useRef(null);

    // Cargar desde localStorage solo el estado del temporizador
    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem("pomodoroState"));
        if (savedState) {
            setIsRunning(savedState.isRunning);
            setIsSession(savedState.isSession);

            if (savedState.isRunning && savedState.lastUpdated) {
                const elapsed = Math.floor((Date.now() - savedState.lastUpdated) / 1000);
                const updatedTimeLeft = savedState.timeLeft - elapsed;
                setTimeLeft(updatedTimeLeft > 0 ? updatedTimeLeft : 0);
            } else {
                setTimeLeft(savedState.timeLeft || sessionLength * 60);
            }
        } else {
            setTimeLeft(sessionLength * 60);
        }
    }, [sessionLength]);

    // Guardar solo los datos de ejecución y temporizador
    useEffect(() => {
        localStorage.setItem("pomodoroState", JSON.stringify({
            timeLeft,
            isRunning,
            isSession,
            lastUpdated: Date.now()
        }));
    }, [timeLeft, isRunning, isSession]);

    const formatTime = (time) => {
        const minutes = String(Math.floor(time / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const handleReset = () => {
        clearInterval(timerRef.current);
        setBreakLength(5);
        setSessionLength(25);
        setTimeLeft(25 * 60);
        setIsRunning(false);
        setIsSession(true);
        localStorage.removeItem("pomodoroState");
        const beep = document.getElementById("beep");
        if (beep) {
            beep.pause();
            beep.currentTime = 0;
        }
    };

    const handleIncrement = (type) => {
        if (isRunning) return;
        if (type === "break" && breakLength < 60) setBreakLength(breakLength + 1);
        if (type === "session" && sessionLength < 60) {
            const newVal = sessionLength + 1;
            setSessionLength(newVal);
            setTimeLeft(newVal * 60);
        }
    };

    const handleDecrement = (type) => {
        if (isRunning) return;
        if (type === "break" && breakLength > 1) setBreakLength(breakLength - 1);
        if (type === "session" && sessionLength > 1) {
            const newVal = sessionLength - 1;
            setSessionLength(newVal);
            setTimeLeft(newVal * 60);
        }
    };

    const toggleTimer = () => {
        setIsRunning((prev) => {
            const newRunning = !prev;
            if (newRunning) {
                localStorage.setItem("pomodoroState", JSON.stringify({
                    timeLeft,
                    isRunning: true,
                    isSession,
                    lastUpdated: Date.now()
                }));
            }
            return newRunning;
        });
    };

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 0) {
                        const beep = document.getElementById("beep");
                        if (beep) beep.play();

                        const nextTime = isSession ? breakLength * 60 : sessionLength * 60;
                        setIsSession((prevSession) => !prevSession);

                        localStorage.setItem("pomodoroState", JSON.stringify({
                            timeLeft: nextTime,
                            isRunning: true,
                            isSession: !isSession,
                            lastUpdated: Date.now()
                        }));

                        return nextTime;
                    }

                    const updated = prev - 1;
                    localStorage.setItem("pomodoroState", JSON.stringify({
                        timeLeft: updated,
                        isRunning: true,
                        isSession,
                        lastUpdated: Date.now()
                    }));

                    return updated;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [isRunning, isSession, breakLength, sessionLength]);

    return (
        <div className="clock-container">
            <div className="main-title">25 + 5 Clock</div>
            <div className="length-control-container">
                <div className="length-control">
                    <span id="break-label">Break Length</span>
                    <div className="bs-length">
                        <span id="break-decrement" onClick={() => handleDecrement("break")}>
                            <IoMdArrowRoundDown />
                        </span>
                        <span id="break-length">{breakLength}</span>
                        <span id="break-increment" onClick={() => handleIncrement("break")}>
                            <IoMdArrowRoundUp />
                        </span>
                    </div>
                </div>
                <div className="length-control">
                    <span id="session-label">Session Length</span>
                    <div className="bs-length">
                        <span id="session-decrement" onClick={() => handleDecrement("session")}>
                            <IoMdArrowRoundDown />
                        </span>
                        <span id="session-length">{sessionLength}</span>
                        <span id="session-increment" onClick={() => handleIncrement("session")}>
                            <IoMdArrowRoundUp />
                        </span>
                    </div>
                </div>
            </div>

            <div className="timer">
                <div className="timer-wrapper">
                    <div className="timer-label" id="timer-label">
                        {isSession ? "Session" : "Break"}
                    </div>
                    <div className="timer-left" id="time-left">
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </div>

            <div className="timer-control">
                <span id="start_stop" onClick={toggleTimer}>
                    <FaPlay size={25} /> <FaPause size={25} />
                </span>
                <span id="reset" onClick={handleReset}>
                    <TbRefresh size={25} />
                </span>
            </div>

            <audio
                id="beep"
                src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
                preload="auto"
            ></audio>
        </div>
    );
};

export default Clock;

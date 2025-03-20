import React, { useState, useEffect } from 'react';

const TimerCountdown = () => {
  const [time, setTime] = useState(30);
  const [phase, setPhase] = useState('initial'); // "initial" for 30 sec, "loop" for 5 sec loop

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        if (prev === 1) {
          if (phase === 'initial') {
            setPhase('loop');
            return 5; // reset to 5 for loop phase
          } else {
            return 5; // reset loop countdown
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  return <span>{time}s</span>;
};

export default TimerCountdown;

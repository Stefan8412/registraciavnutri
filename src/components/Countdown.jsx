import { useState, useEffect } from "react";

const CountdownTimer = () => {
  const targetDate = new Date("2025-05-05T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const difference = targetDate - Date.now();
      setTimeLeft(difference);

      if (difference <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const formatTime = (ms) => {
    if (ms <= 0) return "Čas vypršal!";

    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${days} dní: ${hours} hod: ${minutes} min: ${seconds} sek`;
  };

  return (
    <>
      <p className="mt-2 font-semibold text-black text-center">
        už o {formatTime(timeLeft)}
      </p>
    </>
  );
};

export default CountdownTimer;

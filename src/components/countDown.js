import { useEffect, useState } from 'react';

export default function Counter(props) {

  const useCountdown = () => {
    const countDownDate = new Date(props.timestamp * 1000).getTime();

    const [countDown, setCountDown] = useState(
      countDownDate - new Date().getTime() > 0 ? countDownDate - new Date().getTime() : 0
    );

    useEffect(() => {
      const interval = setInterval(() => {
        const current = countDownDate - new Date().getTime();
        if (current > 0) {
          setCountDown(current);
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [countDownDate]);

    return getReturnValues(countDown);
  };

  const getReturnValues = (countDown) => {
    // calculate time left
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return [days, hours, minutes, seconds];
  };

  const [days, hours, minutes, seconds] = useCountdown();

  return (
    <div className="row" style={{ width: "518px", marginLeft: "137px" }}>
      <div className="col offset-xl-0" style={{ width: "723px", height: "39px" }}>
        <div className="card" style={{ width: "30px", height: "25px", marginLeft: "163px", marginTop: "0px", marginRight: "-29px" }}>
          <p>&nbsp;{days < 10 ? "0" : ""}{days}</p>
        </div>
      </div>
      <div className="col">
        <div className="card" style={{ height: "25px", width: "30px", marginLeft: "29px" }}>
          <p>&nbsp;{hours < 10 ? "0" : ""}{hours}</p>
        </div>
      </div>
      <div className="col">
        <div className="card" style={{ height: "25px", width: "30px", marginLeft: "-27px", marginBottom: "0px" }}>
          <p>&nbsp;{minutes < 10 ? "0" : ""}{minutes}</p>
        </div>
      </div>
      <div className="col" style={{ width: "24.5px" }}>
        <div className="card" style={{ width: "30px", height: "25px", marginLeft: "-86px" }}>
          <p>&nbsp;{seconds < 10 ? "0" : ""}{seconds}</p>
        </div>
      </div>
    </div >
  );
}
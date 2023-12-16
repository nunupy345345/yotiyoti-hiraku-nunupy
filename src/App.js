import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import GoogleMapReact from 'google-map-react';

const defaultLatLng = {
  lat: 35.1571167,
  lng: 136.9708042,
};

/* エラーテキスト */
const ErrorText = () => (
  <p className="App-error-text">geolocation IS NOT available</p>
);

const Correct = (lati,long) => {
  if (lati === null || long === null) {
    return false;
  }
  let lati_gap = Math.abs(lati-defaultLatLng.lat);
  let long_gap = Math.abs(long-defaultLatLng.lng);
  let result = false;
  
  if ((lati_gap < 1) && (long_gap < 1)) {
      result = true;
  }
  return result;
}


export default () => {
  const [isAvailable, setAvailable] = useState(false);
  const [position, setPosition] = useState({ latitude: null, longitude: null });

  // useEffectが実行されているかどうかを判定するために用意しています
  const isFirstRef = useRef(true);

  /*
   * ページ描画時にGeolocation APIが使えるかどうかをチェックしています
   * もし使えなければその旨のエラーメッセージを表示させます
   */
  useEffect(() => {
    isFirstRef.current = false;
    if ('geolocation' in navigator) {
      setAvailable(true);
    }
  }, [isAvailable]);

  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setPosition({ latitude, longitude });
    });
  };

  const CheckAnswer = () =>{
    let answer = "不正解"
    if (position.latitude === null || position.longitude === null){
      answer = ""
    }
    if (Correct(position.latitude,position.longitude)){
      answer = "正解"
    }
    return answer;
  };
  // useEffect実行前であれば、"Loading..."という呼び出しを表示させます
  if (isFirstRef.current) return <div className="App">Loading...</div>;
  console.log(process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY)
  return (
    <div className="App">
      <p>Geolocation API Sample</p>
      {!isFirstRef && !isAvailable && <ErrorText />}
      {isAvailable && (
        <div>
          <button onClick={getCurrentPosition}>Get Current Position</button>
          <div>
            latitude: {position.latitude}
            <br />
            longitude: {position.longitude}
          </div>
          <h3>{CheckAnswer()}</h3>
        </div>
      )}
      <div style={{ height: '300px', width: '300px' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAP_KEY }}
        defaultCenter={defaultLatLng}
        defaultZoom={16}
      />
    </div>
    </div>
  );
};

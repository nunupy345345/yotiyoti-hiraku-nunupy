import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import GoogleMapReact from 'google-map-react';
import data from "./jct.json"

// const fs = require('fs');
// const json = fs.readFileSync("./jct.json","utf-8");
// const data = JSON.parse("")
console.log(data.JCT)

/* エラーテキスト */
const ErrorText = () => (
  <p className="App-error-text">geolocation IS NOT available</p>
);



export default () => {
  const [isAvailable, setAvailable] = useState(false);
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [jct, setJct] = useState(data.JCT[0]);
  const [marker, setMarker] = useState(null);

  // useEffectが実行されているかどうかを判定するために用意しています
  const isFirstRef = useRef(true);
  const aichi_jct = useRef(0)
  // console.log(data.JCT[aichi_jct.current.value])
  // console.log(jct)

  const defaultLatLng = {
    lat: jct.lat,
    lng: jct.lng,
  };
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

  const Correct = (lati,long) => {
    if (lati === null || long === null) {
      return false;
    }
    let lat_gap = Math.abs(lati-jct.lat);
    let lng_gap = Math.abs(long-jct.lng);
    let result = false;
    
    if ((lat_gap < 0.001) && (lng_gap < 0.001)) {
        result = true;
    }
    return result;
  }

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

  const handleApiLoaded = ({ map, maps }) => {
    if (position.latitude !== null && position.longitude !== null){
      console.log(position.latitude)
      new maps.Marker({
        map,
        position: {
          lat: position.latitude,
          lng: position.longitude,
        }
      });
    } else {
      console.log(position.latitude)
      new maps.Marker({
        map,
        position: {
          lat: 34.1551699,
          lng: 136.9638529,
        }
      });
    }
  };
  // useEffect実行前であれば、"Loading..."という呼び出しを表示させます
  if (isFirstRef.current) return <div className="App">Loading...</div>;
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
      <select ref={aichi_jct} onChange={e => setJct(data.JCT[e.target.value])}>
        {data.JCT.map((JCT,index) => {
          // console.log(JCT)
          return <option
            value={index}
            key={index}
          >
            {JCT.name}
          </option>
        })}
      {/* <option value="1">1</option>
 <option value="2">2</option>
 <option value="3">3</option> */}
      </select>
      <div style={{ height: '300px', width: '300px' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAP_KEY }}
        // defaultCenter={{
        //   lat: jct.lat,
        //   lng: jct.lng,
        // }}
        center={{
          lat: jct.lat,
          lng: jct.lng,
        }}
        defaultZoom={16}
        onGoogleApiLoaded={handleApiLoaded}
        onChange={getCurrentPosition}
        // yesIWantToUseGoogleMapApiInternals={true}
      />
    </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import GoogleMapReact from 'google-map-react';
import data from "./jct.json"

console.log(data.JCT)

/* エラーテキスト */
const ErrorText = () => (
  <p className="App-error-text">geolocation IS NOT available</p>
);



export default () => {
  const [isAvailable, setAvailable] = useState(false);
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [jct, setJct] = useState(data.JCT[0]);
  const [correctCount, setCorrectCount] = useState(() => {
    // 正解数を JCT.name の数で表示する
    const storedList = localStorage.getItem('correctJctList');
    return storedList ? JSON.parse(storedList).length : 0;
  });
  const [correctJctList, setCorrectJctList] = useState(() => {
    const storedList = localStorage.getItem('correctJctList');
    return storedList ? JSON.parse(storedList) : [];
  });

  // useEffectが実行されているかどうかを判定するために用意しています
  const isFirstRef = useRef(true);
  const aichi_jct = useRef(0)


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
    if (Correct(position.latitude, position.longitude)) {
      answer = "正解";

      // 正解したJCT.nameを保存
      const newJctName = jct.name;
      if (!correctJctList.includes(newJctName)) {
        setCorrectJctList(prevList => {
          const newList = [...prevList, newJctName];
          localStorage.setItem('correctJctList', JSON.stringify(newList));

          // 正解数を JCT.name の数で更新
          setCorrectCount(newList.length);

          return newList;
        });
      }
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
    <div>
      <div className='App'>
      <h1 className='heading-016'>yotiyoti</h1>
      {!isFirstRef && !isAvailable && <ErrorText />}
      {isAvailable && (
        <div>
          <button className='button-004' onClick={getCurrentPosition}>Get Current Position</button>
            <div>
              latitude: {position.latitude}
              <br />
              longitude: {position.longitude}
            </div>
          <h3 className='heading-016'>{CheckAnswer()}</h3>
        </div>
      )}
      <label className='selectbox-001'>
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
      </select>
      </label>
      <div style={{ height: '265px', width: '80%', margin: '2% 10%',display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAP_KEY }}

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
    <p>進捗: {correctCount} / 16</p>
          <div>
            <h4>正解したJCT</h4>
            <ul className='list-011'>
              {correctJctList.map((jctName, index) => (
                <li key={index}>{jctName}</li>
              ))}
            </ul>
          </div>
    </div>
    </div>
  );
};

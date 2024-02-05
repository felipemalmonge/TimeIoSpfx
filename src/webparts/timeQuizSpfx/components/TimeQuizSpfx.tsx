import * as React from 'react';
import styles from './TimeQuizSpfx.module.scss';
import { ITimeQuizSpfxProps } from './ITimeQuizSpfxProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import { useState, useEffect } from 'react';
//import axios from 'axios';
import imageTimeZone from '../assets/img-timezone.jpg';
import FormQuiz from './FormQuiz';

const TimeQuizSpfx: React.FC<ITimeQuizSpfxProps> = (props): JSX.Element => {

  //const [data, setData] = useState<any | null>(null);
  const [actualScreen, setActualScreen] = useState<string>('initialScreen');

  /* const loadDataFromApi = async () => {
    const apiUrl = 'https://timeapi.io/api/Time/current/zone?timeZone=Europe/Amsterdam';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Use a proxy to avoid CORS issues - Only for development purposes

    try {
      const response = await axios.get(proxyUrl + apiUrl, {
        headers: {
          'Accept': 'application/json',
        }
      });

      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }; */

  useEffect(() => {
    //loadDataFromApi();
  }, []);

  return (
    <>
      {actualScreen == "initialScreen" ?
        <div className={styles.timeQuizSpfx}>
          <div className={styles.imageContainer}>
            <img src={imageTimeZone} alt="timezone" />
          </div>
          <div className={styles.accessContainer}>
            <h1>TIME</h1>
            <h1>ZONE</h1>
            <p>Reiz Tech Quiz</p>
            <hr />
            <span>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ac tempor metus. Maecenas quam turpis, molestie sit amet congue in, rhoncus sed dui. In convallis risus id erat blandit condimentum. Sed varius rhoncus neque, id egestas lorem. Maecenas sit amet est quis ante pharetra condimentum.
              </p>
            </span>
            <button className={styles.buttonStyle} onClick={()=>setActualScreen("formScreen")}>Get Started Now</button>
          </div>
        </div> : <FormQuiz />}
    </>
  );

}
export default TimeQuizSpfx;


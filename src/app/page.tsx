import type { FC } from 'react'
import styles from "../styles/Home.module.css";
import { Hours } from '../components/hours';
import { FutureReadings } from '../components/future-readings';
import { PastReadings } from '../components/past-readings';
import { Events } from '../components/events';

export type Props = {
}

const Home: FC<Props> = async () => {
  return (
    <div className={styles.container}>
      <Hours />
      <div className={styles.separatorLine}></div>
      <FutureReadings />
      <div className={styles.separatorLine}></div>
      <PastReadings />
      <div className={styles.separatorLine}></div>
      <Events />
    </div>)
}

export default Home
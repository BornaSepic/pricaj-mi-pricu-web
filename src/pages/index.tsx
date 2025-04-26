import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Hours } from "../components/hours";
import { PastReadings } from "../components/past-readings";
import { FutureReadings } from "../components/future-readings";
import {Events} from "../components/events";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pricalice</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hours />
      <div className={styles.separatorLine}></div>
      <FutureReadings />
      <div className={styles.separatorLine}></div>
      <PastReadings />
      <div className={styles.separatorLine}></div>
      <Events />

    </div>
  );
}


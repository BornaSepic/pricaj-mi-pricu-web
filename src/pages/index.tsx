import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Hours } from "../components/hours";
import { PastReadings } from "../components/past-readings";
import { FutureReadings } from "../components/future-readings";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pricalice</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hours />
      <FutureReadings />
      <PastReadings />

    </div>
  );
}


import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Hours } from "../components/hours";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pricalice</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hours />

    </div>
  );
}


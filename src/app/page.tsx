import type { FC } from 'react'
import styles from "../styles/Home.module.css";
import { Hours } from '../components/hours';
import { FutureReadings } from '../components/future-readings';
import { PastReadings } from '../components/past-readings';
import { Events } from '../components/events';
import {Users} from "../components/users";
import {AdminDepartments} from "../components/admin-departments";
import {AdminProvider} from "../components/admin-lock";

const Home = async () => {
  return (
    <div className={styles.container}>
      <Hours />
      <div className={styles.separatorLine}></div>
      <FutureReadings />
      <div className={styles.separatorLine}></div>
      <PastReadings />
      <div className={styles.separatorLine}></div>
      <Events />
      <AdminProvider>
        <div className={styles.separatorLine}></div>
        <Users />
        <div className={styles.separatorLine}></div>
        <AdminDepartments />
      </AdminProvider>
    </div>)
}

export default Home

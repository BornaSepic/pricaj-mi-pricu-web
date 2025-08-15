import type { FC } from 'react'
import styles from "../styles/Home.module.css";
import { Hours } from '../components/hours';
import { FutureReadings } from '../components/future-readings';
import { PastReadings } from '../components/past-readings';
import { Events } from '../components/events';
import {Users} from "../components/users";
import {AdminDepartments} from "../components/admin-departments";
import {AdminProvider} from "../components/admin-lock";
import {AdminLoginCode} from "../components/admin-login-code";

const Home = async () => {
  return (
    <div className={styles.container}>
      <AdminProvider>
        <AdminLoginCode />
          <div className={styles.separatorLine}></div>
      </AdminProvider>
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

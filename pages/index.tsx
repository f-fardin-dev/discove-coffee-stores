import type { NextPage } from "next";
import Head from "next/head";
import Banner from "../components/Banner";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const handleClickOnBannerButton = () => console.log("clicked");

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Discovery</title>
        <meta name="description" content="Find the coffee shop around your location!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner buttonText="View stores nearby" handleClickOnButton={handleClickOnBannerButton} />
      </main>
    </div>
  );
};

export default Home;

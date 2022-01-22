import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Card from "../components/Card";
import Banner from "../components/Banner";
import styles from "../styles/Home.module.css";
import { fetchCoffeeStores } from "../lib/coffee-stores";
import useTrackLocation from "../hooks/useTrackLocation";
import { useEffect } from "react";

export const getStaticProps = async () => {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores,
    },
  };
};

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ coffeeStores }) => {
  const { handleTrackLocation, latlng, isFindingLocation, locationErrorMsg } = useTrackLocation();
  const handleClickOnBannerButton = () => {
    handleTrackLocation();
  };

  useEffect(() => {
    if (!latlng) {
      return;
    }
    const getNerabyStores = async () => {
      try {
        const coffeeStoresNearby = await fetchCoffeeStores(latlng, 20);
        console.log({ coffeeStoresNearby });
      } catch (error) {
        console.log("Error in get nearby stores", error);
      }
    };
    getNerabyStores();
  }, [latlng]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Discovery</title>
        <meta name="description" content="Find the coffee shop around your location!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locationg..." : "View stores nearby"}
          handleClickOnButton={handleClickOnBannerButton}
        />
        {locationErrorMsg && <p> Somthing went wrong: {locationErrorMsg}</p>}
        <div className={styles.heroImage}>
          <Image src="/static/hero-image.png" alt="hero-image" width={700} height={400} />
        </div>
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto Stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map(coffeeStore => (
                <Card
                  key={coffeeStore.fsq_id}
                  name={coffeeStore.name}
                  imgUrl={
                    coffeeStore.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${coffeeStore.fsq_id}`}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

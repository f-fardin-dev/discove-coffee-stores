import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Banner from "../components/Banner";
import styles from "../styles/Home.module.css";
import { fetchCoffeeStores } from "../lib/coffee-stores";
import useTrackLocation from "../hooks/useTrackLocation";
import { useContext, useEffect, useState } from "react";
import { CoffeeStoreList } from "../components/CoffeeStoreList";
import { Actions, StoreContext } from "../context/StoreContext";

export const getStaticProps = async () => {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores,
    },
  };
};

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ coffeeStores }) => {
  const [nearCoffeeStoresError, setNearCoffeeStoresError] = useState<null | string>(null);
  const { handleTrackLocation, isFindingLocation, locationErrorMsg } = useTrackLocation();

  const { state, dispatch } = useContext(StoreContext);

  const handleClickOnBannerButton = () => {
    handleTrackLocation();
  };

  useEffect(() => {
    if (!state.latlng) {
      return;
    }
    const getNerabyStores = async () => {
      try {
        const response = await fetch(`/api/getCoffeeStoresByLocation?latlng=${state.latlng}&limit=20`);
        const coffeeStoresNearby = await response.json();
        dispatch({ type: Actions.SET_NEARBY_STORES, payload: coffeeStoresNearby });
        setNearCoffeeStoresError("");
      } catch (error) {
        const { message } = error as { message: string };
        console.log("Error in get nearby stores", error);
        setNearCoffeeStoresError(message);
      }
    };
    getNerabyStores();
  }, [dispatch, state.latlng]);

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
        {nearCoffeeStoresError && <p> Somthing went wrong: {nearCoffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image src="/static/hero-image.png" alt="hero-image" width={700} height={400} />
        </div>
        <CoffeeStoreList title="Stores near me" stores={state.nearbyStores} />
        <CoffeeStoreList title="Toronto Stores" stores={coffeeStores} />
      </main>
    </div>
  );
};

export default Home;

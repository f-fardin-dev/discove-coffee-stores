import type { InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Card from "../components/Card";
import Banner from "../components/Banner";
import styles from "../styles/Home.module.css";
import coffeeStoresData from "../data/coffee-store.json";

export const getStaticProps = async () => {
  return {
    props: {
      coffeeStores: coffeeStoresData,
    },
  };
};

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ coffeeStores }) => {
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
        <div className={styles.heroImage}>
          <Image src="/static/hero-image.png" alt="hero-image" width={700} height={400} />
        </div>
        {coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>Toronto Stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map(coffeeStore => (
                <Card
                  key={coffeeStore.id}
                  name={coffeeStore.name}
                  imgUrl={coffeeStore.imgUrl}
                  href={`/coffee-store/${coffeeStore.id}`}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;

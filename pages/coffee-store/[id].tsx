import { InferGetStaticPropsType, GetStaticPaths, NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import cls from "classnames";
import styles from "../../styles/coffee-store.module.css";
import { CoffeeStore, defaultCoffeeStoreImage, fetchCoffeeStores } from "../../lib/coffee-stores";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
interface IParams extends ParsedUrlQuery {
  id: string;
}

interface ICoffeeStore {
  coffeeStore: CoffeeStore | null;
}

export const getStaticProps: GetStaticProps<ICoffeeStore> = async context => {
  const { id } = context.params as IParams;
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoresById = coffeeStores.find(coffeeStore => coffeeStore.fsq_id.toString() === id);
  return {
    props: {
      coffeeStore: findCoffeeStoresById || null,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map(store => ({ params: { id: store.fsq_id.toString() } }));
  return {
    paths,
    fallback: true,
  };
};

const CoffeeStore: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ coffeeStore }) => {
  const router = useRouter();

  const id = router.query.id;
  const [store, setStore] = useState(coffeeStore);
  const {
    state: { nearbyStores },
  } = useContext(StoreContext);

  const handleUpvote = () => console.log;

  useEffect(() => {
    if (coffeeStore) {
      return;
    }
    const coffeeStoreFromContext = nearbyStores.find(coffeeStore => {
      return coffeeStore.fsq_id.toString() === id;
    });

    if (coffeeStoreFromContext) {
      setStore(coffeeStoreFromContext);
    }
  }, [coffeeStore, id, nearbyStores]);

  if (router.isFallback) {
    return <div>Loading ...</div>;
  }
  if (!store) {
    return <div>Nothing found for this route/id</div>;
  }

  const { name, imgUrl, location } = store;
  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to Home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={imgUrl || defaultCoffeeStoreImage}
            alt={name}
            width={600}
            height={360}
            className={styles.storeImg}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" alt="" width={24} height={24} />
            <p className={styles.text}>{location.address || "N/A"}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/nearMe.svg" alt="" width={24} height={24} />
            <p className={styles.text}>{location.neighborhood || "N/A"}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" alt="" width={24} height={24} />
            <p className={styles.text}>1</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvote}>
            Up Vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;

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
import useSWR from "swr";
import { api } from "../../lib/api";
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
const fetcher = (url: string) => fetch(url).then(res => res.json());

const CoffeeStore: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ coffeeStore }) => {
  const router = useRouter();

  const id = router.query.id;
  const [store, setStore] = useState<CoffeeStore | undefined | null>(coffeeStore);
  const [votingCount, setVotingCount] = useState(0);
  const {
    state: { nearbyStores },
  } = useContext(StoreContext);

  const handleUpvote = async () => {
    try {
      const res = await api<CoffeeStore[]>("/api/votingCoffeeStore", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (res && res.length > 0) {
        setVotingCount(prevState => prevState + 1);
      }
    } catch (error) {
      console.error("Error update voting coffee store", error);
    }
  };

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  const handleCreateCoffeStore = async (coffeStore: CoffeeStore) => {
    const {
      fsq_id: id,
      name,
      imgUrl,
      location: { address, neighborhood },
    } = coffeStore;
    try {
      await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          imgUrl,
          voting: 0,
          address: address || "",
          neighborhood: neighborhood ? neighborhood[0] : "",
        }),
      });
    } catch (error) {
      console.error("Error creating coffee store", error);
    }
  };

  useEffect(() => {
    if (!data || !data.length) {
      return;
    }
    const { id, name, address, imgUrl, neighborhood, voting } = data[0];
    setStore({ fsq_id: id, name, imgUrl, location: { address, neighborhood: [neighborhood || "NA"] } });
    setVotingCount(voting);
  }, [data]);

  useEffect(() => {
    if (coffeeStore) {
      handleCreateCoffeStore(coffeeStore);
      return;
    }
    const coffeeStoreFromContext = nearbyStores.find(coffeeStore => {
      return coffeeStore.fsq_id.toString() === id;
    });

    if (coffeeStoreFromContext) {
      setStore(coffeeStoreFromContext);
      handleCreateCoffeStore(coffeeStoreFromContext);
    }
  }, [coffeeStore, id, nearbyStores]);

  if (router.isFallback || (!store && !error && !data)) {
    return <div>Loading ...</div>;
  }
  if (!store || error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }

  const { name, imgUrl, location } = store;
  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee-store`} />
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
            <Image src="/static/icons/places.svg" alt="places icon" width={24} height={24} />
            <p className={styles.text}>{location.address || "N/A"}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/nearMe.svg" alt="near me icon" width={24} height={24} />
            <p className={styles.text}>{location.neighborhood || "N/A"}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" alt="star icon" width={24} height={24} />
            <p className={styles.text}>{votingCount}</p>
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

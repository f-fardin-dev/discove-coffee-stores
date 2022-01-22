import { InferGetStaticPropsType, GetStaticPaths, NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import coffeeStoresData from "../../data/coffee-store.json";
import cls from "classnames";
import styles from "../../styles/coffee-store.module.css";
import { CoffeeStore, defaultCoffeeStore, defaultCoffeeStoreImage, fetchCoffeeStores } from "../../lib/coffee-stores";
interface IParams extends ParsedUrlQuery {
  id: string;
}

interface ICoffeeStore {
  coffeeStore?: CoffeeStore;
}

export const getStaticProps: GetStaticProps<ICoffeeStore> = async context => {
  const { id } = context.params as IParams;
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoresById = coffeeStores.find(coffeeStore => coffeeStore.fsq_id.toString() === id);
  return {
    props: {
      coffeeStore: findCoffeeStoresById || defaultCoffeeStore,
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

  const handleUpvote = () => console.log;
  if (router.isFallback) {
    return <div>Loading ...</div>;
  }
  if (!coffeeStore) {
    return <div>Nothing found for this route</div>;
  }
  return (
    <div className={styles.layout}>
      <Head>
        <title>{coffeeStore.name}</title>{" "}
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to Home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{coffeeStore.name}</h1>
          </div>
          <Image
            src={coffeeStore.imgUrl || defaultCoffeeStoreImage}
            alt={coffeeStore.name}
            width={600}
            height={360}
            className={styles.storeImg}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" alt="" width={24} height={24} />
            <p className={styles.text}>{coffeeStore.location.address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/nearMe.svg" alt="" width={24} height={24} />
            <p className={styles.text}>{coffeeStore.location.neighborhood || "N/A"}</p>
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

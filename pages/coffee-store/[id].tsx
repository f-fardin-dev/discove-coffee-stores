import { InferGetStaticPropsType, GetStaticPaths, NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import coffeeStoresData from "../../data/coffee-store.json";
import cls from "classnames";
import styles from "../../styles/coffee-store.module.css";
interface IParams extends ParsedUrlQuery {
  id: string;
}

interface ICoffeStore {
  coffeeStore?: typeof coffeeStoresData[0];
}

export const getStaticProps: GetStaticProps<ICoffeStore> = async context => {
  const { id } = context.params as IParams;
  return {
    props: {
      coffeeStore: coffeeStoresData.find(coffeeStore => coffeeStore.id.toString() === id),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = coffeeStoresData.map(store => ({ params: { id: store.id.toString() } }));
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
              <a>Back to Home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{coffeeStore.name}</h1>
          </div>
          <Image src={coffeeStore.imgUrl} alt={coffeeStore.name} width={600} height={360} className={styles.storeImg} />
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" alt="" width={24} height={24} />
            <p className={styles.text}>{coffeeStore.address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/nearMe.svg" alt="" width={24} height={24} />
            <p className={styles.text}>{coffeeStore.neighbourhood}</p>
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

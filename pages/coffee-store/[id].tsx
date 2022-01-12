import { InferGetStaticPropsType, GetStaticPaths, NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import coffeeStoresData from "../../data/coffee-store.json";

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
  console.log({ coffeeStore });

  if (router.isFallback) {
    return <div>Loading ...</div>;
  }
  if (!coffeeStore) {
    return <div>Nothing found for this route</div>;
  }
  return (
    <div>
      <Head>
        <title>{coffeeStore.name}</title>{" "}
      </Head>
      <Link href="/">
        <a>Back to Home</a>
      </Link>
      <p>{coffeeStore.address}</p>
      <p>{coffeeStore.name}</p>
    </div>
  );
};

export default CoffeeStore;

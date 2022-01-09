import Link from "next/link";
import { useRouter } from "next/router";

const CoffeeStore = () => {
  const router = useRouter();
  console.log({ router });
  return (
    <div>
      <h4>Coffee store {router.query.id}</h4>
      <Link href="/">
        <a>Back to Home</a>
      </Link>
    </div>
  );
};

export default CoffeeStore;

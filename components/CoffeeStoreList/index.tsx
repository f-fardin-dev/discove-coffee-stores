import { CoffeeStore, defaultCoffeeStoreImage } from "../../lib/coffee-stores";
import Card from "../Card";
import styles from "../../styles/Home.module.css";

interface CoffeeStoreListProps {
  title: string;
  stores: CoffeeStore[];
}

export const CoffeeStoreList = ({ title, stores }: CoffeeStoreListProps) => {
  return stores.length <= 0 ? null : (
    <div className={styles.sectionWrapper}>
      <h2 className={styles.heading2}>{title}</h2>
      <div className={styles.cardLayout}>
        {stores.map(coffeeStore => (
          <Card
            key={coffeeStore.fsq_id}
            name={coffeeStore.name}
            imgUrl={coffeeStore.imgUrl || defaultCoffeeStoreImage}
            href={`/coffee-store/${coffeeStore.fsq_id}`}
          />
        ))}
      </div>
    </div>
  );
};

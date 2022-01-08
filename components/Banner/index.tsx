import { FunctionComponent } from "react";
import styles from "./Banner.module.css";

interface BannerProps {
  buttonText: string;
  handleClickOnButton: () => void;
}

const Banner: FunctionComponent<BannerProps> = ({ buttonText, handleClickOnButton }) => {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Coffee</span>
        <span className={styles.title2}>Discovery</span>
      </h1>
      <p className={styles.subTitle}>Discover your local coffee shop!</p>
      <div className={styles.buttonWrapper}>
        <button className={styles.button} onClick={handleClickOnButton}>
          {buttonText}
        </button>
      </div>
    </section>
  );
};

export default Banner;

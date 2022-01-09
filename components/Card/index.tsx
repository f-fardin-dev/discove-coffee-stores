import Image from "next/image";
import Link from "next/link";
import { FunctionComponent } from "react";
import styles from "./Card.module.css";
import cls from "classnames";

interface CardProps {
  name: string;
  imgUrl: string;
  href: string;
}

const Card: FunctionComponent<CardProps> = ({ href, name, imgUrl }) => (
  <Link href={href}>
    <a className={styles.cardLink}>
      <div className={cls("glass", styles.container)}>
        <div className={styles.cardHeaderWrapper}>
          <h2 className={styles.cardHeader}>{name}</h2>
        </div>
        <div className={styles.cardImageWrapper}>
          <Image className={styles.cardImage} src={imgUrl} alt={name} width={260} height={160} />
        </div>
      </div>
    </a>
  </Link>
);
export default Card;

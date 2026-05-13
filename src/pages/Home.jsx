import TrainList from "../components/TrainList";
import { trains } from "../data/trains";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>
          🇺🇦 Укрзалізниця
        </h1>
        <p className={styles.heroSub}>
          Купуйте квитки онлайн — швидко, зручно, надійно
        </p>
      </div>
      <div className={styles.content}>
        <TrainList trains={trains} />
      </div>
    </div>
  );
}

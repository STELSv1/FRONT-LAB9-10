import { useBooking } from "../context/BookingContext";
import styles from "./WagonSelector.module.css";

const typeIcons = {
  "Бізнес": "💼",
  "Економ": "🪑",
  "Купе": "🛏",
  "Плацкарт": "🛋",
  "СВ": "✨",
};

export default function WagonSelector({ wagons }) {
  const { state, dispatch } = useBooking();

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Оберіть вагон</h3>
      <div className={styles.list}>
        {wagons.map((wagon) => {
          const free = wagon.seats.filter((s) => !s.booked).length;
          const isSelected = state.selectedWagon?.id === wagon.id;
          return (
            <button
              key={wagon.id}
              className={`${styles.wagonBtn} ${isSelected ? styles.active : ""}`}
              onClick={() => dispatch({ type: "SELECT_WAGON", payload: wagon })}
            >
              <span className={styles.icon}>{typeIcons[wagon.type] || "🚃"}</span>
              <span className={styles.num}>№{wagon.number}</span>
              <span className={styles.type}>{wagon.type}</span>
              <span className={`${styles.free} ${free < 5 ? styles.lowFree : ""}`}>
                {free} міс.
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

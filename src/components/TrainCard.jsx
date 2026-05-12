import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import styles from "./TrainCard.module.css";

const typeColors = {
  "Інтерсіті+": "#0057b7",
  "Інтерсіті": "#1a7abf",
  "Регіональний": "#3a9e6f",
  "Нічний": "#5c3d99",
};

export default function TrainCard({ train }) {
  const navigate = useNavigate();
  const { dispatch } = useBooking();

  const totalSeats = train.wagons.reduce((sum, w) => sum + w.seats.length, 0);
  const bookedSeats = train.wagons.reduce(
    (sum, w) => sum + w.seats.filter((s) => s.booked).length,
    0
  );
  const freeSeats = totalSeats - bookedSeats;

  const handleBook = () => {
    dispatch({ type: "SELECT_TRAIN", payload: train });
    navigate(`/booking/${train.id}`);
  };

  const typeColor = typeColors[train.type] || "#555";

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.trainNumber}>
          <span className={styles.numLabel}>Поїзд</span>
          <span className={styles.num}>{train.number}</span>
        </div>
        <span className={styles.badge} style={{ background: typeColor }}>
          {train.type}
        </span>
      </div>

      <div className={styles.route}>
        <div className={styles.station}>
          <span className={styles.city}>{train.from}</span>
          <span className={styles.time}>{train.departureTime}</span>
        </div>
        <div className={styles.routeLine}>
          <span className={styles.duration}>{train.duration}</span>
          <div className={styles.line}>
            <span className={styles.dot} />
            <span className={styles.dash} />
            <span className={styles.arrow}>▶</span>
          </div>
        </div>
        <div className={styles.station}>
          <span className={styles.city}>{train.to}</span>
          <span className={styles.time}>{train.arrivalTime}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.meta}>
          <span className={styles.date}>
            🗓 {new Date(train.departureDate).toLocaleDateString("uk-UA", {
              day: "numeric", month: "long", year: "numeric"
            })}
          </span>
          <span className={`${styles.seats} ${freeSeats < 10 ? styles.low : ""}`}>
            {freeSeats > 0 ? `${freeSeats} місць` : "Немає місць"}
          </span>
        </div>
        <button
          className={styles.btn}
          onClick={handleBook}
          disabled={freeSeats === 0}
        >
          {freeSeats > 0 ? "Обрати місця" : "Розпродано"}
        </button>
      </div>
    </article>
  );
}

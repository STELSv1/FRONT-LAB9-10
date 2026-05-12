import { useBooking } from "../context/BookingContext";
import { BookingService } from "../services/BookingService";
import styles from "./SeatMap.module.css";

export default function SeatMap() {
  const { state, dispatch } = useBooking();
  const { selectedWagon, selectedSeats } = state;

  if (!selectedWagon) {
    return (
      <div className={styles.placeholder}>
        👆 Оберіть вагон вище, щоб побачити схему місць
      </div>
    );
  }

  const storedBooked = BookingService.getBookedSeats(selectedWagon.id);

  const isBooked = (seat) => seat.booked || storedBooked.has(seat.number);
  const isSelected = (seat) => selectedSeats.some((s) => s.id === seat.id);

  const handleSeat = (seat) => {
    if (isBooked(seat)) return;
    dispatch({ type: "TOGGLE_SEAT", payload: seat });
  };

  const cols = selectedWagon.type === "Плацкарт" ? 4 : 4;
  const rows = Math.ceil(selectedWagon.seats.length / cols);

  return (
    <div className={styles.wrapper}>
      <div className={styles.wagonLabel}>
        Вагон №{selectedWagon.number} · {selectedWagon.type}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.free}`}></span> Вільне
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.selected}`}></span> Обране
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.booked}`}></span> Зайняте
        </span>
      </div>

      <div className={styles.grid} style={{ "--cols": cols }}>
        {selectedWagon.seats.map((seat) => {
          const booked = isBooked(seat);
          const selected = isSelected(seat);
          return (
            <button
              key={seat.id}
              className={`${styles.seat} ${
                booked ? styles.booked : selected ? styles.selected : styles.free
              }`}
              onClick={() => handleSeat(seat)}
              disabled={booked}
              title={`Місце ${seat.number}${booked ? " (зайняте)" : ""}`}
            >
              {seat.number}
            </button>
          );
        })}
      </div>

      {selectedSeats.length > 0 && (
        <div className={styles.selection}>
          Обрано місць: <strong>{selectedSeats.map((s) => s.number).join(", ")}</strong>
        </div>
      )}
    </div>
  );
}

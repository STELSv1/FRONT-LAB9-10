import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { trains } from "../data/trains";
import { useBooking } from "../context/BookingContext";
import WagonSelector from "../components/WagonSelector";
import SeatMap from "../components/SeatMap";
import BookingForm from "../components/BookingForm";
import styles from "./Booking.module.css";

export default function Booking() {
  const { trainId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useBooking();

  const train = trains.find((t) => t.id === Number(trainId));

  useEffect(() => {
    if (!train) { navigate("/"); return; }
    if (!state.selectedTrain || state.selectedTrain.id !== train.id) {
      dispatch({ type: "SELECT_TRAIN", payload: train });
    }
  }, [train, trainId]);

  if (!train) return null;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topInner}>
          <Link to="/" className={styles.back}>← Назад до рейсів</Link>
          <div className={styles.trainInfo}>
            <span className={styles.trainNum}>🚄 {train.number}</span>
            <span className={styles.route}>{train.from} → {train.to}</span>
            <span className={styles.datetime}>
              {new Date(train.departureDate).toLocaleDateString("uk-UA", {
                day: "numeric", month: "long"
              })}, {train.departureTime}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.left}>
          <section className={styles.section}>
            <WagonSelector wagons={train.wagons} />
          </section>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Схема місць</h3>
            <SeatMap />
          </section>
        </div>

        <div className={styles.right}>
          <BookingForm />
        </div>
      </div>
    </div>
  );
}

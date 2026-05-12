import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useBooking } from "../context/BookingContext";
import { BookingService } from "../services/BookingService";
import styles from "./BookingForm.module.css";

function validate(form) {
  const errors = {};
  if (!form.name.trim() || form.name.trim().length < 2)
    errors.name = "Введіть повне ім'я (мінімум 2 символи)";
  if (!/^\+?[\d\s\-()]{10,15}$/.test(form.phone))
    errors.phone = "Невірний формат номера телефону";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Невірний формат email";
  return errors;
}

export default function BookingForm() {
  const { state, dispatch } = useBooking();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { selectedTrain, selectedWagon, selectedSeats } = state;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!selectedWagon) { toast.error("Оберіть вагон!"); return; }
    if (!selectedSeats.length) { toast.error("Оберіть хоча б одне місце!"); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const booking = BookingService.save({
      trainId: selectedTrain.id,
      trainNumber: selectedTrain.number,
      route: `${selectedTrain.from} → ${selectedTrain.to}`,
      departureDate: selectedTrain.departureDate,
      departureTime: selectedTrain.departureTime,
      wagonId: selectedWagon.id,
      wagonNumber: selectedWagon.number,
      wagonType: selectedWagon.type,
      seats: selectedSeats,
      passenger: form,
    });

    toast.success(
      `✅ Бронювання успішне! Квиток №${booking.id} — ${selectedSeats.length} місць у вагоні №${selectedWagon.number}`,
      { autoClose: 5000 }
    );

    dispatch({ type: "RESET" });
    setLoading(false);
    navigate("/");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h3 className={styles.title}>Дані пасажира</h3>

      <div className={styles.field}>
        <label className={styles.label}>Ім'я та прізвище</label>
        <input
          className={`${styles.input} ${errors.name ? styles.error : ""}`}
          name="name"
          placeholder="Іван Шевченко"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Телефон</label>
        <input
          className={`${styles.input} ${errors.phone ? styles.error : ""}`}
          name="phone"
          placeholder="+380 99 123 4567"
          value={form.phone}
          onChange={handleChange}
        />
        {errors.phone && <span className={styles.errMsg}>{errors.phone}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <input
          className={`${styles.input} ${errors.email ? styles.error : ""}`}
          name="email"
          type="email"
          placeholder="ivan@example.com"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <span className={styles.errMsg}>{errors.email}</span>}
      </div>

      {selectedSeats.length > 0 && selectedWagon && (
        <div className={styles.summary}>
          <p>🚃 Вагон №{selectedWagon.number} ({selectedWagon.type})</p>
          <p>💺 Місця: {selectedSeats.map((s) => s.number).join(", ")}</p>
        </div>
      )}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={loading || !selectedSeats.length || !selectedWagon}
      >
        {loading ? "Бронюємо..." : "Забронювати квиток"}
      </button>
    </form>
  );
}

import { useState, useMemo } from "react";
import TrainCard from "./TrainCard";
import styles from "./TrainList.module.css";

export default function TrainList({ trains }) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const types = [...new Set(trains.map((t) => t.type))];

  const filtered = useMemo(() => {
    return trains.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        t.number.toLowerCase().includes(q) ||
        t.from.toLowerCase().includes(q) ||
        t.to.toLowerCase().includes(q);
      const matchDate = !dateFilter || t.departureDate === dateFilter;
      const matchType = !typeFilter || t.type === typeFilter;
      return matchSearch && matchDate && matchType;
    });
  }, [trains, search, dateFilter, typeFilter]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.search}
            type="text"
            placeholder="Пошук за маршрутом або номером..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clear} onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        <input
          className={styles.dateInput}
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          title="Фільтр за датою"
        />

        <select
          className={styles.select}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">Всі типи</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🚂</span>
          <p>Рейси не знайдено. Спробуйте змінити параметри пошуку.</p>
        </div>
      ) : (
        <>
          <p className={styles.count}>Знайдено рейсів: <strong>{filtered.length}</strong></p>
          <div className={styles.grid}>
            {filtered.map((train) => (
              <TrainCard key={train.id} train={train} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

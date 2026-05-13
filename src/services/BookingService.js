const STORAGE_KEY = "railway_bookings";

export const BookingService = {
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  },

  save(booking) {
    const bookings = this.getAll();
    const newBooking = {
      ...booking,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    bookings.push(newBooking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    return newBooking;
  },

  isBooked(wagonId, seatNumber) {
    const bookings = this.getAll();
    return bookings.some(
      (b) =>
        b.wagonId === wagonId &&
        b.seats.some((s) => s.number === seatNumber)
    );
  },

  getBookedSeats(wagonId) {
    const bookings = this.getAll();
    const booked = new Set();
    bookings
      .filter((b) => b.wagonId === wagonId)
      .forEach((b) => b.seats.forEach((s) => booked.add(s.number)));
    return booked;
  },
};

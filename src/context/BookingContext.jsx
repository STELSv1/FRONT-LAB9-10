import { createContext, useContext, useReducer } from "react";

const BookingContext = createContext(null);

const initialState = {
  selectedTrain: null,
  selectedWagon: null,
  selectedSeats: [],
};

function bookingReducer(state, action) {
  switch (action.type) {
    case "SELECT_TRAIN":
      return { ...initialState, selectedTrain: action.payload };
    case "SELECT_WAGON":
      return { ...state, selectedWagon: action.payload, selectedSeats: [] };
    case "TOGGLE_SEAT": {
      const seat = action.payload;
      const exists = state.selectedSeats.find((s) => s.id === seat.id);
      if (exists) {
        return {
          ...state,
          selectedSeats: state.selectedSeats.filter((s) => s.id !== seat.id),
        };
      }
      return { ...state, selectedSeats: [...state.selectedSeats, seat] };
    }
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}

export const initialLighting = Object.freeze({
  salon: 100,
  kitchen: 100,
  hall: 100,
  rest: true,
  tv: false,
});

export function lightingReducer(state, action) {
  switch (action.type) {
    case "toggle-room":
      if (!["salon", "kitchen"].includes(action.room)) return state;
      return { ...state, [action.room]: state[action.room] > 0 ? 0 : 100 };
    case "cinema":
      return { ...state, salon: 20, kitchen: 20, hall: 20, tv: true };
    case "toggle-all":
      return allLightsOff(state)
        ? { ...initialLighting }
        : { salon: 0, kitchen: 0, hall: 0, rest: false, tv: false };
    case "reset":
      return { ...initialLighting };
    default:
      return state;
  }
}

export const cinemaActive = (state) =>
  state.salon === 20 && state.kitchen === 20 && state.hall === 20 && state.tv;

export const allLightsOff = (state) =>
  state.salon === 0 &&
  state.kitchen === 0 &&
  state.hall === 0 &&
  !state.rest &&
  !state.tv;

export const describeLight = (value) =>
  value === 0 ? "wyłączone" : value === 100 ? "włączone" : "przygaszone";

const KEY = "maas_state_v0_1";

const defaultState = {
  activeModule: "home",
  firstRun: true,
  installedAt: null
};

export function loadState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return { ...defaultState };
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

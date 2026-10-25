import test from "node:test";
import assert from "node:assert/strict";
import {
  initialLighting,
  lightingReducer,
  cinemaActive,
  allLightsOff,
} from "../src/components/F50HomeDemo/homeLighting.js";

test("top keys independently toggle salon and kitchen", () => {
  let home = lightingReducer(initialLighting, {
    type: "toggle-room",
    room: "salon",
  });
  assert.equal(home.salon, 0);
  assert.equal(home.kitchen, initialLighting.kitchen);
  home = lightingReducer(home, { type: "toggle-room", room: "kitchen" });
  assert.equal(home.kitchen, 0);
  assert.equal(home.salon, 0);
  home = lightingReducer(home, { type: "toggle-room", room: "salon" });
  assert.equal(home.salon, 100);
  assert.equal(home.kitchen, 0);
});

test("cinema dims the three ground-floor zones, turns on TV, preserves upstairs", () => {
  const home = lightingReducer(initialLighting, { type: "cinema" });
  assert.ok(cinemaActive(home));
  assert.equal(home.rest, initialLighting.rest);
  assert.deepEqual(
    [home.salon, home.kitchen, home.hall, home.tv],
    [20, 20, 20, true],
  );
});

test("manual room change leaves other cinema functions and TV intact", () => {
  const cinema = lightingReducer(initialLighting, { type: "cinema" });
  const home = lightingReducer(cinema, { type: "toggle-room", room: "salon" });
  assert.equal(home.salon, 0);
  assert.deepEqual([home.kitchen, home.hall, home.tv], [20, 20, true]);
  assert.equal(cinemaActive(home), false);
});

test("ALL OFF extinguishes both floors and TV; a later room key relights only that room", () => {
  const cinema = lightingReducer(initialLighting, { type: "cinema" });
  const off = lightingReducer(cinema, { type: "all-off" });
  assert.ok(allLightsOff(off));
  assert.equal(cinemaActive(off), false);
  const kitchenOnly = lightingReducer(off, {
    type: "toggle-room",
    room: "kitchen",
  });
  assert.equal(kitchenOnly.kitchen, 100);
  assert.deepEqual(
    [kitchenOnly.salon, kitchenOnly.hall, kitchenOnly.rest, kitchenOnly.tv],
    [0, 0, false, false],
  );
  assert.equal(allLightsOff(kitchenOnly), false);
});

test("cinema after ALL OFF does not relight bedrooms; reset restores the starting view", () => {
  const off = lightingReducer(initialLighting, { type: "all-off" });
  const home = lightingReducer(off, { type: "cinema" });
  assert.ok(cinemaActive(home));
  assert.equal(home.rest, false);
  assert.deepEqual(lightingReducer(home, { type: "reset" }), initialLighting);
});

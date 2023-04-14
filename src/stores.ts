import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type { EnphaseData } from "./lib/enphase.js";

export const datas: Writable<EnphaseData[]> = writable([]);

export const multiplier = writable(1);
export const batteryMax = writable(0);

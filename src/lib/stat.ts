import { improve, roi, stats } from "./enphase";

export function doIt(
  datas,
  multiplier = 1,
  batteryMax = 0,
  batteryCurrent = 0,
  sellPrice = 0.1,
  buyPrice = 0.2
) {
  const s = stats(improve(datas, multiplier, batteryMax, batteryCurrent).data);
  const r = roi(s, sellPrice, buyPrice);

  return { ...s, ...r, batteryMax: batteryMax };
}

import { describe, expect, it } from "vitest";
import { improve, stats } from "./enphase";

describe("stats", () => {
  it("create stats on an item", async () => {
    expect(
      stats([
        {
          production: 20,
          consumption: 10,
          battery: 0,
          exported: 10,
          imported: 0,
          batteryCurrent: 0,
        },
      ])
    ).toStrictEqual({
      production: 20,
      consumption: 10,
      batteryStored: 0,
      batteryUsed: 0,
      exported: 10,
      imported: 0,
      dependency: 0,
      autoConsumption: 50,
      net: 10,
    });
  });
  it("create stats on an item", async () => {
    expect(
      stats([
        {
          production: 0,
          consumption: 10,
          battery: 0,
          exported: 0,
          imported: 10,
          batteryCurrent: 0,
        },
        {
          production: 0,
          consumption: 20,
          battery: 0,
          exported: 0,
          imported: 20,
          batteryCurrent: 0,
        },
        {
          production: 5,
          consumption: 20,
          battery: 0,
          exported: 0,
          imported: 15,
          batteryCurrent: 0,
        },
        {
          production: 10,
          consumption: 20,
          battery: 0,
          exported: 0,
          imported: 10,
          batteryCurrent: 0,
        },
        {
          production: 15,
          consumption: 20,
          battery: 0,
          exported: 0,
          imported: 5,
          batteryCurrent: 0,
        },
        {
          production: 20,
          consumption: 10,
          battery: 10,
          exported: 0,
          imported: 0,
          batteryCurrent: 10,
        },
        {
          production: 25,
          consumption: 5,
          battery: 20,
          exported: 0,
          imported: 0,
          batteryCurrent: 30,
        },
        {
          production: 30,
          consumption: 0,
          battery: 10,
          exported: 20,
          imported: 0,
          batteryCurrent: 40,
        },
        {
          production: 30,
          consumption: 5,
          battery: 0,
          exported: 25,
          imported: 0,
          batteryCurrent: 40,
        },
        {
          production: 25,
          consumption: 30,
          battery: -5,
          exported: 0,
          imported: 0,
          batteryCurrent: 35,
        },
        {
          production: 15,
          consumption: 25,
          battery: -10,
          exported: 0,
          imported: 0,
          batteryCurrent: 25,
        },
        {
          production: 5,
          consumption: 10,
          battery: -5,
          exported: 0,
          imported: 0,
          batteryCurrent: 20,
        },
        {
          production: 0,
          consumption: 15,
          battery: -15,
          exported: 0,
          imported: 0,
          batteryCurrent: 5,
        },
        {
          production: 0,
          consumption: 50,
          battery: -5,
          exported: 0,
          imported: 45,
          batteryCurrent: 0,
        },
      ])
    ).toStrictEqual({
      production: 180,
      consumption: 240,
      batteryStored: 40,
      batteryUsed: -40,
      exported: 45,
      imported: 105,
      dependency: 43.75,
      autoConsumption: 75,
      net: -60,
    });
  });
});
describe("improve", () => {
  it("multiply electricity production", async () => {
    expect(
      improve([{ production: 10, consumption: 10 }], 2, 0, 0)
    ).toStrictEqual({
      data: [
        {
          production: 20,
          consumption: 10,
          battery: 0,
          exported: 10,
          imported: 0,
          batteryCurrent: 0,
        },
      ],
      batteryCurrent: 0,
    });
  });
  it("import electricity", async () => {
    expect(
      improve([{ production: 0, consumption: 10 }], 1, 0, 0)
    ).toStrictEqual({
      data: [
        {
          production: 0,
          consumption: 10,
          battery: 0,
          exported: 0,
          imported: 10,
          batteryCurrent: 0,
        },
      ],
      batteryCurrent: 0,
    });
  });
  it("export electricity", async () => {
    expect(
      improve([{ production: 20, consumption: 10 }], 1, 0, 0)
    ).toStrictEqual({
      data: [
        {
          production: 20,
          consumption: 10,
          battery: 0,
          exported: 10,
          imported: 0,
          batteryCurrent: 0,
        },
      ],
      batteryCurrent: 0,
    });
  });
  it("export some electricity", async () => {
    expect(
      improve([{ production: 20, consumption: 10 }], 1, 0, 0)
    ).toStrictEqual({
      data: [
        {
          production: 20,
          consumption: 10,
          battery: 0,
          exported: 10,
          imported: 0,
          batteryCurrent: 0,
        },
      ],
      batteryCurrent: 0,
    });
  });
  it("store electricity", async () => {
    expect(
      improve([{ production: 20, consumption: 10 }], 1, 10, 0)
    ).toStrictEqual({
      data: [
        {
          production: 20,
          consumption: 10,
          battery: 10,
          exported: 0,
          imported: 0,
          batteryCurrent: 10,
        },
      ],
      batteryCurrent: 10,
    });
  });
  it("use stored electricity", async () => {
    expect(
      improve([{ production: 10, consumption: 20 }], 1, 10, 10)
    ).toStrictEqual({
      data: [
        {
          production: 10,
          consumption: 20,
          battery: -10,
          exported: 0,
          imported: 0,
          batteryCurrent: 0,
        },
      ],
      batteryCurrent: 0,
    });
  });
  it("import electricity when no more battery", async () => {
    expect(
      improve([{ production: 10, consumption: 30 }], 1, 10, 10)
    ).toStrictEqual({
      data: [
        {
          production: 10,
          consumption: 30,
          battery: -10,
          exported: 0,
          imported: 10,
          batteryCurrent: 0,
        },
      ],
      batteryCurrent: 0,
    });
  });
  it("export electricity when battery is full", async () => {
    expect(
      improve([{ production: 40, consumption: 20 }], 1, 10, 0)
    ).toStrictEqual({
      data: [
        {
          production: 40,
          consumption: 20,
          battery: 10,
          exported: 10,
          imported: 0,
          batteryCurrent: 10,
        },
      ],
      batteryCurrent: 10,
    });
  });
  it("works on a full day", async () => {
    expect(
      improve(
        [
          { production: 0, consumption: 10 },
          { production: 0, consumption: 20 },
          { production: 5, consumption: 20 },
          { production: 10, consumption: 20 },
          { production: 15, consumption: 20 },
          { production: 20, consumption: 10 },
          { production: 25, consumption: 5 },
          { production: 30, consumption: 0 },
          { production: 30, consumption: 5 },
          { production: 25, consumption: 30 },
          { production: 15, consumption: 25 },
          { production: 5, consumption: 10 },
          { production: 0, consumption: 15 },
          { production: 0, consumption: 50 },
        ],
        1,
        40,
        0
      )
    ).toStrictEqual({
      data: [
        {
          production: 0,
          consumption: 10,
          battery: 0,
          exported: 0,
          imported: 10,
          batteryCurrent: 0,
        },
        {
          production: 0,
          consumption: 20,
          battery: 0,
          exported: 0,
          imported: 20,
          batteryCurrent: 0,
        },
        {
          production: 5,
          consumption: 20,
          battery: 0,
          exported: 0,
          imported: 15,
          batteryCurrent: 0,
        },
        {
          production: 10,
          consumption: 20,
          battery: 0,
          exported: 0,
          imported: 10,
          batteryCurrent: 0,
        },
        {
          production: 15,
          consumption: 20,
          battery: 0,
          exported: 0,
          imported: 5,
          batteryCurrent: 0,
        },
        {
          production: 20,
          consumption: 10,
          battery: 10,
          exported: 0,
          imported: 0,
          batteryCurrent: 10,
        },
        {
          production: 25,
          consumption: 5,
          battery: 20,
          exported: 0,
          imported: 0,
          batteryCurrent: 30,
        },
        {
          production: 30,
          consumption: 0,
          battery: 10,
          exported: 20,
          imported: 0,
          batteryCurrent: 40,
        },
        {
          production: 30,
          consumption: 5,
          battery: 0,
          exported: 25,
          imported: 0,
          batteryCurrent: 40,
        },
        {
          production: 25,
          consumption: 30,
          battery: -5,
          exported: 0,
          imported: 0,
          batteryCurrent: 35,
        },
        {
          production: 15,
          consumption: 25,
          battery: -10,
          exported: 0,
          imported: 0,
          batteryCurrent: 25,
        },
        {
          production: 5,
          consumption: 10,
          battery: -5,
          exported: 0,
          imported: 0,
          batteryCurrent: 20,
        },
        {
          production: 0,
          consumption: 15,
          battery: -15,
          exported: 0,
          imported: 0,
          batteryCurrent: 5,
        },
        {
          production: 0,
          consumption: 50,
          battery: -5,
          exported: 0,
          imported: 45,
          batteryCurrent: 0,
        },
      ],
      batteryCurrent: 0,
    });
  });
});

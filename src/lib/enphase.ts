export interface EnphaseData {
  timestamp: number;
  production: number;
  consumption: number;
}

export interface EnphaseDataImproved {
  timestamp: number;
  production: number;
  consumption: number;
  battery: number;
  exported: number;
  imported: number;
  batteryCurrent: number;
}

export interface ImprovedResult {
  data: EnphaseDataImproved[];
  batteryCurrent: number;
}

export function improve(
  data: EnphaseData[],
  multiplier = 1,
  batteryMax = 0,
  batteryCurrent = 0
): ImprovedResult {
  const result: EnphaseDataImproved[] = [];

  data.forEach((value) => {
    const d = {
      timestamp: value.timestamp,
      production: value.production * multiplier,
      consumption: value.consumption,
      battery: 0,
      exported: 0,
      imported: 0,
      batteryCurrent: batteryCurrent,
    };

    if (d.production > d.consumption) {
      // we have more electricity
      if (batteryMax > 0 && batteryCurrent <= batteryMax) {
        // we can store it
        if (d.production - d.consumption + batteryCurrent <= batteryMax) {
          // store all
          d.battery = d.production - d.consumption;
        } else {
          // store to max import rest
          d.battery = batteryMax - batteryCurrent;
          d.exported = d.production - d.consumption - d.battery;
        }
        batteryCurrent += d.battery;
      } else {
        // no battery we import
        d.exported = d.production - d.consumption;
      }
    } else {
      // need electricity
      if (batteryCurrent > 0) {
        // we have a battery
        if (d.consumption - d.production <= batteryCurrent) {
          // we can import all from battery
          d.battery -= d.consumption - d.production;
        } else {
          // we need to import
          d.battery -= batteryCurrent;
          d.imported = d.consumption - d.production + d.battery;
        }
        batteryCurrent += d.battery;
      } else {
        // import all
        d.imported = d.consumption - d.production;
      }
    }

    d.batteryCurrent = batteryCurrent;
    result.push(d);
  });

  return {
    data: result,
    batteryCurrent,
  };
}

export interface EnphaseStats {
  production: number;
  consumption: number;
  batteryStored: number;
  batteryUsed: number;
  exported: number;
  imported: number;
  dependency: number;
  autoConsumption: number;
  net: number;
}
export function stats(data: EnphaseDataImproved[]): EnphaseStats {
  const result = {
    production: 0,
    consumption: 0,
    batteryStored: 0,
    batteryUsed: 0,
    exported: 0,
    imported: 0,
    dependency: 0,
    autoConsumption: 0,
    net: 0,
  };

  data.forEach((d) => {
    result.production += d.production;
    result.consumption += d.consumption;
    if (d.battery > 0) {
      result.batteryStored += d.battery;
    } else {
      result.batteryUsed += d.battery;
    }
    result.imported += d.imported;
    result.exported += d.exported;
  });

  result.autoConsumption =
    Math.round(
      ((result.production - result.exported) / result.production) * 100 * 100
    ) / 100;
  result.dependency =
    Math.round((result.imported / result.consumption) * 100 * 100) / 100;
  result.net = result.production - result.consumption;

  return result;
}

export interface ROI {
  buy: number;
  sell: number;
}

export function roi(
  data: EnphaseStats,
  sellPrice: number,
  buyPrice: number
): ROI {
  return {
    buy: Math.round((data.imported / 1000) * buyPrice * 100) / 100,
    sell: Math.round((data.exported / 1000) * sellPrice * 100) / 100,
  };
}

export interface Stat {
  production: number;
  consumption: number;
  net: number;
  batteryMax: number;
  batteryStored: number;
  batteryUsed: number;
  buy: number;
  sell: number;
  autoConsumption: number;
  dependency: number;
  exported: number;
  imported: number;
}

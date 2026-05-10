export type LightCondition =
  | "NIGHT"
  | "BLUE HOUR"
  | "GOLDEN HOUR"
  | "DAYLIGHT"
  | "TWILIGHT";

export interface LightInfo {
  label: LightCondition;
  color: string;
  gradient: string;
  nextLabel: LightCondition;
  nextAt: string; // HH:MM 24h
  sunrise: string;
  sunset: string;
}

const STYLES: Record<LightCondition, { color: string; gradient: string }> = {
  NIGHT: {
    color: "#1a1a2e",
    gradient: "radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0b 70%)",
  },
  "BLUE HOUR": {
    color: "#2c3e5a",
    gradient: "linear-gradient(180deg, #2c3e5a 0%, #1a1f2e 60%, #0a0a0b 100%)",
  },
  "GOLDEN HOUR": {
    color: "#c89860",
    gradient: "linear-gradient(180deg, #c89860 0%, #8a5a2e 50%, #2a1810 100%)",
  },
  DAYLIGHT: {
    color: "#b8c5d0",
    gradient: "linear-gradient(180deg, #b8c5d0 0%, #6a7888 50%, #2a3340 100%)",
  },
  TWILIGHT: {
    color: "#6b4f8e",
    gradient:
      "linear-gradient(180deg, #b3478f 0%, #6b4f8e 40%, #2c3e5a 80%, #0a0a0b 100%)",
  },
};

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86400000);
}

// Approximate solar geometry for Seattle (47.6°N).
// Returns sunrise / sunset as decimal hours in local time.
function solarTimes(date: Date) {
  const N = dayOfYear(date);
  const declRad =
    (23.45 * Math.sin((((360 / 365) * (N - 81)) * Math.PI) / 180) * Math.PI) /
    180;
  const latRad = (47.6 * Math.PI) / 180;
  const cosH = -Math.tan(latRad) * Math.tan(declRad);
  const clamped = Math.max(-1, Math.min(1, cosH));
  const hourAngleDeg = (Math.acos(clamped) * 180) / Math.PI;
  const dayLength = (2 * hourAngleDeg) / 15;
  // Solar noon ~12:50 local for Seattle longitude (-122.3°W) within Pacific Time;
  // ignore equation-of-time (≤ ±15 min) for simplicity.
  const noon = 12.83;
  return {
    sunrise: noon - dayLength / 2,
    sunset: noon + dayLength / 2,
  };
}

function fmt(h: number): string {
  let hh = Math.floor(h);
  let mm = Math.round((h - hh) * 60);
  if (mm === 60) {
    hh += 1;
    mm = 0;
  }
  hh = ((hh % 24) + 24) % 24;
  return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
}

function info(
  label: LightCondition,
  nextLabel: LightCondition,
  nextAt: number,
  sunrise: number,
  sunset: number
): LightInfo {
  return {
    label,
    nextLabel,
    nextAt: fmt(nextAt),
    color: STYLES[label].color,
    gradient: STYLES[label].gradient,
    sunrise: fmt(sunrise),
    sunset: fmt(sunset),
  };
}

export function getLightConditionAt(date: Date = new Date()): LightInfo {
  const hours = date.getHours() + date.getMinutes() / 60;
  const { sunrise, sunset } = solarTimes(date);

  const dawnBlueStart = sunrise - 0.5;
  const morningGoldenEnd = sunrise + 1;
  const eveningGoldenStart = sunset - 1;
  const twilightEnd = sunset + 0.4;
  const blueHourEnd = sunset + 1.1;

  if (hours < dawnBlueStart || hours > blueHourEnd) {
    return info(
      "NIGHT",
      "BLUE HOUR",
      hours > blueHourEnd ? dawnBlueStart + 24 : dawnBlueStart,
      sunrise,
      sunset
    );
  }
  if (hours < sunrise) {
    return info("BLUE HOUR", "GOLDEN HOUR", sunrise, sunrise, sunset);
  }
  if (hours < morningGoldenEnd) {
    return info("GOLDEN HOUR", "DAYLIGHT", morningGoldenEnd, sunrise, sunset);
  }
  if (hours < eveningGoldenStart) {
    return info("DAYLIGHT", "GOLDEN HOUR", eveningGoldenStart, sunrise, sunset);
  }
  if (hours < sunset) {
    return info("GOLDEN HOUR", "TWILIGHT", sunset, sunrise, sunset);
  }
  if (hours < twilightEnd) {
    return info("TWILIGHT", "BLUE HOUR", twilightEnd, sunrise, sunset);
  }
  return info("BLUE HOUR", "NIGHT", blueHourEnd, sunrise, sunset);
}

export function fmtClock(date: Date = new Date()): string {
  return fmt(date.getHours() + date.getMinutes() / 60);
}

const MINUTE = 60 * 1000;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export const TimeList = [
  {
    value: "1m",
    label: "1m",
    time: MINUTE,
  },
  {
    value: "5m",
    label: "5m",
    time: MINUTE * 5,
  },
  {
    value: "15m",
    label: "15m",
    time: MINUTE * 15,
  },
  {
    value: "30m",
    label: "30m",
    time: MINUTE * 30,
  },
  "hr",
  {
    value: "1h",
    label: "1h",
    time: HOUR,
  },
  {
    value: "2h",
    label: "2h",
    time: HOUR * 2,
  },
  {
    value: "4h",
    label: "4h",
    time: HOUR * 4,
  },
  {
    value: "6h",
    label: "6h",
    time: HOUR * 6,
  },
  {
    value: "12h",
    label: "12h",
    time: HOUR * 12,
  },
  "hr",
  {
    value: "1D",
    label: "1D",
    time: DAY,
  },
  {
    value: "3D",
    label: "3D",
    time: DAY * 3,
  },
  "hr",
  {
    value: "1W",
    label: "1W",
    time: DAY * 7,
  },
  {
    value: "1M",
    label: "1M",
    time: DAY * 30,
  },
];

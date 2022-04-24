const MINUTE = 60 * 1000;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export const timeList = [
  ["1m", MINUTE],
  ["5m", MINUTE * 5],
  ["15m", MINUTE * 15],
  ["30m", MINUTE * 30],
  "hr",
  ["1h", HOUR],
  ["2h", HOUR * 2],
  ["4h", HOUR * 4],
  ["6h", HOUR * 6],
  ["12h", HOUR * 12],
  "hr",
  ["1D", DAY],
  ["3D", DAY * 3],
  "hr",
  ["1W", DAY * 7],
  ["1M", DAY * 30],
];

import React from 'react'
import Notice from "@/components/notice";


export function Title({ t1, t2 }: { t1: string; t2: string }) {
  return (
    <div className="title">
      <span className="t">
        {t1}
        <Notice title={t1} />
      </span>
      <span className="desc">{t2}</span>
    </div>
  );
}

export function Value({
  b,
  s,
  unit,
}: {
  b: string | number;
  s: string;
  unit: string;
}) {
  return (
    <div className="t2">
      <span className="big">{b}</span>
      <span className="s">{s}</span>
      <span className="unit">{unit}</span>
    </div>
  );
}

export function CenterData({ b, s }: { b: number | string; s: string }) {
  return (
    <div className="b1">
      <div className="b1-data">
        <div className="t">
          {b}
          <span className="t1">{s}</span>
        </div>
        <div className="t2">APY.</div>
      </div>
    </div>
  );
}
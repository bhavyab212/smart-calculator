import React, { useState } from 'react';
import { normalPDF, normalCDF, inverseNormalCDF, binomialPMF, binomialCDF, poissonPMF, poissonCDF } from '../../engine/math/statistics';

type DistType = 'normal' | 'binomial' | 'poisson';
type CalcType = 'PDF' | 'CDF' | 'InvN';

export function DistributionApp() {
  const [dist, setDist] = useState<DistType>('normal');
  const [calcType, setCalcType] = useState<CalcType>('CDF');
  const [params, setParams] = useState({ mu: '0', sigma: '1', n: '10', p: '0.5', lambda: '3', x: '0', lo: '0', hi: '1' });
  const [result, setResult] = useState<string[]>([]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setParams(p => ({ ...p, [k]: e.target.value }));
  const num = (k: string) => parseFloat(params[k as keyof typeof params]) || 0;

  const calculate = () => {
    try {
      if (dist === 'normal') {
        const mu = num('mu'), sigma = num('sigma'), x = num('x');
        const lo = num('lo'), hi = num('hi');
        if (calcType === 'PDF') {
          setResult([`P(X=${x}) = ${normalPDF(x, mu, sigma).toPrecision(10)}`]);
        } else if (calcType === 'CDF') {
          setResult([
            `P(X≤${hi}) = ${normalCDF(hi, mu, sigma).toPrecision(10)}`,
            `P(${lo}≤X≤${hi}) = ${(normalCDF(hi, mu, sigma) - normalCDF(lo, mu, sigma)).toPrecision(10)}`,
          ]);
        } else {
          const p = parseFloat(params.p) || 0.5;
          setResult([`x = ${inverseNormalCDF(p, mu, sigma).toPrecision(10)}`]);
        }
      } else if (dist === 'binomial') {
        const n = Math.round(num('n')), p = num('p'), x = Math.round(num('x'));
        setResult([
          `P(X=${x}) = ${binomialPMF(x, n, p).toPrecision(10)}`,
          `P(X≤${x}) = ${binomialCDF(x, n, p).toPrecision(10)}`,
        ]);
      } else {
        const lambda = num('lambda'), x = Math.round(num('x'));
        setResult([
          `P(X=${x}) = ${poissonPMF(x, lambda).toPrecision(10)}`,
          `P(X≤${x}) = ${poissonCDF(x, lambda).toPrecision(10)}`,
        ]);
      }
    } catch (e: any) {
      setResult([`Error: ${e.message}`]);
    }
  };

  const inp = (label: string, key: string) => (
    <div className="flex items-center gap-2">
      <span className="w-14 text-right" style={{ color: 'var(--lcd-dim)' }}>{label}</span>
      <input
        className="data-cell flex-1 border border-[rgba(100,200,50,0.2)] rounded px-1"
        type="number" value={params[key as keyof typeof params]}
        onChange={set(key)}
      />
    </div>
  );

  return (
    <div className="flex flex-col h-full text-xs font-mono p-1" style={{ color: 'var(--lcd-text)' }}>
      {/* Dist tabs */}
      <div className="flex gap-1 mb-2">
        {(['normal','binomial','poisson'] as DistType[]).map(d => (
          <button key={d}
            className={`flex-1 py-0.5 rounded text-[10px] capitalize transition-colors ${dist===d ? 'bg-[rgba(100,200,50,0.25)] border border-[rgba(100,200,50,0.4)]' : 'text-gray-500'}`}
            onClick={() => setDist(d)}>{d === 'normal' ? 'Normal' : d === 'binomial' ? 'Binomial' : 'Poisson'}</button>
        ))}
      </div>

      {/* Calc type tabs (only for normal) */}
      {dist === 'normal' && (
        <div className="flex gap-1 mb-2">
          {(['PDF','CDF','InvN'] as CalcType[]).map(c => (
            <button key={c}
              className={`flex-1 py-0.5 rounded text-[10px] transition-colors ${calcType===c ? 'bg-[rgba(100,200,50,0.2)] border border-[rgba(100,200,50,0.3)]' : 'text-gray-500'}`}
              onClick={() => setCalcType(c)}>{c}</button>
          ))}
        </div>
      )}

      {/* Parameters */}
      <div className="space-y-1 mb-2">
        {dist === 'normal' && <>
          {inp('μ', 'mu')} {inp('σ', 'sigma')}
          {calcType !== 'InvN' ? <>
            {calcType === 'CDF' && inp('Lower', 'lo')}
            {inp('Upper / x', 'hi')}
          </> : inp('p', 'p')}
        </>}
        {dist === 'binomial' && <>{inp('n', 'n')} {inp('p', 'p')} {inp('x', 'x')}</>}
        {dist === 'poisson' && <>{inp('λ', 'lambda')} {inp('x', 'x')}</>}
      </div>

      <button
        className="py-1 rounded font-bold text-[11px] mb-2"
        style={{ background: 'rgba(100,200,50,0.2)', border: '1px solid rgba(100,200,50,0.4)', color: 'var(--lcd-text)' }}
        onClick={calculate}
      >CALCULATE</button>

      {/* Results */}
      <div className="space-y-1">
        {result.map((r, i) => (
          <div key={i} className="flex justify-between">
            <span style={{ color: 'var(--lcd-dim)' }}>{r.split('=')[0]}=</span>
            <span style={{ color: 'var(--lcd-text)' }}>{r.split('=').slice(1).join('=')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

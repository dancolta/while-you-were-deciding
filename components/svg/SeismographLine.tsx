"use client";

interface SeismographLineProps {
  magnitude: number;
  animate: boolean;
}

export default function SeismographLine({ magnitude, animate }: SeismographLineProps) {
  const w = 800;
  const h = 200;
  const midY = h / 2;
  const amp = Math.min((magnitude / 7) * 70, 70);
  const pAmp = amp * 0.4;

  // Generate a seismograph trace: flat -> building oscillation -> peak -> decay -> flat
  function buildTrace(amplitude: number, freqMult: number = 1): string {
    const points: string[] = [`M 0 ${midY}`];
    const segments = 120;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments; // 0..1
      const x = t * w;
      // Envelope: bell curve peaking at center
      const env = Math.exp(-Math.pow((t - 0.5) * 4, 2));
      // Oscillation
      const freq = 12 * freqMult;
      const y = midY - Math.sin(t * freq * Math.PI) * amplitude * env;
      points.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return points.join(" ");
  }

  const pWavePath = buildTrace(pAmp, 1.6);
  const sWavePath = buildTrace(amp, 1);
  const dashLength = 2400;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      fill="none"
      aria-hidden="true"
    >
      {/* P-wave trace - lighter, higher frequency, lower amplitude */}
      <path
        d={pWavePath}
        stroke="var(--quake)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap={"round" as const}
        strokeLinejoin={"round" as const}
        opacity={0.5}
        style={{
          strokeDasharray: dashLength,
          strokeDashoffset: animate ? 0 : dashLength,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ["--dash-length" as any]: dashLength,
        } as React.CSSProperties}
        className={animate ? "animate-svg-draw" : undefined}
      />

      {/* S-wave trace - main trace, full opacity, larger amplitude */}
      <path
        d={sWavePath}
        stroke="var(--quake)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap={"round" as const}
        strokeLinejoin={"round" as const}
        style={{
          strokeDasharray: dashLength,
          strokeDashoffset: animate ? 0 : dashLength,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ["--dash-length" as any]: dashLength,
        } as React.CSSProperties}
        className={animate ? "animate-svg-draw" : undefined}
      />
    </svg>
  );
}

import { RED } from "../constants";
import { A_PATHS } from "../data/aPaths";

export default function AnarsiA({ width, height, glow }) {
  const glowStyle = glow
    ? { filter: "drop-shadow(0 0 30px rgba(210,0,0,0.95)) drop-shadow(0 0 80px rgba(180,0,0,0.7))" }
    : {};
  return (
    <svg viewBox="0 0 110 118" width={width} height={height} xmlns="http://www.w3.org/2000/svg" style={glowStyle}>
      <defs>
        <filter id="brushFilter" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85 0.4" numOctaves="4" seed="5" result="tx" />
          <feDisplacementMap in="SourceGraphic" in2="tx" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="d1" />
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.07" numOctaves="3" seed="12" result="w2" />
          <feDisplacementMap in="d1" in2="w2" scale="1.3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g fill={RED} filter="url(#brushFilter)">
        {A_PATHS.map((d, i) => <path key={i} d={d} />)}
      </g>
    </svg>
  );
}

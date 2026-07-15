import { RED } from "../constants";
import { A_PATHS } from "../data/aPaths";

export default function KaosLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", height: "clamp(2rem,5vw,4rem)" }}>
      <svg viewBox="0 0 150 90" height="100%" width="auto" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="logoFilter" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <text x="-170" y="76" fontFamily="Georgia,serif" fontSize="82" fontWeight="700" fill="#f2ede6" filter="url(#logoFilter)">NOM</text>
        <text x="135" y="76" fontFamily="Georgia,serif" fontSize="82" fontWeight="700" fill="#f2ede6" filter="url(#logoFilter)">STER</text>
        <text x="376" y="76" fontFamily="monospace" fontSize="28" fontStyle="italic" fill="#888">.com.tr</text>
        <g transform="translate(50,1) scale(0.77)">
          <g fill={RED}>
            {A_PATHS.map((d, i) => <path key={i} d={d} />)}
          </g>
        </g>
      </svg>
    </div>
  );
}

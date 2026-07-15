import { S } from "../styles";

export default function Ticker({ tickerText }) {
  return (
    <div style={S.ticker}>
      <span style={S.tickerSpan}>{tickerText + tickerText}</span>
    </div>
  );
}

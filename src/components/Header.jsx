import { S } from "../styles";
import KaosLogo from "./KaosLogo";

export default function Header({ navItems, activeNav, go }) {
  return (
    <header style={S.header}>
      <div style={S.hleft} onClick={() => go("home")}>
        <KaosLogo />
        <p style={S.tagline}>FELSEFE · ANARŞİZM · ÖZGÜR DÜŞÜNCE</p>
      </div>
      <nav style={S.hright}>
        {navItems.map(n => (
          <button key={n.id} style={{ ...S.navBtn, ...(activeNav === n.id ? S.navActive : {}) }} onClick={() => go(n.id)}>{n.label}</button>
        ))}
      </nav>
    </header>
  );
}

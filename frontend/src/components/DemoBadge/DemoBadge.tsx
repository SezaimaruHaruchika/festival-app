import { DEMO_BADGE_DESCRIPTION, DEMO_BADGE_LABEL } from "../../demo";

import "./DemoBadge.css";

// 画面上部の中央に小さく出す「デモ版」の表示。
// レイアウトを押し下げないよう固定表示にし、下にあるボタンの操作を邪魔しないよう押せないようにしている
function DemoBadge() {
  return (
    <p className="demo-badge" role="note">
      {DEMO_BADGE_LABEL}
      <span className="visually-hidden">：{DEMO_BADGE_DESCRIPTION}</span>
    </p>
  );
}

export default DemoBadge;

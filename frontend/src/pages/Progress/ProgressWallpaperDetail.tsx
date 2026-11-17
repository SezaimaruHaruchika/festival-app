import { useLayoutEffect } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import BottomNavigation from "../../components/Navigation/BottomNavigation";
import { WALLPAPER_IDS, type WallpaperId, getWallpaperPreviewUrl } from "../../api/wallpaperApi";
import { useGame } from "../../context/GameContext";
import { DEMO_WALLPAPER_NOTE } from "../../demo";
import { getWallpaperProgress } from "../../utils/hunterRankReward";
import { Chevron, WallpaperImage } from "./WallpaperParts";

import "./Progress.css";

// 一覧から開いたことを、壁紙の画面に伝える（前・次で切り替えても引き継ぐ）
const WALLPAPER_LINK_STATE = { fromList: true };

// 進捗：スマホ壁紙を1枚ずつ見る画面（/progress/wallpaper/1〜5）。デモ版では保存できない
// ランクが届いていない・番号が違うときは、一覧へ戻す（画像は読み込まない）
function ProgressWallpaperDetail() {
  const { wallpaperId } = useParams();
  const { rankExp } = useGame();
  const id = WALLPAPER_IDS.find((item) => String(item) === wallpaperId);

  if (!id || !getWallpaperProgress(rankExp).reached) {
    return <Navigate to="/progress/wallpaper" replace />;
  }

  // 壁紙を切り替えたら、読み込み・案内をやり直す
  return <WallpaperDetail key={id} id={id} />;
}

function WallpaperDetail({ id }: { id: WallpaperId }) {
  const navigate = useNavigate();
  const fromList = (useLocation().state as { fromList?: boolean } | null)?.fromList === true;

  // 一覧でスクロールした位置のまま開かないよう、上から見せる（このアプリは body がスクロールする）
  useLayoutEffect(() => {
    document.body.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, []);

  const index = WALLPAPER_IDS.indexOf(id);
  const prev = WALLPAPER_IDS[index - 1];
  const next = WALLPAPER_IDS[index + 1];

  return (
    <main className="progress-page">
      <div className="progress-content">
        <div className="progress-sub-header-row">
          {/* 一覧から開いたときは履歴を1つ戻る（戻ったあと、端末の「戻る」で進捗のトップへ戻れるように）。
              URL を直接開いたときは、一覧へ移る */}
          <Link
            className="progress-sub-back"
            to="/progress/wallpaper"
            replace
            onClick={(event) => {
              if (!fromList) return;
              event.preventDefault();
              navigate(-1);
            }}
          >
            <span className="progress-sub-back-icon" aria-hidden="true">←</span>
            壁紙一覧に戻る
          </Link>
        </div>

        <h1 className="wallpaper-detail-title">No.{id}</h1>

        {/* 前・次の壁紙で画像を挟む。戻るボタンで一覧に戻れるよう、履歴を積まずに切り替える */}
        <div className="wallpaper-detail">
          {prev ? (
            <Link className="wallpaper-step" to={`/progress/wallpaper/${prev}`} replace state={fromList ? WALLPAPER_LINK_STATE : undefined} aria-label={`前の壁紙（No.${prev}）`}>
              <Chevron direction="left" />
            </Link>
          ) : <span className="wallpaper-step is-empty" aria-hidden="true" />}

          <div className="wallpaper-detail-frame">
            {/* デモ版は保存用の原寸を公開していないので、一覧と同じプレビュー画像を見せる（保存はできない） */}
            <WallpaperImage src={getWallpaperPreviewUrl(id)} alt={`壁紙 No.${id}`} />
          </div>

          {next ? (
            <Link className="wallpaper-step" to={`/progress/wallpaper/${next}`} replace state={fromList ? WALLPAPER_LINK_STATE : undefined} aria-label={`次の壁紙（No.${next}）`}>
              <Chevron direction="right" />
            </Link>
          ) : <span className="wallpaper-step is-empty" aria-hidden="true" />}
        </div>

        <div className="wallpaper-download">
          <p className="wallpaper-download-note">{DEMO_WALLPAPER_NOTE}</p>
        </div>
      </div>

      <BottomNavigation active="progress" />
    </main>
  );
}

export default ProgressWallpaperDetail;

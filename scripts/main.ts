import { world, system } from "@minecraft/server";
import Utilities from "./events/Utilities";

// 立ち入り禁止エリアの定義
const forbiddenArea = {
  x: { min: -10, max: -3 },
  y: { min: -60, max: -56 },
  z: { min: 2, max: 9 },
};

function mainTick() {
  // プレイヤーの位置をチェックし、特定の範囲内にいる場合は押し戻す
  for (const player of world.getAllPlayers()) {
    const { x, y, z } = player.location;

    if (
      x >= forbiddenArea.x.min &&
      x <= forbiddenArea.x.max &&
      y >= forbiddenArea.y.min &&
      y <= forbiddenArea.y.max &&
      z >= forbiddenArea.z.min &&
      z <= forbiddenArea.z.max
    ) {
      const pushX =
        x > (forbiddenArea.x.max + forbiddenArea.x.min) / 2 ? forbiddenArea.x.max + 1 : forbiddenArea.x.min - 1;
      const pushZ =
        z > (forbiddenArea.z.max + forbiddenArea.z.min) / 2 ? forbiddenArea.z.max + 1 : forbiddenArea.z.min - 1;

      // プレイヤーの位置が変更された場合のみテレポートを実行
      if (pushX !== x) {
        player.teleport({ x: pushX, y, z });
        player.sendMessage("この区域には立ち入れません！");
      }
      if (pushZ !== z) {
        player.teleport({ x, y, z: pushZ });
        player.sendMessage("この区域には立ち入れません！");
      }

      // デバッグ
      // console.warn(`プレイヤー位置: (${x}, ${y}, ${z}), 押し戻し位置: (${pushX}, ${y}, ${pushZ})`);
    }
  }

  system.run(mainTick);
}

// ブロック破壊イベントのリスナーを追加
Utilities.protectBlock(forbiddenArea);
Utilities.disabledExplosion(forbiddenArea);
Utilities.protectAreaFromExplosions(forbiddenArea);

system.run(mainTick);

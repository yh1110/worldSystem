import { world, PlayerBreakBlockAfterEvent, ExplosionBeforeEvent } from "@minecraft/server";

export default class Utilities {
  //爆発を無効化
  static disabledExplosion(forbiddenArea: {
    x: { min: number; max: number };
    y: { min: number; max: number };
    z: { min: number; max: number };
  }) {
    world.beforeEvents.explosion.subscribe((event: ExplosionBeforeEvent) => {
      const explosionLocation = event.getImpactedBlocks()[0];

      if (
        explosionLocation.x >= forbiddenArea.x.min &&
        explosionLocation.x <= forbiddenArea.x.max &&
        explosionLocation.y >= forbiddenArea.y.min &&
        explosionLocation.y <= forbiddenArea.y.max &&
        explosionLocation.z >= forbiddenArea.z.min &&
        explosionLocation.z <= forbiddenArea.z.max
      ) {
        event.cancel = true;
        event.setImpactedBlocks;
      }
    });
  }

  //爆発の影響を無視
  static protectAreaFromExplosions(forbiddenArea: {
    x: { min: number; max: number };
    y: { min: number; max: number };
    z: { min: number; max: number };
  }) {
    world.beforeEvents.explosion.subscribe((event: ExplosionBeforeEvent) => {
      const impactedBlocks = event.getImpactedBlocks();
      const protectedBlocks = impactedBlocks.filter(
        (block) =>
          block.x >= forbiddenArea.x.min &&
          block.x <= forbiddenArea.x.max &&
          block.y >= forbiddenArea.y.min &&
          block.y <= forbiddenArea.y.max &&
          block.z >= forbiddenArea.z.min &&
          block.z <= forbiddenArea.z.max
      );

      if (protectedBlocks.length > 0) {
        // setImpactedBlocksは、爆発の影響を受けるブロックのリストを設定するメソッド
        event.setImpactedBlocks(impactedBlocks.filter((block) => !protectedBlocks.includes(block)));
      }
    });
  }

  //プレイヤーによるブロック破壊を無効化
  static protectBlock(forbiddenArea: {
    x: { min: number; max: number };
    y: { min: number; max: number };
    z: { min: number; max: number };
  }) {
    world.afterEvents.playerBreakBlock.subscribe((event: PlayerBreakBlockAfterEvent) => {
      const { x, y, z } = event.block.location;

      if (
        x >= forbiddenArea.x.min &&
        x <= forbiddenArea.x.max &&
        y >= forbiddenArea.y.min &&
        y <= forbiddenArea.y.max &&
        z >= forbiddenArea.z.min &&
        z <= forbiddenArea.z.max
      ) {
        // ブロックの破壊をキャンセル
        event.block.dimension.getBlock(event.block.location)?.setPermutation(event.brokenBlockPermutation);

        // プレイヤーに警告メッセージを送信
        const player = event.player;
        if (player) {
          player.sendMessage("この区域のブロックは破壊できません！");
        }
      }
    });
  }
}

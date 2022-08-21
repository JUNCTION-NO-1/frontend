/**
 * Copyright (c) 2022 ZEP Co., LTD
 */

import "zep-script";
import { ScriptPlayer } from "zep-script";

// 변수에 SpriteSheet를 읽어 저장
const dinos = [
  ScriptApp.loadSpritesheet("dino_level1.png", 48, 64),
  ScriptApp.loadSpritesheet("dino_level2.png", 48, 64),
  ScriptApp.loadSpritesheet("dino_level3.png", 48, 64),
  ScriptApp.loadSpritesheet("dino_level4.png", 48, 64),
  ScriptApp.loadSpritesheet("dino_level5.png", 48, 64),
  ScriptApp.loadSpritesheet("dino_level6.png", 48, 64),
  ScriptApp.loadSpritesheet("dino_level7.png", 48, 64),
] as const;

// 라벨 - 안내
function guideLabel(message: string) {
  ScriptApp.showCustomLabel(
    message,
    0xffffff, // 흰색글씨ㄴ
    0x075fbf, // 파란색 배경
    300, // 오프셋 300
    80, // 너비 20%
    1 // 투명도 1 -> 불투명
  );
}

// 라벨 - 액션
function ActionLabel(message: string) {
  ScriptApp.showCustomLabel(
    message,
    0xffffff, // 흰색글씨
    0x2e92ff, // 파란색 배경
    300, // 오프셋 300
    80, // 너비 20%
    1 // 투명도 1 -> 불투명
  );
}

function dino(
  player: ScriptPlayer,
  beforeLevel: number,
  afterLevel: number
): void {
  if (beforeLevel !== afterLevel) {
    const message = `${player.name} 님이 <span style="${yellowTextstyle}">드래곤</span>에 변화가 생긴 것 같아요!<span style="${yellowTextstyle}">랭킹보드</span>로 이동하여 나의 랭킹을 확인해보세요!</span>`;
    guideLabel(message);
  }
  player.sprite = dinos[afterLevel - 1];
  player.sendUpdated();
}

const bg = ScriptApp.loadSpritesheet("background.png", 1920, 1080);

const board = ScriptApp.loadSpritesheet("board.png", 360, 346);

ScriptApp.onStart.Add(function () {
  ScriptMap.putObject(0, 0, bg, { overlap: false });
  ScriptMap.putObjectWithKey(5, 15, board, { overlap: false });
});

ScriptApp.addOnTileTouched(10, 20, function (player) {
  ScriptApp.httpGet(
    `http://52.78.184.202/dinosaur/ranking/?id=${player.id}&nickname=${player.name}`,
    null,
    (res) => {
      const response = JSON.parse(res) as RankingResponse;
      if (player.tag.dashBoardWidget === null) {
        player.tag.dashBoardWidget = player.showWidget(
          "dashBoard.html",
          "top",
          500,
          500
        );
        player.tag.dashBoardWidget.sendMessage({
          dashBoardInfo: [...response],
        });
        player.tag.dashBoardWidget.onMessage.Add(function (player, msg) {
          if (msg.type === "dashBoardClose") {
            if (player.tag.dashBoardWidget !== null) {
              player.tag.dashBoardWidget.destroy();
              player.tag.dashBoardWidget = null;
            }
          }
        });
      }
    }
  );
});

// 플레이어 입장
ScriptApp.onJoinPlayer.Add(function (player) {
  player.tag = {
    widget: null,
    dashBoardWidget: null,
    level: 1,
    totalTime: 0,
  };
  ScriptApp.httpGet(
    `http://52.78.184.202/dinosaur/?id=${player.id}&nickname=${player.name}`,
    null,
    (res) => {
      const response = JSON.parse(res) as DinosaurResponse;
      const beforeLevel = player.tag.level;
      player.tag.level = response.level;
      player.tag.totalTime = response.totalTime;
      player.sendUpdated();
      dino(player, beforeLevel, player.tag.level);
    }
  );
  const message = `${player.name} 님이 <span style="${yellowTextstyle}">드래곤월드</span>에 입장하셨습니다.`;
  ScriptApp.sayToAll(`${player.name}님이 입장하셨습니다.`, 0x00ffff); // 하늘색으로 표시하기
  guideLabel(message);
});

ScriptApp.addOnKeyDown(65, function (player) {
  ScriptApp.sayToAll(`${player.name}님 타이머 시간을 입력해주세요(분).`);
});

ScriptApp.onSay.Add(function (player, text) {
  if (isNumber(text)) {
    const time = Number(text);
    player.tag.widget = player.showWidget("timer.html", "top", 1920, 1080);
    if (player.tag.widget !== null) {
      player.tag.widget.sendMessage({
        timer: time,
      });
      player.tag.widget.onMessage.Add(function (player, msg) {
        switch (msg.type) {
          // forcedWidgetClose <-> widgetClose 변경
          case "forcedWidgetClose":
            ScriptApp.httpGet(
              `http://52.78.184.202/dinosaur/quit/?id=${player.id}&minute=${time}`,
              null,
              (res) => {
                const response = JSON.parse(res) as TimerEndResponse;
                const beforeLevel = player.tag.level;
                player.tag.level = response.level;
                player.tag.totalTime = response.totalTime;
                dino(player, beforeLevel, player.tag.level);
                // const message = `<span style="${yellowTextstyle}">랭킹보드</span>로 이동하여 나의 랭킹을 확인해보세요!`;
                // guideLabel(message);
              }
            );
            if (player.tag.widget !== null) {
              player.tag.widget.destroy();
              player.tag.widget = null;
            }
            break;
          case "widgetClose":
            if (player.tag.widget !== null) {
              player.tag.widget.destroy();
              player.tag.widget = null;
            }
            break;
          default:
            break;
        }
      });
    }
  }
});

ScriptApp.onDestroy.Add(function () {
  ScriptMap.clearAllObjects();
});

// utils

const isNumber = (text: string): boolean => {
  if (typeof text !== "string") {
    return false;
  }

  if (text.trim() === "") {
    return false;
  }

  return !Number.isNaN(Number(text));
};

// style

const InButtonstyle =
  "display: inline-block; text-align: center; width:12em.; height:1.2em; line-height: 1.2em; color: black; background-color: white; font-size: 1.2em; border-radius:12px";

const yellowTextstyle = "color: #F6F800";

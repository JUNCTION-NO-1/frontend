/**
 * Copyright (c) 2022 ZEP Co., LTD
 */

import "zep-script";

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

// 플레이어 입장
ScriptApp.onJoinPlayer.Add(function (player) {
  let nickname = player.name;
  let message = `${nickname} 님이 <span style="${yellowTextstyle}">드래곤월드</span>에 입장하셨습니다.`;
  ScriptApp.sayToAll(`${nickname}님이 입장하셨습니다.`, 0x00ffff); // 하늘색으로 표시하기
  guideLabel(message);
});

// // 공룡 post
// ScriptApp.httpPost (
//   "http://52.78.184.202:80/dinosour/",
//   null,
//   {
//     'id' : player.id,
//     'nickname' : player.name
//   },
//   (res) => {
//     // 응답 결과를 JSON 오브젝트로 변경
//     let response = JSON.parse(res);
//     player.name = response.words[0];
//     player.sendUpdated();
//   }
// );

ScriptApp.addOnKeyDown(65, function (player) {
  ScriptApp.sayToAll(`${player.name}님 타이머 시간을 입력해주세요(분).`);
  ScriptApp.onSay.Add(function (player, text) {
    if (isNumber(text)) {
      const time = Number(text);
      let widget = player.showWidget("timer.html", "top", 1000, 1000);
      widget.sendMessage({
        timer: time,
      });
    }
  });
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

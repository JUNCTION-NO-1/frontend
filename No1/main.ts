/**
 * Copyright (c) 2022 ZEP Co., LTD
 */

import { Script } from "vm";
import "zep-script";

let InButtonstyle = "display: inline-block; text-align: center; width:12em.; height:1.2em; line-height: 1.2em; color: black; background-color: white; font-size: 1.2em; border-radius:12px";

let yellowTextstyle = "color: #F6F800"

// 라벨 - 안내
function guideLabel(message) {
  ScriptApp.showCustomLabel(
  message,
  0xffffff, // 흰색글씨ㄴ
  0x075FBF, // 파란색 배경
  300, // 오프셋 300
  80, // 너비 20%
  1 // 투명도 1 -> 불투명
  );
}

// 라벨 - 액션
function ActionLabel (message) {
  ScriptApp.showCustomLabel(
  message,
  0xffffff, // 흰색글씨
  0x2E92FF, // 파란색 배경
  300, // 오프셋 300
  80, // 너비 20%
  1 // 투명도 1 -> 불투명
  );
}

// 라벨 - 타이머
function TimerLabel (message) {
  ScriptApp.showCustomLabel(
  message,
  0x075FBF, // 파란 배경
  0xffffff, // 흰색 글씨
  300, // 오프셋 300
  30, // 너비 30%
  1 // 투명도 1 -> 불투명
  );
}

// 플레이어 입장
ScriptApp.onJoinPlayer.Add(function (player) {
  let nickname = player.name
  let message = `${nickname} 님이 <span style="${yellowTextstyle}">드래곤월드</span>에 입장하셨습니다.`
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

ScriptApp.onDestroy.Add(function () {
  ScriptMap.clearAllObjects();
});
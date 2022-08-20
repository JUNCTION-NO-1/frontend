interface DinosaurResponse {
  id: string;
  level: number;
  totalTime: number;
}

interface TimerEndResponse {
  totalTime: number;
  level: number;
}

type RankingResponse = Ranking[];

interface Ranking {
  ranking: number;
  nickname: string;
  totalTime: number;
  level: number;
}

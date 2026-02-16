import { type Island } from './emotions';

export interface Mission {
  text: string;
  emoji: string;
}

const MISSIONS: Record<Island, Mission[]> = {
  joy: [
    { text: '이 순간 사진으로 남기기', emoji: '📸' },
    { text: '감사한 것 3개 적기', emoji: '✍️' },
    { text: '좋아하는 사람에게 기쁜 소식 전하기', emoji: '📱' },
  ],
  peace: [
    { text: '산책하며 이 기분 유지하기', emoji: '🚶' },
    { text: '좋아하는 차 한 잔 마시기', emoji: '🍵' },
    { text: '5분 동안 눈 감고 쉬기', emoji: '😌' },
  ],
  love: [
    { text: '소중한 사람에게 메시지 보내기', emoji: '💌' },
    { text: '고마운 사람에게 감사 표현하기', emoji: '🤗' },
    { text: '따뜻한 기억 하나 더 떠올리기', emoji: '💭' },
  ],
  hope: [
    { text: '내일 할 작은 목표 하나 세우기', emoji: '🎯' },
    { text: '영감 준 것을 메모해두기', emoji: '📝' },
    { text: '새로운 것 하나 시도해보기', emoji: '🌟' },
  ],
  sadness: [
    { text: '좋아하는 음악 한 곡 듣기', emoji: '🎵' },
    { text: '따뜻한 음료 마시기', emoji: '☕' },
    { text: '편한 사람과 대화 나누기', emoji: '💬' },
  ],
  anger: [
    { text: '3분 심호흡 챌린지', emoji: '🌬️' },
    { text: '종이에 감정 쏟아내기', emoji: '📄' },
    { text: '잠깐 바깥 공기 마시기', emoji: '🌿' },
  ],
  fear: [
    { text: '지금 확실한 것 3가지 떠올리기', emoji: '✅' },
    { text: '5분 명상', emoji: '🧘' },
    { text: '오늘 잘한 것 하나 칭찬하기', emoji: '👏' },
  ],
  fatigue: [
    { text: '10분 스트레칭', emoji: '🤸' },
    { text: '일찍 잠자리에 들기', emoji: '🛏️' },
    { text: '가벼운 간식으로 에너지 충전', emoji: '🍫' },
  ],
};

export const getRandomMission = (island: Island): Mission => {
  const pool = MISSIONS[island];
  return pool[Math.floor(Math.random() * pool.length)];
};

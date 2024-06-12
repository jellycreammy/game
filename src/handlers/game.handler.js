export const gameStart = (payload) => {
    console.log('Game started with payload:', payload);
    // 초기화 코드 및 필요한 로직 추가
  };
  
  export const gameEnd = (payload) => {
    console.log('Game ended with payload:', payload);
    // 점수 저장 및 필요한 로직 추가
    // 예: 데이터베이스에 저장
  };
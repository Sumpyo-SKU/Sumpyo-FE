// API 연동 전 환기 알림 화면용 더미 데이터입니다.
// channel은 설정 화면의 알림 종류와 연결된다.
// ventilation: 환기 알림, complaint: 새 민원 알림, sensor: 센서 오류 알림
// 나중에 API로 바꿀 때도 이 구분으로 걸러 보여 준다.
const alertsDummy = {
  title: '환기 알림',
  sectionLabel: '오늘',
  items: [
    {
      id: 'alert-317',
      channel: 'ventilation',
      tone: 'urgent',
      title: '317호 환기 필요',
      body: '지금 1,180ppm',
      time: '방금',
    },
    {
      id: 'alert-509',
      channel: 'ventilation',
      tone: 'soon',
      title: '509호 20분 뒤 환기 필요',
      body: '20분 뒤 1,180ppm 예상',
      time: '5분 전',
    },
    {
      id: 'alert-510',
      channel: 'complaint',
      tone: 'complaint',
      title: '510호 반복 민원',
      body: '같은 민원이 7건 모였어요',
      time: '1시간 전',
    },
    {
      id: 'alert-sensor',
      channel: 'sensor',
      tone: 'sensor',
      title: '608호 센서 오류',
      body: '센서 신호가 끊겼어요',
      time: '12분 전',
    },
  ],
}

export default alertsDummy

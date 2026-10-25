// API 연동 전 캠퍼스톡 화면용 더미 데이터입니다.
const talkDummy = {
  title: '캠퍼스톡',
  building: '북악관',
  zone: '연락 볼 구역',
  edit: '편집',
  send: '캠퍼스톡 보내기',
  action: '확인 하기',
  tabs: [
    { id: 'all', label: '전체 12', left: '33px', width: '54px' },
    { id: 'unread', label: '미확인 7', left: '119px', width: '54px' },
    { id: 'checking', label: '확인 중 3', left: '201px', width: '62px' },
    { id: 'answered', label: '답변 완료 2', left: '291px', width: '62px' },
  ],
  floorTitle: '1. 층을 선택해 주세요. (선택)',
  roomTitle: '2. 강의실을 선택해 주세요. (선택)',
  save: '저장하기',
  sendFloorTitle: '1. 연락 보낼 층을 선택해 주세요. (필수)',
  sendRoomTitle: '2. 강의실을 선택해 주세요. (선택)',
  sendNoteTitle: '3. 특이 사항을 입력해 주세요.',
  sendSubmit: '캠퍼스톡 보내기',
  detailLabel: '캠퍼스톡 내용',
  answerLabel: '답변',
  answerEmpty: ['아직 답변이 없어요', '근처에 있다면 먼저 알려주세요'],
  replies: [
    { id: 'floor', label: '지금 북악관 1층에 있어요', width: 228 },
    { id: 'people', label: '지금 OO호에 사람 있어요', width: 228 },
    { id: 'class', label: 'OO호 지금 수업 중이에요', width: 210 },
    { id: 'custom', label: '직접 입력', width: 87 },
  ],
  sendRooms: ['608', '617', '618', '619', '620', '621'],
  sendPhrases: [
    { id: 'here', text: '북악관 1층에 계신 분 있나요?', width: 228 },
    { id: 'check', text: 'OO호에 사람 있는지 확인해주실 수 있나요?', width: 298 },
    { id: 'class', text: 'OO호 지금 수업 중인가요?', width: 210 },
    { id: 'window', text: '창문 확인 필요', width: 142 },
    { id: 'ac', text: '에어컨 확인 필요', width: 159 },
  ],
  floors: [1, 2, 3, 4, 5, 6, 7],
  roomsByFloor: {
    1: ['108', '117', '118', '119', '120', '121'],
    2: ['208', '217', '218', '219', '220', '221'],
    3: ['308', '317', '318', '319', '320', '321'],
    4: ['408', '417', '418', '419', '420', '421'],
    5: ['508', '517', '518', '519', '520', '521'],
    6: ['608', '617', '618', '619', '620', '621'],
    7: ['708', '717', '718', '719', '720', '721'],
  },
  posts: [
    {
      id: 't-617',
      status: 'unread',
      badge: '미확인',
      place: '6층 · 617호',
      body: '지금 수업 중인가요?',
      time: '6분 전',
      detail: {
        title: '북악관 1층',
        date: '2026.10.06 14:00',
        author: '김근로 · 북악관 6층',
        room: '110호',
        lines: ['110호 지금 수업 중인가요?', '에어컨 업체에서 오신다고 하셔서요.'],
        placeholder: '북악관 1층 연락에 답변하기',
      },
    },
    {
      id: 't-102',
      status: 'checking',
      badge: '확인 중',
      place: '1층',
      body: '102호 창문이 망가져 있어요. 확인 부탁드립니다.',
      time: '43분 전',
    },
    {
      id: 't-105',
      status: 'answered',
      badge: '답변 완료',
      place: '1층 · 105호',
      body: '105호 에어컨이 이상해요. 확인 부탁드립니다.',
      time: '53분 전',
    },
  ],
}

export function postsForZone(floors, rooms) {
  if (!floors.length) return talkDummy.posts
  const cards = [
    { id: 'zone-a', status: 'unread', badge: '미확인', time: '6분 전' },
    { id: 'zone-b', status: 'checking', badge: '확인 중', time: '43분 전' },
    { id: 'zone-c', status: 'answered', badge: '답변 완료', time: '53분 전' },
  ]
  if (rooms.length) {
    const bodies = [
      '지금 수업 중인가요?',
      '102호 창문이 망가져 있어요. 확인 부탁드립니다.',
      '105호 에어컨이 이상해요. 확인 부탁드립니다.',
    ]
    return cards.map((card, index) => {
      const room = rooms[index % rooms.length]
      return { ...card, place: `${room.floor}층 · ${room.id}호`, body: bodies[index] }
    })
  }
  const floor = floors[0]
  return [
    { ...cards[0], place: `${floor}층 · ${floor}17호`, body: '지금 수업 중인가요?' },
    { ...cards[1], place: `${floor}층`, body: '창문이 망가져 있어요. 확인 부탁드립니다.' },
    { ...cards[2], place: `${floor}층 · ${floor}08호`, body: '105호 에어컨이 이상해요. 확인 부탁드립니다.' },
  ]
}

export default talkDummy

// API 연동 전 강의실 선택용 더미 데이터입니다.
const building = '북악관'

function roomRange(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

const roomNumbers = [...roomRange(501, 520), ...roomRange(601, 620)]

const classroomsDummy = {
  building,
  rooms: roomNumbers.map((number) => `${building} · ${number}호`),
  defaultRoom: `${building} · 617호`,
}

export default classroomsDummy

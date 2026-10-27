// API 연동 전 캠퍼스 현황 화면용 더미 데이터입니다.
const columns = [30, 113, 196, 279, 368, 458, 541, 624, 707]

const statusCopy = {
  exceed: { label: '기준 초과 · 환기 전', color: '#f75255', dot: '#f75255' },
  warn: { label: '약 20분 뒤 기준 초과 예상', color: '#ff9d00', dot: '#ffbd54' },
  normal: { label: '정상', color: '#74a842', dot: '#9edb62' },
}

function toneFromCo2(co2) {
  if (co2 >= 1200) return 'exceed'
  if (co2 >= 1000) return 'warn'
  return 'normal'
}

function classroom(number, co2, column, row, extras = {}) {
  const tone = toneFromCo2(co2)
  return {
    id: String(number),
    kind: 'room',
    number: String(number),
    name: `${number}호`,
    co2,
    co2Label: co2.toLocaleString('en-US'),
    showCo2: extras.showCo2 !== false,
    temperature: extras.temperature ?? '23.8°C',
    humidity: extras.humidity ?? '54%',
    tone,
    status: statusCopy[tone],
    column,
    row,
  }
}

function toilet(id, column) {
  return { id, kind: 'toilet', label: '화장실', column, row: 'top' }
}

const highlighted = { temperature: '24.1°C', humidity: '61%' }

const campusDummy = {
  building: '북악관',
  defaultFloor: '6',
  defaultRoomId: '607',
  floors: [
    { id: '2', label: '2F', enabled: false },
    { id: '3', label: '3F', enabled: false },
    { id: '5', label: '5F', enabled: true },
    { id: '6', label: '6F', enabled: true },
    { id: '7', label: '7F', enabled: false },
  ],
  columns,
  halls: [
    { left: 30, width: 374 },
    { left: 404, width: 380 },
  ],
  plans: {
    6: [
      classroom(621, 620, 0, 'top', { temperature: '23.4°C', humidity: '48%' }),
      classroom(620, 580, 1, 'top', { temperature: '23.6°C', humidity: '51%' }),
      classroom(619, 710, 2, 'top', { temperature: '24.0°C', humidity: '55%' }),
      toilet('6-toilet-left', 3),
      toilet('6-toilet-right', 5),
      classroom(618, 580, 6, 'top', { temperature: '23.2°C', humidity: '49%' }),
      classroom(617, 710, 7, 'top', { temperature: '24.2°C', humidity: '57%' }),
      classroom(616, 645, 8, 'top', { temperature: '23.9°C', humidity: '52%' }),
      classroom(604, 650, 0, 'bottom', { temperature: '23.5°C', humidity: '50%' }),
      classroom(605, 890, 1, 'bottom', { temperature: '24.4°C', humidity: '58%' }),
      classroom(606, 1080, 2, 'bottom', highlighted),
      classroom(607, 1250, 3, 'bottom', highlighted),
      classroom(608, 710, 4, 'bottom', { temperature: '23.7°C', humidity: '53%' }),
      classroom(612, 640, 5, 'bottom', { showCo2: false, temperature: '23.3°C', humidity: '47%' }),
      classroom(613, 890, 6, 'bottom', { temperature: '24.3°C', humidity: '56%' }),
      classroom(614, 1080, 7, 'bottom', { temperature: '24.6°C', humidity: '60%' }),
      classroom(615, 1250, 8, 'bottom', { temperature: '24.8°C', humidity: '63%' }),
    ],
    5: [
      classroom(521, 620, 0, 'top', { temperature: '23.1°C', humidity: '46%' }),
      classroom(520, 580, 1, 'top', { temperature: '23.5°C', humidity: '50%' }),
      classroom(519, 710, 2, 'top', { temperature: '24.0°C', humidity: '54%' }),
      toilet('5-toilet-left', 3),
      toilet('5-toilet-right', 5),
      classroom(518, 580, 6, 'top', { temperature: '23.4°C', humidity: '49%' }),
      classroom(517, 710, 7, 'top', { temperature: '24.1°C', humidity: '55%' }),
      classroom(516, 645, 8, 'top', { temperature: '23.8°C', humidity: '52%' }),
      classroom(504, 650, 0, 'bottom', { showCo2: false, temperature: '23.2°C', humidity: '48%' }),
      classroom(505, 740, 1, 'bottom', { showCo2: false, temperature: '23.6°C', humidity: '51%' }),
      classroom(506, 690, 2, 'bottom', { showCo2: false, temperature: '24.0°C', humidity: '53%' }),
      classroom(507, 720, 3, 'bottom', { showCo2: false, temperature: '23.9°C', humidity: '50%' }),
      classroom(508, 710, 4, 'bottom', { temperature: '24.2°C', humidity: '56%' }),
      classroom(512, 660, 5, 'bottom', { showCo2: false, temperature: '23.3°C', humidity: '47%' }),
      classroom(513, 890, 6, 'bottom', { temperature: '24.4°C', humidity: '58%' }),
      classroom(514, 1080, 7, 'bottom', { temperature: '24.5°C', humidity: '60%' }),
      classroom(515, 1250, 8, 'bottom', { temperature: '24.7°C', humidity: '62%' }),
    ],
  },
}

export default campusDummy

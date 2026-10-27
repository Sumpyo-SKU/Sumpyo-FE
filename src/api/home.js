import APIService from './api.js'

function readingsPath(roomId, { from, to, interval } = {}) {
  const search = new URLSearchParams()
  if (from) search.set('from', from)
  if (to) search.set('to', to)
  if (interval !== undefined && interval !== null && interval !== '') search.set('interval', String(interval))
  const query = search.toString()
  return `/rooms/${roomId}/readings${query ? `?${query}` : ''}`
}

// 실측 그래프. 구간 안의 측정값을 interval 분 평균으로 가져온다.
export function getRoomMeasuredReadings(roomId, { from, to, interval, demoLogin } = {}) {
  if (roomId === undefined || roomId === null || roomId === '') {
    throw new Error('강의실 ID가 필요합니다.')
  }

  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get(readingsPath(roomId, { from, to, interval }), { headers })
}

// 최신 측정값. 마지막 측정값과 최근 10분 안의 센서 연결 여부를 가져온다.
export function getRoomLatestReading(roomId, { demoLogin } = {}) {
  if (roomId === undefined || roomId === null || roomId === '') {
    throw new Error('강의실 ID가 필요합니다.')
  }

  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get(`/rooms/${roomId}/readings/latest`, { headers })
}

function predictionsPath(roomId, { from, to } = {}) {
  const search = new URLSearchParams()
  if (from) search.set('from', from)
  if (to) search.set('to', to)
  const query = search.toString()
  return `/rooms/${roomId}/predictions${query ? `?${query}` : ''}`
}

// 예측 그래프. 시각마다 가장 최근 예측값 목록을 가져온다. from, to를 비우면 지금부터 내일 0시까지다.
export function getRoomPredictions(roomId, { from, to, demoLogin } = {}) {
  if (roomId === undefined || roomId === null || roomId === '') {
    throw new Error('강의실 ID가 필요합니다.')
  }

  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get(predictionsPath(roomId, { from, to }), { headers })
}

// 수업 중 예보. 진행 중인 수업, 없으면 오늘 남은 다음 수업의 CO₂ 예보를 가져온다. 수업이 없으면 data는 null이다.
export function getRoomNextClassForecast(roomId, { demoLogin } = {}) {
  if (roomId === undefined || roomId === null || roomId === '') {
    throw new Error('강의실 ID가 필요합니다.')
  }

  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get(`/rooms/${roomId}/forecast/next-class`, { headers })
}

// 바깥 공기 최신값. 기온, 습도, 미세먼지(PM10) 중 가장 최근 값을 가져온다. 아직 모은 값이 없으면 data는 null이다.
export function getLatestOutdoorAir({ demoLogin } = {}) {
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get('/outdoor/latest', { headers })
}

// 내 강의실. 담당 구역 안에서 센서가 있는 강의실을 건물, 층, 호수 순으로 가져온다. 빈 배열이면 담당 구역 설정이 필요하다.
export function getMyRooms({ demoLogin } = {}) {
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get('/me/rooms', { headers })
}

function actionsPath({ zone, buildingId, status } = {}) {
  const search = new URLSearchParams()
  if (zone) search.set('zone', zone)
  if (buildingId !== undefined && buildingId !== null && buildingId !== '') search.set('buildingId', String(buildingId))
  const statusValue = Array.isArray(status) ? status.filter(Boolean).join(',') : status
  if (statusValue) search.set('status', statusValue)
  const query = search.toString()
  return `/actions${query ? `?${query}` : ''}`
}

// 조치 목록. 환기 조치 카드를 급한 순서대로 가져온다. zone을 비우면 전체, mine이면 내 담당 구역이다.
export function getActions({ zone, buildingId, status, demoLogin } = {}) {
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get(actionsPath({ zone, buildingId, status }), { headers })
}

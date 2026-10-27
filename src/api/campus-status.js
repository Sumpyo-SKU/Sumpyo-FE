import APIService from './api.js'

export function roomAirStatus(detail) {
  const level = detail?.co2Level
  const overBy = Number(detail?.co2OverBy)
  const tone = level === 'NORMAL'
    ? { color: '#74a842', dot: '#9edb62' }
    : level === 'CAUTION'
      ? { color: '#ff9d00', dot: '#ffbd54' }
      : overBy > 0
        ? { color: '#f75255', dot: '#f75255' }
        : { color: '#5a6072', dot: '#5a6072' }
  const overLabel = overBy > 0 ? `기준보다 ${overBy.toLocaleString('ko-KR')} 높음` : ''
  const label = detail?.pendingAction?.message || (level === 'NORMAL' ? '정상' : overLabel || level || '—')
  return { ...tone, label }
}

// 건물 목록. 화면 표시 순서대로 건물 이름과 최고층을 가져온다.
export function getBuildings({ demoLogin } = {}) {
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get('/buildings', { headers })
}

// 층 평면도. 그 층 강의실의 CO₂, 상태와 경보 강의실 수를 가져온다. 방이 없으면 rooms는 빈 배열이다.
export function getFloorPlan(buildingId, floor, { demoLogin } = {}) {
  if (buildingId === undefined || buildingId === null || buildingId === '' || floor === undefined || floor === null || floor === '') {
    throw new Error('건물과 층이 필요합니다.')
  }

  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get(`/buildings/${buildingId}/floors/${floor}`, { headers })
}

// 강의실 상세. 평면도 바텀시트와 강의실 상세가 함께 쓰는 현재 CO₂, 온습도, 쾌적도, 대기 조치, 현재·다음 수업을 가져온다.
export function getRoomDetail(roomId, { demoLogin } = {}) {
  if (roomId === undefined || roomId === null || roomId === '') {
    throw new Error('강의실 ID가 필요합니다.')
  }

  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get(`/rooms/${roomId}`, { headers })
}

// 환기 시작. PENDING·CHECKED 조치를 진행 중으로 바꾸고, 시작 시점 CO₂와 처리자를 기록한다.
export function startAction(actionId, { demoLogin } = {}) {
  if (actionId === undefined || actionId === null || actionId === '') {
    throw new Error('조치 ID가 필요합니다.')
  }

  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.post(`/actions/${actionId}/start`, undefined, { headers })
}

// 조치 확인. PENDING 조치를 CHECKED로 바꾼다. 이미 CHECKED면 그대로 성공한다.
export function checkAction(actionId, { demoLogin } = {}) {
  if (actionId === undefined || actionId === null || actionId === '') {
    throw new Error('조치 ID가 필요합니다.')
  }

  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.patch(`/actions/${actionId}/check`, null, { headers })
}

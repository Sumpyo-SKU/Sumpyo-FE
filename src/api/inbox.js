import APIService from './api.js'

function complaintsPath({ status, buildingId, roomId, q, cursor, size } = {}) {
  const search = new URLSearchParams()
  if (status) search.set('status', status)
  if (buildingId != null && buildingId !== '') search.set('buildingId', String(buildingId))
  if (roomId != null && roomId !== '') search.set('roomId', String(roomId))
  if (q) search.set('q', q)
  if (cursor) search.set('cursor', cursor)
  if (size) search.set('size', String(size))
  const query = search.toString()
  return `/complaints${query ? `?${query}` : ''}`
}

function repeatedPath({ buildingId, week } = {}) {
  const search = new URLSearchParams()
  if (buildingId != null && buildingId !== '') search.set('buildingId', String(buildingId))
  if (week) search.set('week', week)
  const query = search.toString()
  return `/complaints/repeated${query ? `?${query}` : ''}`
}

// 이번 주 반복 민원. 그 주에 민원이 5건 이상인 방을 많은 순으로 가져온다. week를 비우면 이번 주고, 센서가 없는 방은 overThresholdDays가 null이다.
export function getRepeatedComplaints({ buildingId, week, demoLogin } = {}) {
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get(repeatedPath({ buildingId, week }), { headers })
}

// 민원 목록. 접수 최신순으로 가져온다. cursor가 없으면 처음부터고, hasNext가 false면 끝이다. q는 건물명·호실·내용 검색이다.
export function getComplaints({ status, buildingId, roomId, q, cursor, size, demoLogin } = {}) {
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get(complaintsPath({ status, buildingId, roomId, q, cursor, size }), { headers })
}

// 민원 상세. 접수 내용, 접수 시점 공기, 가장 최근 조치를 가져온다. 측정이 없으면 snapshot은 null이다.
export function getComplaint(complaintId, { demoLogin } = {}) {
  if (complaintId === undefined || complaintId === null || complaintId === '') {
    throw new Error('민원 ID가 필요합니다.')
  }

  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get(`/complaints/${complaintId}`, { headers })
}

// AI 추천 조치. 접수 상태 민원만 받을 수 있다. retry가 참이면 다른 방법으로 추천을 바꾼다.
export function recommendComplaint(complaintId, { retry = false, demoLogin } = {}) {
  if (complaintId === undefined || complaintId === null || complaintId === '') {
    throw new Error('민원 ID가 필요합니다.')
  }

  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.post(`/complaints/${complaintId}/recommendation`, { retry: Boolean(retry) }, { headers })
}

// 추천대로 처리 시작. PENDING·CHECKED 조치를 진행 중으로 바꾸고, 민원도 처리 중으로 바꾼다. 단계가 없으면 바로 완료된다.
export function startComplaintAction(actionId, { demoLogin } = {}) {
  if (actionId === undefined || actionId === null || actionId === '') {
    throw new Error('조치 ID가 필요합니다.')
  }

  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.post(`/actions/${actionId}/start`, undefined, { headers })
}

// 체크리스트 단계 완료. 진행 중인 조치의 단계만 완료할 수 있다. 에어컨은 희망 온도를 함께 보낸다. 모든 단계를 마치면 완료된다.
export function completeComplaintStep(actionId, { type, targetTemp } = {}, { demoLogin } = {}) {
  if (actionId === undefined || actionId === null || actionId === '') {
    throw new Error('조치 ID가 필요합니다.')
  }
  if (!type) throw new Error('단계가 필요합니다.')

  const body = { type }
  if (type === 'AC_ON' && targetTemp != null && targetTemp !== '') body.targetTemp = Number(targetTemp)
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.patch(`/actions/${actionId}/steps`, body, { headers })
}

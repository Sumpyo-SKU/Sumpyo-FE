import APIService from './api.js'

function lookupPath({ code, buildingId, number } = {}) {
  const search = new URLSearchParams()
  if (code) search.set('code', code)
  if (buildingId != null && buildingId !== '') search.set('buildingId', String(buildingId))
  if (number) search.set('number', String(number))
  return `/rooms/lookup?${search.toString()}`
}

// 건물 목록. 화면 표시 순서대로 건물 이름과 최고층을 가져온다.
export function getComplaintBuildings({ demoLogin } = {}) {
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get('/buildings', { headers })
}

// 호실 찾기. QR은 code로, 위치 선택은 buildingId와 number로 찾는다. number의 앞뒤 공백과 끝의 '호'는 서버가 무시한다.
export function findComplaintRoom({ code, buildingId, number } = {}) {
  return APIService.public.get(lookupPath({ code, buildingId, number }))
}

// 학생 민원 제출. 로그인 없이 접수한다. 같은 사람이 같은 방에 10분 안에 다시 내면 거절된다.
export function submitComplaint({ roomId, categories, content, clientId } = {}) {
  if (roomId === undefined || roomId === null || roomId === '') {
    throw new Error('호실을 찾을 수 없어요.')
  }
  if (!clientId) throw new Error('유효하지 않은 입력입니다.')

  const unique = [...new Set((categories ?? []).filter(Boolean))]
  if (unique.length === 0) throw new Error('주요 내용을 하나 이상 선택해 주세요.')

  const body = {
    roomId: Number(roomId),
    categories: unique,
    clientId,
  }
  const note = typeof content === 'string' ? content.trim() : ''
  if (note) body.content = note.slice(0, 500)
  return APIService.public.post('/complaints', body)
}

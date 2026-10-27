import APIService from './api.js'

export function mapMyZones(data) {
  return (data ?? []).map((item) => ({
    buildingId: item.buildingId,
    building: item.buildingName,
    floors: [...(item.floors ?? [])].sort((left, right) => left - right),
  }))
}

// 내 담당 구역 조회. 담당 구역이 없으면 빈 배열이고, 그때는 온보딩을 보여 준다.
export function getMyZones({ demoLogin } = {}) {
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get('/me/zones', { headers })
}

function zoneSaveBody(zones) {
  return (zones ?? [])
    .map((zone) => ({
      buildingId: zone.buildingId ?? (zone.building === '북악관' ? 1 : undefined),
      floors: [...new Set(zone.floors ?? [])].sort((left, right) => left - right),
    }))
    .filter((zone) => zone.buildingId != null && zone.floors.length > 0)
}

// 내 담당 구역 저장. 보낸 목록으로 담당 구역 전체를 교체한다.
export function saveMyZones(zones, { demoLogin } = {}) {
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.put('/me/zones', zoneSaveBody(zones), { headers })
}

export function mapMySettings(data) {
  return {
    notice: {
      ventilation: Boolean(data?.notifyVentilation),
      complaint: Boolean(data?.notifyComplaint),
      sensor: Boolean(data?.notifySensorError),
    },
    threshold: {
      ppm: data?.co2Threshold ?? 1000,
      fan: Boolean(data?.alertEnabled),
      lead: data?.alertLeadMinutes ?? 15,
      tempMin: data?.tempMin ?? 20,
      tempMax: data?.tempMax ?? 26,
      humidityMin: data?.humidityMin ?? 40,
      humidityMax: data?.humidityMax ?? 60,
    },
  }
}

// 내 설정 조회. 환기 기준값, 알림 스위치, 적정 온도·습도를 가져온다.
export function getMySettings({ demoLogin } = {}) {
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get('/me/settings', { headers })
}

// 내 설정 변경. 보낸 항목만 바꾸고, 기본값으로 되돌릴 때도 기본값을 이 요청으로 보낸다.
export function saveMySettings(settings, { demoLogin } = {}) {
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.put('/me/settings', settings, { headers })
}

// 민원 QR 이미지. 강의실의 PNG QR을 가져온다. 강의실이 아니면 발급할 수 없다.
export function getRoomQrImage(roomId, { demoLogin } = {}) {
  if (roomId === undefined || roomId === null || roomId === '') {
    throw new Error('강의실 ID가 필요합니다.')
  }

  const headers = {
    Accept: 'image/png',
    ...(demoLogin ? { 'X-Demo-Login': demoLogin } : {}),
  }
  return APIService.public.get(`/rooms/${roomId}/qr`, { headers, responseType: 'blob' })
}

// 민원 QR 정보. 화면에 보여줄 강의실 이름과 QR에 담긴 주소를 가져온다.
export function getRoomQrInfo(roomId, { demoLogin } = {}) {
  if (roomId === undefined || roomId === null || roomId === '') {
    throw new Error('강의실 ID가 필요합니다.')
  }

  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get(`/rooms/${roomId}/qr/info`, { headers })
}

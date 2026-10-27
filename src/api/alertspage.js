import APIService from './api.js'

// 알림 읽음. 본인 알림만 읽음 처리한다. 이미 읽은 알림이면 그대로 성공한다.
export function markNotificationRead(notificationId, { demoLogin } = {}) {
  if (notificationId === undefined || notificationId === null || notificationId === '') {
    throw new Error('알림 ID가 필요합니다.')
  }

  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.patch(`/notifications/${notificationId}/read`, null, { headers })
}

function notificationsPath({ cursor, size } = {}) {
  const search = new URLSearchParams()
  if (cursor) search.set('cursor', cursor)
  if (size) search.set('size', String(size))
  const query = search.toString()
  return `/notifications${query ? `?${query}` : ''}`
}

// 안 읽은 알림 수. 최근 7일 동안 읽지 않은 알림 개수를 종 배지에 쓴다.
export function getUnreadNotificationCount({ demoLogin } = {}) {
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get('/notifications/unread-count', { headers })
}

// 알림 목록. 최근 7일 알림을 최신순으로 가져온다. cursor가 없으면 처음부터다.
export function getNotifications({ cursor, size, demoLogin } = {}) {
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get(notificationsPath({ cursor, size }), { headers })
}

// 모두 읽음. 내 안 읽은 알림을 한 번에 읽음 처리한다.
export function markAllNotificationsRead({ demoLogin } = {}) {
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.patch('/notifications/read-all', null, { headers })
}

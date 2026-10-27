import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../../api/alertspage.js'
import campusEllipse from '../../assets/images/bg-campus-ellipse.svg'
import backIcon from '../../assets/images/icon-back.svg'
import urgentIcon from '../../assets/images/icon-alert-urgent.svg'
import soonIcon from '../../assets/images/icon-alert-soon.svg'
import complaintIcon from '../../assets/images/icon-alert-complaint.svg'
import sensorIcon from '../../assets/images/icon-setting-sensor.svg'

const tones = {
  urgent: { icon: urgentIcon, background: '#fde9e5' },
  soon: { icon: soonIcon, background: '#fff3dc' },
  complaint: { icon: complaintIcon, background: '#eef0f8' },
  sensor: { icon: sensorIcon, background: '#ecf4fd' },
}

const PageRoot = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100dvh;
  background: #f0f8ff;
  color: #161a2b;
  font-family: 'Noto Sans KR', sans-serif;
`

const Screen = styled.div`
  position: relative;
  width: 390px;
  min-height: max(844px, 100dvh);
  overflow: hidden;
  background: #f0f8ff;
`

const Ellipse = styled.img`
  position: absolute;
  top: 410px;
  left: -252px;
  z-index: 0;
  pointer-events: none;
`

const BackButton = styled.button`
  position: absolute;
  top: 69px;
  left: 21px;
  z-index: 2;
  width: 22px;
  height: 22px;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`

const Title = styled.h1`
  position: absolute;
  top: 67px;
  left: 52px;
  z-index: 1;
  margin: 0;
  color: #161a2b;
  font-size: 21px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: -0.4px;
`

const ReadAllButton = styled.button`
  position: absolute;
  top: 72px;
  right: 16px;
  z-index: 2;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: #56a6f0;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  line-height: 19px;
  cursor: pointer;
`

const List = styled.main`
  position: absolute;
  top: 112px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  overflow: auto;
  padding: 0 16px 24px;
`

const SectionLabel = styled.h2`
  margin: 0 0 10px 4px;
  color: #5f6a8f;
  font-size: 13px;
  font-weight: 600;
  line-height: 19px;
`

const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Card = styled.button`
  position: relative;
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: 73px;
  margin: 0;
  padding: 14px 14px 0;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.38);
  backdrop-filter: blur(12px);
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    inset 0 -1px 0 rgba(255, 255, 255, 0.3);
  font: inherit;
  text-align: left;
  cursor: pointer;
  opacity: ${({ $read }) => ($read ? 0.55 : 1)};
`

const Note = styled.p`
  margin: 0 0 10px 4px;
  color: ${({ $muted }) => ($muted ? '#5f6a8f' : '#c93a24')};
  font-size: 13px;
  font-weight: 500;
  line-height: 19px;
`

const IconBadge = styled.span`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-top: 3px;
  border-radius: 18px;
  background: ${({ $background }) => $background};
`

const Copy = styled.div`
  min-width: 0;
  margin-left: 12px;
  padding-right: 64px;
`

const ItemTitle = styled.p`
  margin: 0;
  overflow: hidden;
  color: #1d2752;
  font-size: 15px;
  font-weight: 700;
  line-height: 24px;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ItemBody = styled.p`
  margin: 0;
  overflow: hidden;
  color: #5f6a8f;
  font-size: 13px;
  font-weight: 400;
  line-height: 21px;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ItemTime = styled.time`
  position: absolute;
  top: 8px;
  right: 12px;
  color: #5f6a8f;
  font-size: 11px;
  font-weight: 500;
  line-height: 19px;
`

function alertTone(type) {
  const value = String(type || '')
  if (value.includes('SENSOR')) return 'sensor'
  if (value.includes('COMPLAINT') || value.includes('REPEAT')) return 'complaint'
  if (value.includes('SOON') || value.includes('PREDICT')) return 'soon'
  return 'urgent'
}

function alertChannel(type) {
  const tone = alertTone(type)
  if (tone === 'sensor') return 'sensor'
  if (tone === 'complaint') return 'complaint'
  return 'ventilation'
}

function relativeTime(createdAt) {
  if (!createdAt) return ''
  const diff = Date.now() - new Date(createdAt).getTime()
  const minutes = Math.max(0, Math.round(diff / 60000))
  if (minutes < 1) return '방금'
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  return `${Math.round(hours / 24)}일 전`
}

function mapNotification(item) {
  return {
    id: item.notificationId,
    notificationId: item.notificationId,
    title: item.title,
    body: item.body,
    time: relativeTime(item.createdAt),
    tone: alertTone(item.type),
    channel: alertChannel(item.type),
    read: Boolean(item.read),
  }
}

function AlertsPage({ notice, onUnreadCount, onBack }) {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const cursorRef = useRef(null)
  const hasNextRef = useRef(false)
  const loadingRef = useRef(false)

  async function loadNotifications(cursor) {
    if (loadingRef.current) return
    loadingRef.current = true
    setLoading(true)
    try {
      const payload = await getNotifications({ cursor })
      const data = payload.data ?? {}
      const nextItems = (data.content ?? []).map(mapNotification)
      setItems((current) => (cursor ? [...current, ...nextItems] : nextItems))
      hasNextRef.current = Boolean(data.hasNext && data.nextCursor)
      cursorRef.current = data.hasNext ? data.nextCursor : null
      if (!cursor && data.unreadCount != null) onUnreadCount?.(data.unreadCount)
      setError('')
    } catch (loadError) {
      setError(loadError.message || '알림을 불러오지 못했습니다.')
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const visibleItems = items.filter((item) => notice?.[item.channel] !== false)

  async function handleReadAll() {
    try {
      setError('')
      await markAllNotificationsRead()
      setItems((current) => current.map((item) => ({ ...item, read: true })))
      onUnreadCount?.(0)
    } catch (loadError) {
      setError(loadError.message || '알림을 모두 읽음 처리하지 못했습니다.')
    }
  }

  async function handleRead(item) {
    if (item.read) return
    try {
      setError('')
      const payload = await markNotificationRead(item.notificationId)
      const readId = payload.data?.notificationId ?? item.notificationId
      setItems((current) => current.map((entry) => (
        String(entry.notificationId) === String(readId) ? { ...entry, read: true } : entry
      )))
      onUnreadCount?.()
    } catch (loadError) {
      setError(loadError.message || '알림을 읽음 처리하지 못했습니다.')
    }
  }

  return (
    <PageRoot>
      <Screen>
        <Ellipse src={campusEllipse} alt="" width="875" height="875" />

        <BackButton type="button" aria-label="홈으로 돌아가기" onClick={onBack}>
          <img src={backIcon} alt="" width="22" height="22" />
        </BackButton>
        <Title>환기 알림</Title>
        <ReadAllButton type="button" onClick={handleReadAll}>
          모두 읽음
        </ReadAllButton>

        <List
          onScroll={(event) => {
            const node = event.currentTarget
            const nearEnd = node.scrollHeight - node.scrollTop - node.clientHeight < 80
            if (nearEnd && hasNextRef.current) loadNotifications(cursorRef.current)
          }}
        >
          <SectionLabel>최근 7일</SectionLabel>
          {error ? <Note>{error}</Note> : null}
          {!loading && visibleItems.length === 0 ? <Note $muted>최근 7일 알림이 없어요</Note> : null}
          <Items>
            {visibleItems.map((item) => {
              const tone = tones[item.tone] ?? tones.complaint
              return (
                <Card key={item.id} type="button" $read={item.read} onClick={() => handleRead(item)}>
                  <IconBadge $background={tone.background}>
                    <img src={tone.icon} alt="" width={item.tone === 'sensor' ? '19.8333' : '18'} height={item.tone === 'sensor' ? '19.8333' : '18'} />
                  </IconBadge>
                  <Copy>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemBody>{item.body}</ItemBody>
                  </Copy>
                  <ItemTime>{item.time}</ItemTime>
                </Card>
              )
            })}
          </Items>
        </List>
      </Screen>
    </PageRoot>
  )
}

export default AlertsPage

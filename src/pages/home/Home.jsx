import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Header from '../../common/Header/Header.jsx'
import Footer from '../../common/Footer/Footer.jsx'
import Card from '../../components/Card/Card.jsx'
import ForecastView from './ForecastView.jsx'
import AlertsPage from './AlertsPage.jsx'
import SettingsPage from './SettingsPage.jsx'
import ZonePage from './ZonePage.jsx'
import ThresholdPage from './ThresholdPage.jsx'
import QrPage from './QrPage.jsx'
import RoomPicker from './RoomPicker.jsx'
import {
  getActions,
  getLatestOutdoorAir,
  getMyRooms,
  getRoomLatestReading,
  getRoomMeasuredReadings,
  getRoomNextClassForecast,
  getRoomPredictions,
} from '../../api/home.js'
import { getUnreadNotificationCount } from '../../api/alertspage.js'
import { getMySettings, mapMySettings, saveMySettings } from '../../api/settingspage.js'
import bgEllipse1 from '../../assets/images/bg-ellipse-1.svg'
import bgEllipse2 from '../../assets/images/bg-ellipse-2.svg'
import bgEllipse3 from '../../assets/images/bg-ellipse-3.svg'
import bgEllipse4 from '../../assets/images/bg-ellipse-4.svg'
import bgEllipse5 from '../../assets/images/bg-ellipse-5.svg'
import characterBase from '../../assets/images/character-base.png'
import characterLeaf from '../../assets/images/character-leaf.png'
import characterWind from '../../assets/images/character-wind.png'
import characterPlug from '../../assets/images/character-plug.png'
import characterMid from '../../assets/images/character-mid.png'
import characterLow from '../../assets/images/character-low.png'
import co2Icon from '../../assets/images/icon-co2.svg'
import temperatureIcon from '../../assets/images/icon-temperature.svg'
import humidityIcon from '../../assets/images/icon-humidity.svg'
import dividerLine from '../../assets/images/divider-line.svg'
import dustIcon from '../../assets/images/icon-dust.svg'
import outdoorTempIcon from '../../assets/images/icon-outdoor-temp.svg'

const HomeRoot = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: max(844px, 100dvh);
  background: #d7e6fc;
  color: #263e50;
  font-family: 'Noto Sans KR', sans-serif;
`

const HomeScreen = styled.div`
  position: relative;
  width: 390px;
  min-height: max(844px, 100dvh);
  overflow: hidden;
  background: #d7e6fc;
`

const HomeBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
`

const BackgroundEllipse = styled.img`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
`

const Segment = styled.div`
  position: absolute;
  top: 122px;
  left: 118px;
  z-index: 1;
  display: flex;
  align-items: center;
  width: 140px;
  height: 33px;
  padding: 3px;
  border-radius: 40px;
  background: #f2fbff;
`

const SegmentThumb = styled.span`
  position: absolute;
  top: 3px;
  left: ${({ $forecast }) => ($forecast ? '51px' : '3px')};
  width: ${({ $forecast }) => ($forecast ? '86px' : '50px')};
  height: 27px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow:
    0 -1px 6px rgba(0, 0, 0, 0.1),
    0 1px 6px rgba(0, 0, 0, 0.1);
  transition:
    left 0.2s ease,
    width 0.2s ease;
`

const SegmentItem = styled.button`
  position: relative;
  z-index: 1;
  flex: ${({ $forecast, $selected }) => ($forecast ? ($selected ? 1 : 'none') : $selected ? 'none' : 1)};
  width: ${({ $forecast, $selected }) => {
    if ($forecast && $selected) return 'auto'
    if ($selected || $forecast) return '50px'
    return 'auto'
  }};
  padding: 0;
  border: none;
  background: none;
  color: ${({ $selected }) => ($selected ? '#263e50' : '#6d96bc')};
  font: inherit;
  font-size: 13.3px;
  font-weight: 600;
  line-height: 13.314px;
  letter-spacing: -0.6657px;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
`

const LoadNote = styled.p`
  position: absolute;
  top: 208px;
  left: 16px;
  z-index: 1;
  width: 358px;
  margin: 0;
  color: #c93a24;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  text-align: center;
`

const Score = styled.p`
  position: absolute;
  top: 174px;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 390px;
  margin: 0;
  letter-spacing: -0.6657px;
`

const ScoreValue = styled.span`
  color: #263e50;
  font-size: 35px;
  font-weight: 700;
  line-height: 29.29px;
`

const ScoreSuffix = styled.span`
  margin-bottom: 1px;
  color: #6d96bc;
  font-size: 13.3px;
  font-weight: 600;
  line-height: 13.314px;
`

const Hero = styled.div`
  position: absolute;
  top: 232px;
  left: 46px;
  z-index: 1;
  width: 296px;
  height: 227px;
`

const Character = styled.div`
  position: absolute;
  top: 49px;
  left: 29px;
  width: 238px;
  height: 180px;
`

const CharacterBase = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const GaugeSvg = styled.svg`
  display: block;
  overflow: visible;
`

const MidCharacter = styled.img`
  position: absolute;
  top: 45px;
  left: 59px;
  width: 187px;
  height: 193px;
  object-fit: cover;
`

const LowCharacter = styled.img`
  position: absolute;
  top: 100px;
  left: 41px;
  width: 211px;
  height: 135px;
  object-fit: cover;
`

const CharacterPart = styled.div`
  position: absolute;
  top: ${({ $top }) => $top};
  right: ${({ $right }) => $right};
  bottom: ${({ $bottom }) => $bottom};
  left: ${({ $left }) => $left};
  overflow: hidden;
  pointer-events: none;

  img {
    position: absolute;
    top: ${({ $imgTop }) => $imgTop};
    left: ${({ $imgLeft }) => $imgLeft};
    width: ${({ $imgWidth }) => $imgWidth};
    height: ${({ $imgHeight }) => $imgHeight};
  }
`

const MetricsCard = styled(Card)`
  position: absolute;
  top: 492px;
  right: 16px;
  left: 16px;
  z-index: 1;
`

const Metric = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 3px;
`

const MetricLabel = styled.span`
  color: #6d96bc;
  font-size: 11px;
  font-weight: 600;
  line-height: normal;
`

const MetricValue = styled.p`
  display: flex;
  align-items: flex-end;
  margin: 0;
  color: #263e50;
  white-space: nowrap;
`

const MetricNumber = styled.span`
  font-size: 26.4px;
  font-weight: 600;
  line-height: 1;
`

const MetricUnit = styled.span`
  margin: 0 0 3px 2px;
  font-size: ${({ $ppm }) => ($ppm ? '11px' : '12.1px')};
  font-weight: 500;
  line-height: 1;
`

const MetricDivider = styled.div`
  position: relative;
  flex: none;
  width: 0.7px;
  height: 80px;

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
  }
`

const AirLabel = styled.p`
  position: absolute;
  top: 620px;
  left: 70.5px;
  z-index: 1;
  margin: 0;
  color: #6d96bc;
  font-size: 11px;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
  transform: translateX(-50%);
`

const OutdoorRow = styled.div`
  position: absolute;
  top: 657px;
  right: 16px;
  left: 16px;
  z-index: 1;
  display: flex;
  gap: 14px;

  ${Card} {
    flex: 1;
    min-width: 0;
  }
`

const OutdoorCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.8px;
`

const OutdoorName = styled.span`
  color: #6d96bc;
  font-size: 11.6px;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
`

const OutdoorValue = styled.p`
  display: flex;
  align-items: flex-end;
  margin: 0;
  color: #263e50;
`

const OutdoorNumber = styled.span`
  font-size: 21.543px;
  font-weight: 700;
  line-height: 1;
`

const OutdoorUnit = styled.span`
  margin: 0 0 2px 2px;
  font-size: 9.943px;
  font-weight: 500;
  line-height: 1;
`

const backgroundEllipses = [
  { src: bgEllipse1, top: '39px', left: '-275px', width: '925', height: '922' },
  { src: bgEllipse2, top: '-198px', left: '-26px', width: '1009', height: '1009' },
  { src: bgEllipse3, top: '-373px', left: '-643px', width: '1109', height: '1109' },
  { src: bgEllipse4, top: '437px', left: '-187px', width: '768', height: '768' },
  { src: bgEllipse5, top: '-373px', left: '-643px', width: '1109', height: '1109' },
]

const gaugeArc = 'M 49.7278 204.733 A 113.473 113.473 0 1 1 246.272 204.733'

const gaugeColors = {
  high: ['#9DCCFF', '#57AEFF'],
  mid: ['#ECDFC0', '#FFAA6E'],
  low: ['#C2D7FF', '#FF7A6E'],
}

function comfortBand(score) {
  const value = Number(score)
  if (!Number.isFinite(value) || value >= 70) return 'high'
  if (value >= 40) return 'mid'
  return 'low'
}

function comfortRatio(score) {
  const value = Number(score)
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value / 100))
}

function ComfortGauge({ score, band }) {
  const ratio = comfortRatio(score)
  const [from, to] = gaugeColors[band]

  return (
    <GaugeSvg viewBox="0 0 296 226.933" width="296" height="226.933" aria-hidden="true">
      <defs>
        <linearGradient id="home-comfort-gauge" x1="148" y1="34.545" x2="148" y2="204.733" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <path d={gaugeArc} fill="none" stroke="#D7D7E3" strokeWidth="32.56" strokeLinecap="round" />
      {ratio > 0 ? (
        <path
          d={gaugeArc}
          fill="none"
          stroke="url(#home-comfort-gauge)"
          strokeWidth="32.56"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${ratio * 100} 100`}
        />
      ) : null}
    </GaugeSvg>
  )
}

function preferredRoom(list, zones) {
  const bukak = (zones ?? []).find((zone) => zone.building === '북악관' || Number(zone.buildingId) === 1)
  const floors = (bukak?.floors ?? []).map(Number)
  const label = floors.includes(6) ? '북악관 · 617호' : floors.includes(5) ? '북악관 · 517호' : ''
  return (label && list.find((item) => item.label === label)) || list[0] || null
}

function displayNumber(value) {
  if (value === undefined || value === null || value === '') return '—'
  const number = Number(value)
  if (Number.isNaN(number)) return String(value)
  return Number.isInteger(number) ? number.toLocaleString('ko-KR') : String(number)
}

function clockLabel(value) {
  if (!value) return ''
  const text = String(value)
  if (/^\d{2}:\d{2}$/.test(text)) return text
  const time = text.split('T')[1]
  return time ? time.slice(0, 5) : ''
}

function localStamp(date) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function todayAtNine() {
  const date = new Date()
  date.setHours(9, 0, 0, 0)
  return date
}

function sinceNine(points) {
  const start = todayAtNine().getTime()
  return (points ?? []).filter((point) => new Date(point?.at).getTime() >= start)
}

function messageTone(action) {
  if (action.recommend === 'CLOSE' || action.title?.includes('닫')) return 'calm'
  if (action.title?.includes('수업 전')) return 'warn'
  return 'alert'
}

function badgeTone(action) {
  if (!action.relative || action.timeLabel === '지금' || action.timing === 'NOW') return 'now'
  if (String(action.relative).includes('시간')) return 'later'
  return 'soon'
}

function actionCard(action) {
  const tone = messageTone(action)
  const metric = action.metric === 'CO2' ? 'CO2' : 'other'
  const scale = metric === 'CO2' ? 1500 : 100
  const value = Number(action.predictedValue)
  const markerSource = Number(metric === 'CO2' ? action.threshold : action.rangeMax)
  const unit = action.metric === 'CO2'
    ? ` ${action.unit || 'ppm'} · 기준 ${displayNumber(action.threshold)}`
    : ` ${action.unit || ''}${action.rangeMin != null ? ` · 적정 ${action.rangeMin}–${action.rangeMax}` : ''}`

  return {
    id: action.actionId,
    name: action.number ? `${action.number}호` : action.room,
    badge: {
      text: !action.relative || action.timeLabel === '지금' ? '지금' : `${action.timeLabel} · ${action.relative}`,
      tone: badgeTone(action),
    },
    message: action.title,
    messageTone: tone,
    note: action.reason,
    metricLabel: action.metricLabel,
    metricValue: displayNumber(action.predictedValue),
    metricUnit: unit,
    barPercent: Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round((value / scale) * 100))) : 0,
    markerPercent: Number.isFinite(markerSource) ? Math.max(0, Math.min(100, Math.round((markerSource / scale) * 100))) : 0,
    barColor: tone === 'calm' ? '#6e9bcb' : tone === 'warn' ? '#ffad60' : '#e5585d',
  }
}

function forecastViewData({ room, forecast, readings, predictions, actions }) {
  const measured = sinceNine(readings?.points)
  const predicted = sinceNine(predictions?.points)
  const lastMeasured = measured[measured.length - 1]
  const lastPredicted = predicted[predicted.length - 1]
  const buildingName = room?.label?.split('·')[0]?.trim() || '담당 구역'
  const threshold = forecast?.threshold ?? 1000

  return {
    summary: {
      caption: forecast?.start ? `${forecast.start}–${forecast.end} 수업 · ${forecast.condition || '창문을 닫아두면'}` : '오늘 남은 수업이 없어요',
      title: forecast?.headline || '예정된 수업이 없어요',
      co2Lead: '수업 종료 시 CO₂ ',
      co2Value: forecast?.co2AtEnd == null ? '—' : `${displayNumber(forecast.co2AtEnd)} ppm`,
      co2Tail: forecast?.co2AtEnd == null ? '' : ' 예상',
    },
    chart: {
      yLabels: ['1,500', '1,000', '200'],
      times: [
        '09:00',
        clockLabel(lastMeasured?.at) || '지금',
        clockLabel(lastPredicted?.at) || forecast?.end || '—',
      ],
      axisFrom: localStamp(todayAtNine()),
      measuredLabel: lastMeasured ? displayNumber(lastMeasured.co2) : '—',
      predictedLabel: forecast?.co2AtEnd != null ? displayNumber(forecast.co2AtEnd) : displayNumber(lastPredicted?.co2),
      measuredPoints: measured,
      predictedPoints: predicted,
      legendMeasured: '실측',
      legendPredicted: '예측',
      legendGuide: `${displayNumber(threshold)} ppm · 환기 권장선`,
    },
    sectionTitle: `창문 환기 예측 · ${buildingName}`,
    rooms: (actions ?? []).map(actionCard),
  }
}

function Home({ onNavigate, zones, onZonesChange }) {
  const [view, setView] = useState('now')
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [latest, setLatest] = useState(null)
  const [outdoor, setOutdoor] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [classForecast, setClassForecast] = useState(null)
  const [readings, setReadings] = useState(null)
  const [predictions, setPredictions] = useState(null)
  const [actions, setActions] = useState([])
  const [loadError, setLoadError] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [alertsOpen, setAlertsOpen] = useState(false)
  const [settingsView, setSettingsView] = useState(null)
  // 알림 종류는 설정 화면 토글과 연결된다. 끈 종류는 알림 페이지에 나오지 않는다.
  // ventilation: 환기 알림, complaint: 새 민원 알림, sensor: 센서 오류 알림
  // 나중에 API로 바꿀 때도 이 구분으로 걸러 보여 준다.
  const [notice, setNotice] = useState({
    ventilation: true,
    complaint: true,
    sensor: true,
  })
  const [threshold, setThreshold] = useState({ ppm: 1000, fan: true, lead: 15 })
  const [settingsError, setSettingsError] = useState('')
  const isForecast = view === 'forecast'
  const forecastData = forecastViewData({
    room: selectedRoom,
    forecast: classForecast,
    readings,
    predictions,
    actions,
  })
  useEffect(() => {
    let cancelled = false

    getMySettings()
      .then((payload) => {
        if (cancelled) return
        const settings = mapMySettings(payload.data)
        setNotice(settings.notice)
        setThreshold(settings.threshold)
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error.message || '설정을 불러오지 못했습니다.')
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadHome() {
      const [roomsResult, outdoorResult, unreadResult] = await Promise.allSettled([
        getMyRooms(),
        getLatestOutdoorAir(),
        getUnreadNotificationCount(),
      ])
      if (cancelled) return

      if (roomsResult.status === 'fulfilled') {
        const list = roomsResult.value.data ?? []
        setRooms(list)
        setSelectedRoom(preferredRoom(list, zones))
        setLoadError(list.length ? '' : '담당 구역을 설정하면 강의실이 보여요')
      } else {
        setLoadError(roomsResult.reason?.message || '강의실을 불러오지 못했습니다.')
      }

      if (outdoorResult.status === 'fulfilled') setOutdoor(outdoorResult.value.data ?? null)
      if (unreadResult.status === 'fulfilled') setUnreadCount(unreadResult.value.data?.unreadCount ?? 0)
    }

    loadHome()
    return () => {
      cancelled = true
    }
  }, [zones])

  useEffect(() => {
    if (!selectedRoom?.roomId) return undefined
    let cancelled = false

    async function loadRoom() {
      const roomId = selectedRoom.roomId
      const [latestResult, forecastResult, readingsResult, predictionsResult, actionsResult] = await Promise.allSettled([
        getRoomLatestReading(roomId),
        getRoomNextClassForecast(roomId),
        getRoomMeasuredReadings(roomId, { from: localStamp(todayAtNine()) }),
        getRoomPredictions(roomId),
        getActions({ zone: 'mine', buildingId: selectedRoom.buildingId }),
      ])
      if (cancelled) return

      if (latestResult.status === 'fulfilled') setLatest(latestResult.value.data ?? null)
      else setLoadError(latestResult.reason?.message || '측정값을 불러오지 못했습니다.')
      if (forecastResult.status === 'fulfilled') setClassForecast(forecastResult.value.data ?? null)
      if (readingsResult.status === 'fulfilled') setReadings(readingsResult.value.data ?? null)
      if (predictionsResult.status === 'fulfilled') setPredictions(predictionsResult.value.data ?? null)
      if (actionsResult.status === 'fulfilled') setActions(actionsResult.value.data ?? [])
    }

    loadRoom()
    return () => {
      cancelled = true
    }
  }, [selectedRoom])

  if (settingsView === 'zones') {
    return (
      <ZonePage
        zones={zones}
        onChange={onZonesChange}
        onBack={() => setSettingsView('settings')}
      />
    )
  }

  if (settingsView === 'threshold') {
    return (
      <ThresholdPage
        saved={threshold}
        onBack={() => setSettingsView('settings')}
        onSave={async (next) => {
          const payload = await saveMySettings({
            co2Threshold: next.ppm,
            alertEnabled: next.fan,
            alertLeadMinutes: next.lead,
          })
          const settings = mapMySettings(payload.data)
          setNotice(settings.notice)
          setThreshold(settings.threshold)
          setSettingsError('')
          setSettingsView('settings')
        }}
        onReset={() => saveMySettings({
          co2Threshold: 1000,
          tempMin: 20,
          tempMax: 26,
          humidityMin: 40,
          humidityMax: 60,
          alertEnabled: true,
          alertLeadMinutes: 15,
        }).then((payload) => {
          const settings = mapMySettings(payload.data)
          setNotice(settings.notice)
          setThreshold(settings.threshold)
          setSettingsError('')
          return settings.threshold
        })}
      />
    )
  }

  if (settingsView === 'qr') {
    return <QrPage roomId={selectedRoom?.roomId} onBack={() => setSettingsView('settings')} />
  }

  if (settingsView === 'settings') {
    return (
      <SettingsPage
        notice={notice}
        ppm={threshold.ppm}
        error={settingsError}
        onToggle={async (key) => {
          const field = {
            ventilation: 'notifyVentilation',
            complaint: 'notifyComplaint',
            sensor: 'notifySensorError',
          }[key]
          const nextValue = !notice[key]
          setNotice((current) => ({ ...current, [key]: nextValue }))
          try {
            const payload = await saveMySettings({ [field]: nextValue })
            const settings = mapMySettings(payload.data)
            setNotice(settings.notice)
            setThreshold(settings.threshold)
            setSettingsError('')
          } catch (error) {
            setNotice((current) => ({ ...current, [key]: !nextValue }))
            setSettingsError(error.message || '설정을 저장하지 못했습니다.')
          }
        }}
        onBack={() => setSettingsView(null)}
        onOpenThreshold={() => setSettingsView('threshold')}
        onOpenZones={() => setSettingsView('zones')}
        onOpenQr={() => setSettingsView('qr')}
      />
    )
  }

  if (alertsOpen) {
    return (
      <AlertsPage
        notice={notice}
        onUnreadCount={(count) => {
          if (typeof count === 'number') {
            setUnreadCount(count)
            return
          }
          getUnreadNotificationCount()
            .then((payload) => setUnreadCount(payload.data?.unreadCount ?? 0))
            .catch(() => {})
        }}
        onBack={() => setAlertsOpen(false)}
      />
    )
  }

  const comfort = comfortBand(latest?.comfortScore)

  return (
    <HomeRoot>
      <HomeScreen>
        <HomeBackground aria-hidden="true">
          {backgroundEllipses.map((ellipse) => (
            <BackgroundEllipse
              key={`${ellipse.src}-${ellipse.top}`}
              src={ellipse.src}
              alt=""
              width={ellipse.width}
              height={ellipse.height}
              $top={ellipse.top}
              $left={ellipse.left}
            />
          ))}
        </HomeBackground>


        <Header
          room={selectedRoom?.label || (loadError ? '강의실 없음' : '강의실 선택')}
          pickerOpen={pickerOpen}
          unreadCount={unreadCount}
          onRoomClick={() => setPickerOpen((open) => !open)}
          onBellClick={() => {
            setPickerOpen(false)
            setAlertsOpen(true)
          }}
          onSettingsClick={() => {
            setPickerOpen(false)
            setSettingsView('settings')
          }}
        />

        <main>
          <Segment>
            <SegmentThumb $forecast={isForecast} />
            <SegmentItem type="button" $forecast={isForecast} $selected={!isForecast} onClick={() => setView('now')}>
              지금
            </SegmentItem>
            <SegmentItem type="button" $forecast={isForecast} $selected={isForecast} onClick={() => setView('forecast')}>
              수업 중 예보
            </SegmentItem>
          </Segment>
          {loadError ? <LoadNote>{loadError}</LoadNote> : null}

          {isForecast ? (
            <ForecastView data={forecastData} />
          ) : (
            <>
              <Score>
                <ScoreValue>{displayNumber(latest?.comfortScore)}</ScoreValue>
                <ScoreSuffix> / 100 쾌적도</ScoreSuffix>
              </Score>

              <Hero>
                <ComfortGauge score={latest?.comfortScore} band={comfort} />
                {comfort === 'low' ? <LowCharacter src={characterLow} alt="쾌적도를 나타내는 캐릭터" /> : null}
                {comfort === 'mid' ? <MidCharacter src={characterMid} alt="쾌적도를 나타내는 캐릭터" /> : null}
                {comfort === 'high' ? (
                  <Character>
                    <CharacterBase src={characterBase} alt="쾌적도를 나타내는 캐릭터" />
                    <CharacterPart $top="65.56%" $right="76.47%" $bottom="27.78%" $left="15.55%" $imgTop="4.95%" $imgLeft="1%" $imgWidth="97.27%" $imgHeight="91.59%">
                      <img src={characterLeaf} alt="" />
                    </CharacterPart>
                    <CharacterPart $top="30.56%" $right="80.25%" $bottom="58.89%" $left="7.98%" $imgTop="2.75%" $imgLeft="1.96%" $imgWidth="96.28%" $imgHeight="95.51%">
                      <img src={characterWind} alt="" />
                    </CharacterPart>
                    <CharacterPart $top="52.22%" $right="10.5%" $bottom="41.11%" $left="75.63%" $imgTop="1.87%" $imgLeft="0.49%" $imgWidth="101.22%" $imgHeight="94.77%">
                      <img src={characterPlug} alt="" />
                    </CharacterPart>
                  </Character>
                ) : null}
              </Hero>

              <MetricsCard $variant="metric">
                <Metric>
                  <img src={co2Icon} alt="" width="24" height="24" />
                  <MetricLabel>CO₂</MetricLabel>
                  <MetricValue>
                    <MetricNumber>{displayNumber(latest?.co2)}</MetricNumber>
                    <MetricUnit $ppm>ppm</MetricUnit>
                  </MetricValue>
                </Metric>
                <MetricDivider>
                  <img src={dividerLine} alt="" width="80" height="0.7" />
                </MetricDivider>
                <Metric>
                  <img src={temperatureIcon} alt="" width="24" height="24" />
                  <MetricLabel>교실 온도</MetricLabel>
                  <MetricValue>
                    <MetricNumber>{displayNumber(latest?.temp)}</MetricNumber>
                    <MetricUnit>°C</MetricUnit>
                  </MetricValue>
                </Metric>
                <MetricDivider>
                  <img src={dividerLine} alt="" width="80" height="0.7" />
                </MetricDivider>
                <Metric>
                  <img src={humidityIcon} alt="" width="24" height="24" />
                  <MetricLabel>습도</MetricLabel>
                  <MetricValue>
                    <MetricNumber>{displayNumber(latest?.humidity)}</MetricNumber>
                    <MetricUnit>%</MetricUnit>
                  </MetricValue>
                </Metric>
              </MetricsCard>

              <AirLabel>바깥 공기 · 창문 환기</AirLabel>

              <OutdoorRow>
                <Card $variant="outdoor">
                  <img src={dustIcon} alt="" width="35" height="35" />
                  <OutdoorCopy>
                    <OutdoorName>미세먼지 농도</OutdoorName>
                    <OutdoorValue>
                      <OutdoorNumber>{displayNumber(outdoor?.pm10)}</OutdoorNumber>
                      <OutdoorUnit>㎍/㎥</OutdoorUnit>
                    </OutdoorValue>
                  </OutdoorCopy>
                </Card>
                <Card $variant="outdoor">
                  <img src={outdoorTempIcon} alt="" width="35" height="35" />
                  <OutdoorCopy>
                    <OutdoorName>실외 온도</OutdoorName>
                    <OutdoorValue>
                      <OutdoorNumber>{displayNumber(outdoor?.temp)}</OutdoorNumber>
                      <OutdoorUnit>°C</OutdoorUnit>
                    </OutdoorValue>
                  </OutdoorCopy>
                </Card>
              </OutdoorRow>
            </>
          )}
        </main>

        <Footer active="home" onNavigate={onNavigate} />

        {pickerOpen ? (
          <RoomPicker
            rooms={rooms.map((item) => item.label)}
            selected={selectedRoom?.label ?? ''}
            onSelect={(label) => {
              const next = rooms.find((item) => item.label === label)
              if (next) setSelectedRoom(next)
              setPickerOpen(false)
            }}
            onClose={() => setPickerOpen(false)}
          />
        ) : null}
      </HomeScreen>
    </HomeRoot>
  )
}

export default Home

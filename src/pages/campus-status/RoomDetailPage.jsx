import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { completeAction, roomAirStatus, ventilateRoom } from '../../api/campus-status.js'
import { completeComplaintStep, getComplaints, recommendComplaint } from '../../api/inbox.js'
import sparkIcon from '../../assets/images/icon-repeat-spark.svg'
import sparkSmallIcon from '../../assets/images/icon-repeat-spark-2.svg'
import redoIcon from '../../assets/images/icon-redo.svg'
import checkIcon from '../../assets/images/icon-check.svg'
import checkSmallIcon from '../../assets/images/icon-check-small.svg'
import campusEllipse from '../../assets/images/bg-campus-ellipse.svg'
import backIcon from '../../assets/images/icon-back.svg'
import ventIcon from '../../assets/images/icon-vent.svg'
import tempIcon from '../../assets/images/icon-detail-temp.svg'
import humidityIcon from '../../assets/images/icon-detail-humidity.svg'
import Co2FlowChart from './Co2FlowChart.jsx'

const glass = css`
  border: 1px solid rgba(255, 255, 255, 0.65);
  background: rgba(255, 255, 255, 0.38);
  backdrop-filter: blur(12px);
`

const raisedShadow = css`
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
`

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
  height: ${({ $height }) => `${$height}px`};
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

const RoomTitle = styled.h1`
  position: absolute;
  top: 58px;
  left: 60px;
  z-index: 1;
  margin: 0;
  color: #161a2b;
  font-size: 21px;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.4px;
`

const RoomPlace = styled.p`
  position: absolute;
  top: 88px;
  left: 60px;
  z-index: 1;
  margin: 0;
  color: #5f6a8f;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
`

const AirCard = styled.section`
  position: absolute;
  top: 115px;
  right: 16px;
  left: 16px;
  z-index: 1;
  height: 190px;
  border-radius: 24px;
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    inset 0 -1px 0 rgba(255, 255, 255, 0.3);
  ${glass}
`

const AirLabel = styled.p`
  position: absolute;
  top: 18px;
  left: 29px;
  margin: 0;
  color: #5f6a8f;
  font-size: 13px;
  font-weight: 400;
  line-height: 19px;
`

const AirReading = styled.p`
  position: absolute;
  top: 41px;
  left: 29px;
  display: flex;
  align-items: flex-end;
  margin: 0;
`

const AirValue = styled.span`
  color: #1d2752;
  font-size: 40px;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: -1px;
`

const AirUnit = styled.span`
  margin: 0 0 6px 6px;
  color: #5f6a8f;
  font-size: 15px;
  font-weight: 500;
  line-height: 15px;
  letter-spacing: -1px;
`

const AirStatus = styled.p`
  position: absolute;
  top: 103px;
  left: 29px;
  margin: 0;
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
`

const VentBanner = styled.div`
  position: absolute;
  top: 131px;
  right: 18px;
  left: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 39px;
  padding: 0 12px;
  border-radius: 14px;
  background: rgba(86, 166, 240, 0.2);
  color: #2b679e;
  font-size: 13px;
  font-weight: 400;
  line-height: normal;
`

const Gauge = styled.div`
  position: absolute;
  top: 19.5px;
  left: 242px;
  width: 98px;
  height: 96px;
  overflow: hidden;
`

const GaugeRing = styled.svg`
  position: absolute;
  top: 5px;
  left: 5px;
`

const Score = styled.span`
  position: absolute;
  top: 26px;
  right: 0;
  left: 0;
  color: #1d2752;
  font-family: Inter, 'Noto Sans KR', sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: normal;
  text-align: center;
`

const ScoreLabel = styled.span`
  position: absolute;
  top: 56px;
  right: 0;
  left: 0;
  color: #5f6a8f;
  font-family: Inter, 'Noto Sans KR', sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: normal;
  text-align: center;
`

const MiniCard = styled.section`
  position: absolute;
  top: 323px;
  z-index: 1;
  width: 174px;
  height: 112px;
  border-radius: 20px;
  box-shadow:
    0 8px 24px rgba(60, 80, 160, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  ${glass}
  ${({ $side }) => ($side === 'left' ? 'left: 16px;' : 'right: 16px;')}
`

const MiniIcon = styled.span`
  position: absolute;
  top: 15px;
  left: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
`

const MiniName = styled.span`
  position: absolute;
  top: 14px;
  left: 36px;
  color: #5f6a8f;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`

const MiniReading = styled.p`
  position: absolute;
  top: 38px;
  left: 14px;
  display: flex;
  align-items: flex-end;
  margin: 0;
`

const MiniValue = styled.span`
  color: #263e50;
  font-size: 24px;
  font-weight: 700;
  line-height: 36px;
`

const MiniUnit = styled.span`
  margin: 0 0 8px 2px;
  color: #5f6a8f;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
`

const MiniNote = styled.p`
  position: absolute;
  top: 78px;
  left: 14px;
  margin: 0;
  color: #6d96bc;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
`

const ChartCard = styled.section`
  position: absolute;
  top: 457px;
  right: 16px;
  left: 16px;
  z-index: 1;
  height: 241px;
  border-radius: 22px;
  ${raisedShadow}
  ${glass}
`

const ChartTitle = styled.h2`
  position: absolute;
  top: 15px;
  left: 18px;
  margin: 0;
  color: #263e50;
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
`

const ChartPlot = styled.div`
  position: absolute;
  top: 60px;
  left: 16px;
  width: 326px;
  height: 136px;
  overflow: visible;
`

const LegendText = styled.span`
  position: absolute;
  top: 206px;
  left: ${({ $left }) => $left};
  color: #5f6a8f;
  font-size: 11px;
  font-weight: 400;
  line-height: 17px;
`

const MeasuredKey = styled.span`
  position: absolute;
  top: 213px;
  left: 16px;
  width: 16px;
  height: 3px;
  border-radius: 2px;
  background: #319bff;
`

const PredictedKey = styled.span`
  position: absolute;
  top: 213.5px;
  left: 68.63px;
  width: 16px;
  border-top: 2px dashed #6d96bc;
`

const GuideKey = styled.span`
  position: absolute;
  top: 214px;
  left: 135.3px;
  width: 16px;
  border-top: 1px dashed #f75255;
`

const AdviceCard = styled.section`
  position: absolute;
  top: 720px;
  right: 16px;
  left: 16px;
  z-index: 2;
  height: ${({ $height }) => `${$height}px`};
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
`

const Spark = styled.span`
  position: absolute;
  top: 11px;
  left: 14px;
  width: 22px;
  height: 22px;
`

const SparkMain = styled.img`
  position: absolute;
  top: 3px;
  left: 4px;
`

const SparkSmall = styled.img`
  position: absolute;
  top: 15px;
  left: 14.5px;
`

const AdviceTitle = styled.h2`
  position: absolute;
  top: 14px;
  left: 41px;
  margin: 0;
  color: #56a6f0;
  font-size: 15px;
  font-weight: 700;
`

const AdviceText = styled.p`
  position: absolute;
  top: 47px;
  right: 16px;
  left: 16px;
  margin: 0;
  color: #263e50;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.35;
`

const Effect = styled.p`
  position: absolute;
  top: 80px;
  left: 14px;
  display: flex;
  align-items: center;
  width: 328px;
  height: 35px;
  margin: 0;
  padding-left: 14px;
  border-radius: 10px;
  background: ${({ $error }) => ($error ? 'rgba(247, 82, 85, 0.12)' : 'rgba(204, 234, 201, 0.5)')};
  color: ${({ $error }) => ($error ? '#f75255' : '#547761')};
  font-size: 13px;
`

const EffectValue = styled.span`
  margin-left: 6px;
  font-weight: 500;
`

const OtherButton = styled.button`
  position: absolute;
  top: 129px;
  left: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  width: 120px;
  height: 50px;
  padding: 0 0 0 17px;
  border: 1px solid #e7e8e9;
  border-radius: 15px;
  background: #ffffff;
  color: rgba(22, 26, 43, 0.6);
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`

const RedoIcon = styled.span`
  position: relative;
  width: 20px;
  height: 20px;
  flex: none;
`

const RedoImage = styled.img`
  position: absolute;
  top: 1.75px;
  left: 1.75px;
`

const StartButton = styled.button`
  position: absolute;
  top: 129px;
  left: 142px;
  width: 202px;
  height: 50px;
  border: none;
  border-radius: 15px;
  background: #56a6f0;
  color: #ffffff;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`

const ProgressBody = styled.div`
  margin-top: 47px;
  padding: 0 14px 16px;
`

const ProgressSummary = styled.p`
  margin: 0;
  color: #263e50;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.35;
`

const ProgressTasks = styled.div`
  margin-top: 12px;
`

const StepError = styled.p`
  margin: 8px 0 0;
  color: #f75255;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
`

const Task = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 44px;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;

  & + & {
    margin-top: 6px;
  }

  &:disabled {
    cursor: default;
  }
`

const CheckBox = styled.span`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: ${({ $small }) => ($small ? '20px' : '24px')};
  height: ${({ $small }) => ($small ? '20px' : '24px')};
  border: ${({ $on, $small }) => ($on || $small ? 'none' : '2px solid #b9cbe0')};
  border-radius: ${({ $small }) => ($small ? '6px' : '8px')};
  background: ${({ $on }) => ($on ? '#56a6f0' : '#b9cbe0')};
`

const TaskCopy = styled.span`
  display: flex;
  flex-direction: column;
`

const TaskTitle = styled.span`
  color: ${({ $done }) => ($done ? '#8a97a8' : '#1e2a4a')};
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
`

const TaskNote = styled.span`
  color: ${({ $done }) => ($done ? '#8a97a8' : '#5b6880')};
  font-size: 11px;
  line-height: 16px;
`

const Result = styled.div`
  position: absolute;
  top: 44px;
  right: 16px;
  left: 16px;
  height: 63px;
  border-radius: 14px;
  background: rgba(86, 166, 240, 0.2);
`

const ResultLabel = styled.p`
  position: absolute;
  top: calc(50% - 13.5px);
  left: 14px;
  margin: 0;
  color: #2f3e4e;
  font-size: 11px;
  line-height: 1;
  transform: translateY(-50%);
`

const ResultValue = styled.p`
  position: absolute;
  top: calc(50% + 8.5px);
  left: 14px;
  margin: 0;
  color: #2f3e4e;
  font-size: 18px;
  font-weight: 900;
  line-height: 1;
  transform: translateY(-50%);
`

const ResultUnit = styled.span`
  position: absolute;
  top: calc(50% + 11.5px);
  left: 123.69px;
  color: #2f3e4e;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  transform: translateY(-50%);
`

const Goal = styled.span`
  position: absolute;
  top: 50%;
  left: 242.47px;
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  width: 67.53px;
  height: 25px;
  padding-left: 10px;
  border-radius: 999px;
  background: #ffffff;
  color: #2f3e4e;
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
  transform: translateY(-50%);
`

const DoneList = styled.div`
  position: absolute;
  top: 123px;
  right: 30px;
  left: 30px;
`

const DoneItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  height: 20px;
  margin: 0 0 10px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
`

const DoneLabel = styled.span`
  margin-left: 8px;
  color: #5b6880;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
`

const DoneTime = styled.span`
  margin-left: auto;
  color: #5b6880;
  font-size: 11px;
  font-weight: 400;
  line-height: 16px;
`

const ScheduleCard = styled.section`
  position: absolute;
  top: ${({ $top }) => $top};
  right: 16px;
  left: 16px;
  z-index: 1;
  height: 128px;
  border-radius: 22px;
  ${raisedShadow}
  ${glass}
`

const ClassRow = styled.div`
  position: absolute;
  top: ${({ $top }) => $top};
  right: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  height: ${({ $divided }) => ($divided ? '58px' : '46px')};
  ${({ $divided }) =>
    $divided &&
    css`
      border-top: 1px solid rgba(255, 255, 255, 0.7);
    `}
`

const ClassBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 37.63px;
  height: 23px;
  border-radius: 8px;
  background: ${({ $next }) => ($next ? '#ffffff' : '#56a6f0')};
  color: ${({ $next }) => ($next ? '#56a6f0' : '#ffffff')};
  font-size: 11px;
  font-weight: 700;
  line-height: 17px;
`

const ClassCopy = styled.p`
  margin: 0;
  color: #1d2752;
  font-size: 14px;
  font-weight: 700;
  line-height: normal;
`

const ClassTime = styled.span`
  display: block;
  color: #5f6a8f;
  font-size: 12px;
  font-weight: 400;
`

function comfortGaugeColor(score) {
  const value = Number(score)
  if (!Number.isFinite(value) || value >= 70) return '#56A6F0'
  if (value >= 40) return '#FFAA6E'
  return '#FF7A6E'
}

function comfortRatio(score) {
  const value = Number(score)
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value / 100))
}

function ComfortGauge({ score }) {
  const ratio = comfortRatio(score)

  return (
    <GaugeRing viewBox="0 0 86 86" width="86" height="86" aria-hidden="true">
      <circle cx="43" cy="43" r="38" fill="none" stroke="#E3E3E3" strokeOpacity="0.8" strokeWidth="10" />
      {ratio > 0 ? (
        <circle
          cx="43"
          cy="43"
          r="38"
          fill="none"
          stroke={comfortGaugeColor(score)}
          strokeWidth="10"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${ratio * 100} 100`}
          transform="rotate(-90 43 43)"
        />
      ) : null}
    </GaugeRing>
  )
}

function displayNumber(value) {
  if (value === undefined || value === null || value === '') return '—'
  const number = Number(value)
  if (Number.isNaN(number)) return String(value)
  return Number.isInteger(number) ? number.toLocaleString('ko-KR') : String(number)
}

function classTime(item) {
  if (!item?.start || !item?.end) return ''
  return `${item.start}–${item.end}`
}

function needsAdvice(detail) {
  const level = detail?.co2Level
  return level === 'CRITICAL' || level === 'CAUTION'
}

function effectText(data) {
  const before = Number(data?.co2Before)
  const after = Number(data?.expectedCo2After)
  if (!Number.isFinite(before) || !Number.isFinite(after)) return ''
  return `CO₂ ${before.toLocaleString('ko-KR')} → 약 ${after.toLocaleString('ko-KR')}ppm`
}

function clock(value) {
  const date = value ? new Date(value) : null
  if (!date || Number.isNaN(date.getTime())) return ''
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function actionSteps(steps, previous = []) {
  return (steps ?? []).map((step) => {
    const earlier = previous.find((item) => item.type === step.type)
    const targetTemp = step.targetTemp ?? earlier?.targetTemp
    const label = step.label ?? earlier?.label ?? ''
    const time = clock(step.doneAt)
    return {
      type: step.type,
      label,
      targetTemp,
      doneAt: step.doneAt ?? null,
      checked: Boolean(step.doneAt),
      pendingNote: step.type === 'AC_ON' && targetTemp != null ? `희망 온도 ${targetTemp}°C` : '',
      doneNote: time ? `${time} 완료` : '',
      doneLabel: step.type === 'AC_ON' && targetTemp != null ? `${label} · ${targetTemp}°C` : label,
      time,
    }
  })
}

function adviceCardHeight(view, stepCount) {
  if (view !== 'progress') return 192
  return Math.max(192, 79 + stepCount * 50 + 13)
}

function RoomDetailPage({ detail, floor, loadError, loading, onBack }) {
  const showAdvice = needsAdvice(detail)
  const [complaintId, setComplaintId] = useState(null)
  const [recommendation, setRecommendation] = useState(null)
  const [recommendError, setRecommendError] = useState('')
  const [recommending, setRecommending] = useState(false)
  const [starting, setStarting] = useState(false)
  const [phase, setPhase] = useState('received')
  const [steps, setSteps] = useState([])
  const [action, setAction] = useState(null)
  const [checkingType, setCheckingType] = useState(null)
  const [stepError, setStepError] = useState('')
  const [startError, setStartError] = useState('')
  const status = detail ? roomAirStatus(detail) : null
  const number = detail?.number
  const placeFloor = detail?.floor ?? floor
  const building = detail?.building || '북악관'
  const statusText = loadError || (loading ? '강의실 정보를 불러오고 있어요' : status?.label || '—')
  const statusColor = loadError ? '#c93a24' : status?.color || '#5f6a8f'

  useEffect(() => {
    if (!showAdvice || detail?.roomId == null) return undefined
    let cancelled = false

    const load = async () => {
      setRecommending(true)
      setRecommendError('')
      setRecommendation(null)
      setComplaintId(null)
      setPhase('received')
      setSteps([])
      setAction(null)
      setStepError('')
      setStartError('')
      try {
        const list = await getComplaints({ roomId: detail.roomId, status: 'RECEIVED', size: 1 })
        if (cancelled) return
        const id = list.data?.content?.[0]?.complaintId
        if (id == null) {
          setRecommendError('접수된 민원이 없어 추천을 불러오지 못했어요.')
          return
        }
        setComplaintId(id)
        const payload = await recommendComplaint(id)
        if (!cancelled) setRecommendation(payload.data ?? null)
      } catch (error) {
        if (!cancelled) setRecommendError(error.message || '추천을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setRecommending(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [showAdvice, detail?.roomId])

  async function loadRecommendation(retry) {
    if (complaintId == null || recommending) return
    setRecommending(true)
    setRecommendError('')
    try {
      const payload = await recommendComplaint(complaintId, { retry })
      setRecommendation(payload.data ?? null)
      setPhase('received')
      setSteps([])
      setAction(null)
    } catch (error) {
      setRecommendError(error.message || '추천을 불러오지 못했습니다.')
    } finally {
      setRecommending(false)
    }
  }

  async function begin() {
    const roomId = detail?.roomId
    if (roomId == null || roomId === '' || starting || phase !== 'received') return
    setStarting(true)
    setStartError('')
    try {
      const payload = await ventilateRoom(roomId)
      const data = payload.data ?? {}
      const nextSteps = actionSteps(data.steps ?? [])
      setAction({ ...recommendation, ...data, summary: data.summary || recommendation?.summary })
      setSteps(nextSteps)
      setPhase(data.status === 'DONE' ? 'done' : 'progress')
    } catch (error) {
      setStartError(error.message || '환기를 시작하지 못했습니다.')
    } finally {
      setStarting(false)
    }
  }

  async function toggleStep(step) {
    if (step.checked) {
      setSteps((current) => current.map((item) => (item.type === step.type ? { ...item, checked: false } : item)))
      setStepError('')
      return
    }
    if (step.doneAt) {
      setSteps((current) => current.map((item) => (item.type === step.type ? { ...item, checked: true } : item)))
      return
    }
    const actionId = action?.actionId ?? recommendation?.actionId
    if (actionId == null || checkingType) return
    setCheckingType(step.type)
    setStepError('')
    try {
      const payload = await completeComplaintStep(actionId, { type: step.type, targetTemp: step.targetTemp })
      const data = payload.data ?? {}
      const returned = Array.isArray(data.steps) ? data.steps : []
      const nextSteps = returned.length
        ? actionSteps(returned, steps)
        : steps.map((item) => (item.type === step.type ? { ...item, checked: true } : item))
      const finished = nextSteps.length > 0 && nextSteps.every((item) => item.checked)
      let result = data
      if (finished && data.status !== 'DONE') {
        const completed = await completeAction(actionId)
        result = { ...data, ...(completed.data ?? {}) }
      }
      setAction((current) => ({ ...current, ...result, summary: current?.summary || result.summary }))
      setSteps(nextSteps)
      if (result.status === 'DONE') setPhase('done')
    } catch (error) {
      setStepError(error.message || '조치를 완료하지 못했습니다.')
    } finally {
      setCheckingType(null)
    }
  }

  const allChecked = steps.length > 0 && steps.every((step) => step.checked)
  const view = phase === 'received' ? 'received' : allChecked || (phase === 'done' && steps.length === 0) ? 'done' : 'progress'
  const adviceTitle = view === 'done' ? '조치 완료' : view === 'progress' ? '조치 진행 중' : 'AI 추천 조치'
  const bannerText = view === 'done' ? '조치 완료' : view === 'progress' ? '조치 진행 중' : detail?.ventilating ? '환기 진행중' : ''
  const cardHeight = adviceCardHeight(view, steps.length)
  const scheduleTop = showAdvice ? 720 + cardHeight + 22 : 722
  const screenHeight = showAdvice ? scheduleTop + 168 : 870

  return (
    <PageRoot>
      <Screen $height={screenHeight}>
        <Ellipse src={campusEllipse} alt="" width="875" height="875" />

        <BackButton type="button" aria-label="캠퍼스 현황으로 돌아가기" onClick={onBack}>
          <img src={backIcon} alt="" width="22" height="22" />
        </BackButton>
        <RoomTitle>{number ? `${number} 호` : '강의실'}</RoomTitle>
        <RoomPlace>{building} {placeFloor}층 · 강의실</RoomPlace>

        <AirCard aria-label="지금 공기 상태">
          <AirLabel>지금 CO₂</AirLabel>
          <AirReading>
            <AirValue>{displayNumber(detail?.co2)}</AirValue>
            <AirUnit>ppm</AirUnit>
          </AirReading>
          <AirStatus $color={statusColor}>{statusText}</AirStatus>
          {bannerText ? (
            <VentBanner>
              <img src={ventIcon} alt="" width="18" height="18" />
              {bannerText}
            </VentBanner>
          ) : null}
          <Gauge>
            <ComfortGauge score={detail?.comfortScore} />
            <Score>{displayNumber(detail?.comfortScore)}</Score>
            <ScoreLabel>쾌적도</ScoreLabel>
          </Gauge>
        </AirCard>

        <MiniCard $side="left" aria-label="온도">
          <MiniIcon>
            <img src={tempIcon} alt="" width="6.66667" height="13.7761" />
          </MiniIcon>
          <MiniName>온도</MiniName>
          <MiniReading>
            <MiniValue>{displayNumber(detail?.temp)}</MiniValue>
            <MiniUnit>°C</MiniUnit>
          </MiniReading>
          <MiniNote>{detail?.tempLabel || '—'}</MiniNote>
        </MiniCard>

        <MiniCard $side="right" aria-label="습도">
          <MiniIcon>
            <img src={humidityIcon} alt="" width="9.33333" height="12.3333" />
          </MiniIcon>
          <MiniName>습도</MiniName>
          <MiniReading>
            <MiniValue>{displayNumber(detail?.humidity)}</MiniValue>
            <MiniUnit>%</MiniUnit>
          </MiniReading>
          <MiniNote>{detail?.humidityLabel || '—'}</MiniNote>
        </MiniCard>

        <ChartCard aria-label="오늘 CO₂ 흐름">
          <ChartTitle>오늘 CO₂ 흐름</ChartTitle>
          <ChartPlot>
            <Co2FlowChart roomId={detail?.roomId} />
          </ChartPlot>
          <MeasuredKey />
          <LegendText $left="35px">실측</LegendText>
          <PredictedKey />
          <LegendText $left="87.63px">AI 예측</LegendText>
          <GuideKey />
          <LegendText $left="154.3px">기준</LegendText>
        </ChartCard>

        {showAdvice ? (
          <AdviceCard $height={cardHeight} aria-label={adviceTitle}>
            <Spark>
              <SparkMain src={sparkIcon} alt="" width="13.4484" height="13.7817" />
              <SparkSmall src={sparkSmallIcon} alt="" width="5.44842" height="5.89842" />
            </Spark>
            <AdviceTitle>{adviceTitle}</AdviceTitle>
            {view === 'received' ? (
              <>
                {recommending && !recommendation ? <AdviceText>추천을 불러오고 있어요.</AdviceText> : null}
                {!recommendation && recommendError ? <AdviceText>{recommendError}</AdviceText> : null}
                {recommendation ? <AdviceText>{recommendation.summary}</AdviceText> : null}
                {recommendation && (startError || recommendError) ? (
                  <Effect $error>{startError || recommendError}</Effect>
                ) : null}
                {recommendation && !startError && !recommendError && effectText(recommendation) ? (
                  <Effect>
                    예상 효과
                    <EffectValue>{effectText(recommendation)}</EffectValue>
                  </Effect>
                ) : null}
                <OtherButton type="button" disabled={recommending || complaintId == null} onClick={() => loadRecommendation(true)}>
                  <RedoIcon>
                    <RedoImage src={redoIcon} alt="" width="16.5" height="16.5" />
                  </RedoIcon>
                  {recommending ? '찾는 중' : '다른 방법'}
                </OtherButton>
                <StartButton type="button" disabled={starting || detail?.roomId == null} onClick={begin}>
                  추천대로 처리 시작
                </StartButton>
              </>
            ) : null}
            {view === 'progress' ? (
              <ProgressBody>
                <ProgressSummary>{action?.summary || recommendation?.summary}</ProgressSummary>
                <ProgressTasks>
                  {steps.map((step) => (
                    <Task
                      key={`${step.type}-${step.label}`}
                      type="button"
                      role="checkbox"
                      aria-checked={step.checked}
                      disabled={checkingType === step.type}
                      onClick={() => toggleStep(step)}
                    >
                      <CheckBox $on={step.checked}>
                        {step.checked ? <img src={checkIcon} alt="" width="16" height="16" /> : null}
                      </CheckBox>
                      <TaskCopy>
                        <TaskTitle $done={step.checked}>{step.label}</TaskTitle>
                        {(step.checked ? step.doneNote : step.pendingNote) ? (
                          <TaskNote $done={step.checked}>{step.checked ? step.doneNote : step.pendingNote}</TaskNote>
                        ) : null}
                      </TaskCopy>
                    </Task>
                  ))}
                </ProgressTasks>
                {stepError ? <StepError>{stepError}</StepError> : null}
              </ProgressBody>
            ) : null}
            {view === 'done' ? (
              <>
                {Number.isFinite(Number(action?.actualCo2After)) ? (
                  <Result>
                    <ResultLabel>CO₂ 변화</ResultLabel>
                    <ResultValue>
                      {Number(action.co2Before).toLocaleString('ko-KR')} → {Number(action.actualCo2After).toLocaleString('ko-KR')}
                    </ResultValue>
                    <ResultUnit> ppm</ResultUnit>
                    {action.goalReached ? <Goal>목표 달성</Goal> : null}
                  </Result>
                ) : null}
                <DoneList>
                  {steps.map((step) => (
                    <DoneItem type="button" key={`${step.type}-${step.label}`} onClick={() => toggleStep(step)}>
                      <CheckBox $on $small>
                        <img src={checkSmallIcon} alt="" width="14" height="14" />
                      </CheckBox>
                      <DoneLabel>{step.doneLabel}</DoneLabel>
                      <DoneTime>{step.time}</DoneTime>
                    </DoneItem>
                  ))}
                </DoneList>
              </>
            ) : null}
          </AdviceCard>
        ) : null}

        <ScheduleCard $top={`${scheduleTop}px`} aria-label="수업 일정">
          <ClassRow $top="11px">
            <ClassBadge>지금</ClassBadge>
            <ClassCopy>
              {detail?.currentClass?.courseName || '수업 없음'}
              <ClassTime>{classTime(detail?.currentClass)}</ClassTime>
            </ClassCopy>
          </ClassRow>
          <ClassRow $top="62px" $divided>
            <ClassBadge $next>다음</ClassBadge>
            <ClassCopy>
              {detail?.nextClass?.courseName || '수업 없음'}
              <ClassTime>
                {classTime(detail?.nextClass)}
                {detail?.nextClass?.tip ? ` · ${detail.nextClass.tip}` : ''}
              </ClassTime>
            </ClassCopy>
          </ClassRow>
        </ScheduleCard>
      </Screen>
    </PageRoot>
  )
}

export default RoomDetailPage

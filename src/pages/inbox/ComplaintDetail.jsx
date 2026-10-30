import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Footer from '../../common/Footer/Footer.jsx'
import { completeComplaintStep, getComplaint, recommendComplaint, startComplaintAction } from '../../api/inbox.js'
import ellipse from '../../assets/images/bg-detail-ellipse.svg'
import backIcon from '../../assets/images/icon-back.svg'
import megaphoneIcon from '../../assets/images/icon-megaphone.svg'
import sparkIcon from '../../assets/images/icon-repeat-spark.svg'
import sparkSmallIcon from '../../assets/images/icon-repeat-spark-2.svg'
import redoIcon from '../../assets/images/icon-redo.svg'
import checkIcon from '../../assets/images/icon-check.svg'
import checkSmallIcon from '../../assets/images/icon-check-small.svg'

const PageRoot = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  background: #f0f8ff;
  color: #161a2b;
  font-family: 'Noto Sans KR', sans-serif;
`

const Screen = styled.div`
  width: 390px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background: #f0f8ff;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const Sheet = styled.div`
  position: relative;
  width: 390px;
  min-height: ${({ $extra }) => `max(844px, 100dvh, ${860 + ($extra || 0)}px)`};
`

const MenuDock = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 6;
  display: flex;
  justify-content: center;
`

const Ellipse = styled.img`
  position: absolute;
  top: 410px;
  left: -252px;
  z-index: 0;
  pointer-events: none;
`

const Header = styled.header`
  position: absolute;
  top: 45px;
  left: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  width: 390px;
  height: 70px;
  padding-left: 55px;
`

const BackButton = styled.button`
  position: absolute;
  top: 24px;
  left: 20px;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
`

const Title = styled.h1`
  margin: 0;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.4px;
`

const Glass = styled.section`
  position: absolute;
  right: 16px;
  left: 16px;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px);
`

const ComplaintCard = styled(Glass)`
  top: 115px;
  height: ${({ $shift }) => 203 + ($shift || 0)}px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.8);
`

const Megaphone = styled.img`
  position: absolute;
  top: 14px;
  left: 17px;
`

const Place = styled.h2`
  position: absolute;
  top: 17px;
  left: 48px;
  margin: 0;
  color: #263e50;
  font-size: 17px;
  font-weight: 600;
  line-height: ${({ $wrap }) => ($wrap ? '21px' : '1')};
  white-space: pre-line;
`

const badgeTones = {
  received: { background: '#ffe3e3', color: '#fe7e7e', label: '접수' },
  progress: { background: '#fff5d8', color: '#ffa264', label: '처리 중' },
  done: { background: '#e2f1ff', color: '#56a6f0', label: '완료' },
}

const Badge = styled.span`
  position: absolute;
  top: 16px;
  left: 283px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 58px;
  height: 25px;
  padding: 0 6px;
  border-radius: 30px;
  background: ${({ $tone }) => badgeTones[$tone].background};
  color: ${({ $tone }) => badgeTones[$tone].color};
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
`

const SubmittedAt = styled.p`
  position: absolute;
  top: ${({ $shift }) => 48 + ($shift || 0)}px;
  left: 20px;
  margin: 0;
  color: #263e50;
  font-size: 13px;
`

const ContentLabel = styled.p`
  position: absolute;
  top: ${({ $shift }) => 90 + ($shift || 0)}px;
  left: 20px;
  margin: 0;
  color: rgba(38, 62, 80, 0.7);
  font-size: 13px;
  font-weight: 500;
`

const Quote = styled.p`
  position: absolute;
  top: ${({ $shift }) => 115 + ($shift || 0)}px;
  left: 16px;
  display: flex;
  align-items: center;
  width: 324px;
  height: 72px;
  margin: 0;
  padding: 0 13px;
  border-radius: 10px;
  background: rgba(86, 166, 240, 0.2);
  color: #263e50;
  font-size: 13px;
  line-height: 20px;
`

const AirCard = styled(Glass)`
  top: ${({ $shift }) => 330 + ($shift || 0)}px;
  height: 206px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.5);
`

const AirLabel = styled.p`
  position: absolute;
  top: 20px;
  left: 29px;
  margin: 0;
  color: #5f6a8f;
  font-size: 13px;
`

const Co2Value = styled.p`
  position: absolute;
  top: 47px;
  left: 29px;
  margin: 0;
  color: #1d2752;
  font-size: 40px;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: -1px;
`

const Co2Unit = styled.span`
  margin-left: 6px;
  color: #5f6a8f;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -1px;
`

const Gauge = styled.div`
  position: absolute;
  top: 19.5px;
  left: 242px;
  width: 98px;
  height: 96px;
`

const RingSvg = styled.svg`
  position: absolute;
  top: 5px;
  left: 6px;
`

const ComfortScore = styled.p`
  position: absolute;
  top: 26px;
  right: 0;
  left: 0;
  margin: 0;
  color: #1d2752;
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  text-align: center;
`

const ComfortLabel = styled.p`
  position: absolute;
  top: 56px;
  right: 0;
  left: 0;
  margin: 0;
  color: #5f6a8f;
  font-size: 10px;
  text-align: center;
`

const Severity = styled.p`
  position: absolute;
  top: 102px;
  left: 29px;
  margin: 0;
  color: ${({ $color }) => $color || '#f75255'};
  font-size: 12px;
  font-weight: 700;
`

const Metrics = styled.div`
  position: absolute;
  top: 132px;
  right: 16px;
  left: 16px;
  display: flex;
  height: 54px;
  border-top: 1px solid rgba(30, 42, 74, 0.08);
`

const Metric = styled.div`
  flex: 1;
  padding: 12px 0 0 10px;

  &:last-child {
    padding-left: 15px;
    border-left: 1px solid rgba(30, 42, 74, 0.08);
  }
`

const MetricLabel = styled.p`
  margin: 0;
  color: #5b6880;
  font-size: 11px;
`

const MetricValue = styled.p`
  display: flex;
  align-items: baseline;
  margin: 4px 0 0;
  color: #1e2a4a;
  font-size: 18px;
  font-weight: 700;
`

const MetricUnit = styled.span`
  margin-left: 2px;
  color: #5b6880;
  font-size: 11px;
  font-weight: 400;
`

const MetricNote = styled.span`
  color: #3f6e9e;
  font-weight: 700;
`

const AdviceCard = styled(Glass)`
  top: ${({ $shift }) => 548 + ($shift || 0)}px;
  z-index: 5;
  height: ${({ $tall, $extra }) => ($tall ? 'auto' : `${192 + ($extra || 0)}px`)};
  min-height: 192px;
  padding-bottom: ${({ $tall }) => ($tall ? '16px' : '0')};
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.5);
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
  top: ${({ $offset }) => 80 + ($offset || 0)}px;
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
  top: ${({ $offset }) => 129 + ($offset || 0)}px;
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
  transition: transform 180ms cubic-bezier(0.34, 1.45, 0.64, 1);

  &:active:not(:disabled) {
    transform: scale(0.94);
  }

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
  top: ${({ $offset }) => 129 + ($offset || 0)}px;
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

const TaskList = styled.div`
  position: absolute;
  top: 79px;
  right: 18px;
  left: 14px;
`

const ProgressBody = styled.div`
  margin-top: 47px;
  padding: 0 16px;
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

  &:disabled {
    cursor: default;
  }
`

const DoneLabel = styled.span`
  margin-left: 8px;
  color: #5b6880;
  font-size: 13px;
`

const DoneTime = styled.span`
  margin-left: auto;
  color: #5b6880;
  font-size: 11px;
`

const adviceTitles = {
  received: 'aiTitle',
  progress: 'progressTitle',
  done: 'doneTitle',
}

function submittedAt(createdAt) {
  const date = createdAt ? new Date(createdAt) : null
  if (!date || Number.isNaN(date.getTime())) return ''
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${date.getFullYear()}.${month}.${day} ${hour}:${minute}`
}

function effectText(data) {
  const before = Number(data?.co2Before)
  const after = Number(data?.expectedCo2After)
  if (!Number.isFinite(before) || !Number.isFinite(after)) return ''
  return `CO₂ ${before.toLocaleString('ko-KR')} → 약 ${after.toLocaleString('ko-KR')}ppm`
}

function clock(createdAt) {
  const date = createdAt ? new Date(createdAt) : null
  if (!date || Number.isNaN(date.getTime())) return ''
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const complaintPhase = {
  RECEIVED: 'received',
  IN_PROGRESS: 'progress',
  DONE: 'done',
}

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

function ComfortRing({ score }) {
  const value = Number(score)
  const ratio = Number.isFinite(value) ? Math.min(1, Math.max(0, value / 100)) : 0
  const [from, to] = gaugeColors[comfortBand(score)]

  return (
    <RingSvg viewBox="0 0 86 86" width="86" height="86" aria-hidden="true">
      <defs>
        <linearGradient id="complaint-comfort-gauge" x1="43" y1="5" x2="43" y2="81" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <circle cx="43" cy="43" r="38" fill="none" stroke="#E3E3E3" strokeOpacity="0.8" strokeWidth="10" />
      {ratio > 0 ? (
        <circle
          cx="43"
          cy="43"
          r="38"
          fill="none"
          stroke="url(#complaint-comfort-gauge)"
          strokeWidth="10"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${ratio * 100} 100`}
          transform="rotate(-90 43 43)"
        />
      ) : null}
    </RingSvg>
  )
}

function formatMeasure(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '—'
  return number.toLocaleString('ko-KR')
}

function snapshotSeverity(snapshot) {
  const overBy = Number(snapshot?.co2OverBy)
  const level = snapshot?.co2Level
  if (level === 'NORMAL') return { text: '정상', color: '#74a842' }
  if (level === 'CAUTION') {
    const extra = overBy > 0 ? ` · 기준보다 ${overBy.toLocaleString('ko-KR')} 높음` : ''
    return { text: `주의${extra}`, color: '#ff9d00' }
  }
  if (overBy > 0) return { text: `심각 · 기준보다 ${overBy.toLocaleString('ko-KR')} 높음`, color: '#f75255' }
  return { text: '', color: '#f75255' }
}

function actionSteps(steps, previous = []) {
  return (steps ?? []).map((step) => {
    const earlier = previous.find((item) => item.type === step.type)
    const targetTemp = step.targetTemp ?? earlier?.targetTemp
    const time = clock(step.doneAt)
    return {
      type: step.type,
      label: step.label ?? earlier?.label ?? '',
      targetTemp,
      checked: Boolean(step.doneAt),
      pendingNote: step.type === 'AC_ON' && targetTemp != null ? `희망 온도 ${targetTemp}°C` : '',
      doneNote: time ? `${time} 완료` : '',
      doneLabel: step.type === 'AC_ON' && targetTemp != null
        ? `${step.label ?? earlier?.label ?? ''} · ${targetTemp}°C`
        : (step.label ?? earlier?.label ?? ''),
      time,
    }
  })
}

function ComplaintDetail({ complaint, onBack, onNavigate, onStatus }) {
  const legacy = complaint.detail
  const [phase, setPhase] = useState(complaint.status === 'received' ? 'received' : complaint.status)
  const [checks, setChecks] = useState(complaint.checks ?? legacy?.steps?.map((step) => step.checked) ?? [])
  const [recommendation, setRecommendation] = useState(null)
  const [recommendError, setRecommendError] = useState('')
  const [recommending, setRecommending] = useState(false)
  const [action, setAction] = useState(null)
  const [startedSteps, setStartedSteps] = useState([])
  const [starting, setStarting] = useState(false)
  const [startError, setStartError] = useState('')
  const [stepError, setStepError] = useState('')
  const [checkingType, setCheckingType] = useState(null)
  const [record, setRecord] = useState(null)
  const [detailError, setDetailError] = useState('')
  const [detailLoading, setDetailLoading] = useState(!legacy && complaint.complaintId != null)
  const summaryRef = useRef(null)
  const [summaryExtra, setSummaryExtra] = useState(0)

  const loadRecommendation = async (retry) => {
    setRecommending(true)
    setRecommendError('')
    try {
      const payload = await recommendComplaint(complaint.complaintId, { retry })
      setRecommendation(payload.data ?? null)
    } catch (error) {
      setRecommendError(error.message || '추천을 불러오지 못했습니다.')
    } finally {
      setRecommending(false)
    }
  }

  useEffect(() => {
    if (legacy || complaint.complaintId == null) return undefined
    let cancelled = false

    const load = async () => {
      setDetailLoading(true)
      setDetailError('')
      try {
        const payload = await getComplaint(complaint.complaintId)
        if (cancelled) return
        const data = payload.data ?? {}
        const nextPhase = complaintPhase[data.status] ?? complaint.status
        const linked = data.action ?? null
        const steps = actionSteps(linked?.steps)
        setRecord(data)
        if (nextPhase === 'progress' || nextPhase === 'done') {
          setAction(linked)
          setStartedSteps(steps)
          setChecks(steps.map((step) => step.checked))
          setRecommendation(linked)
          setPhase(nextPhase)
          if (nextPhase !== complaint.status) onStatus(nextPhase, steps.map((step) => step.checked))
        } else if (linked) {
          setRecommendation(linked)
          setPhase('received')
        } else if (nextPhase === 'received') {
          setPhase('received')
          loadRecommendation(false)
        } else {
          setPhase(nextPhase)
        }
      } catch (error) {
        if (cancelled) return
        setDetailError(error.message || '민원을 불러오지 못했습니다.')
        if (complaint.status === 'received') loadRecommendation(false)
      } finally {
        if (!cancelled) setDetailLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [complaint.complaintId])

  const changePhase = (nextPhase, nextChecks) => {
    setPhase(nextPhase)
    setChecks(nextChecks)
    onStatus(nextPhase, nextChecks)
  }

  const start = () => {
    if (!legacy) return
    const initial = legacy.steps.map((step) => step.checked)
    changePhase(initial.every(Boolean) ? 'done' : 'progress', initial)
  }

  const begin = async () => {
    const actionId = recommendation?.actionId
    if (actionId == null || actionId === '') {
      setStartError('조치 ID가 필요합니다.')
      return
    }

    setStarting(true)
    setStartError('')
    try {
      const payload = await startComplaintAction(actionId)
      const data = payload.data ?? {}
      const plan = recommendation?.steps ?? []
      const returned = Array.isArray(data.steps) ? data.steps : []
      const recordedAt = new Map(returned.filter((step) => step?.doneAt).map((step) => [step.type, step.doneAt]))
      const source = (plan.length ? plan : returned).map((step) => (
        step?.doneAt || !recordedAt.has(step?.type) ? step : { ...step, doneAt: recordedAt.get(step.type) }
      ))
      const steps = actionSteps(source, plan)
      const finished = data.status === 'DONE'
      const nextPhase = finished ? 'done' : 'progress'
      const nextChecks = steps.map((step) => step.checked)
      setAction({ ...recommendation, ...data, summary: recommendation?.summary || data.summary, steps: source })
      setStartedSteps(steps)
      setChecks(nextChecks)
      setPhase(nextPhase)
      onStatus(nextPhase, nextChecks)
    } catch (error) {
      setStartError(error.message || '처리를 시작하지 못했습니다.')
    } finally {
      setStarting(false)
    }
  }

  const completeStep = async (step) => {
    if (step.checked || checkingType) return
    let current = action
    let actionId = current?.actionId ?? recommendation?.actionId
    setCheckingType(step.type)
    setStepError('')
    try {
      if (current?.status === 'PENDING' || current?.status === 'CHECKED') {
        const started = await startComplaintAction(actionId)
        const startedData = started.data ?? {}
        current = {
          ...recommendation,
          ...current,
          ...startedData,
          summary: current?.summary || recommendation?.summary || startedData.summary,
        }
        actionId = current.actionId ?? actionId
        setAction(current)
      }
      const payload = await completeComplaintStep(actionId, { type: step.type, targetTemp: step.targetTemp })
      const data = payload.data ?? {}
      const steps = actionSteps(data.steps, startedSteps)
      const finished = data.status === 'DONE'
      setAction(data)
      setStartedSteps(steps)
      setChecks(steps.map((item) => item.checked))
      if (finished) {
        setPhase('done')
        onStatus('done', steps.map((item) => item.checked))
      }
    } catch (error) {
      setStepError(error.message || '단계를 완료하지 못했습니다.')
    } finally {
      setCheckingType(null)
    }
  }

  const toggle = (index) => {
    const nextChecks = checks.map((checked, itemIndex) => (itemIndex === index ? !checked : checked))
    changePhase(nextChecks.every(Boolean) ? 'done' : 'progress', nextChecks)
  }

  const title = legacy?.title ?? '학생 접수 상세'
  const contentLabel = legacy?.contentLabel ?? '민원 내용'
  const labels = (record?.categoryLabels ?? complaint.categoryLabels ?? []).filter(Boolean)
  const room = record?.room ?? complaint.room ?? ''
  const categoryLineCount = labels.length >= 2 ? Math.ceil(labels.length / 3) : 0
  const categoryLines = []
  if (categoryLineCount) {
    for (let index = 0; index < labels.length; index += 3) {
      categoryLines.push(labels.slice(index, index + 3).join(' · '))
    }
  }
  const place = labels.length || room
    ? (categoryLineCount
      ? [room, ...categoryLines].filter(Boolean).join('\n')
      : (labels.length ? `${room} · ${labels.join(' · ')}` : (room || complaint.place)))
    : complaint.place
  const layoutShift = categoryLineCount * 21
  const titleShift = categoryLineCount ? layoutShift + 7 : 0
  const content = legacy?.content ?? record?.content ?? complaint.body
  const when = legacy?.submittedAt ?? submittedAt(record?.createdAt ?? complaint.createdAt)
  const snapshot = record?.snapshot
  const severity = snapshot ? snapshotSeverity(snapshot) : null
  const phaseTitles = { received: 'AI 추천 조치', progress: '조치 진행 중', done: '조치 완료' }
  const adviceTitle = legacy?.[adviceTitles[phase]] ?? phaseTitles[phase] ?? 'AI 추천 조치'
  const textOffset = phase === 'received' ? summaryExtra : 0

  useLayoutEffect(() => {
    const node = summaryRef.current
    if (!node || phase !== 'received') {
      setSummaryExtra(0)
      return
    }
    const extra = Math.max(0, Math.ceil(node.getBoundingClientRect().height - 23))
    setSummaryExtra((current) => (current === extra ? current : extra))
  }, [phase, recommendation?.summary, recommendError, detailError, detailLoading, startError, legacy])

  return (
    <PageRoot>
      <Screen>
        <Sheet $extra={textOffset + layoutShift}>
        <Ellipse src={ellipse} alt="" width="875" height="875" />

        <Header>
          <BackButton type="button" aria-label="접수함으로 돌아가기" onClick={onBack}>
            <img src={backIcon} alt="" width="22" height="22" />
          </BackButton>
          <Title>{title}</Title>
        </Header>

        <ComplaintCard $shift={layoutShift} aria-label={place}>
          <Megaphone src={megaphoneIcon} alt="" width="24" height="24" />
          {detailLoading && !legacy ? null : <Place $wrap={categoryLineCount > 0}>{place}</Place>}
          <Badge $tone={phase}>{badgeTones[phase].label}</Badge>
          <SubmittedAt $shift={titleShift}>{when}</SubmittedAt>
          <ContentLabel $shift={titleShift}>{contentLabel}</ContentLabel>
          <Quote $shift={layoutShift}>{detailLoading && !legacy ? '' : content}</Quote>
        </ComplaintCard>

        {legacy ? (
        <AirCard $shift={layoutShift} aria-label={legacy.co2Label}>
          <AirLabel>{legacy.co2Label}</AirLabel>
          <Co2Value>
            {legacy.co2}
            <Co2Unit>{legacy.co2Unit}</Co2Unit>
          </Co2Value>
          <Gauge>
            <ComfortRing score={legacy.comfort} />
            <ComfortScore>{legacy.comfort}</ComfortScore>
            <ComfortLabel>{legacy.comfortLabel}</ComfortLabel>
          </Gauge>
          <Severity>{legacy.severity}</Severity>
          <Metrics>
            <Metric>
              <MetricLabel>{legacy.temperatureLabel}</MetricLabel>
              <MetricValue>
                {legacy.temperature}
                <MetricUnit>
                  {' '}
                  °C <MetricNote>· {legacy.temperatureNote}</MetricNote>
                </MetricUnit>
              </MetricValue>
            </Metric>
            <Metric>
              <MetricLabel>{legacy.humidityLabel}</MetricLabel>
              <MetricValue>
                {legacy.humidity}
                <MetricUnit>
                  {' '}
                  % <MetricNote>· {legacy.humidityNote}</MetricNote>
                </MetricUnit>
              </MetricValue>
            </Metric>
          </Metrics>
        </AirCard>
        ) : null}
        {snapshot ? (
          <AirCard $shift={layoutShift} aria-label="접수 시점 CO₂">
            <AirLabel>접수 시점 CO₂</AirLabel>
            <Co2Value>
              {formatMeasure(snapshot.co2)}
              <Co2Unit>ppm</Co2Unit>
            </Co2Value>
            <Gauge>
              <ComfortRing score={snapshot.comfortScore} />
              <ComfortScore>{formatMeasure(snapshot.comfortScore)}</ComfortScore>
              <ComfortLabel>쾌적도</ComfortLabel>
            </Gauge>
            {severity?.text ? <Severity $color={severity.color}>{severity.text}</Severity> : null}
            <Metrics>
              <Metric>
                <MetricLabel>접수 시점 온도</MetricLabel>
                <MetricValue>
                  {formatMeasure(snapshot.temp)}
                  <MetricUnit>
                    {' '}
                    °C{snapshot.tempLabel ? <MetricNote>· {snapshot.tempLabel}</MetricNote> : null}
                  </MetricUnit>
                </MetricValue>
              </Metric>
              <Metric>
                <MetricLabel>접수 시점 습도</MetricLabel>
                <MetricValue>
                  {formatMeasure(snapshot.humidity)}
                  <MetricUnit>
                    {' '}
                    %{snapshot.humidityLabel ? <MetricNote>· {snapshot.humidityLabel}</MetricNote> : null}
                  </MetricUnit>
                </MetricValue>
              </Metric>
            </Metrics>
          </AirCard>
        ) : null}

        {(legacy || (!complaint.local && (phase === 'received' || phase === 'progress' || phase === 'done'))) ? (
        <AdviceCard $tall={phase === 'progress' && !legacy} $extra={textOffset} $shift={layoutShift} aria-label={adviceTitle}>
          <Spark>
            <SparkMain src={sparkIcon} alt="" width="13.4484" height="13.7817" />
            <SparkSmall src={sparkSmallIcon} alt="" width="5.44842" height="5.89842" />
          </Spark>
          <AdviceTitle>{adviceTitle}</AdviceTitle>
          {detailError && !legacy ? <AdviceText ref={summaryRef}>{detailError}</AdviceText> : null}
          {detailLoading && !legacy ? <AdviceText ref={summaryRef}>민원을 불러오고 있어요.</AdviceText> : null}
          {phase === 'received' && legacy && (
            <>
              <AdviceText ref={summaryRef}>{legacy.aiAction}</AdviceText>
              <Effect $offset={textOffset}>
                {legacy.effectLabel}
                <EffectValue>{legacy.effect}</EffectValue>
              </Effect>
              <OtherButton type="button" $offset={textOffset}>
                <RedoIcon>
                  <RedoImage src={redoIcon} alt="" width="16.5" height="16.5" />
                </RedoIcon>
                {legacy.other}
              </OtherButton>
              <StartButton type="button" $offset={textOffset} onClick={start}>
                {legacy.start}
              </StartButton>
            </>
          )}
          {phase === 'received' && !legacy && !detailLoading && (
            <>
              {recommending && !recommendation ? <AdviceText ref={summaryRef}>추천을 불러오고 있어요.</AdviceText> : null}
              {!recommendation && recommendError ? <AdviceText ref={summaryRef}>{recommendError}</AdviceText> : null}
              {recommendation ? (
                <>
                  <AdviceText ref={summaryRef}>{recommendation.summary}</AdviceText>
                  {recommendError ? (
                    <Effect $error $offset={textOffset}>{recommendError}</Effect>
                  ) : effectText(recommendation) ? (
                    <Effect $offset={textOffset}>
                      예상 효과
                      <EffectValue>{effectText(recommendation)}</EffectValue>
                    </Effect>
                  ) : null}
                </>
              ) : null}
              <OtherButton type="button" $offset={textOffset} disabled={recommending} onClick={() => loadRecommendation(true)}>
                <RedoIcon>
                  <RedoImage src={redoIcon} alt="" width="16.5" height="16.5" />
                </RedoIcon>
                {recommending ? '찾는 중' : '다른 방법'}
              </OtherButton>
              {startError ? <AdviceText>{startError}</AdviceText> : null}
              <StartButton type="button" $offset={textOffset} disabled={starting || !recommendation?.actionId} onClick={begin}>
                추천대로 처리 시작
              </StartButton>
            </>
          )}
          {phase === 'progress' && !legacy && !detailLoading && (
            <ProgressBody>
              <ProgressSummary>{action?.summary || recommendation?.summary}</ProgressSummary>
              <ProgressTasks>
                {startedSteps.map((step, index) => {
                  const checked = checks[index]
                  const note = checked ? step.doneNote : step.pendingNote
                  return (
                    <Task
                      key={`${step.type}-${step.label}`}
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      disabled={checked || checkingType === step.type}
                      onClick={() => completeStep(step)}
                    >
                      <CheckBox $on={checked}>
                        {checked && <img src={checkIcon} alt="" width="16" height="16" />}
                      </CheckBox>
                      <TaskCopy>
                        <TaskTitle $done={checked}>{step.label}</TaskTitle>
                        {note && <TaskNote $done={checked}>{note}</TaskNote>}
                      </TaskCopy>
                    </Task>
                  )
                })}
              </ProgressTasks>
              {stepError ? <StepError>{stepError}</StepError> : null}
            </ProgressBody>
          )}
          {phase === 'done' && !legacy && !detailLoading && (
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
                {startedSteps.map((step) => (
                  <DoneItem key={`${step.type}-${step.label}`} type="button" role="checkbox" aria-checked="true" disabled>
                    <CheckBox $on $small>
                      <img src={checkSmallIcon} alt="" width="14" height="14" />
                    </CheckBox>
                    <DoneLabel>{step.doneLabel}</DoneLabel>
                    <DoneTime>{step.time}</DoneTime>
                  </DoneItem>
                ))}
              </DoneList>
            </>
          )}
          {phase === 'progress' && legacy && (
            <>
              <AdviceText>{legacy.aiAction}</AdviceText>
              <TaskList>
                {legacy.steps.map((step, index) => {
                  const checked = checks[index]
                  const note = checked ? step.doneNote : step.pendingNote
                  return (
                    <Task key={step.label} type="button" role="checkbox" aria-checked={checked} onClick={() => toggle(index)}>
                      <CheckBox $on={checked}>
                        {checked && <img src={checkIcon} alt="" width="16" height="16" />}
                      </CheckBox>
                      <TaskCopy>
                        <TaskTitle $done={checked}>{step.label}</TaskTitle>
                        {note && <TaskNote $done={checked}>{note}</TaskNote>}
                      </TaskCopy>
                    </Task>
                  )
                })}
              </TaskList>
            </>
          )}
          {phase === 'done' && legacy && (
            <>
              <Result>
                <ResultLabel>{legacy.result.label}</ResultLabel>
                <ResultValue>{legacy.result.value}</ResultValue>
                <ResultUnit> {legacy.result.unit}</ResultUnit>
                <Goal>{legacy.result.badge}</Goal>
              </Result>
              <DoneList>
                {legacy.steps.map((step, index) => (
                  <DoneItem key={step.label} type="button" role="checkbox" aria-checked={checks[index]} onClick={() => toggle(index)}>
                    <CheckBox $on $small>
                      <img src={checkSmallIcon} alt="" width="14" height="14" />
                    </CheckBox>
                    <DoneLabel>{step.doneLabel}</DoneLabel>
                    <DoneTime>{step.time}</DoneTime>
                  </DoneItem>
                ))}
              </DoneList>
            </>
          )}
        </AdviceCard>
        ) : null}

        </Sheet>
      </Screen>
      <MenuDock>
        <Footer active="inbox" onNavigate={onNavigate} />
      </MenuDock>
    </PageRoot>
  )
}

export default ComplaintDetail

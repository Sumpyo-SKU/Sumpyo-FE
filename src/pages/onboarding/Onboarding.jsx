import { useEffect, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import ellipseA from '../../assets/images/onboarding-ellipse-a.svg'
import ellipseB from '../../assets/images/onboarding-ellipse-b.svg'
import ellipseC from '../../assets/images/onboarding-ellipse-c.svg'
import ellipseD from '../../assets/images/onboarding-ellipse-d.svg'
import logoImage from '../../assets/images/onboarding-logo.png'
import bubbleImage from '../../assets/images/onboarding-bubble.png'
import runImage from '../../assets/images/onboarding-run.png'
import pinIcon from '../../assets/images/onboarding-pin.svg'
import checkIcon from '../../assets/images/onboarding-check.svg'

const buildings = [
  ['대일관', '문예관', '본관'],
  ['북악관', '상승관', '유담관'],
  ['은주1관', '은주2관', '청운관'],
  ['한림관', '혜인관', '수인관'],
]

const floors = [1, 2, 3, 4, 5, 6, 7, 8]
const steps = ['담당 구역 저장', '강의실 센서 연결 중', '환기 알림 켜기']

function floorLabel(selected) {
  const sorted = [...selected].sort((left, right) => left - right)
  if (sorted.length === 0) return ''
  if (sorted.length === 1) return `${sorted[0]}층`
  return `${sorted.join('·')}층`
}

function zoneLabel(building, selectedFloors) {
  return [building, floorLabel(selectedFloors)].filter(Boolean).join(' · ') || '북악관'
}

const PageRoot = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100dvh;
  background: #ebf3ff;
  color: #263e50;
  font-family: 'Noto Sans KR', sans-serif;
`

const Screen = styled.div`
  position: relative;
  width: 390px;
  min-height: max(844px, 100dvh);
  overflow: hidden;
  background: #ebf3ff;
`

const Ellipse = styled.img`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  z-index: 0;
  pointer-events: none;
`

const Logo = styled.img`
  position: absolute;
  top: 81px;
  left: 114px;
  z-index: 2;
  object-fit: cover;
`

const Slogan = styled.p`
  position: absolute;
  top: 183px;
  right: 0;
  left: 0;
  z-index: 2;
  margin: 0;
  color: #5f6a8f;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
`

const bubbleFloat = keyframes`
  0% {
    transform: translateY(8px) scale(0.985, 1.015);
  }
  50% {
    transform: translateY(-12px) scale(1.02, 0.985);
  }
  100% {
    transform: translateY(8px) scale(0.985, 1.015);
  }
`

const dropletRise = keyframes`
  0% {
    transform: translateY(16px) scale(0.65);
    opacity: 0;
  }
  18% {
    opacity: 0.9;
  }
  72% {
    transform: translateY(-22px) scale(1);
    opacity: 0.75;
  }
  100% {
    transform: translateY(-46px) scale(0.8);
    opacity: 0;
  }
`

const dropletShine = keyframes`
  0% {
    transform: translate(-18px, 10px);
    opacity: 0.28;
  }
  50% {
    transform: translate(16px, -12px);
    opacity: 0.7;
  }
  100% {
    transform: translate(-18px, 10px);
    opacity: 0.28;
  }
`

const droplets = [
  { top: '132px', left: '230px', size: '12px', delay: '0s', duration: '2s' },
  { top: '188px', left: '452px', size: '18px', delay: '0.25s', duration: '2.3s' },
  { top: '318px', left: '206px', size: '11px', delay: '0.55s', duration: '1.8s' },
  { top: '356px', left: '430px', size: '15px', delay: '0.1s', duration: '2.15s' },
  { top: '246px', left: '488px', size: '9px', delay: '0.7s', duration: '1.7s' },
]

const BubbleStage = styled.div`
  position: absolute;
  top: 203px;
  left: -140px;
  z-index: 1;
  width: 645px;
  height: 633px;
  transform-origin: 50% 46%;
  animation: ${bubbleFloat} 2.2s ease-in-out infinite;
`

const Bubble = styled.img`
  display: block;
  object-fit: cover;
  opacity: 0.88;
`

const BubbleShine = styled.span`
  position: absolute;
  top: 126px;
  left: 242px;
  width: 96px;
  height: 52px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 72%);
  animation: ${dropletShine} 2.2s ease-in-out infinite;
  pointer-events: none;
`

const Droplet = styled.span`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border-radius: 50%;
  background: radial-gradient(
    circle at 32% 28%,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(198, 228, 255, 0.72) 42%,
    rgba(255, 255, 255, 0.08) 74%
  );
  box-shadow:
    inset 0 -1px 2px rgba(120, 176, 230, 0.35),
    0 4px 8px rgba(120, 180, 230, 0.18);
  animation: ${dropletRise} ${({ $duration }) => $duration} ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay};
  pointer-events: none;
`

const Main = styled.main`
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: auto;
  padding: 112px 0 32px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const Title = styled.h1`
  margin: 0 21px;
  color: #263e50;
  font-size: 27px;
  font-weight: 700;
  line-height: 37px;
  letter-spacing: -0.53px;
`

const Subtitle = styled.p`
  margin: 4px 21px 0;
  color: #5f6a8f;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`

const Note = styled.p`
  margin: 28px 21px 0;
  color: #54a447;
  font-size: 13px;
  font-weight: 400;
  line-height: 19px;
  white-space: nowrap;
`

const Card = styled.section`
  margin: 14px 16px 0;
  padding: 14px 16px 16px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.38);
  backdrop-filter: blur(12px);
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
`

const FloorCard = styled(Card)`
  margin-top: 27px;
`

const CardTitle = styled.h2`
  margin: 0;
  color: #263e50;
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
`

const BuildingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 102px);
  gap: 15px 9px;
  margin-top: 12px;
`

const FloorGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 13px 9px;
  margin-top: 12px;
`

const chipStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin: 0;
  padding: 0;
  border: 1px solid #d4e8fb;
  background: #ffffff;
  color: #6d96bc;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 22px;
`

const BuildingChip = styled.button`
  ${chipStyle}
  width: 102px;
  border-radius: 10px;
  cursor: pointer;

  ${({ $on }) =>
    $on &&
    css`
      border: 1.5px solid #56a6f0;
      background: rgba(86, 166, 240, 0.1);
      color: #263e50;
    `}
`

const BuildingLabel = styled.span`
  ${chipStyle}
  width: 102px;
  border-radius: 10px;
`

const FloorChip = styled.button`
  ${chipStyle}
  width: 74px;
  border-radius: 30px;
  cursor: pointer;

  ${({ $on }) =>
    $on &&
    css`
      border: 1.5px solid #56a6f0;
      background: rgba(86, 166, 240, 0.1);
      color: #263e50;
    `}
`

const FloorLabel = styled.span`
  ${chipStyle}
  width: 74px;
  border-radius: 30px;
`

const StartButton = styled.button`
  display: block;
  width: calc(100% - 32px);
  height: 56px;
  margin: 41px 16px 0;
  border: none;
  border-radius: 20px;
  background: #56a6f0;
  color: #ffffff;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  cursor: pointer;
`

const Ready = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
`

const runHop = keyframes`
  0% {
    transform: translateY(0) scale(1, 1);
  }
  50% {
    transform: translateY(-6px) scale(0.995, 1.015);
  }
  100% {
    transform: translateY(0) scale(1, 1);
  }
`

const Runner = styled.img`
  position: absolute;
  top: 118px;
  left: 47px;
  object-fit: cover;
  transform-origin: 58% 84%;
  animation: ${runHop} 1.4s ease-in-out infinite;
`

const Badge = styled.p`
  position: absolute;
  top: 434px;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  margin: 0;
  padding: 0 14px;
  border: 1px solid #d1e0f8;
  border-radius: 999px;
  background: #ffffff;
  color: #425c81;
  font-size: 13px;
  font-weight: 700;
  line-height: 19px;
  white-space: nowrap;
  transform: translateX(-50%);
`

const ReadyTitle = styled.h1`
  position: absolute;
  top: 475px;
  right: 24px;
  left: 24px;
  margin: 0;
  color: #2f3e4e;
  font-size: 22px;
  font-weight: 900;
  line-height: 31px;
  text-align: center;
`

const ReadyHint = styled.p`
  position: absolute;
  top: 517px;
  right: 24px;
  left: 24px;
  margin: 0;
  color: #616c78;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
`

const Panel = styled.section`
  position: absolute;
  top: 567px;
  right: 24px;
  left: 24px;
  height: 150px;
  padding: 18px;
  border: 1px solid #ffffff;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 14px rgba(47, 62, 78, 0.06);
`

const Track = styled.div`
  height: 8px;
  overflow: hidden;
  border-radius: 4px;
  background: #eaf1fc;
`

const Fill = styled.div`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, #99bbef 0%, #56a6f0 100%);
`

const StepList = styled.ul`
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
`

const StepItem = styled.li`
  display: flex;
  align-items: center;
  height: 22px;
  margin-top: 12px;
  color: ${({ $state }) => ($state === 'active' ? '#2f3e4e' : $state === 'done' ? '#616c78' : '#8f979f')};
  font-size: 14px;
  font-weight: ${({ $state }) => ($state === 'active' ? 700 : 400)};
  line-height: 20px;

  &:first-child {
    margin-top: 0;
  }
`

const DoneMark = styled.span`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-right: 10px;
  border-radius: 11px;
  background: #56a6f0;
`

const RingSvg = styled.svg`
  display: block;
  flex: none;
  width: 22px;
  height: 22px;
  margin-right: 10px;
`

const Footnote = styled.p`
  position: absolute;
  right: 24px;
  bottom: 52px;
  left: 24px;
  margin: 0;
  color: #616c78;
  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  text-align: center;
`

function Backdrop() {
  return (
    <>
      <Ellipse src={ellipseA} alt="" width="1009" height="1009" $top="-198px" $left="-26px" />
      <Ellipse src={ellipseB} alt="" width="1109" height="1109" $top="-373px" $left="-643px" />
      <Ellipse src={ellipseD} alt="" width="1109" height="1109" $top="-373px" $left="-643px" />
      <Ellipse src={ellipseC} alt="" width="768" height="768" $top="437px" $left="-187px" />
    </>
  )
}

const ringRadius = 8.75
const ringLength = 2 * Math.PI * ringRadius
const stepMs = 600

function ringAmount(index, elapsed) {
  return Math.min(1, Math.max(0, (elapsed - index * stepMs) / stepMs))
}

function ringState(amount) {
  if (amount >= 1) return 'done'
  if (amount > 0) return 'active'
  return 'pending'
}

function LoadingRing({ progress }) {
  return (
    <RingSvg viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r={ringRadius} fill="none" stroke="#d2dbe7" strokeWidth="2.5" />
      {progress > 0 && (
        <circle
          cx="11"
          cy="11"
          r={ringRadius}
          fill="none"
          stroke="#56a6f0"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={ringLength}
          strokeDashoffset={ringLength * (1 - progress)}
          transform="rotate(-90 11 11)"
        />
      )}
    </RingSvg>
  )
}

function ReadyPage({ label, onDone }) {
  const [progress, setProgress] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const started = performance.now()
    let frame
    const tick = (now) => {
      const next = now - started
      setElapsed(next)
      setProgress(Math.min(100, (next / (steps.length * stepMs)) * 100))
      if (next < 2000) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    const doneTimer = setTimeout(onDone, 2000)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <Ready>
      <Runner src={runImage} alt="" width="297" height="286" />
      <Badge>
        <img src={pinIcon} alt="" width="14" height="14" />
        {label}
      </Badge>
      <ReadyTitle>담당 구역을 준비하고 있어요</ReadyTitle>
      <ReadyHint>이 층 강의실 알림만 보내드릴게요</ReadyHint>
      <Panel>
        <Track>
          <Fill $progress={progress} />
        </Track>
        <StepList>
          {steps.map((labelText, index) => {
            const amount = ringAmount(index, elapsed)
            const state = ringState(amount)
            return (
              <StepItem key={labelText} $state={state}>
                {state === 'done' ? (
                  <DoneMark>
                    <img src={checkIcon} alt="" width="14" height="14" />
                  </DoneMark>
                ) : (
                  <LoadingRing progress={amount} />
                )}
                {labelText}
              </StepItem>
            )
          })}
        </StepList>
      </Panel>
      <Footnote>담당 구역은 설정에서 언제든 바꿀 수 있어요</Footnote>
    </Ready>
  )
}

function Onboarding({ onDone }) {
  const [step, setStep] = useState('flash')
  const [building, setBuilding] = useState(null)
  const [selectedFloors, setSelectedFloors] = useState([])

  useEffect(() => {
    if (step !== 'flash') return undefined
    const timer = setTimeout(() => setStep('role'), 2000)
    return () => clearTimeout(timer)
  }, [step])

  function toggleFloor(floor) {
    setSelectedFloors((current) =>
      current.includes(floor) ? current.filter((item) => item !== floor) : [...current, floor],
    )
  }

  return (
    <PageRoot>
      <Screen>
        <Backdrop />
        {step === 'flash' && (
          <>
            <Logo src={logoImage} alt="숨표" width="162" height="100" />
            <Slogan>숨 쉬기 좋은 강의실을 위해</Slogan>
            <BubbleStage>
              <Bubble src={bubbleImage} alt="" width="645" height="633" />
              <BubbleShine />
              {droplets.map((drop) => (
                <Droplet
                  key={`${drop.top}-${drop.left}`}
                  $top={drop.top}
                  $left={drop.left}
                  $size={drop.size}
                  $delay={drop.delay}
                  $duration={drop.duration}
                />
              ))}
            </BubbleStage>
          </>
        )}
        {step === 'role' && (
          <Main>
            <Title>어디를 맡고 있나요?</Title>
            <Subtitle>맡고있는 곳에 관한 알림만 받아요</Subtitle>
            <Note>*현재 북악관 5·6층에서 주요 기능을 체험하실 수 있습니다</Note>
            <Card>
              <CardTitle>1. 건물을 선택해 주세요.</CardTitle>
              <BuildingGrid>
                {buildings.flat().map((name) =>
                  name === '북악관' ? (
                    <BuildingChip
                      key={name}
                      type="button"
                      $on={building === name}
                      aria-pressed={building === name}
                      onClick={() => setBuilding((current) => (current === name ? null : name))}
                    >
                      {name}
                    </BuildingChip>
                  ) : (
                    <BuildingLabel key={name}>{name}</BuildingLabel>
                  ),
                )}
              </BuildingGrid>
            </Card>
            <FloorCard>
              <CardTitle>2. 담당 층을 선택해 주세요.</CardTitle>
              <FloorGrid>
                {floors.map((floor) =>
                  floor === 5 || floor === 6 ? (
                    <FloorChip
                      key={floor}
                      type="button"
                      $on={selectedFloors.includes(floor)}
                      aria-pressed={selectedFloors.includes(floor)}
                      onClick={() => toggleFloor(floor)}
                    >
                      {floor}층
                    </FloorChip>
                  ) : (
                    <FloorLabel key={floor}>{floor}층</FloorLabel>
                  ),
                )}
              </FloorGrid>
            </FloorCard>
            <StartButton type="button" onClick={() => setStep('ready')}>
              시작하기
            </StartButton>
          </Main>
        )}
        {step === 'ready' && (
          <ReadyPage
            label={zoneLabel(building, selectedFloors)}
            onDone={() => onDone({ building, floors: selectedFloors })}
          />
        )}
      </Screen>
    </PageRoot>
  )
}

export default Onboarding

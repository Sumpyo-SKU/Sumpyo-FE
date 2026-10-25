import { useState } from 'react'
import styled from 'styled-components'
import Footer from '../../common/Footer/Footer.jsx'
import ellipse from '../../assets/images/bg-detail-ellipse.svg'
import backIcon from '../../assets/images/icon-back.svg'
import megaphoneIcon from '../../assets/images/icon-megaphone.svg'
import sparkIcon from '../../assets/images/icon-repeat-spark.svg'
import sparkSmallIcon from '../../assets/images/icon-repeat-spark-2.svg'
import gaugeTrack from '../../assets/images/gauge-comfort-track.svg'
import gaugeFill from '../../assets/images/gauge-comfort-fill.svg'
import redoIcon from '../../assets/images/icon-redo.svg'
import checkIcon from '../../assets/images/icon-check.svg'
import checkSmallIcon from '../../assets/images/icon-check-small.svg'
import statusTime from '../../assets/images/status-time.svg'
import statusSignal from '../../assets/images/status-signal.svg'
import statusWifi from '../../assets/images/status-wifi.svg'
import statusBattery from '../../assets/images/status-battery.svg'
import statusIndicator from '../../assets/images/status-indicator.svg'

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

const StatusBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  width: 390px;
  height: 45px;
`

const StatusIcon = styled.img`
  position: absolute;
  top: ${({ $top }) => $top};
  ${({ $left }) => $left && `left: ${$left};`}
  ${({ $right }) => $right && `right: ${$right};`}
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
  height: 203px;
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
  line-height: 1;
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
  top: 48px;
  left: 20px;
  margin: 0;
  color: #263e50;
  font-size: 13px;
`

const ContentLabel = styled.p`
  position: absolute;
  top: 90px;
  left: 20px;
  margin: 0;
  color: rgba(38, 62, 80, 0.7);
  font-size: 13px;
  font-weight: 500;
`

const Quote = styled.p`
  position: absolute;
  top: 115px;
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
  top: 330px;
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

const GaugeTrack = styled.img`
  position: absolute;
  top: 5px;
  left: 6px;
`

const GaugeArc = styled.div`
  position: absolute;
  top: 10px;
  left: 49px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38.8px;
  height: 65.7px;
`

const GaugeFill = styled.img`
  flex: none;
  transform: rotate(-90deg);
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
  color: #f75255;
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
  top: 548px;
  height: 192px;
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
  left: 16px;
  margin: 0;
  color: #263e50;
  font-size: 17px;
  font-weight: 600;
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
  background: rgba(204, 234, 201, 0.5);
  color: #547761;
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
`

const TaskList = styled.div`
  position: absolute;
  top: 79px;
  right: 18px;
  left: 14px;
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

function ComplaintDetail({ complaint, onBack, onNavigate, onStatus }) {
  const detail = complaint.detail
  const [phase, setPhase] = useState(complaint.status === 'received' ? 'received' : complaint.status)
  const [checks, setChecks] = useState(complaint.checks ?? detail.steps.map((step) => step.checked))

  const changePhase = (nextPhase, nextChecks) => {
    setPhase(nextPhase)
    setChecks(nextChecks)
    onStatus(nextPhase, nextChecks)
  }

  const start = () => {
    const initial = detail.steps.map((step) => step.checked)
    changePhase(initial.every(Boolean) ? 'done' : 'progress', initial)
  }

  const toggle = (index) => {
    const nextChecks = checks.map((checked, itemIndex) => (itemIndex === index ? !checked : checked))
    changePhase(nextChecks.every(Boolean) ? 'done' : 'progress', nextChecks)
  }

  return (
    <PageRoot>
      <Screen>
        <Ellipse src={ellipse} alt="" width="875" height="875" />
        <StatusBar aria-hidden="true">
          <StatusIcon src={statusTime} alt="" width="33" height="15" $top="15px" $left="31px" />
          <StatusIcon src={statusIndicator} alt="" width="6" height="6" $top="8px" $right="71px" />
          <StatusIcon src={statusSignal} alt="" width="20" height="14" $top="16px" $right="63px" />
          <StatusIcon src={statusWifi} alt="" width="16" height="14" $top="16px" $right="43px" />
          <StatusIcon src={statusBattery} alt="" width="25" height="14" $top="16px" $right="14px" />
        </StatusBar>

        <Header>
          <BackButton type="button" aria-label="접수함으로 돌아가기" onClick={onBack}>
            <img src={backIcon} alt="" width="22" height="22" />
          </BackButton>
          <Title>{detail.title}</Title>
        </Header>

        <ComplaintCard aria-label={complaint.place}>
          <Megaphone src={megaphoneIcon} alt="" width="24" height="24" />
          <Place>{complaint.place}</Place>
          <Badge $tone={phase}>{badgeTones[phase].label}</Badge>
          <SubmittedAt>{detail.submittedAt}</SubmittedAt>
          <ContentLabel>{detail.contentLabel}</ContentLabel>
          <Quote>{detail.content}</Quote>
        </ComplaintCard>

        <AirCard aria-label={detail.co2Label}>
          <AirLabel>{detail.co2Label}</AirLabel>
          <Co2Value>
            {detail.co2}
            <Co2Unit>{detail.co2Unit}</Co2Unit>
          </Co2Value>
          <Gauge>
            <GaugeTrack src={gaugeTrack} alt="" width="86" height="86" />
            <GaugeArc>
              <GaugeFill src={gaugeFill} alt="" width="75.704" height="48.0006" />
            </GaugeArc>
            <ComfortScore>{detail.comfort}</ComfortScore>
            <ComfortLabel>{detail.comfortLabel}</ComfortLabel>
          </Gauge>
          <Severity>{detail.severity}</Severity>
          <Metrics>
            <Metric>
              <MetricLabel>{detail.temperatureLabel}</MetricLabel>
              <MetricValue>
                {detail.temperature}
                <MetricUnit>
                  {' '}
                  °C <MetricNote>· {detail.temperatureNote}</MetricNote>
                </MetricUnit>
              </MetricValue>
            </Metric>
            <Metric>
              <MetricLabel>{detail.humidityLabel}</MetricLabel>
              <MetricValue>
                {detail.humidity}
                <MetricUnit>
                  {' '}
                  % <MetricNote>· {detail.humidityNote}</MetricNote>
                </MetricUnit>
              </MetricValue>
            </Metric>
          </Metrics>
        </AirCard>

        <AdviceCard aria-label={detail[adviceTitles[phase]]}>
          <Spark>
            <SparkMain src={sparkIcon} alt="" width="13.4484" height="13.7817" />
            <SparkSmall src={sparkSmallIcon} alt="" width="5.44842" height="5.89842" />
          </Spark>
          <AdviceTitle>{detail[adviceTitles[phase]]}</AdviceTitle>
          {phase === 'received' && (
            <>
              <AdviceText>{detail.aiAction}</AdviceText>
              <Effect>
                {detail.effectLabel}
                <EffectValue>{detail.effect}</EffectValue>
              </Effect>
              <OtherButton type="button">
                <RedoIcon>
                  <RedoImage src={redoIcon} alt="" width="16.5" height="16.5" />
                </RedoIcon>
                {detail.other}
              </OtherButton>
              <StartButton type="button" onClick={start}>
                {detail.start}
              </StartButton>
            </>
          )}
          {phase === 'progress' && (
            <>
              <AdviceText>{detail.aiAction}</AdviceText>
              <TaskList>
                {detail.steps.map((step, index) => {
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
          {phase === 'done' && (
            <>
              <Result>
                <ResultLabel>{detail.result.label}</ResultLabel>
                <ResultValue>{detail.result.value}</ResultValue>
                <ResultUnit> {detail.result.unit}</ResultUnit>
                <Goal>{detail.result.badge}</Goal>
              </Result>
              <DoneList>
                {detail.steps.map((step, index) => (
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

        <Footer active="inbox" onNavigate={onNavigate} />
      </Screen>
    </PageRoot>
  )
}

export default ComplaintDetail

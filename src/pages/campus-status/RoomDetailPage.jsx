import styled, { css } from 'styled-components'
import campusEllipse from '../../assets/images/bg-campus-ellipse.svg'
import backIcon from '../../assets/images/icon-back.svg'
import ventIcon from '../../assets/images/icon-vent.svg'
import tempIcon from '../../assets/images/icon-detail-temp.svg'
import humidityIcon from '../../assets/images/icon-detail-humidity.svg'
import gaugeTrack from '../../assets/images/gauge-track.svg'
import gaugeFill from '../../assets/images/gauge-fill.svg'
import chartThreshold from '../../assets/images/chart-threshold.svg'
import chartShade from '../../assets/images/chart-shade.svg'
import chartMeasuredFill from '../../assets/images/chart-measured-fill.svg'
import chartMeasuredLine from '../../assets/images/chart-measured-line.svg'
import chartPredictedLine from '../../assets/images/chart-predicted-line.svg'
import chartNowLine from '../../assets/images/chart-now-line.svg'
import chartNowDot from '../../assets/images/chart-now-dot.svg'
import statusTime from '../../assets/images/status-time.svg'
import statusSignal from '../../assets/images/status-signal.svg'
import statusWifi from '../../assets/images/status-wifi.svg'
import statusBattery from '../../assets/images/status-battery.svg'
import statusIndicator from '../../assets/images/status-indicator.svg'

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
  height: 870px;
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
  z-index: 2;
  width: 390px;
  height: 45px;
`

const StatusIcon = styled.img`
  position: absolute;
  top: ${({ $top }) => $top};
  ${({ $left }) => $left && css`left: ${$left};`}
  ${({ $right }) => $right && css`right: ${$right};`}
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

const GaugeTrack = styled.img`
  position: absolute;
  top: 5px;
  left: 5px;
`

const GaugeFillWrap = styled.div`
  position: absolute;
  top: 10.42%;
  right: 10.42%;
  bottom: 21.14%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const GaugeFillRotate = styled.div`
  position: relative;
  width: 65.703px;
  height: 38.788px;
  transform: rotate(-90deg);
  flex: none;
`

const GaugeFill = styled.img`
  position: absolute;
  top: -5.1px;
  left: -5px;
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
  overflow: hidden;
`

const PlotImage = styled.img`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
`

const ThresholdLabel = styled.span`
  position: absolute;
  top: 34px;
  right: 0;
  color: #f75255;
  font-family: Inter, 'Noto Sans KR', sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: normal;
`

const TimeRow = styled.div`
  position: absolute;
  top: 122px;
  left: 0;
  display: flex;
  gap: 56px;
  color: #6d96bc;
  font-family: Inter, 'Noto Sans KR', sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: normal;
  white-space: nowrap;
`

const TimeNow = styled.span`
  color: #263e50;
  font-weight: 700;
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

const ScheduleCard = styled.section`
  position: absolute;
  top: 722px;
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

const comfortScore = { exceed: '38', warn: '62', normal: '82' }

const statusLine = {
  exceed: { text: (gap) => `심각 · 기준보다 ${gap} 높음`, color: '#f75255' },
  warn: { text: () => '주의 · 곧 기준을 넘을 수 있어요', color: '#ff9d00' },
  normal: { text: () => '정상', color: '#74a842' },
}

function RoomDetailPage({ room, floor, onBack }) {
  const gap = Math.max(room.co2 - 1000, 0).toLocaleString('en-US')
  const line = statusLine[room.tone]
  const temperature = room.temperature.replace('°C', '').trim()
  const humidity = room.humidity.replace('%', '').trim()

  return (
    <PageRoot>
      <Screen>
        <Ellipse src={campusEllipse} alt="" width="875" height="875" />
        <StatusBar aria-hidden="true">
          <StatusIcon src={statusTime} alt="" width="33" height="15" $top="15px" $left="31px" />
          <StatusIcon src={statusIndicator} alt="" width="6" height="6" $top="8px" $right="71px" />
          <StatusIcon src={statusSignal} alt="" width="20" height="14" $top="16px" $right="63px" />
          <StatusIcon src={statusWifi} alt="" width="16" height="14" $top="16px" $right="43px" />
          <StatusIcon src={statusBattery} alt="" width="25" height="14" $top="16px" $right="14px" />
        </StatusBar>

        <BackButton type="button" aria-label="캠퍼스 현황으로 돌아가기" onClick={onBack}>
          <img src={backIcon} alt="" width="22" height="22" />
        </BackButton>
        <RoomTitle>{room.number} 호</RoomTitle>
        <RoomPlace>북악관 {floor}층 · 강의실</RoomPlace>

        <AirCard aria-label="지금 공기 상태">
          <AirLabel>지금 CO₂</AirLabel>
          <AirReading>
            <AirValue>{room.co2Label}</AirValue>
            <AirUnit>ppm</AirUnit>
          </AirReading>
          <AirStatus $color={line.color}>{line.text(gap)}</AirStatus>
          <VentBanner>
            <img src={ventIcon} alt="" width="18" height="18" />
            환기 진행중
          </VentBanner>
          <Gauge aria-hidden="true">
            <GaugeTrack src={gaugeTrack} alt="" width="86" height="86" />
            <GaugeFillWrap>
              <GaugeFillRotate>
                <GaugeFill src={gaugeFill} alt="" width="75.704" height="48.0006" />
              </GaugeFillRotate>
            </GaugeFillWrap>
            <Score>{comfortScore[room.tone]}</Score>
            <ScoreLabel>쾌적도</ScoreLabel>
          </Gauge>
        </AirCard>

        <MiniCard $side="left" aria-label="온도">
          <MiniIcon>
            <img src={tempIcon} alt="" width="6.66667" height="13.7761" />
          </MiniIcon>
          <MiniName>온도</MiniName>
          <MiniReading>
            <MiniValue>{temperature}</MiniValue>
            <MiniUnit>°C</MiniUnit>
          </MiniReading>
          <MiniNote>살짝 더워요 · 적정 20–24</MiniNote>
        </MiniCard>

        <MiniCard $side="right" aria-label="습도">
          <MiniIcon>
            <img src={humidityIcon} alt="" width="9.33333" height="12.3333" />
          </MiniIcon>
          <MiniName>습도</MiniName>
          <MiniReading>
            <MiniValue>{humidity}</MiniValue>
            <MiniUnit>%</MiniUnit>
          </MiniReading>
          <MiniNote>조금 습해요 · 적정 40–60</MiniNote>
        </MiniCard>

        <ChartCard aria-label="오늘 CO₂ 흐름">
          <ChartTitle>오늘 CO₂ 흐름</ChartTitle>
          <ChartPlot>
            <PlotImage src={chartShade} alt="" width="44.7239" height="115.288" $top="0" $left="205px" />
            <PlotImage src={chartMeasuredFill} alt="" width="238" height="94" $top="22px" $left="0" />
            <PlotImage src={chartThreshold} alt="" width="324" height="0.993865" $top="48.6px" $left="0" />
            <PlotImage src={chartMeasuredLine} alt="" width="240.386" height="82.3855" $top="20.8px" $left="-1.2px" />
            <PlotImage src={chartNowLine} alt="" width="0.993865" height="115.288" $top="0.4px" $left="239px" />
            <PlotImage src={chartPredictedLine} alt="" width="85.4728" height="61.8821" $top="21.3px" $left="238.5px" />
            <PlotImage src={chartNowDot} alt="" width="11.3301" height="11.3301" $top="17.6px" $left="231.7px" />
            <ThresholdLabel>1,000ppm</ThresholdLabel>
            <TimeRow>
              <span>09시</span>
              <span>12시</span>
              <span>14시</span>
              <TimeNow>지금</TimeNow>
              <span>18시</span>
            </TimeRow>
          </ChartPlot>
          <MeasuredKey />
          <LegendText $left="35px">실측</LegendText>
          <PredictedKey />
          <LegendText $left="87.63px">AI 예측</LegendText>
          <GuideKey />
          <LegendText $left="154.3px">기준</LegendText>
        </ChartCard>

        <ScheduleCard aria-label="수업 일정">
          <ClassRow $top="11px">
            <ClassBadge>지금</ClassBadge>
            <ClassCopy>
              자료구조
              <ClassTime>13:00–14:15</ClassTime>
            </ClassCopy>
          </ClassRow>
          <ClassRow $top="62px" $divided>
            <ClassBadge $next>다음</ClassBadge>
            <ClassCopy>
              운영체제
              <ClassTime>15:00–16:15</ClassTime>
            </ClassCopy>
          </ClassRow>
        </ScheduleCard>
      </Screen>
    </PageRoot>
  )
}

export default RoomDetailPage

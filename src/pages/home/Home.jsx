import { useState } from 'react'
import styled, { css } from 'styled-components'
import Header from '../../common/Header/Header.jsx'
import Footer from '../../common/Footer/Footer.jsx'
import Card from '../../components/Card/Card.jsx'
import ForecastView from './ForecastView.jsx'
import AlertsPage from './AlertsPage.jsx'
import SettingsPage from './SettingsPage.jsx'
import ZonePage from './ZonePage.jsx'
import ThresholdPage from './ThresholdPage.jsx'
import alertsDummy from '../../services/alertsDummy.js'
import RoomPicker from './RoomPicker.jsx'
import forecastDummy from '../../services/forecastDummy.js'
import classroomsDummy from '../../services/classroomsDummy.js'
import bgEllipse1 from '../../assets/images/bg-ellipse-1.svg'
import bgEllipse2 from '../../assets/images/bg-ellipse-2.svg'
import bgEllipse3 from '../../assets/images/bg-ellipse-3.svg'
import bgEllipse4 from '../../assets/images/bg-ellipse-4.svg'
import bgEllipse5 from '../../assets/images/bg-ellipse-5.svg'
import statusTime from '../../assets/images/status-time.svg'
import statusSignal from '../../assets/images/status-signal.svg'
import statusWifi from '../../assets/images/status-wifi.svg'
import statusBattery from '../../assets/images/status-battery.svg'
import statusIndicator from '../../assets/images/status-indicator.svg'
import gaugeImage from '../../assets/images/gauge.svg'
import characterBase from '../../assets/images/character-base.png'
import characterLeaf from '../../assets/images/character-leaf.png'
import characterWind from '../../assets/images/character-wind.png'
import characterPlug from '../../assets/images/character-plug.png'
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

function Home({ onNavigate, zones, onZonesChange }) {
  const [view, setView] = useState('now')
  const [room, setRoom] = useState(classroomsDummy.defaultRoom)
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
  const isForecast = view === 'forecast'
  const visibleAlerts = {
    ...alertsDummy,
    items: alertsDummy.items.filter((item) => notice[item.channel] !== false),
  }

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
        onSave={(next) => {
          setThreshold(next)
          setSettingsView('settings')
        }}
      />
    )
  }

  if (settingsView === 'settings') {
    return (
      <SettingsPage
        notice={notice}
        ppm={threshold.ppm}
        onToggle={(key) => setNotice((current) => ({ ...current, [key]: !current[key] }))}
        onBack={() => setSettingsView(null)}
        onOpenThreshold={() => setSettingsView('threshold')}
        onOpenZones={() => setSettingsView('zones')}
      />
    )
  }

  if (alertsOpen) {
    return <AlertsPage alerts={visibleAlerts} onBack={() => setAlertsOpen(false)} />
  }

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

        <StatusBar aria-hidden="true">
          <StatusIcon src={statusTime} alt="" width="33" height="15" $top="15px" $left="31px" />
          <StatusIcon src={statusIndicator} alt="" width="6" height="6" $top="8px" $right="71px" />
          <StatusIcon src={statusSignal} alt="" width="20" height="14" $top="16px" $right="63px" />
          <StatusIcon src={statusWifi} alt="" width="16" height="14" $top="16px" $right="43px" />
          <StatusIcon src={statusBattery} alt="" width="25" height="14" $top="16px" $right="14px" />
        </StatusBar>

        <Header
          room={room}
          pickerOpen={pickerOpen}
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

          {isForecast ? (
            <ForecastView data={forecastDummy} />
          ) : (
            <>
              <Score>
                <ScoreValue>86</ScoreValue>
                <ScoreSuffix> / 100 쾌적도</ScoreSuffix>
              </Score>

              <Hero>
                <img src={gaugeImage} alt="" width="296" height="226.933" />
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
              </Hero>

              <MetricsCard $variant="metric">
                <Metric>
                  <img src={co2Icon} alt="" width="24" height="24" />
                  <MetricLabel>CO₂</MetricLabel>
                  <MetricValue>
                    <MetricNumber>640</MetricNumber>
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
                    <MetricNumber>24</MetricNumber>
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
                    <MetricNumber>48</MetricNumber>
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
                      <OutdoorNumber>28</OutdoorNumber>
                      <OutdoorUnit>㎍/㎥</OutdoorUnit>
                    </OutdoorValue>
                  </OutdoorCopy>
                </Card>
                <Card $variant="outdoor">
                  <img src={outdoorTempIcon} alt="" width="35" height="35" />
                  <OutdoorCopy>
                    <OutdoorName>실외 온도</OutdoorName>
                    <OutdoorValue>
                      <OutdoorNumber>18</OutdoorNumber>
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
            rooms={classroomsDummy.rooms}
            selected={room}
            onSelect={(nextRoom) => {
              setRoom(nextRoom)
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

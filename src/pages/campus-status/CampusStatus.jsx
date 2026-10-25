import { useState } from 'react'
import styled, { css } from 'styled-components'
import Footer from '../../common/Footer/Footer.jsx'
import FloorPlan from './FloorPlan.jsx'
import RoomDetailCard from './RoomDetailCard.jsx'
import RoomDetailPage from './RoomDetailPage.jsx'
import campusDummy from '../../services/campusDummy.js'
import campusEllipse from '../../assets/images/bg-campus-ellipse.svg'
import chevronIcon from '../../assets/images/icon-chevron-down.svg'
import statusTime from '../../assets/images/status-time.svg'
import statusSignal from '../../assets/images/status-signal.svg'
import statusWifi from '../../assets/images/status-wifi.svg'
import statusBattery from '../../assets/images/status-battery.svg'
import statusIndicator from '../../assets/images/status-indicator.svg'

const PageRoot = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: max(844px, 100dvh);
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

const Title = styled.h1`
  position: absolute;
  top: 64px;
  left: 20px;
  z-index: 1;
  margin: 0;
  color: #161a2b;
  font-size: 21px;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -0.4px;
`

const BuildingButton = styled.div`
  position: absolute;
  top: 62px;
  left: 284px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 90px;
  height: 36px;
  border-radius: 999px;
  background: #ffffff;
  color: #161a2b;
  font-size: 13px;
  font-weight: 600;
  line-height: normal;
  pointer-events: none;
`

const FloorTabs = styled.div`
  position: absolute;
  top: 115px;
  right: 16px;
  left: 16px;
  z-index: 1;
  display: flex;
  height: 46px;
  border-radius: 14px;
  background: rgba(233, 236, 244, 0.4);
`

const FloorTab = styled.button`
  position: relative;
  flex: 1;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: #5a6072;
  font-size: 13px;
  font-weight: 400;
  line-height: 19px;
  cursor: ${({ $enabled }) => ($enabled ? 'pointer' : 'default')};
  pointer-events: ${({ $enabled }) => ($enabled ? 'auto' : 'none')};

  ${({ $selected }) =>
    $selected &&
    css`
      color: #161a2b;
      font-weight: 700;
    `}
`

const FloorPill = styled.span`
  position: absolute;
  top: 4px;
  left: 50%;
  z-index: 0;
  width: 67px;
  height: 38px;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 1px 1.5px rgba(22, 26, 43, 0.08);
  transform: translateX(-50%);
`

const FloorLabel = styled.span`
  position: relative;
  z-index: 1;
`

const FloorSection = styled.section`
  position: absolute;
  top: 174px;
  right: 15px;
  left: 15px;
  z-index: 1;
  height: 281px;
  overflow: hidden;
`

const Legend = styled.div`
  position: absolute;
  top: 16px;
  left: 25px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 16px;
  pointer-events: none;
`

const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #3f4558;
  font-size: 13px;
  font-weight: 400;
  line-height: normal;
`

const LegendDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: ${({ $color }) => $color};
`

const UnitLabel = styled.span`
  position: absolute;
  top: 244px;
  right: 16px;
  z-index: 2;
  color: #5a6072;
  font-size: 13px;
  font-weight: 400;
  line-height: normal;
  pointer-events: none;
`

function CampusStatus({ onNavigate }) {
  const [floor, setFloor] = useState(campusDummy.defaultFloor)
  const [selectedId, setSelectedId] = useState(campusDummy.defaultRoomId)
  const [detailOpen, setDetailOpen] = useState(false)
  const selectedRoom = campusDummy.plans[floor].find((cell) => cell.id === selectedId)

  if (detailOpen && selectedRoom) {
    return <RoomDetailPage room={selectedRoom} floor={floor} onBack={() => setDetailOpen(false)} />
  }

  function changeFloor(nextFloor) {
    setFloor(nextFloor)
    setSelectedId(nextFloor === campusDummy.defaultFloor ? campusDummy.defaultRoomId : null)
  }

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

        <Title>캠퍼스 현황</Title>
        <BuildingButton>
          {campusDummy.building}
          <img src={chevronIcon} alt="" width="14" height="14" />
        </BuildingButton>

        <FloorTabs aria-label="층 선택">
          {campusDummy.floors.map((item) => (
            <FloorTab
              key={item.id}
              type="button"
              $enabled={item.enabled}
              $selected={item.id === floor}
              aria-pressed={item.enabled ? item.id === floor : undefined}
              onClick={() => changeFloor(item.id)}
            >
              {item.id === floor ? <FloorPill /> : null}
              <FloorLabel>{item.label}</FloorLabel>
            </FloorTab>
          ))}
        </FloorTabs>

        <FloorSection aria-label={`${floor}층 평면도`}>
          <Legend>
            <LegendItem>
              <LegendDot $color="#f75255" />
              기준 초과
            </LegendItem>
            <LegendItem>
              <LegendDot $color="#ffbd54" />
              위험 예측
            </LegendItem>
          </Legend>
          <UnitLabel>CO₂ ppm</UnitLabel>
          <FloorPlan floor={floor} selectedId={selectedId} onSelect={setSelectedId} />
        </FloorSection>

        {selectedRoom ? <RoomDetailCard room={selectedRoom} onOpenDetail={() => setDetailOpen(true)} /> : null}
        <Footer active="campus" onNavigate={onNavigate} />
      </Screen>
    </PageRoot>
  )
}

export default CampusStatus

import { useState } from 'react'
import styled, { css } from 'styled-components'
import talkDummy from '../../services/talkDummy.js'
import ellipse from '../../assets/images/bg-edit-ellipse.svg'
import backIcon from '../../assets/images/icon-back.svg'
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
  height: max(844px, 100dvh);
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
  ${({ $left }) => $left && css`left: ${$left};`}
  ${({ $right }) => $right && css`right: ${$right};`}
`

const Header = styled.header`
  position: absolute;
  top: 45px;
  left: 0;
  z-index: 2;
  width: 390px;
  height: 70px;
`

const BackButton = styled.button`
  position: absolute;
  top: 24px;
  left: 21px;
  width: 22px;
  height: 22px;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
`

const Main = styled.main`
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: auto;
  padding: 115px 0 110px;
`

const Card = styled.section`
  margin: 0 16px;
  padding: 16px 16px 18px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.38);
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);

  & + & {
    margin-top: 22px;
  }
`

const CardTitle = styled.h2`
  margin: 0;
  color: #263e50;
  font-size: 15px;
  font-weight: 700;
  line-height: normal;
`

const FloorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 74px);
  gap: 13px 9px;
  margin-top: 11px;
`

const RoomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 102px);
  gap: 15px 9px;
  margin-top: 13px;
`

const Choice = styled.button`
  height: 40px;
  margin: 0;
  padding: 0;
  border: ${({ $on }) => ($on ? '1.5px solid #56a6f0' : '1px solid #d4e8fb')};
  border-radius: ${({ $room }) => ($room ? '10px' : '30px')};
  background: ${({ $on }) => ($on ? '#e7f3fe' : '#ffffff')};
  color: ${({ $on }) => ($on ? '#263e50' : '#6d96bc')};
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
`

const SaveButton = styled.button`
  position: absolute;
  right: 27px;
  bottom: 30px;
  left: 27px;
  z-index: 2;
  height: 56px;
  border: none;
  border-radius: 20px;
  background: #56a6f0;
  color: #ffffff;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
`

function ZoneEdit({ zone, onBack, onSave }) {
  const [floors, setFloors] = useState(zone.floors)
  const [rooms, setRooms] = useState(zone.rooms)

  const toggleRoom = (floor, id) => {
    setRooms((current) => {
      const exists = current.some((room) => room.floor === floor && room.id === id)
      return exists
        ? current.filter((room) => room.floor !== floor || room.id !== id)
        : [...current, { floor, id }]
    })
  }

  const selectFloor = (floor) => {
    const selected = floors.includes(floor)
    setFloors((current) => (
      selected ? current.filter((item) => item !== floor) : [...current, floor].sort((a, b) => a - b)
    ))
    if (selected) setRooms((current) => current.filter((room) => room.floor !== floor))
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
          <BackButton type="button" aria-label="캠퍼스톡으로 돌아가기" onClick={onBack}>
            <img src={backIcon} alt="" width="22" height="22" />
          </BackButton>
        </Header>
        <Main>
          <Card>
            <CardTitle>{talkDummy.floorTitle}</CardTitle>
            <FloorGrid>
              {talkDummy.floors.map((floor) => (
                <Choice
                  key={floor}
                  type="button"
                  $on={floors.includes(floor)}
                  aria-pressed={floors.includes(floor)}
                  onClick={() => selectFloor(floor)}
                >
                  {floor}층
                </Choice>
              ))}
            </FloorGrid>
          </Card>
          {floors.map((floor) => (
            <Card key={floor}>
              <CardTitle>{talkDummy.roomTitle}</CardTitle>
              <RoomGrid>
                {talkDummy.roomsByFloor[floor].map((id) => {
                  const on = rooms.some((room) => room.floor === floor && room.id === id)
                  return (
                    <Choice
                      key={id}
                      type="button"
                      $room
                      $on={on}
                      aria-pressed={on}
                      onClick={() => toggleRoom(floor, id)}
                    >
                      {id}
                    </Choice>
                  )
                })}
              </RoomGrid>
            </Card>
          ))}
        </Main>
        <SaveButton type="button" onClick={() => onSave({ floors, rooms })}>
          {talkDummy.save}
        </SaveButton>
      </Screen>
    </PageRoot>
  )
}

export default ZoneEdit

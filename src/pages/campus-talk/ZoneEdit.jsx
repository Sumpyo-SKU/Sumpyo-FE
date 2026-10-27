import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getBuildings, getFloorPlan } from '../../api/campus-status.js'
import ellipse from '../../assets/images/bg-edit-ellipse.svg'
import backIcon from '../../assets/images/icon-back.svg'

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

const Note = styled.p`
  margin: 12px 16px 0;
  color: ${({ $muted }) => ($muted ? '#5f6a8f' : '#c93a24')};
  font-size: 13px;
  font-weight: 500;
  line-height: 19px;
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

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`

function lectureRooms(plan) {
  return (plan?.rooms ?? [])
    .filter((room) => room.type === 'LECTURE')
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
}

function ZoneEdit({ zone, onBack, onSave }) {
  const [floors, setFloors] = useState(zone.floors)
  const [rooms, setRooms] = useState(zone.rooms)
  const [floorOptions, setFloorOptions] = useState([])
  const [roomsByFloor, setRoomsByFloor] = useState({})
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const roomsReady = floors.every((floor) => Array.isArray(roomsByFloor[floor]))

  useEffect(() => {
    let cancelled = false

    getBuildings()
      .then((payload) => {
        if (cancelled) return
        const building = (payload.data ?? []).find((item) => item.buildingId === zone.buildingId)
        const maxFloor = building?.maxFloor ?? 0
        setFloorOptions(Array.from({ length: maxFloor }, (_, index) => index + 1))
      })
      .catch((loadError) => {
        if (cancelled) return
        setError(loadError.message || '건물 정보를 불러오지 못했습니다.')
      })

    return () => {
      cancelled = true
    }
  }, [zone.buildingId])

  useEffect(() => {
    let cancelled = false
    const missing = floors.filter((floor) => !Array.isArray(roomsByFloor[floor]))
    if (!zone.buildingId || missing.length === 0) return undefined

    Promise.all(missing.map((floor) => (
      getFloorPlan(zone.buildingId, floor).then((payload) => ({
        floor,
        rooms: lectureRooms(payload.data),
      }))
    )))
      .then((lists) => {
        if (cancelled) return
        setRoomsByFloor((current) => {
          const next = { ...current }
          lists.forEach((item) => {
            next[item.floor] = item.rooms
          })
          return next
        })
      })
      .catch((loadError) => {
        if (cancelled) return
        setError(loadError.message || '강의실을 불러오지 못했습니다.')
      })

    return () => {
      cancelled = true
    }
  }, [floors, roomsByFloor, zone.buildingId])

  const toggleRoom = (floor, room) => {
    setRooms((current) => {
      const exists = current.some((item) => item.roomId === room.roomId)
      return exists
        ? current.filter((item) => item.roomId !== room.roomId)
        : [...current, { floor, id: room.number, roomId: room.roomId }]
    })
  }

  const selectFloor = (floor) => {
    const selected = floors.includes(floor)
    setFloors((current) => (
      selected ? current.filter((item) => item !== floor) : [...current, floor].sort((a, b) => a - b)
    ))
    if (selected) setRooms((current) => current.filter((room) => room.floor !== floor))
  }

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      await onSave({ floors, rooms })
    } catch (saveError) {
      setError(saveError.message || '연락 볼 구역을 저장하지 못했습니다.')
      setSaving(false)
    }
  }

  return (
    <PageRoot>
      <Screen>
        <Ellipse src={ellipse} alt="" width="875" height="875" />
        <Header>
          <BackButton type="button" aria-label="캠퍼스톡으로 돌아가기" onClick={onBack}>
            <img src={backIcon} alt="" width="22" height="22" />
          </BackButton>
        </Header>
        <Main>
          <Card>
            <CardTitle>1. 층을 선택해 주세요. (선택)</CardTitle>
            {floorOptions.length === 0 && !error ? <Note $muted>층을 불러오고 있어요.</Note> : null}
            <FloorGrid>
              {floorOptions.map((floor) => (
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
              <CardTitle>2. 강의실을 선택해 주세요. (선택)</CardTitle>
              {Array.isArray(roomsByFloor[floor]) ? (
                <RoomGrid>
                  {roomsByFloor[floor].map((room) => {
                    const on = rooms.some((item) => item.roomId === room.roomId)
                    return (
                      <Choice
                        key={room.roomId}
                        type="button"
                        $room
                        $on={on}
                        aria-pressed={on}
                        onClick={() => toggleRoom(floor, room)}
                      >
                        {room.number}
                      </Choice>
                    )
                  })}
                </RoomGrid>
              ) : (
                <Note $muted>강의실을 불러오고 있어요.</Note>
              )}
            </Card>
          ))}
          {error ? <Note>{error}</Note> : null}
        </Main>
        <SaveButton type="button" disabled={saving || !roomsReady} onClick={save}>
          저장하기
        </SaveButton>
      </Screen>
    </PageRoot>
  )
}

export default ZoneEdit

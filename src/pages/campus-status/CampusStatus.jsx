import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import Footer from '../../common/Footer/Footer.jsx'
import FloorPlan from './FloorPlan.jsx'
import RoomDetailCard from './RoomDetailCard.jsx'
import RoomDetailPage from './RoomDetailPage.jsx'
import { getBuildings, getFloorPlan, getRoomDetail, roomAirStatus } from '../../api/campus-status.js'
import campusEllipse from '../../assets/images/bg-campus-ellipse.svg'
import chevronIcon from '../../assets/images/icon-chevron-down.svg'

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

const MenuBackdrop = styled.button`
  position: absolute;
  inset: 0;
  z-index: 5;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: default;
`

const BuildingWrap = styled.div`
  position: absolute;
  top: 62px;
  left: 284px;
  z-index: 6;
`

const BuildingButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 90px;
  height: 36px;
  margin: 0;
  padding: 0 8px;
  border: none;
  border-radius: 999px;
  background: #ffffff;
  color: #161a2b;
  font-size: 13px;
  font-weight: 600;
  line-height: normal;
  cursor: pointer;
`

const BuildingName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const BuildingMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  width: 128px;
  max-height: 240px;
  overflow: auto;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(22, 26, 43, 0.12);
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const BuildingOption = styled.button`
  display: block;
  width: 100%;
  height: 36px;
  margin: 0;
  padding: 0 12px;
  border: none;
  background: ${({ $selected }) => ($selected ? 'rgba(86, 166, 240, 0.1)' : 'transparent')};
  color: ${({ $selected }) => ($selected ? '#263e50' : '#5a6072')};
  font-size: 13px;
  font-weight: ${({ $selected }) => ($selected ? 700 : 500)};
  line-height: 36px;
  text-align: left;
  cursor: pointer;
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
  width: 55px;
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

const EmptyPlan = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 22px;
  background: #ffffff;
`

const PlanNote = styled.p`
  position: absolute;
  top: 120px;
  right: 24px;
  left: 24px;
  z-index: 2;
  margin: 0;
  color: ${({ $muted }) => ($muted ? '#5f6a8f' : '#c93a24')};
  font-size: 13px;
  font-weight: 500;
  line-height: 19px;
  text-align: center;
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

const floorTabs = [
  { id: '2', label: '2F' },
  { id: '3', label: '3F' },
  { id: '5', label: '5F' },
  { id: '6', label: '6F' },
  { id: '7', label: '7F' },
  { id: '8', label: '8F' },
]

function displayNumber(value) {
  if (value === undefined || value === null || value === '') return '—'
  const number = Number(value)
  if (Number.isNaN(number)) return String(value)
  return Number.isInteger(number) ? number.toLocaleString('ko-KR') : String(number)
}

function CampusStatus({ onNavigate }) {
  const [floor, setFloor] = useState('6')
  const [selectedId, setSelectedId] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [buildings, setBuildings] = useState([])
  const [buildingId, setBuildingId] = useState(null)
  const [buildingMenuOpen, setBuildingMenuOpen] = useState(false)
  const [buildingError, setBuildingError] = useState('')
  const [plan, setPlan] = useState(null)
  const [planError, setPlanError] = useState('')
  const [planLoading, setPlanLoading] = useState(false)
  const [detail, setDetail] = useState(null)
  const [detailError, setDetailError] = useState('')
  const [detailLoading, setDetailLoading] = useState(false)
  const building = buildings.find((item) => item.buildingId === buildingId) ?? null
  const floors = floorTabs.map((item) => ({
    ...item,
    enabled: item.id === '5' || item.id === '6',
  }))
  const selectedRoom = (plan?.rooms ?? []).find((room) => String(room.roomId) === String(selectedId) && room.type !== 'RESTROOM')
  const roomId = selectedRoom?.roomId
  const waiting = detailLoading
  const air = detail ? roomAirStatus(detail) : { label: waiting ? '강의실 정보를 불러오고 있어요' : '—', color: '#5f6a8f', dot: null }
  const sheetRoom = selectedRoom
    ? {
        name: detail?.number ? `${detail.number}호` : `${selectedRoom.number}호`,
        co2Label: detail ? displayNumber(detail.co2) : '—',
        temperature: detail ? `${displayNumber(detail.temp)}°C` : '—',
        humidity: detail ? `${displayNumber(detail.humidity)}%` : '—',
        status: air,
      }
    : null

  useEffect(() => {
    let ignore = false
    getBuildings()
      .then((payload) => {
        if (ignore) return
        const list = payload.data ?? []
        setBuildings(list)
        setBuildingId((current) => {
          if (current != null && list.some((item) => item.buildingId === current)) return current
          return list.find((item) => item.buildingId === 1)?.buildingId ?? list[0]?.buildingId ?? null
        })
      })
      .catch((error) => {
        if (!ignore) setBuildingError(error.message)
      })
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (buildingId == null) return undefined
    let ignore = false
    setPlanLoading(true)
    setPlanError('')
    getFloorPlan(buildingId, floor)
      .then((payload) => {
        if (!ignore) setPlan(payload.data ?? null)
      })
      .catch((error) => {
        if (!ignore) {
          setPlan(null)
          setPlanError(error.message)
        }
      })
      .finally(() => {
        if (!ignore) setPlanLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [buildingId, floor])

  useEffect(() => {
    if (roomId == null) return undefined

    let ignore = false
    setDetailLoading(true)
    setDetailError('')
    getRoomDetail(roomId)
      .then((payload) => {
        if (!ignore) setDetail(payload.data ?? null)
      })
      .catch((error) => {
        if (!ignore) {
          setDetail(null)
          setDetailError(error.message)
        }
      })
      .finally(() => {
        if (!ignore) setDetailLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [roomId])

  if (detailOpen && selectedRoom) {
    return (
      <RoomDetailPage
        detail={detail}
        floor={floor}
        loadError={detailError}
        loading={waiting}
        onBack={() => setDetailOpen(false)}
      />
    )
  }

  function changeFloor(nextFloor) {
    if (nextFloor !== '5' && nextFloor !== '6') return
    setFloor(nextFloor)
    setPlan(null)
    setSelectedId(null)
    setDetail(null)
    setDetailOpen(false)
    setBuildingMenuOpen(false)
  }

  function chooseBuilding(next) {
    setBuildingId(next.buildingId)
    setBuildingMenuOpen(false)
    setDetailOpen(false)
    setSelectedId(null)
    setDetail(null)
    setPlan(null)
    if (Number(floor) > (next.maxFloor ?? 0)) {
      const nextFloor = [...floorTabs].reverse().find((item) => (item.id === '5' || item.id === '6') && Number(item.id) <= (next.maxFloor ?? 0))
      if (nextFloor) setFloor(nextFloor.id)
    }
  }

  function selectRoom(roomId) {
    setSelectedId(roomId)
  }

  return (
    <PageRoot>
      <Screen>
        <Ellipse src={campusEllipse} alt="" width="875" height="875" />

        <Title>캠퍼스 현황</Title>
        {buildingMenuOpen ? <MenuBackdrop type="button" aria-label="건물 목록 닫기" onClick={() => setBuildingMenuOpen(false)} /> : null}
        <BuildingWrap>
          <BuildingButton
            type="button"
            aria-label="건물 선택"
            aria-expanded={buildingMenuOpen}
            onClick={() => setBuildingMenuOpen((open) => !open)}
          >
            <BuildingName>{building?.name || '—'}</BuildingName>
            <img src={chevronIcon} alt="" width="14" height="14" />
          </BuildingButton>
          {buildingMenuOpen ? (
            <BuildingMenu role="listbox" aria-label="건물 목록">
              {buildings.map((item) => (
                <BuildingOption
                  key={item.buildingId}
                  type="button"
                  role="option"
                  aria-selected={item.buildingId === buildingId}
                  $selected={item.buildingId === buildingId}
                  onClick={() => chooseBuilding(item)}
                >
                  {item.name}
                </BuildingOption>
              ))}
            </BuildingMenu>
          ) : null}
        </BuildingWrap>

        <FloorTabs aria-label="층 선택">
          {floors.map((item) => (
            <FloorTab
              key={item.id}
              type="button"
              $enabled={item.enabled}
              $selected={item.id === floor && (item.enabled || building == null)}
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
          {planError ? <PlanNote>{planError}</PlanNote> : null}
          {planLoading && !plan && !planError ? <PlanNote $muted>평면도를 불러오고 있어요</PlanNote> : null}
          {!planError && plan?.rooms?.length ? (
            <FloorPlan rooms={plan.rooms} selectedId={selectedId} onSelect={selectRoom} />
          ) : (
            <EmptyPlan />
          )}
        </FloorSection>

        {sheetRoom ? (
          <RoomDetailCard
            room={sheetRoom}
            onOpenDetail={() => {
              setBuildingMenuOpen(false)
              setDetailOpen(true)
            }}
            actionError={buildingError || detailError}
          />
        ) : null}
        <Footer active="campus" onNavigate={onNavigate} />
      </Screen>
    </PageRoot>
  )
}

export default CampusStatus

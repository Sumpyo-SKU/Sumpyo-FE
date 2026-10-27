import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import backIcon from '../../assets/images/icon-settings-back.svg'
import ellipseBottom from '../../assets/images/bg-edit-ellipse.svg'
import ellipseTop from '../../assets/images/bg-settings-ellipse.svg'
import buildingIcon from '../../assets/images/icon-zone-card.svg'
import lineIcon from '../../assets/images/icon-settings-line.svg'
import { getMyZones, mapMyZones, saveMyZones } from '../../api/settingspage.js'

const buildings = [
  ['대일관', '문예관', '본관'],
  ['북악관', '상승관', '유담관'],
  ['은주1관', '은주2관', '청운관'],
  ['한림관', '혜인관', '수인관'],
]

const editorFloors = [1, 2, 3, 4, 5, 6, 7]

function sortFloors(floors) {
  return [...floors].sort((left, right) => left - right)
}

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
  z-index: 0;
  pointer-events: none;
  ${({ $top, $left }) => css`
    top: ${$top};
    left: ${$left};
  `}
`

const BackButton = styled.button`
  position: absolute;
  top: 62px;
  left: 15px;
  z-index: 2;
  width: 37px;
  height: 37px;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`

const BackIcon = styled.img`
  display: block;
  transform: rotate(180deg);
`

const Title = styled.h1`
  position: absolute;
  top: 66px;
  left: 65px;
  z-index: 2;
  margin: 0;
  color: #1d2752;
  font-size: 18px;
  font-weight: 700;
  line-height: 27px;
`

const HeaderAction = styled.button`
  position: absolute;
  top: 64px;
  left: 302px;
  z-index: 2;
  width: 65px;
  height: 33px;
  margin: 0;
  padding: 0;
  border: 1px solid #e3f1ff;
  border-radius: 999px;
  background: #ffffff;
  color: #6d96bc;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  line-height: 19px;
  cursor: pointer;
`

const Main = styled.main`
  position: absolute;
  top: 115px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  overflow: auto;
  padding: 42px 0 32px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const ZoneCard = styled.section`
  margin: 0 16px 17px;
  padding: 15px 16px 16px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.38);
  backdrop-filter: blur(12px);
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
`

const ZoneHead = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const Tile = styled.span`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 31px;
  height: 31px;
  border-radius: 8px;
  background: #ecf4fd;
`

const ZoneName = styled.p`
  margin: 0;
  color: #56a6f0;
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
`

const DeleteButton = styled.button`
  margin: 0 0 0 auto;
  padding: 0;
  border: none;
  background: transparent;
  color: #c93a24;
  font: inherit;
  font-size: 13px;
  font-weight: 400;
  line-height: 19px;
  cursor: pointer;
`

const PillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 13px;
`

const SavedPill = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 74px;
  height: 40px;
  border: 1px solid #56a6f0;
  border-radius: 30px;
  background: rgba(86, 166, 240, 0.1);
  color: #263e50;
  font-size: 13px;
  font-weight: 500;
  line-height: 22px;
`

const Divider = styled.img`
  display: block;
  width: calc(100% + 28px);
  height: 1px;
  margin: 15px 0 12px -14px;
  background: #e6e6e6;
`

const FloorGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 13px 9px;
`

const floorChip = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 74px;
  height: 40px;
  margin: 0;
  padding: 0;
  border-radius: 30px;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 22px;
`

const FloorButton = styled.button`
  ${floorChip}
  cursor: pointer;
  ${({ $on }) =>
    $on
      ? css`
          border: 1px solid #56a6f0;
          background: rgba(86, 166, 240, 0.1);
          color: #263e50;
        `
      : css`
          border: 1px solid #d4e8fb;
          background: #ffffff;
          color: #6d96bc;
        `}
`

const FloorLabel = styled.span`
  ${floorChip}
  border: 1px solid #d4e8fb;
  background: #ffffff;
  color: #6d96bc;
`

const AddButton = styled.button`
  display: block;
  width: calc(100% - 32px);
  height: 56px;
  margin: 0 16px;
  border: 1px dashed #56a6f0;
  border-radius: 20px;
  background: rgba(86, 166, 240, 0.1);
  color: #56a6f0;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  cursor: pointer;
`

const PickerCard = styled.section`
  margin: 0 16px 17px;
  padding: 14px 16px 16px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.38);
  backdrop-filter: blur(12px);
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
`

const PickerTitle = styled.h2`
  margin: 0 0 12px;
  color: #263e50;
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
`

const BuildingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 102px);
  gap: 15px 9px;
`

const buildingChip = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 102px;
  height: 40px;
  margin: 0;
  padding: 0;
  border-radius: 10px;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 22px;
`

const BuildingButton = styled.button`
  ${buildingChip}
  cursor: pointer;
  ${({ $on }) =>
    $on
      ? css`
          border: 1px solid #56a6f0;
          background: rgba(86, 166, 240, 0.1);
          color: #263e50;
        `
      : css`
          border: 1px solid #d4e8fb;
          background: #ffffff;
          color: #6d96bc;
        `}
`

const BuildingLabel = styled.span`
  ${buildingChip}
  border: 1px solid #d4e8fb;
  background: #ffffff;
  color: #6d96bc;
`

const SaveButton = styled.button`
  display: block;
  width: calc(100% - 32px);
  height: 56px;
  margin: 14px 16px 0;
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

const ZoneNote = styled.p`
  margin: 0 16px 12px;
  color: #c93a24;
  font-size: 13px;
  font-weight: 500;
  line-height: 19px;
`

function ZonePage({ zones, onChange, onBack }) {
  const [mode, setMode] = useState('view')
  const [draft, setDraft] = useState(zones)
  const [building, setBuilding] = useState(null)
  const [floors, setFloors] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    getMyZones()
      .then((payload) => {
        if (!cancelled) onChange(mapMyZones(payload.data))
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message || '담당 구역을 불러오지 못했습니다.')
      })

    return () => {
      cancelled = true
    }
  }, [onChange])

  function openEdit() {
    setDraft(zones.map((zone) => ({ ...zone, floors: [...zone.floors] })))
    setMode('edit')
  }

  function toggleDraftFloor(name, floor) {
    setDraft((current) =>
      current.map((zone) => {
        if (zone.building !== name) return zone
        const next = zone.floors.includes(floor)
          ? zone.floors.filter((item) => item !== floor)
          : sortFloors([...zone.floors, floor])
        return { ...zone, floors: next }
      }),
    )
  }

  async function persistZones(next) {
    setError('')
    try {
      const payload = await saveMyZones(next)
      onChange(mapMyZones(payload.data))
      return true
    } catch (saveError) {
      setError(saveError.message || '담당 구역을 저장하지 못했습니다.')
      return false
    }
  }

  async function saveNewZone() {
    if (building !== '북악관' && floors.length === 0) return
    const exists = zones.some((zone) => zone.building === '북악관')
    const next = exists
      ? zones.map((zone) =>
          zone.building === '북악관'
            ? { ...zone, floors: sortFloors([...new Set([...zone.floors, ...floors])]) }
            : zone,
        )
      : [...zones, { building: '북악관', buildingId: 1, floors: sortFloors(floors) }]
    const saved = await persistZones(next)
    if (!saved) return
    setBuilding(null)
    setFloors([])
    setMode('view')
  }

  const shown = mode === 'edit' ? draft : zones

  return (
    <PageRoot>
      <Screen>
        <Ellipse src={ellipseBottom} alt="" width="875" height="875" $top="410px" $left="-252px" />
        <Ellipse src={ellipseTop} alt="" width="875" height="875" $top="-326px" $left="-35px" />
        <BackButton
          type="button"
          aria-label={mode === 'view' ? '설정으로 돌아가기' : '내 담당 구역으로 돌아가기'}
          onClick={() => {
            if (mode === 'view') onBack()
            else setMode('view')
          }}
        >
          <BackIcon src={backIcon} alt="" width="37" height="37" />
        </BackButton>
        <Title>{mode === 'add' ? '내 담당 구역 추가' : '내 담당 구역'}</Title>
        {mode === 'view' && (
          <HeaderAction type="button" onClick={openEdit}>
            수정
          </HeaderAction>
        )}
        {mode === 'edit' && (
          <HeaderAction
            type="button"
            onClick={async () => {
              const saved = await persistZones(draft)
              if (saved) setMode('view')
            }}
          >
            완료
          </HeaderAction>
        )}

        <Main>
          {error ? <ZoneNote>{error}</ZoneNote> : null}
          {mode !== 'add' &&
            shown.map((zone) => (
              <ZoneCard key={zone.building}>
                <ZoneHead>
                  <Tile>
                    <img src={buildingIcon} alt="" width="26" height="28" />
                  </Tile>
                  <ZoneName>{zone.building}</ZoneName>
                  {mode === 'edit' && (
                    <DeleteButton
                      type="button"
                      onClick={() => setDraft((current) => current.filter((item) => item.building !== zone.building))}
                    >
                      삭제
                    </DeleteButton>
                  )}
                </ZoneHead>
                <PillRow>
                  {sortFloors(zone.floors).map((floor) => (
                    <SavedPill key={floor}>{floor}층</SavedPill>
                  ))}
                </PillRow>
                {mode === 'edit' && (
                  <>
                    <Divider src={lineIcon} alt="" width="358" height="1" />
                    <FloorGrid>
                      {editorFloors.map((floor) =>
                        floor === 5 || floor === 6 ? (
                          <FloorButton
                            key={floor}
                            type="button"
                            $on={zone.floors.includes(floor)}
                            aria-pressed={zone.floors.includes(floor)}
                            onClick={() => toggleDraftFloor(zone.building, floor)}
                          >
                            {floor}층
                          </FloorButton>
                        ) : (
                          <FloorLabel key={floor}>{floor}층</FloorLabel>
                        ),
                      )}
                    </FloorGrid>
                  </>
                )}
              </ZoneCard>
            ))}

          {mode === 'view' && (
            <AddButton
              type="button"
              onClick={() => {
                setBuilding(null)
                setFloors([])
                setMode('add')
              }}
            >
              + 담당 구역 추가
            </AddButton>
          )}

          {mode === 'add' && (
            <>
              <PickerCard>
                <PickerTitle>1. 건물을 선택해 주세요.</PickerTitle>
                <BuildingGrid>
                  {buildings.flat().map((name) =>
                    name === '북악관' ? (
                      <BuildingButton
                        key={name}
                        type="button"
                        $on={building === name}
                        aria-pressed={building === name}
                        onClick={() => setBuilding((current) => (current === name ? null : name))}
                      >
                        {name}
                      </BuildingButton>
                    ) : (
                      <BuildingLabel key={name}>{name}</BuildingLabel>
                    ),
                  )}
                </BuildingGrid>
              </PickerCard>
              <PickerCard>
                <PickerTitle>2. 담당 층을 선택해 주세요.</PickerTitle>
                <FloorGrid>
                  {editorFloors.map((floor) =>
                    floor === 5 || floor === 6 ? (
                      <FloorButton
                        key={floor}
                        type="button"
                        $on={floors.includes(floor)}
                        aria-pressed={floors.includes(floor)}
                        onClick={() =>
                          setFloors((current) =>
                            current.includes(floor) ? current.filter((item) => item !== floor) : sortFloors([...current, floor]),
                          )
                        }
                      >
                        {floor}층
                      </FloorButton>
                    ) : (
                      <FloorLabel key={floor}>{floor}층</FloorLabel>
                    ),
                  )}
                </FloorGrid>
              </PickerCard>
              <SaveButton type="button" onClick={saveNewZone}>
                추가하기
              </SaveButton>
            </>
          )}
        </Main>
      </Screen>
    </PageRoot>
  )
}

export default ZonePage

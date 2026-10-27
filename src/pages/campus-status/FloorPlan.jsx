import { useRef } from 'react'
import styled, { css } from 'styled-components'

const contentTop = 48
const rowTop = { TOP: contentTop, BOTTOM: contentTop + 114 }
const hallTop = contentTop + 74
const cellWidth = 77
const sideInset = 30
const columns = [30, 113, 196, 279, 368, 458, 541, 624, 707]
const halls = [
  { left: 30, width: 374 },
  { left: 404, width: 380 },
]

function cellLeft(room) {
  const index = room.side === 'TOP' && room.order >= 5 ? room.order : room.order - 1
  return columns[index] ?? sideInset + index * 83
}

function planWidth(rooms) {
  const maxLeft = rooms.reduce((max, room) => Math.max(max, cellLeft(room)), sideInset)
  return maxLeft + cellWidth + sideInset
}

function planTone(status) {
  if (status === 'OVER') return 'exceed'
  if (status === 'CAUTION') return 'warn'
  return 'normal'
}

const cellTone = {
  normal: '#dcdfe8',
  warn: 'rgba(255, 189, 84, 0.2)',
  exceed: 'rgba(247, 82, 85, 0.2)',
}

const Scroller = styled.div`
  position: absolute;
  inset: 0;
  overflow-x: auto;
  overflow-y: hidden;
  cursor: grab;
  touch-action: none;
  user-select: none;
  scrollbar-width: none;

  &:active {
    cursor: grabbing;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`

const PlanCard = styled.div`
  position: relative;
  width: ${({ $width }) => $width}px;
  height: 100%;
  border-radius: 22px;
  background: #ffffff;
`

const Hall = styled.div`
  position: absolute;
  top: ${hallTop}px;
  left: ${({ $left }) => $left}px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $width }) => $width}px;
  height: 34px;
  border-radius: 1px;
  background: #e2e6f1;
  color: #6b7184;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
`

const Cell = styled.button`
  position: absolute;
  top: ${({ $top }) => $top}px;
  left: ${({ $left }) => $left}px;
  width: 77px;
  height: 68px;
  margin: 0;
  padding: 0;
  border: 3px solid transparent;
  border-radius: 1px;
  background: ${({ $tone }) => cellTone[$tone] ?? '#dcdfe8'};
  cursor: ${({ $interactive }) => ($interactive ? 'pointer' : 'default')};
  pointer-events: ${({ $interactive }) => ($interactive ? 'auto' : 'none')};

  ${({ $selected }) =>
    $selected &&
    css`
      border-color: #263e50;
    `}
`

const RoomNumber = styled.span`
  position: absolute;
  top: 8px;
  right: 0;
  left: 0;
  color: #161a2b;
  font-size: ${({ $toilet }) => ($toilet ? '13px' : '14px')};
  font-weight: 700;
  line-height: 21px;
  text-align: center;
`

const RoomPpm = styled.span`
  position: absolute;
  top: 38px;
  right: 0;
  left: 0;
  color: ${({ $alert }) => ($alert ? '#f75255' : '#3a5779')};
  font-size: 11px;
  font-weight: 600;
  line-height: 17px;
  text-align: center;
`

function FloorPlan({ rooms, selectedId, onSelect }) {
  const cells = rooms ?? []
  const scrollerRef = useRef(null)
  const dragRef = useRef(null)
  const draggedRef = useRef(false)

  function handlePointerDown(event) {
    const scroller = scrollerRef.current
    const room = event.target.closest('[data-room-id]')
    draggedRef.current = false
    dragRef.current = {
      x: event.clientX,
      scroll: scroller.scrollLeft,
      pointerId: event.pointerId,
      roomId: room?.dataset.roomId ?? null,
    }
    scroller.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event) {
    const drag = dragRef.current
    const scroller = scrollerRef.current
    if (!drag || drag.pointerId !== event.pointerId || !scroller) return

    const distance = event.clientX - drag.x
    if (Math.abs(distance) <= 5) return
    draggedRef.current = true
    scroller.scrollLeft = drag.scroll - distance
  }

  function handlePointerUp(event) {
    const drag = dragRef.current
    const scroller = scrollerRef.current
    if (drag?.pointerId === event.pointerId && scroller?.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId)
    }
    if (drag && !draggedRef.current && drag.roomId) onSelect(drag.roomId)
    dragRef.current = null
    draggedRef.current = false
  }

  return (
    <Scroller
      ref={scrollerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <PlanCard $width={planWidth(cells)}>
        {halls.map((hall) => (
          <Hall key={hall.left} $left={hall.left} $width={hall.width}>
            복도
          </Hall>
        ))}
        {cells.map((cell) => {
          const isRoom = cell.type !== 'RESTROOM'
          const tone = planTone(cell.status)
          const selected = isRoom && String(cell.roomId) === String(selectedId)
          return (
            <Cell
              key={cell.roomId}
              as={isRoom ? 'button' : 'div'}
              type={isRoom ? 'button' : undefined}
              $left={cellLeft(cell)}
              $top={rowTop[cell.side] ?? rowTop.BOTTOM}
              $tone={tone}
              $interactive={isRoom}
              data-room-id={isRoom ? cell.roomId : undefined}
              $selected={selected}
              aria-pressed={isRoom ? selected : undefined}
            >
              <RoomNumber $toilet={!isRoom}>{isRoom ? cell.number : '화장실'}</RoomNumber>
              {isRoom && cell.co2 != null && cell.status !== 'NO_SENSOR' ? (
                <RoomPpm $alert={cell.status === 'OVER'}>{Number(cell.co2).toLocaleString('ko-KR')}</RoomPpm>
              ) : null}
            </Cell>
          )
        })}
      </PlanCard>
    </Scroller>
  )
}

export default FloorPlan

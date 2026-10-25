import { useRef } from 'react'
import styled, { css } from 'styled-components'
import campusDummy from '../../services/campusDummy.js'

const contentTop = 48
const rowTop = { top: contentTop, bottom: contentTop + 114 }
const hallTop = contentTop + 74
const cellWidth = 77
const sideInset = 30
const planWidth = campusDummy.columns[campusDummy.columns.length - 1] + cellWidth + sideInset

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
  width: ${planWidth}px;
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

function FloorPlan({ floor, selectedId, onSelect }) {
  const cells = campusDummy.plans[floor]
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
      <PlanCard>
        {campusDummy.halls.map((hall) => (
          <Hall key={`${floor}-${hall.left}`} $left={hall.left} $width={hall.width}>
            복도
          </Hall>
        ))}
        {cells.map((cell) => {
          const isRoom = cell.kind === 'room'
          return (
            <Cell
              key={cell.id}
              as={isRoom ? 'button' : 'div'}
              type={isRoom ? 'button' : undefined}
              $left={campusDummy.columns[cell.column]}
              $top={rowTop[cell.row]}
              $tone={cell.tone}
              $interactive={isRoom}
              data-room-id={isRoom ? cell.id : undefined}
              $selected={isRoom && cell.id === selectedId}
              aria-pressed={isRoom ? cell.id === selectedId : undefined}
            >
              <RoomNumber $toilet={!isRoom}>{isRoom ? cell.number : cell.label}</RoomNumber>
              {isRoom && cell.showCo2 ? (
                <RoomPpm $alert={cell.tone === 'exceed'}>{cell.co2Label}</RoomPpm>
              ) : null}
            </Cell>
          )
        })}
      </PlanCard>
    </Scroller>
  )
}

export default FloorPlan

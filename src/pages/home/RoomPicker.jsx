import { useLayoutEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import checkIcon from '../../assets/images/icon-check.svg'

const Overlay = styled.button`
  position: absolute;
  inset: 0;
  z-index: 5;
  margin: 0;
  padding: 0;
  border: none;
  background: rgba(22, 26, 43, 0.3);
  cursor: pointer;
`

const Panel = styled.div`
  position: absolute;
  top: 108px;
  left: 19px;
  z-index: 6;
  width: 173px;
  height: 156px;
  overflow: hidden;
  border: 1px solid #ffffff;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 4px 7px rgba(30, 42, 74, 0.05);
`

const List = styled.div`
  height: 100%;
  padding: 3px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const Option = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 35px;
  margin: 0;
  padding: 0 30px 0 10px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: rgba(53, 64, 65, 0.6);
  font-family: inherit;
  font-size: 13px;
  font-weight: 400;
  line-height: normal;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;

  ${({ $selected }) =>
    $selected &&
    css`
      height: 38px;
      background: rgba(86, 166, 240, 0.2);
      color: #354041;
      font-weight: 500;
    `}
`

const Check = styled.img`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
`

function RoomPicker({ rooms, selected, onSelect, onClose }) {
  const listRef = useRef(null)

  useLayoutEffect(() => {
    const list = listRef.current
    const current = list?.querySelector('[data-selected="true"]')
    if (!list || !current) return

    const maxScroll = list.scrollHeight - list.clientHeight
    list.scrollTop = Math.min(Math.max(0, current.offsetTop - 3), maxScroll)
  }, [])

  return (
    <>
      <Overlay type="button" aria-label="강의실 선택 닫기" onClick={onClose} />
      <Panel role="listbox" aria-label="강의실">
        <List ref={listRef}>
          {rooms.map((room) => {
            const isSelected = room === selected
            return (
              <Option
                key={room}
                type="button"
                role="option"
                aria-selected={isSelected}
                data-selected={isSelected ? 'true' : 'false'}
                $selected={isSelected}
                onClick={() => onSelect(room)}
              >
                {room}
                {isSelected ? <Check src={checkIcon} alt="" width="16" height="16" /> : null}
              </Option>
            )
          })}
        </List>
      </Panel>
    </>
  )
}

export default RoomPicker

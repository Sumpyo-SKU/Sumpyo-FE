import styled from 'styled-components'
import Button from '../../components/Button/Button.jsx'
import chevronIcon from '../../assets/images/icon-chevron.svg'
import bellIcon from '../../assets/images/icon-bell.svg'
import settingsIcon from '../../assets/images/icon-settings.svg'

const HeaderBar = styled.header`
  position: absolute;
  top: 45px;
  left: 0;
  z-index: ${({ $pickerOpen }) => ($pickerOpen ? 'auto' : 2)};
  width: 390px;
  height: 70px;
`

const LocationButton = styled(Button)`
  position: absolute;
  top: 18px;
  left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 33px;
  padding: 0 11px;
  border-radius: 827px;
  background: ${({ $raised }) => ($raised ? '#ffffff' : 'rgba(255, 255, 255, 0.8)')};
  color: #354041;
  font-size: 13px;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
  pointer-events: auto;
  cursor: pointer;
  z-index: ${({ $raised }) => ($raised ? 7 : 'auto')};
`

const BellButton = styled.button`
  position: absolute;
  top: 17px;
  left: 301px;
  width: 30px;
  height: 32px;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  pointer-events: auto;
`

const settingsButtonStyle = `
  position: absolute;
  top: 22px;
  left: 346px;
  width: 24.5px;
  height: 25.0834px;
`

const SettingsIcon = styled.img`
  ${settingsButtonStyle}
`

const SettingsButton = styled.button`
  ${settingsButtonStyle}
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  pointer-events: auto;
`

const UnreadBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -6px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: #e5585d;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  line-height: 16px;
`

function Header({ room = '강의실 선택', pickerOpen = false, unreadCount = 0, onRoomClick, onBellClick, onSettingsClick }) {
  const badge = unreadCount > 99 ? '99+' : String(unreadCount)

  return (
    <HeaderBar $pickerOpen={pickerOpen}>
      <LocationButton
        type="button"
        $raised={pickerOpen}
        aria-haspopup="listbox"
        aria-expanded={pickerOpen}
        onClick={onRoomClick}
      >
        <span>{room}</span>
        <img src={chevronIcon} alt="" width="13" height="13" />
      </LocationButton>
      <BellButton type="button" aria-label={unreadCount > 0 ? `환기 알림 ${badge}개` : '환기 알림'} onClick={onBellClick}>
        <img src={bellIcon} alt="" width="30" height="32" />
        {unreadCount > 0 ? <UnreadBadge>{badge}</UnreadBadge> : null}
      </BellButton>
      {onSettingsClick ? (
        <SettingsButton type="button" aria-label="설정" onClick={onSettingsClick}>
          <img src={settingsIcon} alt="" width="24.5" height="25.0834" />
        </SettingsButton>
      ) : (
        <SettingsIcon src={settingsIcon} alt="" width="24.5" height="25.0834" />
      )}
    </HeaderBar>
  )
}

export default Header

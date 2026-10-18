import Button from '../../components/Button/Button.jsx'
import chevronIcon from '../../assets/images/icon-chevron.svg'
import bellIcon from '../../assets/images/icon-bell.svg'
import settingsIcon from '../../assets/images/icon-settings.svg'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <Button className="header-location">
        <span>북악관 · 616호</span>
        <img src={chevronIcon} alt="" width="13" height="13" />
      </Button>
      <img className="header-bell" src={bellIcon} alt="" width="30" height="32" />
      <img className="header-settings" src={settingsIcon} alt="" width="24.5" height="25.0834" />
    </header>
  )
}

export default Header

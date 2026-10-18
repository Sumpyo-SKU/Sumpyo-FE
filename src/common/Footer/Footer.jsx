import homeShape from '../../assets/bottom-nav-icons/nav-home-shape.svg'
import homeCircle from '../../assets/bottom-nav-icons/nav-home-circle.svg'
import homeIcon from '../../assets/bottom-nav-icons/nav-home.svg'
import campusIcon from '../../assets/bottom-nav-icons/nav-campus.svg'
import inboxIcon from '../../assets/bottom-nav-icons/nav-inbox.svg'
import talkIcon from '../../assets/bottom-nav-icons/nav-talk.svg'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-fill" />
      <div className="footer-bar" />
      <img className="footer-bump" src={homeShape} alt="" width="90" height="30.5" />
      <img className="footer-circle" src={homeCircle} alt="" width="50" height="50" />
      <img className="footer-home-icon" src={homeIcon} alt="" width="26" height="28" />
      <img className="footer-campus-icon" src={campusIcon} alt="" width="26" height="28" />
      <img className="footer-inbox-icon" src={inboxIcon} alt="" width="26" height="28" />
      <img className="footer-talk-icon" src={talkIcon} alt="" width="21.5" height="21.5" />
      <span className="footer-label footer-label-home">홈</span>
      <span className="footer-label footer-label-campus">캠퍼스 현황</span>
      <span className="footer-label footer-label-inbox">접수함</span>
      <span className="footer-label footer-label-talk">캠퍼스톡</span>
    </footer>
  )
}

export default Footer

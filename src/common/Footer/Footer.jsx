import { useEffect, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import homeShape from '../../assets/bottom-nav-icons/nav-home-shape.svg'
import homeCircle from '../../assets/bottom-nav-icons/nav-home-circle.svg'
import homeIcon from '../../assets/bottom-nav-icons/nav-home.svg'
import homeIdleIcon from '../../assets/bottom-nav-icons/nav-home-idle.svg'
import campusIcon from '../../assets/bottom-nav-icons/nav-campus.svg'
import campusActiveIcon from '../../assets/bottom-nav-icons/nav-campus-active.svg'
import inboxIcon from '../../assets/bottom-nav-icons/nav-inbox.svg'
import inboxActiveIcon from '../../assets/bottom-nav-icons/nav-inbox-active.svg'
import talkIcon from '../../assets/bottom-nav-icons/nav-talk.svg'
import talkActiveIcon from '../../assets/bottom-nav-icons/nav-talk-active.svg'

const iconSway = keyframes`
  0% {
    transform: rotate(0deg);
  }
  18% {
    transform: rotate(-10deg);
  }
  42% {
    transform: rotate(10deg);
  }
  64% {
    transform: rotate(-10deg);
  }
  84% {
    transform: rotate(6deg);
  }
  100% {
    transform: rotate(0deg);
  }
`

const dropletMotion = keyframes`
  0% {
    transform: scaleX(1) scaleY(1);
  }
  36% {
    transform: scaleX(var(--stretch)) scaleY(0.7);
  }
  68% {
    transform: scaleX(0.94) scaleY(1.08);
  }
  100% {
    transform: scaleX(1) scaleY(1);
  }
`

const FooterBar = styled.footer`
  position: ${({ $pinned }) => ($pinned ? 'fixed' : 'absolute')};
  bottom: 0;
  left: ${({ $pinned }) => ($pinned ? '50%' : '0')};
  z-index: ${({ $pinned }) => ($pinned ? 4 : 2)};
  width: ${({ $pinned }) => ($pinned ? 'min(390px, 100dvw)' : '390px')};
  height: 95px;
  margin-left: ${({ $pinned }) => ($pinned ? 'calc(min(390px, 100dvw) / -2)' : '0')};
  pointer-events: none;
`

const FooterFill = styled.div`
  position: absolute;
  top: 53px;
  right: 0;
  bottom: 0;
  left: 0;
  background: #ffffff;
`

const FooterShadow = styled.div`
  position: absolute;
  top: 22px;
  left: 0;
  width: 390px;
  height: 62px;
  border-radius: 30px;
  background: #ffffff;
  box-shadow: 0 -10px 45px rgba(0, 0, 0, 0.13);
`

const FooterSurface = styled.div`
  position: absolute;
  top: 15px;
  right: 0;
  left: 0;
  height: 66px;
  border-radius: 15px;
  background: #ffffff;
`

const Droplet = styled.div`
  position: absolute;
  top: 0;
  left: ${({ $x }) => $x}px;
  z-index: 2;
  width: 90px;
  height: 60px;
  transform-origin: 45px 34px;
  transition: left 0.64s cubic-bezier(0.34, 0.75, 0.28, 1.12);
  pointer-events: none;
  --stretch: ${({ $stretch }) => $stretch};

  ${({ $animate }) =>
    $animate &&
    css`
      animation: ${dropletMotion} 0.64s cubic-bezier(0.34, 0.75, 0.28, 1);
    `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    animation: none;
  }
`

const Bump = styled.img`
  position: absolute;
  top: 0;
  left: 0;
`

const Bubble = styled.img`
  position: absolute;
  top: 9px;
  left: 20px;
`

const FooterImage = styled.img`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  z-index: ${({ $front }) => ($front ? 3 : 1)};
  transform-origin: center 18%;
  transition: top 0.5s cubic-bezier(0.34, 1.4, 0.64, 1);

  ${({ $sway }) =>
    $sway &&
    css`
      animation: ${iconSway} 0.72s ease-in-out;
    `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    animation: none;
  }
`

const FooterLabel = styled.span`
  position: absolute;
  top: 66px;
  left: ${({ $left }) => $left};
  z-index: 3;
  color: #56a6f0;
  font-size: 11px;
  font-weight: 500;
  line-height: normal;
  white-space: nowrap;
  transform: translateX(-50%);
`

const NavButton = styled.button`
  position: absolute;
  top: 0;
  left: ${({ $left }) => $left};
  z-index: 4;
  width: 90px;
  height: 80px;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  pointer-events: auto;
`

const bump = {
  home: 13,
  campus: 96,
  inbox: 184,
  talk: 270,
}

let lastTab = 'home'

const items = [
  { id: 'home', label: '홈', buttonLeft: '13px', labelLeft: '58px', iconLeft: '45px', idle: homeIdleIcon, active: homeIcon, width: '26', height: '28', topOn: '20px', topOff: '31px' },
  { id: 'campus', label: '캠퍼스 현황', buttonLeft: '96px', labelLeft: '141.5px', iconLeft: '128px', idle: campusIcon, active: campusActiveIcon, width: '26', height: '28', topOn: '20px', topOff: '31px' },
  { id: 'inbox', label: '접수함', buttonLeft: '184px', labelLeft: '229px', iconLeft: '216px', idle: inboxIcon, active: inboxActiveIcon, width: '26', height: '28', topOn: '20px', topOff: '31px' },
  { id: 'talk', label: '캠퍼스톡', buttonLeft: '270px', labelLeft: '315.5px', iconLeft: '304px', idle: talkIcon, active: talkActiveIcon, width: '21.5', height: '21.5', topOn: '23px', topOff: '34px' },
]

function Footer({ active = 'home', onNavigate, shadow = false, pinned = false }) {
  const [stretch, setStretch] = useState(1)
  const [animate, setAnimate] = useState(false)
  const [sway, setSway] = useState(false)
  const [x, setX] = useState(() => bump[lastTab] ?? bump[active] ?? bump.home)
  const [raisedId, setRaisedId] = useState(() => lastTab)
  const [lit, setLit] = useState(() => lastTab)

  useEffect(() => {
    const fromId = lastTab
    const from = bump[fromId] ?? bump.home
    const to = bump[active] ?? bump.home
    if (fromId === active) return undefined
    setStretch(1 + Math.min(Math.abs(to - from) / 340, 0.34))
    setAnimate(false)
    setSway(false)
    let cancelled = false
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return
        lastTab = active
        setX(to)
        setRaisedId(active)
        setLit(null)
        setAnimate(true)
        setSway(true)
      })
    })
    const timer = setTimeout(() => {
      if (!cancelled) setLit(active)
    }, 260)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
  }, [active])

  return (
    <FooterBar $pinned={pinned}>
      {shadow && <FooterShadow />}
      <FooterFill />
      <FooterSurface />
      <Droplet $x={x} $stretch={stretch} $animate={animate}>
        <Bump src={homeShape} alt="" width="90" height="30.5" />
        <Bubble src={homeCircle} alt="" width="50" height="50" />
      </Droplet>
      {items.map((item) => {
        const raised = raisedId === item.id
        return (
          <FooterImage
            key={item.id}
            src={lit === item.id ? item.active : item.idle}
            alt=""
            width={item.width}
            height={item.height}
            $top={raised ? item.topOn : item.topOff}
            $left={item.iconLeft}
            $front={raised}
            $sway={sway && item.id === active}
          />
        )
      })}
      {items.map((item) => (
        <NavButton
          key={item.id}
          type="button"
          $left={item.buttonLeft}
          aria-label={item.label}
          aria-current={active === item.id ? 'page' : undefined}
          onClick={() => onNavigate?.(item.id)}
        />
      ))}
      {items.map((item) => (
        <FooterLabel key={item.label} $left={item.labelLeft}>
          {item.label}
        </FooterLabel>
      ))}
    </FooterBar>
  )
}

export default Footer

import { useState } from 'react'
import styled, { css } from 'styled-components'
import Footer from '../../common/Footer/Footer.jsx'
import talkDummy, { postsForZone } from '../../services/talkDummy.js'
import ZoneEdit from './ZoneEdit.jsx'
import TalkSend from './TalkSend.jsx'
import TalkDetail from './TalkDetail.jsx'
import ellipseA from '../../assets/images/bg-talk-ellipse-a.svg'
import ellipseB from '../../assets/images/bg-talk-ellipse-b.svg'
import ellipseC from '../../assets/images/bg-talk-ellipse-c.svg'
import ellipseD from '../../assets/images/bg-talk-ellipse-d.svg'
import ellipseE from '../../assets/images/bg-talk-ellipse-e.svg'
import arrowIcon from '../../assets/images/icon-inbox-arrow.svg'
import sendIcon from '../../assets/images/icon-talk-send.svg'
import statusTime from '../../assets/images/status-time.svg'
import statusSignal from '../../assets/images/status-signal.svg'
import statusWifi from '../../assets/images/status-wifi.svg'
import statusBattery from '../../assets/images/status-battery.svg'
import statusIndicator from '../../assets/images/status-indicator.svg'

const badgeTones = {
  unread: { background: '#ffe3e3', color: '#fe7e7e' },
  checking: { background: '#fff5d8', color: '#ffa264' },
  answered: { background: '#e2f1ff', color: '#56a6f0' },
}

const ellipses = [
  { src: ellipseA, top: '-198px', left: '-26px', width: '1009', height: '1009' },
  { src: ellipseB, top: '-373px', left: '-643px', width: '1109', height: '1109' },
  { src: ellipseC, top: '437px', left: '-187px', width: '768', height: '768' },
  { src: ellipseD, top: '-386px', left: '-478px', width: '1294', height: '1386' },
  { src: ellipseE, top: '-373px', left: '-643px', width: '1109', height: '1109' },
]

const PageRoot = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100dvh;
  background: #d7e6fc;
  color: #161a2b;
  font-family: 'Noto Sans KR', sans-serif;
`

const Screen = styled.div`
  position: relative;
  width: 390px;
  height: max(844px, 100dvh);
  overflow: hidden;
  background: #d7e6fc;
`

const Ellipse = styled.img`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  z-index: 0;
  pointer-events: none;
`

const StatusBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  width: 390px;
  height: 45px;
`

const StatusIcon = styled.img`
  position: absolute;
  top: ${({ $top }) => $top};
  ${({ $left }) => $left && css`left: ${$left};`}
  ${({ $right }) => $right && css`right: ${$right};`}
`

const Main = styled.main`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 45px 0 0;

  > * {
    flex-shrink: 0;
  }
`

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding: 0 20px;
`

const Title = styled.h1`
  margin: 0;
  color: #161a2b;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.4px;
`

const Building = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 36px;
  border-radius: 999px;
  background: #ffffff;
  color: #161a2b;
  font-size: 13px;
  font-weight: 600;
`

const ZoneBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 50px;
  margin: 0 20px;
  padding: 0 17px 0 20px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.38);
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
`

const ZoneLabel = styled.p`
  flex: none;
  margin: 0;
  color: #757575;
  font-size: 15px;
  font-weight: 500;
`

const ChipRow = styled.div`
  display: flex;
  flex: 1;
  gap: 8px;
  min-width: 0;
  overflow: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const Chip = styled.span`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  height: 25px;
  padding: 0 8px;
  border-radius: 30px;
  background: rgba(86, 166, 240, 0.65);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
`

const EditButton = styled.button`
  flex: none;
  margin: 0 0 0 auto;
  padding: 0;
  border: none;
  background: none;
  color: #757575;
  cursor: pointer;
  font: inherit;
  font-size: 11px;
  font-weight: 500;
`

const Tabs = styled.div`
  position: relative;
  height: 30px;
  margin-top: 22px;
`

const Tab = styled.button`
  position: absolute;
  top: 0;
  left: ${({ $left }) => $left};
  width: ${({ $width }) => $width};
  height: 25px;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: ${({ $selected }) => ($selected ? '#263e50' : 'rgba(38, 62, 80, 0.6)')};
  font: inherit;
  font-size: 13px;
  font-weight: ${({ $selected }) => ($selected ? 700 : 500)};
  line-height: 25px;
  text-align: center;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    top: 27px;
    left: 0;
    width: 100%;
    height: 3px;
    background: ${({ $selected }) => ($selected ? '#56a6f0' : 'transparent')};
  }
`

const List = styled.section`
  flex: 1 0 auto;
  padding: 19px 0 180px;
  background: rgba(215, 230, 252, 0.5);
`

const Card = styled.article`
  position: relative;
  height: 124px;
  margin: 0 20px 15px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 0 4px -1px rgba(86, 166, 240, 0.3);
`

const Badge = styled.span`
  position: absolute;
  top: 13px;
  left: 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 21px;
  border-radius: 30px;
  background: ${({ $tone }) => badgeTones[$tone].background};
  color: ${({ $tone }) => badgeTones[$tone].color};
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
`

const BadgeText = styled.span`
  display: block;
  line-height: 1;
  transform: translateY(-0.5px);
`

const Time = styled.time`
  position: absolute;
  top: 13px;
  right: 18px;
  display: flex;
  align-items: center;
  height: 21px;
  color: rgba(38, 62, 80, 0.6);
  font-size: 11px;
  font-weight: 500;
`

const Place = styled.h2`
  position: absolute;
  top: 47px;
  left: 15px;
  margin: 0;
  color: ${({ $answered }) => ($answered ? '#161a2b' : '#263e50')};
  font-size: 17px;
  font-weight: 600;
  line-height: 14px;
`

const Body = styled.p`
  position: absolute;
  top: 74px;
  left: 15px;
  width: 304px;
  margin: 0;
  color: #5a6072;
  font-size: 11px;
  font-weight: 600;
  line-height: 14px;
`

const Check = styled.button`
  position: absolute;
  right: 13px;
  bottom: 13px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: #263e50;
  font: inherit;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
`

const SendButton = styled.button`
  position: absolute;
  right: 10px;
  bottom: 120px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 9px;
  width: 169px;
  height: 41px;
  padding: 0 16px 0 20px;
  border: 1px solid rgba(86, 166, 240, 0.65);
  border-radius: 30px;
  background: rgba(86, 166, 240, 0.5);
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  color: #ffffff;
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  backdrop-filter: blur(12px);
`

function CampusTalk({ onNavigate }) {
  const [tab, setTab] = useState('all')
  const [editing, setEditing] = useState(false)
  const [sending, setSending] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [overrides, setOverrides] = useState({})
  const [zone, setZone] = useState({ floors: [], rooms: [] })
  const zonePosts = postsForZone(zone.floors, zone.rooms).map((item) => ({
    ...item,
    ...overrides[item.id],
  }))
  const posts = zonePosts.filter((item) => tab === 'all' || item.status === tab)
  const selected = zonePosts.find((item) => item.id === selectedId)
  const chips = [
    ...zone.floors.map((floor) => `${floor}층`),
    ...zone.rooms.map((room) => `${room.id}호`),
  ]

  const openPost = (item) => {
    if (item.status === 'unread') {
      setOverrides((current) => ({
        ...current,
        [item.id]: { ...current[item.id], status: 'checking', badge: '확인 중' },
      }))
    }
    setSelectedId(item.id)
  }

  if (selected) {
    return (
      <TalkDetail
        post={selected}
        onBack={() => setSelectedId(null)}
        onReply={(reply) => {
          setOverrides((current) => {
            const previous = current[selected.id]?.replies ?? []
            return {
              ...current,
              [selected.id]: {
                ...current[selected.id],
                status: 'answered',
                badge: '답변 완료',
                replies: [...previous, reply],
              },
            }
          })
        }}
      />
    )
  }

  if (sending) {
    return (
      <TalkSend
        onBack={() => setSending(false)}
        onSend={() => setSending(false)}
      />
    )
  }

  if (editing) {
    return (
      <ZoneEdit
        zone={zone}
        onBack={() => setEditing(false)}
        onSave={(next) => {
          setZone(next)
          setEditing(false)
        }}
      />
    )
  }

  return (
    <PageRoot>
      <Screen>
        {ellipses.map((ellipse) => (
          <Ellipse
            key={`${ellipse.src}-${ellipse.top}`}
            src={ellipse.src}
            alt=""
            width={ellipse.width}
            height={ellipse.height}
            $top={ellipse.top}
            $left={ellipse.left}
          />
        ))}
        <StatusBar aria-hidden="true">
          <StatusIcon src={statusTime} alt="" width="33" height="15" $top="15px" $left="31px" />
          <StatusIcon src={statusIndicator} alt="" width="6" height="6" $top="8px" $right="71px" />
          <StatusIcon src={statusSignal} alt="" width="20" height="14" $top="16px" $right="63px" />
          <StatusIcon src={statusWifi} alt="" width="16" height="14" $top="16px" $right="43px" />
          <StatusIcon src={statusBattery} alt="" width="25" height="14" $top="16px" $right="14px" />
        </StatusBar>
        <Main>
          <Header>
            <Title>{talkDummy.title}</Title>
            <Building>{talkDummy.building}</Building>
          </Header>
          <ZoneBar>
            <ZoneLabel>{talkDummy.zone}</ZoneLabel>
            <ChipRow>
              {chips.map((chip) => (
                <Chip key={chip}>{chip}</Chip>
              ))}
            </ChipRow>
            <EditButton type="button" onClick={() => setEditing(true)}>{talkDummy.edit}</EditButton>
          </ZoneBar>
          <Tabs>
            {talkDummy.tabs.map((item) => (
              <Tab
                key={item.id}
                type="button"
                $left={item.left}
                $width={item.width}
                $selected={tab === item.id}
                aria-pressed={tab === item.id}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </Tab>
            ))}
          </Tabs>
          <List>
            {posts.map((item) => (
              <Card key={item.id}>
                <Badge $tone={item.status}>
                  <BadgeText>{item.badge}</BadgeText>
                </Badge>
                <Time>{item.time}</Time>
                <Place $answered={item.status === 'answered'}>{item.place}</Place>
                <Body>{item.body}</Body>
                <Check type="button" onClick={() => openPost(item)}>
                  {talkDummy.action}
                  <img src={arrowIcon} alt="" width="15" height="15" />
                </Check>
              </Card>
            ))}
          </List>
        </Main>
        <SendButton type="button" onClick={() => setSending(true)}>
          <img src={sendIcon} alt="" width="18.709" height="15.5" />
          {talkDummy.send}
        </SendButton>
        <Footer active="talk" shadow onNavigate={onNavigate} />
      </Screen>
    </PageRoot>
  )
}

export default CampusTalk

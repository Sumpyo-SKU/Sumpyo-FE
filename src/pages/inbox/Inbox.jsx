import { useState } from 'react'
import styled, { css } from 'styled-components'
import Footer from '../../common/Footer/Footer.jsx'
import ComplaintDetail from './ComplaintDetail.jsx'
import inboxDummy from '../../services/inboxDummy.js'
import ellipseA from '../../assets/images/bg-inbox-ellipse-a.svg'
import ellipseB from '../../assets/images/bg-inbox-ellipse-b.svg'
import ellipseC from '../../assets/images/bg-inbox-ellipse-c.svg'
import ellipseD from '../../assets/images/bg-inbox-ellipse-d.svg'
import ellipseE from '../../assets/images/bg-inbox-ellipse-e.svg'
import searchIcon from '../../assets/images/icon-search.svg'
import sparkIcon from '../../assets/images/icon-repeat-spark.svg'
import sparkSmallIcon from '../../assets/images/icon-repeat-spark-2.svg'
import arrowIcon from '../../assets/images/icon-inbox-arrow.svg'
import statusTime from '../../assets/images/status-time.svg'
import statusSignal from '../../assets/images/status-signal.svg'
import statusWifi from '../../assets/images/status-wifi.svg'
import statusBattery from '../../assets/images/status-battery.svg'
import statusIndicator from '../../assets/images/status-indicator.svg'

const badgeTones = {
  received: { background: '#ffe3e3', color: '#fe7e7e' },
  progress: { background: '#fff5d8', color: '#ffa264' },
  done: { background: '#e2f1ff', color: '#56a6f0' },
}

const ellipses = [
  { src: ellipseD, top: '-386px', left: '-478px', width: '1294', height: '1386' },
  { src: ellipseB, top: '-373px', left: '-643px', width: '1109', height: '1109' },
  { src: ellipseE, top: '-373px', left: '-643px', width: '1109', height: '1109' },
  { src: ellipseA, top: '-198px', left: '-26px', width: '1009', height: '1009' },
  { src: ellipseC, top: '437px', left: '-187px', width: '768', height: '768' },
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
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

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
  font-size: 13px;
  font-weight: 600;
`

const SearchBar = styled.label`
  display: flex;
  align-items: center;
  gap: 11px;
  height: 42px;
  margin: 8px 20px 0;
  padding: 0 16px;
  border: 1.2px solid rgba(86, 166, 240, 0.5);
  border-radius: 30px;
  background: #ffffff;
`

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #161a2b;
  font: inherit;
  font-size: 13px;

  &::placeholder {
    color: #556881;
  }
`

const Summary = styled.section`
  height: 163px;
  margin: 23px 16px 0;
  padding: 14px 15px 0 11px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.38);
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
`

const SummaryTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 2px;
  margin: 0;
  color: #1d2752;
  font-size: 15px;
  font-weight: 700;
`

const Spark = styled.span`
  position: relative;
  width: 22px;
  height: 22px;
  flex: none;
`

const SparkMain = styled.img`
  position: absolute;
  top: 3px;
  left: 4px;
`

const SparkSmall = styled.img`
  position: absolute;
  top: 15px;
  left: 14.5px;
`

const Room = styled.p`
  margin: 12px 0 0 20px;
  color: #263e50;
  font-size: 13px;
  font-weight: 600;
`

const Note = styled.p`
  margin: 5px 0 0 20px;
  color: rgba(38, 62, 80, 0.6);
  font-size: 9px;
`

const Action = styled.button`
  width: calc(100% - 8px);
  height: 45px;
  margin: 16px 4px 0;
  border: none;
  border-radius: 15px;
  background: rgba(86, 166, 240, 0.8);
  color: #ffffff;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
`

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 24px 28px 0;
`

const Tab = styled.button`
  position: relative;
  margin: 0;
  padding: 0 0 5px;
  border: none;
  background: none;
  color: ${({ $selected }) => ($selected ? '#263e50' : 'rgba(38, 62, 80, 0.6)')};
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 25px;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 3px;
    background: ${({ $selected }) => ($selected ? '#56a6f0' : 'transparent')};
  }
`

const List = styled.section`
  flex: 1 0 auto;
  margin-top: 21px;
  padding: 21px 0 120px;
  background: rgba(215, 230, 252, 0.5);
`

const Card = styled.article`
  position: relative;
  height: 124px;
  margin: 0 20px 13px;
  padding: 10px 15px 0;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 0 4px -1px rgba(86, 166, 240, 0.3);
`

const Badge = styled.span`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 53px;
  height: 21px;
  border-radius: 30px;
  background: ${({ $tone }) => badgeTones[$tone].background};
  color: ${({ $tone }) => badgeTones[$tone].color};
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
`

const BadgeText = styled.span`
  display: block;
  line-height: 1;
  transform: ${({ $lift }) => ($lift ? 'translateY(-0.5px)' : 'none')};
`

const Time = styled.time`
  position: absolute;
  top: 11px;
  right: 15px;
  color: rgba(38, 62, 80, 0.6);
  font-size: 11px;
  font-weight: 500;
`

const Place = styled.h3`
  margin: 21px 0 0;
  color: ${({ $done }) => ($done ? '#161a2b' : '#263e50')};
  font-size: 17px;
  font-weight: 600;
  line-height: 1;
`

const Body = styled.p`
  margin: 8px 0 0;
  color: #5a6072;
  font-size: 11px;
  font-weight: 600;
  line-height: 14px;
`

const More = styled.button`
  position: absolute;
  right: 13px;
  bottom: 11px;
  display: inline-flex;
  align-items: center;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: #263e50;
  font: inherit;
  font-size: 11px;
  font-weight: 500;
  cursor: ${({ $link }) => ($link ? 'pointer' : 'default')};
`

function Inbox({ onNavigate }) {
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [detail, setDetail] = useState(null)
  const [complaints, setComplaints] = useState(inboxDummy.complaints)
  const keyword = query.trim()
  const visibleComplaints = complaints.filter((item) => {
    const matchesTab = tab === 'all' || item.status === tab
    const matchesQuery = !keyword || `${item.place} ${item.body}`.includes(keyword)
    return matchesTab && matchesQuery
  })

  if (detail) {
    return (
      <ComplaintDetail
        complaint={detail}
        onBack={() => setDetail(null)}
        onNavigate={onNavigate}
        onStatus={(status, checks) => {
          const labels = { received: '접수', progress: '처리 중', done: '완료' }
          setComplaints((items) => items.map((item) => (
            item.id === detail.id ? { ...item, status, badge: labels[status], checks } : item
          )))
          setDetail((item) => (item ? { ...item, status, badge: labels[status], checks } : item))
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
            <Title>접수함</Title>
            <Building>{inboxDummy.building}</Building>
          </Header>

          <SearchBar>
            <img src={searchIcon} alt="" width="16" height="16" />
            <SearchInput
              value={query}
              placeholder={inboxDummy.searchPlaceholder}
              onChange={(event) => setQuery(event.target.value)}
            />
          </SearchBar>

          <Summary aria-label={inboxDummy.repeat.title}>
            <SummaryTitle>
              <Spark>
                <SparkMain src={sparkIcon} alt="" width="13.4484" height="13.7817" />
                <SparkSmall src={sparkSmallIcon} alt="" width="5.44842" height="5.89842" />
              </Spark>
              {inboxDummy.repeat.title}
            </SummaryTitle>
            <Room>{inboxDummy.repeat.room}</Room>
            <Note>{inboxDummy.repeat.summary}</Note>
            <Action
              type="button"
              onClick={() => {
                setTab('all')
                setQuery(inboxDummy.repeat.query)
              }}
            >
              {inboxDummy.repeat.action}
            </Action>
          </Summary>

          <Tabs>
            {inboxDummy.tabs.map((item) => (
              <Tab key={item.id} type="button" $selected={tab === item.id} onClick={() => setTab(item.id)}>
                {item.label}
              </Tab>
            ))}
          </Tabs>

          <List>
            {visibleComplaints.map((item) => (
              <Card key={item.id}>
                <Badge $tone={item.status}>
                  <BadgeText $lift={item.status !== 'received'}>{item.badge}</BadgeText>
                </Badge>
                <Time>{item.time}</Time>
                <Place $done={item.status === 'done'}>{item.place}</Place>
                <Body>{item.body}</Body>
                <More
                  as={item.detail ? 'button' : 'span'}
                  type={item.detail ? 'button' : undefined}
                  $link={Boolean(item.detail)}
                  onClick={item.detail ? () => setDetail(item) : undefined}
                >
                  상세 보기
                  <img src={arrowIcon} alt="" width="15" height="15" />
                </More>
              </Card>
            ))}
          </List>
        </Main>

        <Footer active="inbox" shadow onNavigate={onNavigate} />
      </Screen>
    </PageRoot>
  )
}

export default Inbox

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Footer from '../../common/Footer/Footer.jsx'
import ComplaintDetail from './ComplaintDetail.jsx'
import { getComplaints, getRepeatedComplaints } from '../../api/inbox.js'
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

const DetailLayer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 50%;
  z-index: 30;
  width: min(390px, 100dvw);
  margin-left: calc(min(390px, 100dvw) / -2);
  overflow: hidden;
  background: #f0f8ff;
`

const Ellipse = styled.img`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  z-index: 0;
  pointer-events: none;
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
  min-height: 103px;
  margin: 23px 16px 0;
  padding: 14px 15px 14px 11px;
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
  color: ${({ $error }) => ($error ? '#c93a24' : 'rgba(38, 62, 80, 0.6)')};
  font-size: 9px;
`

const Tabs = styled.div`
  position: relative;
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
`

const TabIndicator = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${({ $width }) => $width}px;
  height: 3px;
  background: #56a6f0;
  transform: translateX(${({ $left }) => $left}px);
  transition: ${({ $move }) => ($move ? 'transform 280ms cubic-bezier(0.32, 0.72, 0, 1), width 280ms cubic-bezier(0.32, 0.72, 0, 1)' : 'none')};
  pointer-events: none;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
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

const ListNote = styled.p`
  margin: 0 24px 12px;
  color: ${({ $muted }) => ($muted ? '#5f6a8f' : '#c93a24')};
  font-size: 13px;
  font-weight: 500;
  line-height: 19px;
`

const complaintStatus = {
  RECEIVED: { id: 'received', badge: '접수' },
  IN_PROGRESS: { id: 'progress', badge: '처리 중' },
  DONE: { id: 'done', badge: '완료' },
}

const statusQuery = {
  received: 'RECEIVED',
  progress: 'IN_PROGRESS',
  done: 'DONE',
}

function relativeTime(createdAt) {
  const diff = Date.now() - new Date(createdAt).getTime()
  const minutes = Math.max(0, Math.round(diff / 60000))
  if (!Number.isFinite(minutes) || minutes < 1) return '방금'
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  return `${Math.round(hours / 24)}일 전`
}

function mapComplaint(item) {
  const tone = complaintStatus[item.status] ?? { id: 'received', badge: item.status || '' }
  const categories = (item.categoryLabels ?? []).filter(Boolean).join(' · ')
  return {
    id: item.complaintId,
    complaintId: item.complaintId,
    status: tone.id,
    badge: tone.badge,
    place: categories ? `${item.room ?? ''} · ${categories}` : (item.room ?? ''),
    room: item.room ?? '',
    categoryLabels: (item.categoryLabels ?? []).filter(Boolean),
    body: item.preview ?? '',
    time: relativeTime(item.createdAt),
    createdAt: item.createdAt,
  }
}

function Inbox({ onNavigate }) {
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [keyword, setKeyword] = useState('')
  const [detail, setDetail] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [counts, setCounts] = useState({ all: 0, received: 0, inProgress: 0, done: 0 })
  const [listError, setListError] = useState('')
  const [loading, setLoading] = useState(true)
  const [repeated, setRepeated] = useState([])
  const [repeatError, setRepeatError] = useState('')
  const cursorRef = useRef(null)
  const hasNextRef = useRef(false)
  const loadingRef = useRef(false)
  const requestRef = useRef(0)
  const tabRef = useRef(tab)
  const tabsRef = useRef(null)
  const tabButtonRefs = useRef({})
  const [indicator, setIndicator] = useState(null)
  const [indicatorMoves, setIndicatorMoves] = useState(false)
  const tabs = [
    { id: 'all', label: `전체 ${counts.all ?? 0}` },
    { id: 'received', label: `접수 ${counts.received ?? 0}` },
    { id: 'progress', label: `처리 중 ${counts.inProgress ?? 0}` },
    { id: 'done', label: `완료 ${counts.done ?? 0}` },
  ]

  useEffect(() => {
    const timer = setTimeout(() => setKeyword(query.trim()), 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    let cancelled = false
    getRepeatedComplaints()
      .then((payload) => {
        if (cancelled) return
        setRepeated(Array.isArray(payload.data) ? payload.data : [])
        setRepeatError('')
      })
      .catch((error) => {
        if (cancelled) return
        setRepeated([])
        setRepeatError(error.message || '반복 민원을 불러오지 못했습니다.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function loadComplaints(cursor, statusTab, search) {
    if (cursor && loadingRef.current) return
    const requestId = requestRef.current + 1
    requestRef.current = requestId
    loadingRef.current = true
    setLoading(true)
    try {
      const payload = await getComplaints({
        status: statusQuery[statusTab],
        q: search,
        cursor,
      })
      if (requestRef.current !== requestId) return
      const data = payload.data ?? {}
      const nextItems = (data.content ?? []).map(mapComplaint)
      setComplaints((current) => (cursor ? [...current, ...nextItems] : nextItems))
      hasNextRef.current = Boolean(data.hasNext && data.nextCursor)
      cursorRef.current = data.hasNext ? data.nextCursor : null
      if (!cursor) setCounts(data.counts ?? { all: 0, received: 0, inProgress: 0, done: 0 })
      setListError('')
    } catch (error) {
      if (requestRef.current !== requestId) return
      if (!cursor) setComplaints([])
      setListError(error.message || '민원을 불러오지 못했습니다.')
    } finally {
      if (requestRef.current === requestId) {
        loadingRef.current = false
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    tabRef.current = tab
    cursorRef.current = null
    hasNextRef.current = false
    setComplaints([])
    loadComplaints(undefined, tab, keyword)
  }, [tab, keyword])

  useLayoutEffect(() => {
    const parent = tabsRef.current
    const node = tabButtonRefs.current[tab]
    if (!parent || !node) return undefined
    function measure() {
      const current = tabButtonRefs.current[tab]
      if (!current) return
      const parentRect = parent.getBoundingClientRect()
      const rect = current.getBoundingClientRect()
      const left = rect.left - parentRect.left
      const width = rect.width
      setIndicator((previous) => (
        previous && previous.left === left && previous.width === width ? previous : { left, width }
      ))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(parent)
    return () => observer.disconnect()
  }, [tab, counts])

  useEffect(() => {
    if (!indicator || indicatorMoves) return undefined
    const frame = requestAnimationFrame(() => setIndicatorMoves(true))
    return () => cancelAnimationFrame(frame)
  }, [indicator, indicatorMoves])

  useEffect(() => {
    if (!detail) return undefined
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [detail?.id])

  function openDetail(item) {
    setDetail(item)
  }

  function closeDetail() {
    setDetail(null)
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

        <Main
          onScroll={(event) => {
            const node = event.currentTarget
            const nearEnd = node.scrollHeight - node.scrollTop - node.clientHeight < 80
            if (nearEnd && hasNextRef.current) loadComplaints(cursorRef.current, tabRef.current, keyword)
          }}
        >
          <Header>
            <Title>접수함</Title>
            <Building>{inboxDummy.building}</Building>
          </Header>

          <SearchBar>
            <img src={searchIcon} alt="" width="16" height="16" />
            <SearchInput
              value={query}
              placeholder="건물·강의실·내용으로 검색"
              onChange={(event) => setQuery(event.target.value)}
            />
          </SearchBar>

          <Summary aria-label="이번주 반복 민원">
            <SummaryTitle>
              <Spark>
                <SparkMain src={sparkIcon} alt="" width="13.4484" height="13.7817" />
                <SparkSmall src={sparkSmallIcon} alt="" width="5.44842" height="5.89842" />
              </Spark>
              이번주 반복 민원
            </SummaryTitle>
            {repeatError ? <Note $error>{repeatError}</Note> : null}
            {!repeatError && repeated.length === 0 ? <Note>이번 주 반복 민원이 없어요</Note> : null}
            {repeated.map((item) => (
              <div key={item.roomId ?? item.room}>
                <Room>{item.room}</Room>
                {item.message ? <Note>{item.message}</Note> : null}
              </div>
            ))}
          </Summary>

          <Tabs ref={tabsRef}>
            {tabs.map((item) => (
              <Tab
                key={item.id}
                ref={(node) => { tabButtonRefs.current[item.id] = node }}
                type="button"
                $selected={tab === item.id}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </Tab>
            ))}
            {indicator ? (
              <TabIndicator $left={indicator.left} $width={indicator.width} $move={indicatorMoves} />
            ) : null}
          </Tabs>

          <List>
            {listError ? <ListNote>{listError}</ListNote> : null}
            {!loading && !listError && complaints.length === 0 ? <ListNote $muted>민원이 없어요</ListNote> : null}
            {complaints.map((item) => (
              <Card key={item.id}>
                <Badge $tone={item.status}>
                  <BadgeText $lift={item.status !== 'received'}>{item.badge}</BadgeText>
                </Badge>
                <Time>{item.time}</Time>
                <Place $done={item.status === 'done'}>{item.place}</Place>
                <Body>{item.body}</Body>
                <More as="button" type="button" $link onClick={() => openDetail(item)}>
                  상세 보기
                  <img src={arrowIcon} alt="" width="15" height="15" />
                </More>
              </Card>
            ))}
          </List>
        </Main>

        <Footer active="inbox" shadow onNavigate={onNavigate} />
      </Screen>
      {detail ? (
        <DetailLayer>
          <ComplaintDetail
            complaint={detail}
            onBack={closeDetail}
            onNavigate={onNavigate}
            onStatus={(status, checks) => {
              const labels = { received: '접수', progress: '처리 중', done: '완료' }
              setComplaints((items) => items.map((item) => (
                item.id === detail.id ? { ...item, status, badge: labels[status], checks } : item
              )))
              setDetail((item) => (item ? { ...item, status, badge: labels[status], checks } : item))
            }}
          />
        </DetailLayer>
      ) : null}
    </PageRoot>
  )
}

export default Inbox

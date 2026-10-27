import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { createTalk } from '../../api/campus-talk.js'
import { getBuildings, getFloorPlan } from '../../api/campus-status.js'
import ellipse from '../../assets/images/bg-edit-ellipse.svg'
import backIcon from '../../assets/images/icon-back.svg'

const PageRoot = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100dvh;
  background: #f0f8ff;
  color: #161a2b;
  font-family: 'Noto Sans KR', sans-serif;
`

const Screen = styled.div`
  position: relative;
  width: 390px;
  height: max(844px, 100dvh);
  overflow: hidden;
  background: #f0f8ff;
`

const Ellipse = styled.img`
  position: absolute;
  top: 410px;
  left: -252px;
  z-index: 0;
  pointer-events: none;
`

const Header = styled.header`
  position: absolute;
  top: 45px;
  left: 0;
  z-index: 2;
  width: 390px;
  height: 70px;
`

const BackButton = styled.button`
  position: absolute;
  top: 24px;
  left: 21px;
  width: 22px;
  height: 22px;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
`

const Main = styled.main`
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: auto;
  padding: 115px 0 40px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const Card = styled.section`
  margin: 0 16px;
  padding: 16px 16px 18px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.38);
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);

  & + & {
    margin-top: 20px;
  }
`

const CardTitle = styled.h2`
  margin: 0;
  color: #263e50;
  font-size: 15px;
  font-weight: 700;
  line-height: normal;
`

const FloorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 74px);
  gap: 13px 9px;
  margin-top: 11px;
`

const RoomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 102px);
  gap: 15px 9px;
  margin-top: 14px;
`

const Choice = styled.button`
  height: 40px;
  margin: 0;
  padding: 0;
  border: ${({ $on, $room }) => {
    if (!$on) return '1px solid #d4e8fb'
    return $room ? '1.5px solid #56a6f0' : '1px solid #56a6f0'
  }};
  border-radius: ${({ $room }) => ($room ? '10px' : '30px')};
  background: ${({ $on }) => ($on ? 'rgba(86, 166, 240, 0.1)' : '#ffffff')};
  color: ${({ $on }) => ($on ? '#263e50' : '#6d96bc')};
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
`

const NoteField = styled.textarea`
  display: block;
  width: 100%;
  height: 93px;
  margin: 8px 0 0;
  padding: 12px 15px;
  border: 1px solid #d4e8fb;
  border-radius: 10px;
  background: #ffffff;
  color: rgba(38, 62, 80, 0.7);
  font: inherit;
  font-size: 13px;
  font-weight: 400;
  line-height: normal;
  resize: none;
`

const Phrases = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 6px;
  margin: 48px 16px 0;
`

const Phrase = styled.button`
  width: ${({ $width }) => `${$width}px`};
  height: 33px;
  margin: 0;
  padding: 0 8px;
  border: ${({ $on }) => ($on ? '1px solid #56a6f0' : '1px solid #d4e8fb')};
  border-radius: 30px;
  background: ${({ $on }) => ($on ? 'rgba(86, 166, 240, 0.1)' : '#ffffff')};
  color: ${({ $on }) => ($on ? '#263e50' : '#6d96bc')};
  font: inherit;
  font-size: 13px;
  font-weight: 400;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
`

const SubmitButton = styled.button`
  display: block;
  width: calc(100% - 54px);
  height: 56px;
  margin: 17px 27px 0;
  border: none;
  border-radius: 20px;
  background: #56a6f0;
  color: #ffffff;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`

const Note = styled.p`
  margin: 12px 0 0;
  color: ${({ $muted }) => ($muted ? '#5f6a8f' : '#c93a24')};
  font-size: 13px;
  font-weight: 500;
  line-height: 19px;
`

const phrases = [
  { id: 'here', text: '북악관 1층에 계신 분 있나요?', width: 228 },
  { id: 'check', text: 'OO호에 사람 있는지 확인해주실 수 있나요?', width: 298 },
  { id: 'class', text: 'OO호 지금 수업 중인가요?', width: 210 },
  { id: 'window', text: '창문 확인 필요', width: 142 },
  { id: 'ac', text: '에어컨 확인 필요', width: 159 },
]

function lectureRooms(plan) {
  return (plan?.rooms ?? [])
    .filter((room) => room.type === 'LECTURE')
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
}

function TalkSend({ buildingId, onBack, onSend }) {
  const [floorOptions, setFloorOptions] = useState([])
  const [floor, setFloor] = useState(null)
  const [roomChoices, setRoomChoices] = useState([])
  const [roomsLoading, setRoomsLoading] = useState(false)
  const [room, setRoom] = useState(null)
  const [phraseId, setPhraseId] = useState(null)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    let cancelled = false

    getBuildings()
      .then((payload) => {
        if (cancelled) return
        const building = (payload.data ?? []).find((item) => item.buildingId === buildingId)
        const maxFloor = building?.maxFloor ?? 0
        setFloorOptions(Array.from({ length: maxFloor }, (_, index) => index + 1))
      })
      .catch((loadError) => {
        if (cancelled) return
        setError(loadError.message || '건물 정보를 불러오지 못했습니다.')
      })

    return () => {
      cancelled = true
    }
  }, [buildingId])

  useEffect(() => {
    if (!buildingId || floor == null) return undefined
    let cancelled = false
    setRoomsLoading(true)
    setRoomChoices([])

    getFloorPlan(buildingId, floor)
      .then((payload) => {
        if (cancelled) return
        setRoomChoices(lectureRooms(payload.data))
      })
      .catch((loadError) => {
        if (cancelled) return
        setError(loadError.message || '강의실을 불러오지 못했습니다.')
      })
      .finally(() => {
        if (!cancelled) setRoomsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [buildingId, floor])

  const selectFloor = (next) => {
    setFloor((current) => (current === next ? null : next))
    setRoom(null)
  }

  const selectRoom = (next) => {
    setRoom((current) => (current?.roomId === next.roomId ? null : next))
  }

  const selectPhrase = (phrase) => {
    if (phraseId === phrase.id) {
      setPhraseId(null)
      if (note === phrase.text) setNote('')
      return
    }
    setPhraseId(phrase.id)
    setNote(phrase.text)
  }

  const submit = async () => {
    const content = note.trim()
    if (floor == null) {
      setError('층을 선택해 주세요.')
      return
    }
    if (content.length < 1 || content.length > 300) {
      setError('내용은 1~300자로 입력해주세요.')
      return
    }

    setSending(true)
    setError('')
    try {
      const payload = await createTalk({
        floor,
        roomId: room?.roomId,
        content,
      })
      onSend(payload.data)
    } catch (sendError) {
      setError(sendError.message || '캠퍼스톡을 보내지 못했습니다.')
      setSending(false)
    }
  }

  return (
    <PageRoot>
      <Screen>
        <Ellipse src={ellipse} alt="" width="875" height="875" />
        <Header>
          <BackButton type="button" aria-label="캠퍼스톡으로 돌아가기" onClick={onBack}>
            <img src={backIcon} alt="" width="22" height="22" />
          </BackButton>
        </Header>
        <Main>
          <Card>
            <CardTitle>1. 연락 보낼 층을 선택해 주세요. (필수)</CardTitle>
            {floorOptions.length === 0 && !error ? <Note $muted>층을 불러오고 있어요.</Note> : null}
            <FloorGrid>
              {floorOptions.map((item) => (
                <Choice
                  key={item}
                  type="button"
                  $on={floor === item}
                  aria-pressed={floor === item}
                  onClick={() => selectFloor(item)}
                >
                  {item}층
                </Choice>
              ))}
            </FloorGrid>
          </Card>
          <Card>
            <CardTitle>2. 강의실을 선택해 주세요. (선택)</CardTitle>
            {floor == null ? <Note $muted>층을 먼저 선택해 주세요.</Note> : null}
            {floor != null && roomsLoading ? <Note $muted>강의실을 불러오고 있어요.</Note> : null}
            {floor != null && !roomsLoading ? (
              <RoomGrid>
                {roomChoices.map((item) => (
                  <Choice
                    key={item.roomId}
                    type="button"
                    $room
                    $on={room?.roomId === item.roomId}
                    aria-pressed={room?.roomId === item.roomId}
                    onClick={() => selectRoom(item)}
                  >
                    {item.number}
                  </Choice>
                ))}
              </RoomGrid>
            ) : null}
          </Card>
          <Card>
            <CardTitle>3. 특이 사항을 입력해 주세요.</CardTitle>
            <NoteField
              value={note}
              maxLength={300}
              aria-label="특이 사항을 입력해 주세요."
              onChange={(event) => setNote(event.target.value)}
            />
            {error ? <Note>{error}</Note> : null}
          </Card>
          <Phrases>
            {phrases.map((phrase) => (
              <Phrase
                key={phrase.id}
                type="button"
                $width={phrase.width}
                $on={phraseId === phrase.id}
                aria-pressed={phraseId === phrase.id}
                onClick={() => selectPhrase(phrase)}
              >
                {phrase.text}
              </Phrase>
            ))}
          </Phrases>
          <SubmitButton type="button" disabled={sending} onClick={submit}>
            캠퍼스톡 보내기
          </SubmitButton>
        </Main>
      </Screen>
    </PageRoot>
  )
}

export default TalkSend

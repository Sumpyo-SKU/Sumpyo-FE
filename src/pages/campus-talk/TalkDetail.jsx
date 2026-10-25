import { useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import talkDummy from '../../services/talkDummy.js'
import ellipse from '../../assets/images/bg-edit-ellipse.svg'
import backIcon from '../../assets/images/icon-back.svg'
import avatarIcon from '../../assets/images/icon-talk-avatar.svg'
import replyButton from '../../assets/images/icon-talk-reply-button.png'
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

const StatusBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
  width: 390px;
  height: 45px;
`

const StatusIcon = styled.img`
  position: absolute;
  top: ${({ $top }) => $top};
  ${({ $left }) => $left && css`left: ${$left};`}
  ${({ $right }) => $right && css`right: ${$right};`}
`

const Header = styled.header`
  position: absolute;
  top: 45px;
  left: 0;
  z-index: 3;
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

const Heading = styled.div`
  position: absolute;
  top: 12px;
  left: 60px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const Title = styled.h1`
  margin: 0;
  color: #161a2b;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.4px;
  line-height: normal;
`

const DateText = styled.p`
  margin: 0;
  color: #5f6a8f;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
`

const Badge = styled.span`
  position: absolute;
  top: 23px;
  right: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 69px;
  height: 25px;
  border-radius: 30px;
  background: ${({ $tone }) => badgeTones[$tone].background};
  color: ${({ $tone }) => badgeTones[$tone].color};
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
`

const Main = styled.main`
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: auto;
  padding: 119px 0 280px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const MessageCard = styled.section`
  margin: 0 16px;
  padding: 16px 16px 18px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.38);
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
`

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const Avatar = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 31px;
  height: 31px;
  border-radius: 8px;
  background: #ecf4fd;
`

const Author = styled.p`
  margin: 0;
  color: #263e50;
  font-size: 11px;
  font-weight: 500;
  line-height: 20px;
`

const SectionLabel = styled.h2`
  margin: 14px 0 0;
  color: #1d2752;
  font-size: 15px;
  font-weight: 700;
  line-height: normal;
`

const MessageBody = styled.div`
  margin-top: 8px;
  padding: 6px 13px;
  border-radius: 10px;
  background: rgba(86, 166, 240, 0.15);
  color: #263e50;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
`

const AnswerLabel = styled.h2`
  margin: 18px 20px 0;
  color: #1d2752;
  font-size: 15px;
  font-weight: 700;
  line-height: normal;
`

const EmptyAnswer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 56px;
  margin: 9px 18px 0 16px;
  border: 1px dashed rgba(86, 166, 240, 0.5);
  border-radius: 20px;
  background: rgba(86, 166, 240, 0.05);
  text-align: center;
`

const EmptyLine = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 20px;
  color: ${({ $strong }) => ($strong ? '#263e50' : 'rgba(38, 62, 80, 0.7)')};
  font-weight: ${({ $strong }) => ($strong ? 500 : 400)};
`

const ReplyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 9px 16px 0;
`

const ReplyCard = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 52px;
  padding: 0 17px 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.38);
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
`

const ReplyText = styled.p`
  margin: 0;
  color: #263e50;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
`

const ReplyTime = styled.span`
  flex: 0 0 auto;
  color: #5f6a8f;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
  white-space: nowrap;
`

const Sheet = styled.section`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  padding: 26px 15px 0;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 22px 22px 0 0;
  background: rgba(255, 255, 255, 0.38);
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
`

const BubbleList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`

const Bubble = styled.button`
  width: ${({ $width }) => `${$width}px`};
  height: 33px;
  margin: 0;
  padding: 0 8px;
  border: ${({ $on }) => ($on ? '1.5px solid #56a6f0' : '1px solid #d4e8fb')};
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

const Composer = styled.form`
  position: relative;
  width: 390px;
  height: 74px;
  margin: 5px 0 0 -16px;
`

const DraftInput = styled.input`
  position: absolute;
  top: 16px;
  left: 18px;
  width: 309px;
  height: 44px;
  margin: 0;
  padding: 0 16px 0 24px;
  border: 1.5px solid rgba(86, 166, 240, 0.3);
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.8);
  color: rgba(38, 62, 80, 0.7);
  font: inherit;
  font-size: 13px;
  font-weight: 400;
  line-height: 41px;
  outline: none;
  appearance: none;

  &::placeholder {
    color: rgba(38, 62, 80, 0.7);
  }
`

const SendButton = styled.button`
  position: absolute;
  top: 18px;
  left: 334px;
  width: 40px;
  height: 40px;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
`

const SendIcon = styled.img`
  display: block;
  filter: drop-shadow(0 4px 8px rgba(86, 166, 240, 0.45));
`

function detailOf(post) {
  if (post.detail) return post.detail
  const title = post.place.includes('북악') ? post.place : `북악관 ${post.place}`
  return {
    title,
    date: '2026.10.06 14:00',
    author: '김근로 · 북악관 6층',
    room: 'OO호',
    lines: [post.body],
    placeholder: `${title} 연락에 답변하기`,
  }
}

function replyTime(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${month}.${day} ${hour}:${minute}`
}

function fillFor(reply, room) {
  if (reply.id === 'people') return `지금 ${room}에 사람 있어요`
  if (reply.id === 'class') return `${room} 지금 수업 중이에요`
  if (reply.id === 'custom') return ''
  return reply.label
}

function TalkDetail({ post, onBack, onReply }) {
  const detail = detailOf(post)
  const inputRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const [draft, setDraft] = useState('')

  const selectReply = (reply) => {
    if (selected === reply.id) {
      setSelected(null)
      setDraft('')
      return
    }
    setSelected(reply.id)
    setDraft(fillFor(reply, detail.room))
    if (reply.id === 'custom') inputRef.current?.focus()
  }

  const submit = (event) => {
    event.preventDefault()
    const reply = draft.trim()
    if (!reply) return
    onReply({ text: reply, time: replyTime() })
    setSelected(null)
    setDraft('')
  }

  return (
    <PageRoot>
      <Screen>
        <Ellipse src={ellipse} alt="" width="875" height="875" />
        <StatusBar aria-hidden="true">
          <StatusIcon src={statusTime} alt="" width="33" height="15" $top="15px" $left="31px" />
          <StatusIcon src={statusIndicator} alt="" width="6" height="6" $top="8px" $right="71px" />
          <StatusIcon src={statusSignal} alt="" width="20" height="14" $top="16px" $right="63px" />
          <StatusIcon src={statusWifi} alt="" width="16" height="14" $top="16px" $right="43px" />
          <StatusIcon src={statusBattery} alt="" width="25" height="14" $top="16px" $right="14px" />
        </StatusBar>
        <Header>
          <BackButton type="button" aria-label="캠퍼스톡으로 돌아가기" onClick={onBack}>
            <img src={backIcon} alt="" width="22" height="22" />
          </BackButton>
          <Heading>
            <Title>{detail.title}</Title>
            <DateText>{detail.date}</DateText>
          </Heading>
          <Badge $tone={post.status}>{post.badge}</Badge>
        </Header>
        <Main>
          <MessageCard>
            <AuthorRow>
              <Avatar>
                <img src={avatarIcon} alt="" width="18.709" height="15.5" />
              </Avatar>
              <Author>{detail.author}</Author>
            </AuthorRow>
            <SectionLabel>{talkDummy.detailLabel}</SectionLabel>
            <MessageBody>
              {detail.lines.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </MessageBody>
          </MessageCard>
          <AnswerLabel>{talkDummy.answerLabel}</AnswerLabel>
          {post.replies?.length ? (
            <ReplyList>
              {post.replies.map((reply, index) => (
                <ReplyCard key={`${reply.time}-${index}`}>
                  <ReplyText>{reply.text}</ReplyText>
                  <ReplyTime>{reply.time}</ReplyTime>
                </ReplyCard>
              ))}
            </ReplyList>
          ) : (
            <EmptyAnswer>
              <EmptyLine>{talkDummy.answerEmpty[0]}</EmptyLine>
              <EmptyLine $strong>{talkDummy.answerEmpty[1]}</EmptyLine>
            </EmptyAnswer>
          )}
        </Main>
        <Sheet>
          <BubbleList>
            {talkDummy.replies.map((reply) => {
              const on = selected === reply.id
              return (
                <Bubble
                  key={reply.id}
                  type="button"
                  $width={reply.width}
                  $on={on}
                  aria-pressed={on}
                  onClick={() => selectReply(reply)}
                >
                  {reply.label}
                </Bubble>
              )
            })}
          </BubbleList>
          <Composer onSubmit={submit}>
            <DraftInput
              ref={inputRef}
              value={draft}
              placeholder={post.replies?.length ? detail.placeholder : ''}
              aria-label="답변 입력"
              onChange={(event) => setDraft(event.target.value)}
            />
            <SendButton type="submit" aria-label="답변 보내기">
              <SendIcon src={replyButton} alt="" width="40" height="40" />
            </SendButton>
          </Composer>
        </Sheet>
      </Screen>
    </PageRoot>
  )
}

export default TalkDetail

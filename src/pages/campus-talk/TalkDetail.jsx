import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { createTalkReply, deleteTalk, deleteTalkReply, getTalkDetail } from '../../api/campus-talk.js'
import ellipse from '../../assets/images/bg-edit-ellipse.svg'
import backIcon from '../../assets/images/icon-back.svg'
import avatarIcon from '../../assets/images/icon-talk-avatar.svg'
import replyButton from '../../assets/images/icon-talk-reply-button.png'

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
  flex: 1;
  margin: 0;
  color: #263e50;
  font-size: 11px;
  font-weight: 500;
  line-height: 20px;
`

const DeleteButton = styled.button`
  margin: 0 0 0 auto;
  padding: 0;
  border: none;
  background: none;
  color: #c93a24;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`

const ConfirmLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(22, 26, 43, 0.28);
`

const ConfirmCard = styled.div`
  width: 100%;
  padding: 28px 20px 20px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 8px 32px rgba(60, 80, 160, 0.12);
`

const ConfirmText = styled.p`
  margin: 0;
  color: #161a2b;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
`

const ConfirmActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 22px;
`

const ConfirmButton = styled.button`
  flex: 1;
  height: 48px;
  margin: 0;
  border: ${({ $primary }) => ($primary ? 'none' : '1px solid #d4e8fb')};
  border-radius: 16px;
  background: ${({ $primary }) => ($primary ? '#56a6f0' : '#ffffff')};
  color: ${({ $primary }) => ($primary ? '#ffffff' : '#6d96bc')};
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
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
  color: ${({ $deleted }) => ($deleted ? '#8b93a7' : '#263e50')};
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
`

const ReplySide = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
`

const ReplyDelete = styled.button`
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: #c93a24;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
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
  width: fit-content;
  max-width: 100%;
  height: 33px;
  margin: 0;
  padding: 0 16px;
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

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`

const SendIcon = styled.img`
  display: block;
  filter: drop-shadow(0 4px 8px rgba(86, 166, 240, 0.45));
`

const ReplyNote = styled.p`
  margin: 8px 2px 0;
  color: #c93a24;
  font-size: 13px;
  font-weight: 500;
  line-height: 19px;
`

const LoadNote = styled.p`
  margin: 24px 20px;
  color: ${({ $muted }) => ($muted ? '#5f6a8f' : '#c93a24')};
  font-size: 13px;
  font-weight: 500;
  line-height: 19px;
`

const detailStatus = {
  UNREAD: { id: 'unread', badge: '미확인' },
  CHECKING: { id: 'checking', badge: '확인 중' },
  ANSWERED: { id: 'answered', badge: '답변 완료' },
}

function replyTime(createdAt) {
  const date = createdAt ? new Date(createdAt) : new Date()
  if (Number.isNaN(date.getTime())) return replyTime()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${month}.${day} ${hour}:${minute}`
}

function talkDate(createdAt) {
  const date = createdAt ? new Date(createdAt) : null
  if (!date || Number.isNaN(date.getTime())) return ''
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${date.getFullYear()}.${month}.${day} ${hour}:${minute}`
}

function mapTalkDetail(data) {
  const tone = detailStatus[data?.status] ?? { id: 'unread', badge: data?.status || '' }
  const title = [data?.building, data?.target].filter(Boolean).join(' ')
  return {
    talkId: data?.talkId,
    title,
    date: talkDate(data?.createdAt),
    author: data?.sentByMe ? '나' : (data?.building || ''),
    lines: String(data?.content ?? '').split('\n').filter((line) => line.length > 0),
    status: tone.id,
    badge: tone.badge,
    sentByMe: Boolean(data?.sentByMe),
    suggestions: data?.suggestions ?? [],
    replies: (data?.replies ?? []).map((reply) => ({
      replyId: reply.replyId,
      text: reply.deleted ? (reply.content || '삭제된 답변입니다') : (reply.content ?? ''),
      author: reply.deleted ? '' : (reply.author ?? ''),
      time: replyTime(reply.createdAt),
      mine: Boolean(reply.mine),
      deleted: Boolean(reply.deleted),
    })),
  }
}

function TalkDetail({ post, onBack, onReply, onLoaded, onDeleted }) {
  const inputRef = useRef(null)
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [selected, setSelected] = useState(null)
  const [draft, setDraft] = useState('')
  const [suggested, setSuggested] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deletingReplyId, setDeletingReplyId] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const suggestions = [
    ...(detail?.suggestions ?? []).map((text, index) => ({ id: `suggestion-${index}`, label: text })),
    { id: 'custom', label: '직접 입력' },
  ]

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setLoadError('')
    setDetail(null)

    getTalkDetail(post.talkId)
      .then((payload) => {
        if (cancelled) return
        const next = mapTalkDetail(payload.data)
        setDetail(next)
        onLoaded?.(next)
      })
      .catch((loadError) => {
        if (cancelled) return
        setLoadError(loadError.message || '캠퍼스톡을 불러오지 못했습니다.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [post.talkId])

  const selectReply = (reply) => {
    if (selected === reply.id) {
      setSelected(null)
      setDraft('')
      setSuggested(false)
      return
    }
    const text = reply.id === 'custom' ? '' : reply.label
    setSelected(reply.id)
    setDraft(text)
    setSuggested(reply.id !== 'custom' && text.length > 0)
    if (reply.id === 'custom') inputRef.current?.focus()
  }

  const submit = async (event) => {
    event.preventDefault()
    const content = draft.trim()
    if (content.length < 1 || content.length > 300) {
      setError('내용은 1~300자로 입력해주세요.')
      return
    }

    setSending(true)
    setError('')
    try {
      const payload = await createTalkReply(post.talkId, { content, isSuggested: suggested })
      const data = payload.data ?? {}
      const tone = detailStatus[data.talkStatus] ?? { id: 'answered', badge: '답변 완료' }
      const reply = {
        replyId: data.replyId,
        text: content,
        author: '나',
        time: replyTime(data.createdAt),
        mine: true,
        talkStatus: data.talkStatus,
      }
      setDetail((current) => current && ({
        ...current,
        status: tone.id,
        badge: tone.badge,
        replies: [...current.replies, reply],
      }))
      onReply(reply)
      setSelected(null)
      setDraft('')
      setSuggested(false)
      setSending(false)
    } catch (sendError) {
      setError(sendError.message || '답변을 보내지 못했습니다.')
      setSending(false)
    }
  }

  const remove = async () => {
    setDeleting(true)
    setError('')
    try {
      await deleteTalk(post.talkId)
      onDeleted?.()
    } catch (deleteError) {
      setError(deleteError.message || '캠퍼스톡을 삭제하지 못했습니다.')
      setDeleting(false)
    }
  }

  const removeReply = async (replyId) => {
    setDeletingReplyId(replyId)
    setError('')
    try {
      const payload = await deleteTalkReply(post.talkId, replyId)
      const talkStatus = payload.data?.talkStatus
      const tone = detailStatus[talkStatus]
      setDetail((current) => {
        if (!current) return current
        return {
          ...current,
          status: tone?.id ?? current.status,
          badge: tone?.badge ?? current.badge,
          replies: current.replies.map((item) => (
            item.replyId === replyId
              ? { ...item, text: '삭제된 답변입니다', author: '', deleted: true }
              : item
          )),
        }
      })
      if (talkStatus) onReply?.({ talkStatus })
    } catch (deleteError) {
      setError(deleteError.message || '답변을 삭제하지 못했습니다.')
    } finally {
      setDeletingReplyId(null)
    }
  }

  const title = detail?.title || post.place
  const badgeStatus = detail?.status || post.status
  const badgeLabel = detail?.badge || post.badge

  return (
    <PageRoot>
      <Screen>
        <Ellipse src={ellipse} alt="" width="875" height="875" />
        <Header>
          <BackButton type="button" aria-label="캠퍼스톡으로 돌아가기" onClick={onBack}>
            <img src={backIcon} alt="" width="22" height="22" />
          </BackButton>
          <Heading>
            <Title>{title}</Title>
            <DateText>{detail?.date}</DateText>
          </Heading>
          <Badge $tone={badgeStatus}>{badgeLabel}</Badge>
        </Header>
        <Main>
          {loading ? <LoadNote $muted>캠퍼스톡을 불러오고 있어요.</LoadNote> : null}
          {loadError ? <LoadNote>{loadError}</LoadNote> : null}
          {detail ? (
            <>
              <MessageCard>
                <AuthorRow>
                  <Avatar>
                    <img src={avatarIcon} alt="" width="18.709" height="15.5" />
                  </Avatar>
                  <Author>{detail.author}</Author>
                  {detail.sentByMe ? (
                    <DeleteButton
                      type="button"
                      disabled={deleting}
                      onClick={() => {
                        setError('')
                        setConfirming(true)
                      }}
                    >
                      삭제
                    </DeleteButton>
                  ) : null}
                </AuthorRow>
                <SectionLabel>캠퍼스톡 내용</SectionLabel>
                <MessageBody>
                  {detail.lines.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </MessageBody>
              </MessageCard>
              <AnswerLabel>답변</AnswerLabel>
              {detail.replies.length ? (
                <ReplyList>
                  {detail.replies.map((reply) => (
                    <ReplyCard key={reply.replyId ?? `${reply.time}-${reply.text}`}>
                      <ReplyText $deleted={reply.deleted}>
                        {reply.author ? `${reply.author} · ${reply.text}` : reply.text}
                      </ReplyText>
                      <ReplySide>
                        <ReplyTime>{reply.time}</ReplyTime>
                        {reply.mine && !reply.deleted ? (
                          <ReplyDelete
                            type="button"
                            disabled={deletingReplyId === reply.replyId}
                            onClick={() => removeReply(reply.replyId)}
                          >
                            삭제
                          </ReplyDelete>
                        ) : null}
                      </ReplySide>
                    </ReplyCard>
                  ))}
                </ReplyList>
              ) : (
                <EmptyAnswer>
                  <EmptyLine>아직 답변이 없어요</EmptyLine>
                  <EmptyLine $strong>근처에 있다면 먼저 알려주세요</EmptyLine>
                </EmptyAnswer>
              )}
            </>
          ) : null}
        </Main>
        {detail ? (
          <Sheet>
            {error && !confirming ? <ReplyNote>{error}</ReplyNote> : null}
            <BubbleList>
              {suggestions.map((reply) => {
                const on = selected === reply.id
                return (
                  <Bubble
                    key={reply.id}
                    type="button"
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
                maxLength={300}
                placeholder={detail.replies.length ? `${title} 연락에 답변하기` : ''}
                aria-label="답변 입력"
                onChange={(event) => {
                  const next = event.target.value
                  setDraft(next)
                  const picked = suggestions.find((reply) => reply.id === selected)
                  if (suggested && next !== (picked?.label ?? '')) setSuggested(false)
                }}
              />
              <SendButton type="submit" aria-label="답변 보내기" disabled={sending}>
                <SendIcon src={replyButton} alt="" width="40" height="40" />
              </SendButton>
            </Composer>
          </Sheet>
        ) : null}
        {confirming ? (
          <ConfirmLayer role="presentation" onClick={() => { if (!deleting) setConfirming(false) }}>
            <ConfirmCard role="dialog" aria-modal="true" aria-labelledby="delete-talk-title" onClick={(event) => event.stopPropagation()}>
              <ConfirmText id="delete-talk-title">삭제하시겠습니까?</ConfirmText>
              {error ? <ReplyNote>{error}</ReplyNote> : null}
              <ConfirmActions>
                <ConfirmButton type="button" disabled={deleting} onClick={() => setConfirming(false)}>
                  취소
                </ConfirmButton>
                <ConfirmButton type="button" $primary disabled={deleting} onClick={remove}>
                  확인
                </ConfirmButton>
              </ConfirmActions>
            </ConfirmCard>
          </ConfirmLayer>
        ) : null}
      </Screen>
    </PageRoot>
  )
}

export default TalkDetail

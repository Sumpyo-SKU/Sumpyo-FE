import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { findComplaintRoom, getComplaintBuildings, submitComplaint } from '../../api/qrpage.js'
import ellipseBottom from '../../assets/images/bg-edit-ellipse.svg'
import ellipseTop from '../../assets/images/bg-settings-ellipse.svg'
import backIcon from '../../assets/images/complaint-back.svg'
import chevronIcon from '../../assets/images/complaint-chevron.svg'
import pinIcon from '../../assets/images/complaint-pin.png'
import askImage from '../../assets/images/complaint-character-body.png'
import questionImage from '../../assets/images/complaint-question.png'
import thanksImage from '../../assets/images/complaint-character-thanks.png'
import stuffyIcon from '../../assets/images/complaint-icon-stuffy.svg'
import hotIcon from '../../assets/images/complaint-icon-hot.svg'
import coldIcon from '../../assets/images/complaint-icon-cold.svg'
import humidIcon from '../../assets/images/complaint-icon-humid.svg'
import smellIcon from '../../assets/images/complaint-icon-smell.svg'
import wrenchIcon from '../../assets/images/complaint-icon-wrench.svg'

const categories = [
  { id: 'stuffy', code: 'STUFFY', label: '답답해요', icon: stuffyIcon },
  { id: 'hot', code: 'HOT', label: '더워요', icon: hotIcon },
  { id: 'cold', code: 'COLD', label: '추워요', icon: coldIcon },
  { id: 'humid', code: 'HUMID', label: '습해요', icon: humidIcon },
  { id: 'smell', code: 'SMELL', label: '냄새나요', icon: smellIcon },
  { id: 'broken', code: 'BROKEN', label: '설비 고장', icon: wrenchIcon },
]

const clientKey = 'sumpyo-complaint-client-id'

function complaintClientId() {
  const saved = localStorage.getItem(clientKey)
  if (saved) return saved
  const next = crypto.randomUUID()
  localStorage.setItem(clientKey, next)
  return next
}

const stems = {
  답답해요: '답답하',
  더워요: '덥',
  추워요: '춥',
  습해요: '습하',
  냄새나요: '냄새나',
}

function placeLabel(place) {
  if (!place?.building || !place?.number) return ''
  return `${place.building} ${place.number}호`
}

function roomFromLookup(data) {
  if (data?.roomId == null || !data.building || data.number == null || data.number === '') return null
  return {
    building: data.building,
    number: String(data.number),
    roomId: data.roomId,
  }
}

function complaintPhrase(labels) {
  const broken = labels.includes('설비 고장')
  const normal = labels.filter((label) => label !== '설비 고장')
  if (normal.length === 0) return broken ? '설비 고장이라고' : '불편하다고'
  const words = normal.map((label, index) => {
    const stem = stems[label] || label
    const last = index === normal.length - 1
    if (!last || broken) return `${stem}고`
    return `${stem}다고`
  })
  if (broken) return `${words.join(' ')} 설비 고장이라고`
  return words.join(' ')
}

function leaveComplaint() {
  const referrer = document.referrer
  if (referrer) {
    try {
      if (new URL(referrer).origin === window.location.origin) {
        window.history.back()
        return
      }
    } catch {
      // 주소가 아니면 홈으로 돌아간다.
    }
  }
  window.location.assign('/')
}

const question = keyframes`
  0%,
  100% {
    transform: translateY(0) rotate(-8deg);
  }
  50% {
    transform: translateY(-7px) rotate(8deg);
  }
`

const PageRoot = styled.div`
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  background: #f0f8ff;
  color: #161a2b;
  font-family: 'Noto Sans KR', sans-serif;
`

const Screen = styled.div`
  position: relative;
  width: 390px;
  height: 100dvh;
  margin: 0 auto;
  overflow: hidden;
  background: #f0f8ff;
`

const Stage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 390px;
  height: 844px;
  overflow: hidden;
  transform: scale(var(--complaint-scale, 1));
  transform-origin: top center;
`

const Ellipse = styled.img`
  position: absolute;
  z-index: 0;
  pointer-events: none;
  ${({ $top, $left }) => css`
    top: ${$top};
    left: ${$left};
  `}
`

const BackButton = styled.button`
  position: absolute;
  top: 69px;
  left: 21px;
  z-index: 2;
  width: 22px;
  height: 22px;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`

const Title = styled.h1`
  position: absolute;
  top: 112px;
  left: 23px;
  z-index: 1;
  width: 210px;
  margin: 0;
  color: #161a2b;
  font-size: 27px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.4px;
`

const Lead = styled.p`
  position: absolute;
  top: 196px;
  left: 24px;
  z-index: 1;
  width: 210px;
  margin: 0;
  color: #5f6a8f;
  font-size: 13px;
  font-weight: 400;
  line-height: 19px;
  letter-spacing: -0.4px;
`

const AskFloat = styled.div`
  position: absolute;
  top: 58px;
  left: 244px;
  z-index: 1;
  width: 102px;
  height: 184px;
`

const AskImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 102px;
  height: 184px;
  object-fit: contain;
`

const QuestionImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 102px;
  height: 184px;
  object-fit: contain;
  transform-origin: 65px 29px;
  animation: ${question} 1.6s ease-in-out infinite;
`

const Card = styled.section`
  position: absolute;
  top: 274px;
  right: 16px;
  left: 16px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 549px;
  padding: 22px 16px 13px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
`

const FieldLabel = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  color: #1d2752;
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
`

const Pin = styled.img`
  width: 16px;
  height: 20px;
  object-fit: cover;
`

const LocationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 35px;
  margin: 8px 0 0;
  padding: 0 12px 0 13px;
  border: 0.5px solid rgba(95, 106, 143, 0.3);
  border-radius: 10px;
  background: #ffffff;
  color: #5f6a8f;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 14px;
  text-align: left;
  cursor: pointer;
`

const Chevron = styled.img`
  flex: none;
  transform: rotate(180deg);
`

const SectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 22px;
`

const SectionTitle = styled.h2`
  margin: 0;
  color: #1d2752;
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
`

const SectionHint = styled.p`
  margin: 0;
  color: #56a6f0;
  font-size: 11px;
  font-weight: 400;
  line-height: 14px;
`

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 11px;
  margin-top: 12px;
`

const Category = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 64px;
  margin: 0;
  padding: 0;
  border: 1px solid rgba(86, 166, 240, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.8);
  color: #5f6a8f;
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: 13px;
  cursor: pointer;

  ${({ $on }) =>
    $on &&
    css`
      border-width: 2px;
      background: #dff1ff;
      color: #1d2e75;
    `}
`

const CategoryIcon = styled.img`
  ${({ $mute }) =>
    $mute &&
    css`
      filter: grayscale(1) brightness(0.55);
    `}
`

const DetailTitle = styled(SectionTitle)`
  margin-top: 22px;
`

const NoteBox = styled.div`
  position: relative;
  margin-top: 10px;
`

const NoteInput = styled.textarea`
  width: 100%;
  height: 96px;
  margin: 0;
  padding: 12px 13px 28px;
  border: 0.5px solid rgba(95, 106, 143, 0.3);
  border-radius: 10px;
  background: #ffffff;
  color: #1d2752;
  font: inherit;
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  resize: none;

  &::placeholder {
    color: rgba(95, 106, 143, 0.6);
    font-size: 11px;
  }
`

const Counter = styled.span`
  position: absolute;
  right: 12px;
  bottom: 10px;
  color: rgba(95, 106, 143, 0.6);
  font-size: 11px;
  line-height: 14px;
`

const FormError = styled.p`
  margin: 10px 0 0;
  color: #c93a24;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
`

const SubmitButton = styled.button`
  width: 100%;
  height: 56px;
  margin-top: auto;
  border: none;
  border-radius: 20px;
  background: #56a6f0;
  color: #ffffff;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transform: scale(1);
  transition: transform 180ms cubic-bezier(0.34, 1.45, 0.64, 1), background 180ms ease;

  &:active:not(:disabled) {
    background: #3f94df;
    transform: scale(0.94);
    transition-duration: 80ms;
    transition-timing-function: ease-in;
  }

  &:disabled {
    cursor: default;
  }
`

const Layer = styled.div`
  position: absolute;
  z-index: 30;
  inset: 0;
`

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(22, 26, 43, 0.5);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: opacity ${({ $open }) => ($open ? '220ms ease' : '360ms ease 80ms')};
`

const sheetDown = keyframes`
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  78% {
    transform: translateY(78%);
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0.45;
  }
`

const Sheet = styled.section`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  height: 595px;
  padding: 11px 16px 16px;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
  background: linear-gradient(180deg, #ffffff 0%, #f0f8ff 100%);
  transform: translateY(${({ $open }) => ($open ? '0' : '100%')});
  opacity: 1;
  transition: ${({ $closing }) => ($closing ? 'none' : 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1)')};
  animation: ${({ $closing }) => ($closing ? css`${sheetDown} 480ms cubic-bezier(0.4, 0, 1, 1) forwards` : 'none')};
`

const Handle = styled.div`
  width: 60px;
  height: 4px;
  margin: 0 auto 18px;
  border-radius: 20px;
  background: #d9d9d9;
`

const SheetTitle = styled.h2`
  margin: 0;
  color: #1d2752;
  font-size: 19px;
  font-weight: 700;
  line-height: 22px;
`

const SheetLead = styled.p`
  margin: 8px 0 0;
  color: #5f6a8f;
  font-size: 13px;
  font-weight: 400;
  line-height: 19px;
`

const Glass = styled.section`
  margin-top: 18px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.38);
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
`

const Step = styled.p`
  margin: 0;
  color: #263e50;
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
`

const BuildingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px 9px;
  margin-top: 12px;
`

const BuildingChip = styled.button`
  height: 40px;
  margin: 0;
  padding: 0 6px;
  border: 1px solid #d4e8fb;
  border-radius: 10px;
  background: #ffffff;
  color: #6d96bc;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;

  ${({ $on }) =>
    $on &&
    css`
      border: 2px solid #56a6f0;
      background: rgba(86, 166, 240, 0.1);
      color: #263e50;
    `}
`

const RoomCard = styled(Glass)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 65px;
  margin-top: 16px;
  padding: 12px 16px;
`

const RoomField = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #263e50;
  font-size: 15px;
  font-weight: 700;
`

const RoomInput = styled.input`
  width: 102px;
  height: 31px;
  margin: 0;
  padding: 0 10px;
  border: 1px solid rgba(86, 166, 240, 0.25);
  border-radius: 10px;
  background: #ffffff;
  color: #263e50;
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
`

const SuccessMain = styled.main`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding: 45px 16px 23px;
`

const SuccessBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`

const ThanksImage = styled.img`
  width: 234px;
  height: 266px;
  object-fit: cover;
`

const ThanksTitle = styled.h1`
  margin: 8px 0 0;
  color: #161a2b;
  font-size: 27px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.4px;
`

const ThanksCopy = styled.p`
  margin: 12px 0 0;
  color: #5f6a8f;
  font-size: 13px;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: -0.4px;
`

function StudentComplaint({ code }) {
  const [place, setPlace] = useState(null)
  const [selected, setSelected] = useState([])
  const [note, setNote] = useState('')
  const [formError, setFormError] = useState('')
  const [sheetMounted, setSheetMounted] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetClosing, setSheetClosing] = useState(false)
  const [draftBuilding, setDraftBuilding] = useState('')
  const [draftNumber, setDraftNumber] = useState('')
  const [sheetError, setSheetError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [lookingUp, setLookingUp] = useState(Boolean(code))
  const [buildings, setBuildings] = useState([])
  const [buildingsError, setBuildingsError] = useState('')
  const [buildingsLoaded, setBuildingsLoaded] = useState(false)
  const [done, setDone] = useState(null)
  const closeTimer = useRef(0)

  useEffect(() => {
    if (!code) return undefined
    let cancelled = false
    setLookingUp(true)
    findComplaintRoom({ code })
      .then((payload) => {
        if (cancelled) return
        const data = payload.data ?? {}
        const room = roomFromLookup(data)
        if (!room) return
        setPlace((current) => (current?.roomId != null ? current : room))
        setFormError('')
      })
      .catch((error) => {
        if (!cancelled) setFormError(error.message || '호실을 찾을 수 없어요.')
      })
      .finally(() => {
        if (!cancelled) setLookingUp(false)
      })
    return () => {
      cancelled = true
    }
  }, [code])

  useEffect(() => {
    let cancelled = false
    getComplaintBuildings()
      .then((payload) => {
        if (cancelled) return
        setBuildings(Array.isArray(payload.data) ? payload.data : [])
        setBuildingsError('')
      })
      .catch((error) => {
        if (!cancelled) setBuildingsError(error.message || '건물을 불러오지 못했습니다.')
      })
      .finally(() => {
        if (!cancelled) setBuildingsLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useLayoutEffect(() => {
    const fit = () => {
      document.documentElement.style.setProperty('--complaint-scale', String(Math.min(1, window.innerHeight / 844)))
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    fit()
    window.addEventListener('resize', fit)
    return () => {
      document.body.style.overflow = previous
      document.documentElement.style.removeProperty('--complaint-scale')
      window.removeEventListener('resize', fit)
      window.clearTimeout(closeTimer.current)
    }
  }, [])

  const bukak = buildings.find((item) => item.name === '북악관') ?? null

  const openSheet = () => {
    window.clearTimeout(closeTimer.current)
    setDraftBuilding(place?.building === bukak?.name ? bukak.buildingId : '')
    setDraftNumber(place?.number ?? '')
    setSheetError('')
    setSheetClosing(false)
    setSheetMounted(true)
    setSheetOpen(false)
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setSheetOpen(true))
    })
  }

  const closeSheet = () => {
    setSheetClosing(true)
    setSheetOpen(false)
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      setSheetMounted(false)
      setSheetClosing(false)
    }, 500)
  }

  const confirmPlace = async () => {
    if (draftBuilding !== bukak?.buildingId || !draftNumber) {
      setSheetError('북악관 호실을 선택해 주세요.')
      return
    }
    setSheetError('')
    try {
      const payload = await findComplaintRoom({ buildingId: bukak.buildingId, number: draftNumber })
      const data = payload.data ?? {}
      const room = roomFromLookup(data)
      if (!room) {
        setSheetError('호실을 찾을 수 없어요.')
        return
      }
      setPlace(room)
      setFormError('')
      closeSheet()
    } catch (error) {
      setSheetError(error.message || '호실을 찾을 수 없어요.')
    }
  }

  const toggleCategory = (id) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
    setFormError('')
  }

  const submit = async () => {
    const chosen = categories.filter((item) => selected.includes(item.id))
    const room = placeLabel(place)
    if (!room) {
      setFormError('위치를 선택해 주세요.')
      return
    }
    if (chosen.length === 0) {
      setFormError('주요 내용을 하나 이상 선택해 주세요.')
      return
    }
    setSubmitting(true)
    setFormError('')
    try {
      let roomId = place.roomId
      if (roomId == null) {
        const payload = code && !place?.number
          ? await findComplaintRoom({ code })
          : await findComplaintRoom({ buildingId: bukak?.buildingId, number: place.number })
        roomId = payload.data?.roomId
      }
      const result = await submitComplaint({
        roomId,
        categories: chosen.map((item) => item.code),
        content: note,
        clientId: complaintClientId(),
      })
      const data = result.data ?? {}
      const shown = (data.categoryLabels ?? []).filter(Boolean)
      setDone({
        room: data.room || room,
        phrase: complaintPhrase(shown.length ? shown : chosen.map((item) => item.label)),
      })
    } catch (error) {
      setFormError(error.message || '민원을 보내지 못했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const again = () => {
    setSelected([])
    setNote('')
    setFormError('')
    setDone(null)
  }

  return (
    <PageRoot>
      <Screen>
        <Stage>
        <Ellipse src={ellipseBottom} alt="" width="875" height="875" $top="410px" $left="-252px" />
        <Ellipse src={ellipseTop} alt="" width="875" height="875" $top="-326px" $left="-35px" />
        {done ? (
          <SuccessMain>
            <SuccessBody>
              <ThanksImage src={thanksImage} alt="" width="234" height="266" />
              <ThanksTitle>알려줘서 고마워요!</ThanksTitle>
              <ThanksCopy>
                {done.room}가 {done.phrase} 전달했어요
                <br />
                담당자가 바로 확인할게요
              </ThanksCopy>
            </SuccessBody>
            <SubmitButton type="button" onClick={again}>
              다른 불편도 알리기
            </SubmitButton>
          </SuccessMain>
        ) : (
          <>
            <BackButton type="button" aria-label="이전으로 돌아가기" onClick={leaveComplaint}>
              <img src={backIcon} alt="" width="22" height="22" />
            </BackButton>
            <Title>
              불편한 점을
              <br />
              알려주세요!
            </Title>
            <Lead>
              더 쾌적한 학습 공간을 만들기 위해
              <br />
              소중한 의견을 기다리고 있어요.
            </Lead>
            <AskFloat>
              <AskImage src={askImage} alt="" width="102" height="184" />
              <QuestionImage src={questionImage} alt="" width="102" height="184" />
            </AskFloat>
            <Card>
              <FieldLabel>
                <Pin src={pinIcon} alt="" width="16" height="20" />
                위치 선택 (필수)
              </FieldLabel>
              <LocationButton type="button" onClick={openSheet}>
                <span>{lookingUp ? '호실을 찾고 있어요' : (placeLabel(place) || '위치를 선택해 주세요')}</span>
                <Chevron src={chevronIcon} alt="" width="22" height="22" />
              </LocationButton>
              <SectionHead>
                <SectionTitle>주요 내용 (필수)</SectionTitle>
                <SectionHint>무엇이 불편한가요?</SectionHint>
              </SectionHead>
              <CategoryGrid>
                {categories.map((item) => {
                  const on = selected.includes(item.id)
                  return (
                    <Category key={item.id} type="button" $on={on} aria-pressed={on} onClick={() => toggleCategory(item.id)}>
                      <CategoryIcon src={item.icon} alt="" width="22.8494" height="22.8494" $mute={item.id === 'humid' && !on} />
                      {item.label}
                    </Category>
                  )
                })}
              </CategoryGrid>
              <DetailTitle>상세 내용 (선택)</DetailTitle>
              <NoteBox>
                <NoteInput
                  value={note}
                  maxLength={500}
                  placeholder="자세한 내용을 입력해주세요."
                  onChange={(event) => setNote(event.target.value.slice(0, 500))}
                />
                <Counter>{note.length}/500</Counter>
              </NoteBox>
              {formError ? <FormError>{formError}</FormError> : null}
              <SubmitButton type="button" disabled={submitting} onClick={submit}>
                제출하기
              </SubmitButton>
            </Card>
          </>
        )}
        {sheetMounted ? (
          <Layer>
            <Backdrop $open={sheetOpen} onClick={closeSheet} />
            <Sheet
              $open={sheetOpen}
              $closing={sheetClosing}
              role="dialog"
              aria-modal="true"
              aria-label="위치 선택"
              onClick={(event) => event.stopPropagation()}
            >
              <Handle />
              <SheetTitle>위치 선택</SheetTitle>
              <SheetLead>불편한 점이 발생한 건물과 호실을 선택해주세요.</SheetLead>
              <Glass>
                <Step>1. 건물을 선택해 주세요.</Step>
                {buildingsError ? <FormError>{buildingsError}</FormError> : null}
                {!buildingsError && !buildingsLoaded ? <Step>건물을 불러오고 있어요.</Step> : null}
                <BuildingGrid>
                  {buildings.map((item) => (
                    <BuildingChip
                      key={item.buildingId}
                      type="button"
                      $on={item.buildingId === draftBuilding}
                      onClick={() => {
                        if (item.name === '북악관') setDraftBuilding(item.buildingId)
                      }}
                    >
                      {item.name}
                    </BuildingChip>
                  ))}
                </BuildingGrid>
              </Glass>
              <RoomCard>
                <Step>2. 해당 호실을 알려주세요</Step>
                <RoomField>
                  <RoomInput
                    inputMode="numeric"
                    aria-label="호실"
                    value={draftNumber}
                    onChange={(event) => setDraftNumber(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                  호
                </RoomField>
              </RoomCard>
              {sheetError ? <FormError>{sheetError}</FormError> : null}
              <SubmitButton type="button" onClick={confirmPlace}>
                선택하기
              </SubmitButton>
            </Sheet>
          </Layer>
        ) : null}
        </Stage>
      </Screen>
    </PageRoot>
  )
}

export default StudentComplaint

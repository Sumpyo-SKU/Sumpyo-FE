import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { getRoomQrImage, getRoomQrInfo } from '../../api/settingspage.js'
import backIcon from '../../assets/images/icon-settings-back.svg'
import ellipseBottom from '../../assets/images/bg-edit-ellipse.svg'
import ellipseTop from '../../assets/images/bg-settings-ellipse.svg'

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
  min-height: max(844px, 100dvh);
  overflow: hidden;
  background: #f0f8ff;
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
  top: 62px;
  left: 15px;
  z-index: 2;
  width: 37px;
  height: 37px;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`

const BackIcon = styled.img`
  display: block;
  transform: rotate(180deg);
`

const Title = styled.h1`
  position: absolute;
  top: 66px;
  left: 65px;
  z-index: 2;
  margin: 0;
  color: #1d2752;
  font-size: 18px;
  font-weight: 700;
  line-height: 27px;
`

const Card = styled.section`
  position: absolute;
  top: 157px;
  right: 16px;
  left: 16px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 20px 24px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 8px 32px rgba(60, 80, 160, 0.12);
`

const QrImage = styled.img`
  width: 220px;
  height: 220px;
  object-fit: contain;
  border-radius: 12px;
  background: #ffffff;
`

const StatusText = styled.p`
  margin: 0;
  color: ${({ $error }) => ($error ? '#c93a24' : '#6d96bc')};
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  text-align: center;
`

const Room = styled.p`
  margin: 18px 0 0;
  color: #1d2752;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
`

const Url = styled.a`
  margin: 4px 0 0;
  color: #6d96bc;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  text-align: center;
  text-decoration: none;
  word-break: break-all;
`

const Hint = styled.p`
  margin: 18px 0 0;
  color: #6d96bc;
  font-size: 13px;
  font-weight: 500;
  line-height: 19px;
  text-align: center;
`

function QrPage({ roomId, onBack }) {
  const [imageUrl, setImageUrl] = useState('')
  const [info, setInfo] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (roomId === undefined || roomId === null || roomId === '') {
      setError('강의실을 먼저 선택해 주세요.')
      return undefined
    }

    let cancelled = false
    let objectUrl = ''
    setImageUrl('')
    setInfo(null)
    setError('')

    getRoomQrInfo(roomId)
      .then((payload) => {
        if (!cancelled) setInfo(payload.data)
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message || 'QR 정보를 불러오지 못했습니다.')
      })

    getRoomQrImage(roomId)
      .then((blob) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setImageUrl(objectUrl)
        setError('')
      })
      .catch((loadError) => {
        if (!cancelled) setError(loadError.message || 'QR을 불러오지 못했습니다.')
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [roomId])
  return (
    <PageRoot>
      <Screen>
        <Ellipse src={ellipseBottom} alt="" width="875" height="875" $top="410px" $left="-252px" />
        <Ellipse src={ellipseTop} alt="" width="875" height="875" $top="-326px" $left="-35px" />
        <BackButton type="button" aria-label="설정으로 돌아가기" onClick={onBack}>
          <BackIcon src={backIcon} alt="" width="37" height="37" />
        </BackButton>
        <Title>접수 QR 코드</Title>
        <Card>
          {imageUrl ? (
            <QrImage src={imageUrl} alt="접수 QR 코드" width="220" height="220" />
          ) : (
            <StatusText $error={Boolean(error)}>{error || 'QR을 불러오고 있어요'}</StatusText>
          )}
          {info?.room ? <Room>{info.room}</Room> : null}
          {info?.url ? <Url href={info.url}>{info.url}</Url> : null}
          <Hint>학생이 이 QR을 찍어 바로 접수할 수 있어요</Hint>
        </Card>
      </Screen>
    </PageRoot>
  )
}

export default QrPage

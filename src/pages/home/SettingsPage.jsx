import { Fragment } from 'react'
import styled, { css } from 'styled-components'
import backIcon from '../../assets/images/icon-settings-back.svg'
import ellipseBottom from '../../assets/images/bg-edit-ellipse.svg'
import ellipseTop from '../../assets/images/bg-settings-ellipse.svg'
import ventIcon from '../../assets/images/icon-setting-vent.svg'
import messageIcon from '../../assets/images/icon-setting-message.svg'
import sensorIcon from '../../assets/images/icon-setting-sensor.svg'
import qrIcon from '../../assets/images/icon-setting-qr.svg'
import gearIcon from '../../assets/images/icon-setting-gear.svg'
import guideIcon from '../../assets/images/icon-setting-alert.svg'
import chevronIcon from '../../assets/images/icon-setting-chevron.svg'
import lineIcon from '../../assets/images/icon-settings-line.svg'
import zoneIcon from '../../assets/images/icon-zone-building.svg'
import readingCat from '../../assets/images/settings-reading-cat.png'
import knobIcon from '../../assets/images/icon-toggle-knob.svg'

const noticeRows = [
  { key: 'ventilation', label: '환기 알림', icon: ventIcon, width: '22', height: '22' },
  { key: 'complaint', label: '새 민원 알림', icon: messageIcon, width: '19.8333', height: '18.9167', flip: true },
  { key: 'sensor', label: '센서 오류 알림', icon: sensorIcon, width: '19.8333', height: '19.8333' },
]

function formatPpm(ppm) {
  return `${ppm.toLocaleString('en-US')} ppm`
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

const Content = styled.main`
  position: relative;
  z-index: 1;
  padding-top: 124px;
`

const Section = styled.section`
  & + & {
    margin-top: 38px;
  }
`

const SectionTitle = styled.h1`
  margin: 0 0 11px 21px;
  color: #161a2b;
  font-size: 17px;
  font-weight: 600;
  line-height: 22px;
`

const Card = styled.div`
  margin: 0 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.38);
  backdrop-filter: blur(12px);
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
`

const Rows = styled.div``

const Line = styled.img`
  display: block;
  width: calc(100% + 2px);
  height: 1px;
  margin-left: -1px;
  background: #e6e6e6;
`

const rowStyle = css`
  display: flex;
  align-items: center;
  width: 100%;
  height: 53px;
  padding: 0 18px 0 10px;
  gap: 13px;
`

const Row = styled.div`
  ${rowStyle}
`

const RowButton = styled.button`
  ${rowStyle}
  margin: 0;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
`

const Tile = styled.span`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 31px;
  height: 31px;
  border-radius: 8px;
  background: #ecf4fd;
`

const IconSlot = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
`

const RowIcon = styled.img`
  display: block;
  transform: ${({ $flip }) => ($flip ? 'scaleX(-1)' : 'none')};
`

const Label = styled.span`
  flex: 1;
  min-width: 0;
  color: #161a2b;
  font-size: 13px;
  font-weight: 500;
  line-height: 14px;
`

const Value = styled.span`
  flex: none;
  color: rgba(90, 96, 114, 0.9);
  font-size: 11px;
  font-weight: 400;
  line-height: 14px;
`

const Switch = styled.button`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: ${({ $on }) => ($on ? 'flex-end' : 'flex-start')};
  width: 48px;
  height: 27px;
  margin: 0;
  padding: 2px;
  border: none;
  border-radius: 30px;
  background: ${({ $on }) => ($on ? '#56a6f0' : '#d5e2ee')};
  cursor: pointer;
`

function TileIcon({ src, width, height, flip = false }) {
  return (
    <Tile>
      <IconSlot>
        <RowIcon src={src} alt="" width={width} height={height} $flip={flip} />
      </IconSlot>
    </Tile>
  )
}

const ReadingCat = styled.img`
  position: absolute;
  top: 645px;
  left: 218px;
  z-index: 1;
  object-fit: contain;
  pointer-events: none;
`

const SettingsNote = styled.p`
  margin: 0 21px 12px;
  color: #c93a24;
  font-size: 13px;
  font-weight: 500;
  line-height: 19px;
`

function SettingsPage({ notice, ppm, error, onToggle, onBack, onOpenThreshold, onOpenZones, onOpenQr }) {
  return (
    <PageRoot>
      <Screen>
        <Ellipse src={ellipseBottom} alt="" width="875" height="875" $top="410px" $left="-252px" />
        <Ellipse src={ellipseTop} alt="" width="875" height="875" $top="-326px" $left="-35px" />

        <BackButton type="button" aria-label="홈으로 돌아가기" onClick={onBack}>
          <BackIcon src={backIcon} alt="" width="37" height="37" />
        </BackButton>

        <Content>
          {error ? <SettingsNote>{error}</SettingsNote> : null}
          <Section>
            <SectionTitle>알림 설정</SectionTitle>
            <Card>
              <Rows>
                {noticeRows.map((row, index) => (
                  <Fragment key={row.key}>
                    {index > 0 && <Line src={lineIcon} alt="" width="358" height="1" />}
                    <Row>
                      <TileIcon src={row.icon} width={row.width} height={row.height} flip={row.flip} />
                      <Label>{row.label}</Label>
                      <Switch
                        type="button"
                        role="switch"
                        aria-checked={notice[row.key]}
                        aria-label={row.label}
                        $on={notice[row.key]}
                        onClick={() => onToggle(row.key)}
                      >
                        <img src={knobIcon} alt="" width="23" height="23" />
                      </Switch>
                    </Row>
                  </Fragment>
                ))}
              </Rows>
            </Card>
          </Section>

          <Section>
            <SectionTitle>관리 설정</SectionTitle>
            <Card>
              <Rows>
                <RowButton type="button" onClick={onOpenQr}>
                  <TileIcon src={qrIcon} width="18" height="18" />
                  <Label>접수 QR 코드 발급</Label>
                  <img src={chevronIcon} alt="" width="20" height="20" />
                </RowButton>
                <Line src={lineIcon} alt="" width="358" height="1" />
                <RowButton type="button" onClick={onOpenThreshold}>
                  <TileIcon src={gearIcon} width="13.4167" height="13.4167" />
                  <Label>환기 기준값 설정</Label>
                  <Value>{formatPpm(ppm)}</Value>
                  <img src={chevronIcon} alt="" width="20" height="20" />
                </RowButton>
                <Line src={lineIcon} alt="" width="358" height="1" />
                <Row>
                  <TileIcon src={guideIcon} width="19.8333" height="19.8333" />
                  <Label>환기 기준 안내</Label>
                  <img src={chevronIcon} alt="" width="20" height="20" />
                </Row>
                <Line src={lineIcon} alt="" width="358" height="1" />
                <RowButton type="button" onClick={onOpenZones}>
                  <Tile>
                    <img src={zoneIcon} alt="" width="26" height="28" />
                  </Tile>
                  <Label>내 담당 구역</Label>
                  <img src={chevronIcon} alt="" width="20" height="20" />
                </RowButton>
              </Rows>
            </Card>
          </Section>
          <ReadingCat src={readingCat} alt="" width="117" height="157" />
        </Content>
      </Screen>
    </PageRoot>
  )
}

export default SettingsPage

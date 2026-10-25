import styled, { css } from 'styled-components'
import campusEllipse from '../../assets/images/bg-campus-ellipse.svg'
import backIcon from '../../assets/images/icon-back.svg'
import urgentIcon from '../../assets/images/icon-alert-urgent.svg'
import soonIcon from '../../assets/images/icon-alert-soon.svg'
import complaintIcon from '../../assets/images/icon-alert-complaint.svg'
import sensorIcon from '../../assets/images/icon-setting-sensor.svg'
import statusTime from '../../assets/images/status-time.svg'
import statusSignal from '../../assets/images/status-signal.svg'
import statusWifi from '../../assets/images/status-wifi.svg'
import statusBattery from '../../assets/images/status-battery.svg'
import statusIndicator from '../../assets/images/status-indicator.svg'

const tones = {
  urgent: { icon: urgentIcon, background: '#fde9e5' },
  soon: { icon: soonIcon, background: '#fff3dc' },
  complaint: { icon: complaintIcon, background: '#eef0f8' },
  sensor: { icon: sensorIcon, background: '#ecf4fd' },
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
  top: 410px;
  left: -252px;
  z-index: 0;
  pointer-events: none;
`

const StatusBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 390px;
  height: 45px;
`

const StatusIcon = styled.img`
  position: absolute;
  top: ${({ $top }) => $top};
  ${({ $left }) => $left && css`left: ${$left};`}
  ${({ $right }) => $right && css`right: ${$right};`}
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
  top: 67px;
  left: 52px;
  z-index: 1;
  margin: 0;
  color: #161a2b;
  font-size: 21px;
  font-weight: 700;
  line-height: 32px;
  letter-spacing: -0.4px;
`

const List = styled.main`
  position: absolute;
  top: 112px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  overflow: auto;
  padding: 0 16px 24px;
`

const SectionLabel = styled.h2`
  margin: 0 0 10px 4px;
  color: #5f6a8f;
  font-size: 13px;
  font-weight: 600;
  line-height: 19px;
`

const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Card = styled.article`
  position: relative;
  display: flex;
  align-items: flex-start;
  height: 73px;
  padding: 14px 14px 0;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.38);
  backdrop-filter: blur(12px);
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    inset 0 -1px 0 rgba(255, 255, 255, 0.3);
`

const IconBadge = styled.span`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-top: 3px;
  border-radius: 18px;
  background: ${({ $background }) => $background};
`

const Copy = styled.div`
  min-width: 0;
  margin-left: 12px;
  padding-right: 64px;
`

const ItemTitle = styled.p`
  margin: 0;
  overflow: hidden;
  color: #1d2752;
  font-size: 15px;
  font-weight: 700;
  line-height: 24px;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ItemBody = styled.p`
  margin: 0;
  overflow: hidden;
  color: #5f6a8f;
  font-size: 13px;
  font-weight: 400;
  line-height: 21px;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ItemTime = styled.time`
  position: absolute;
  top: 8px;
  right: 12px;
  color: #5f6a8f;
  font-size: 11px;
  font-weight: 500;
  line-height: 19px;
`

function AlertsPage({ alerts, onBack }) {
  return (
    <PageRoot>
      <Screen>
        <Ellipse src={campusEllipse} alt="" width="875" height="875" />
        <StatusBar aria-hidden="true">
          <StatusIcon src={statusTime} alt="" width="33" height="15" $top="15px" $left="31px" />
          <StatusIcon src={statusIndicator} alt="" width="6" height="6" $top="8px" $right="71px" />
          <StatusIcon src={statusSignal} alt="" width="20" height="14" $top="16px" $right="63px" />
          <StatusIcon src={statusWifi} alt="" width="16" height="14" $top="16px" $right="43px" />
          <StatusIcon src={statusBattery} alt="" width="25" height="14" $top="16px" $right="14px" />
        </StatusBar>

        <BackButton type="button" aria-label="홈으로 돌아가기" onClick={onBack}>
          <img src={backIcon} alt="" width="22" height="22" />
        </BackButton>
        <Title>{alerts.title}</Title>

        <List>
          <SectionLabel>{alerts.sectionLabel}</SectionLabel>
          <Items>
            {alerts.items.map((item) => {
              const tone = tones[item.tone] ?? tones.complaint
              return (
                <Card key={item.id}>
                  <IconBadge $background={tone.background}>
                    <img src={tone.icon} alt="" width={item.tone === 'sensor' ? '19.8333' : '18'} height={item.tone === 'sensor' ? '19.8333' : '18'} />
                  </IconBadge>
                  <Copy>
                    <ItemTitle>{item.title}</ItemTitle>
                    <ItemBody>{item.body}</ItemBody>
                  </Copy>
                  <ItemTime>{item.time}</ItemTime>
                </Card>
              )
            })}
          </Items>
        </List>
      </Screen>
    </PageRoot>
  )
}

export default AlertsPage

import styled from 'styled-components'
import arrowIcon from '../../assets/images/icon-arrow-forward.svg'

const Card = styled.section`
  position: absolute;
  top: 477px;
  right: 16px;
  left: 16px;
  z-index: 2;
  height: 253px;
  border-radius: 22px;
  background: #ffffff;
`

const RoomName = styled.p`
  position: absolute;
  top: 18px;
  left: 16px;
  margin: 0;
  color: #5a6072;
  font-size: 13px;
  font-weight: 400;
  line-height: 19px;
`

const DetailLink = styled.button`
  position: absolute;
  top: 17px;
  right: 16px;
  display: inline-flex;
  align-items: center;
  height: 15px;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: rgba(38, 62, 80, 0.6);
  font-size: 11px;
  font-weight: 500;
  line-height: 14px;
  cursor: pointer;
`

const Reading = styled.p`
  position: absolute;
  top: 41px;
  left: 16px;
  display: flex;
  align-items: flex-end;
  margin: 0;
  color: #161a2b;
`

const Co2Value = styled.span`
  font-size: 28px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: -0.5px;
`

const Co2Unit = styled.span`
  margin: 0 0 2px 4px;
  color: #5a6072;
  font-size: 13px;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: -0.5px;
`

const Metrics = styled.div`
  position: absolute;
  top: 83px;
  right: 16px;
  left: 16px;
  display: flex;
  gap: 12px;
`

const Metric = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 61px;
  border-radius: 12px;
  background: #f4f5fa;
`

const MetricLabel = styled.span`
  color: #5a6072;
  font-size: 11px;
  font-weight: 400;
  line-height: 17px;
`

const MetricValue = styled.span`
  color: #161a2b;
  font-size: 15px;
  font-weight: 700;
  line-height: 22px;
`

const Status = styled.p`
  position: absolute;
  top: 158px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  color: ${({ $color }) => $color};
  font-size: 13px;
  font-weight: 500;
  line-height: 19px;
`

const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: ${({ $color }) => $color};
`

const Actions = styled.div`
  position: absolute;
  top: 191px;
  right: 16px;
  left: 16px;
  display: flex;
  gap: 8px;
`

const ActionButton = styled.button`
  height: 46px;
  margin: 0;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  line-height: 21px;
  pointer-events: none;

  ${({ $primary }) =>
    $primary
      ? `
          flex: 1;
          background: #56a6f0;
          color: #ffffff;
          font-weight: 700;
        `
      : `
          width: 122px;
          background: #f4f5fa;
          color: #161a2b;
          font-weight: 600;
        `}
`

function RoomDetailCard({ room, onOpenDetail }) {
  return (
    <Card aria-label={`${room.name} 현황`}>
      <RoomName>{room.name}</RoomName>
      <DetailLink type="button" onClick={onOpenDetail}>
        상세 보기
        <img src={arrowIcon} alt="" width="15" height="15" />
      </DetailLink>
      <Reading>
        <Co2Value>{room.co2Label}</Co2Value>
        <Co2Unit>ppm</Co2Unit>
      </Reading>
      <Metrics>
        <Metric>
          <MetricLabel>온도</MetricLabel>
          <MetricValue>{room.temperature}</MetricValue>
        </Metric>
        <Metric>
          <MetricLabel>습도</MetricLabel>
          <MetricValue>{room.humidity}</MetricValue>
        </Metric>
      </Metrics>
      <Status $color={room.status.color}>
        <StatusDot $color={room.status.dot} />
        {room.status.label}
      </Status>
      <Actions>
        <ActionButton type="button">확인</ActionButton>
        <ActionButton type="button" $primary>환기 하기</ActionButton>
      </Actions>
    </Card>
  )
}

export default RoomDetailCard

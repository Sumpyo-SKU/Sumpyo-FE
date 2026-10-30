import styled from 'styled-components'

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

const OpenButton = styled.button`
  position: absolute;
  top: 191px;
  right: 16px;
  left: 16px;
  height: 46px;
  margin: 0;
  border: none;
  border-radius: 12px;
  background: #56a6f0;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
  cursor: pointer;
`

function RoomDetailCard({ room, onOpenDetail, actionError }) {
  return (
    <Card aria-label={`${room.name} 현황`}>
      <RoomName>{room.name}</RoomName>
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
      <Status $color={actionError ? '#c93a24' : room.status.color}>
        {actionError || !room.status.dot ? null : <StatusDot $color={room.status.dot} />}
        {actionError || room.status.label}
      </Status>
      <OpenButton type="button" onClick={onOpenDetail}>
        상세 내용 보러가기
      </OpenButton>
    </Card>
  )
}

export default RoomDetailCard

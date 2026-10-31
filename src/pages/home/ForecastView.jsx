import { useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import gridLine1500 from '../../assets/images/chart-grid-top.svg'
import gridLine600 from '../../assets/images/chart-grid-mid.svg'
import gridLine1000 from '../../assets/images/chart-grid-bottom.svg'
import predictedSample from '../../assets/images/chart-predicted-sample.png'

const messageColors = {
  alert: '#e5585d',
  warn: '#a04e0c',
  calm: '#3f6e9e',
}

const badgeStyles = {
  now: css`
    background: #fde3e4;
    color: #e5585d;
  `,
  soon: css`
    background: #fcebdd;
    color: #a04e0c;
  `,
  later: css`
    background: #e6eef7;
    color: #3f6e9e;
  `,
}

const yLabelTops = {
  '1,500': '2px',
  '1,000': '56px',
  200: '110px',
}

const Forecast = styled.section`
  position: absolute;
  top: 184px;
  left: 0;
  z-index: 1;
  width: 390px;
`

const Summary = styled.article`
  height: 297px;
  margin: 0 16px;
  padding: 16px 16px 0;
  border: 1px solid #ffffff;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 14px rgba(30, 42, 74, 0.05);
`

const Caption = styled.p`
  margin: 0;
  color: #6d96bc;
  font-size: 11px;
  font-weight: 600;
  line-height: normal;
`

const Title = styled.h2`
  margin: 5px 0 0;
  color: #263e50;
  font-size: 19px;
  font-weight: 700;
  line-height: normal;
`

const Co2Text = styled.p`
  margin: 5px 0 0;
  color: #6d96bc;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;

  strong {
    color: #263e50;
    font-weight: 600;
  }
`

const Plot = styled.div`
  position: relative;
  width: 326px;
  height: 150px;
  margin-top: 16px;
`

const Shade = styled.div`
  position: absolute;
  top: 10px;
  left: 169px;
  width: 149px;
  height: 110px;
  border-radius: 6px;
  background: rgba(229, 242, 255, 0.5);
`

const PlotLine = styled.img`
  position: absolute;
  top: ${({ $top }) => $top};
  left: 28px;
`

const PlotSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 326px;
  height: 150px;
  overflow: visible;
`

const PlotLabel = styled.span`
  position: absolute;
  margin: 0;
  font-size: 10px;
  line-height: normal;
  white-space: nowrap;
`

const YLabel = styled(PlotLabel)`
  top: ${({ $top }) => $top};
  left: 0;
  width: 26px;
  color: #6d96bc;
  font-weight: 400;
  text-align: right;
`

const XLabel = styled(PlotLabel)`
  top: 128px;
  color: #6d96bc;
  font-weight: 400;
  ${({ $place }) =>
    $place === 'start' &&
    css`
      left: 28px;
    `}
  ${({ $place }) =>
    $place === 'mid' &&
    css`
      left: 163px;
      color: #e5585d;
      font-weight: 700;
      transform: translateX(-50%);
    `}
  ${({ $place }) =>
    $place === 'end' &&
    css`
      right: 8px;
    `}
`

const MeasuredValue = styled(PlotLabel)`
  color: #264050;
  font-weight: 600;
  transform: translate(-50%, -100%);
`

const PredictedValue = styled(PlotLabel)`
  color: #56a6f0;
  font-weight: 600;
  transform: translate(-50%, -100%);
`

const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 6px;
  color: #6d96bc;
  font-size: 10px;
  font-weight: 400;
  line-height: normal;
`

const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
`

const MeasuredSample = styled.span`
  width: 15px;
  height: 2px;
  background: #6d96bc;
`

const LegendGuide = styled.span`
  color: #9c8b68;
`

const SectionTitle = styled.h3`
  margin: 20px 0 13px 20px;
  color: #4f6f96;
  font-size: 12px;
  font-weight: 700;
  line-height: normal;
`

const RoomScroller = styled.div`
  display: flex;
  gap: 10px;
  height: 200px;
  padding-bottom: 4px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-padding-left: 16px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const RoomCard = styled.article`
  position: relative;
  flex: 0 0 300px;
  height: 196px;
  border: 1px solid #ffffff;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 4px 14px rgba(30, 42, 74, 0.05);
  scroll-snap-align: start;
  scroll-margin-left: 16px;

  &:first-child {
    margin-left: 16px;
  }

  &:last-child {
    margin-right: 16px;
  }
`

const RoomBadge = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 25px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  line-height: normal;
  white-space: nowrap;
  ${({ $tone }) => badgeStyles[$tone]}
`

const BadgeDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: #e5585d;
`

const RoomName = styled.h4`
  position: absolute;
  top: 16px;
  left: 18px;
  margin: 0;
  color: #1e2a4a;
  font-size: 24px;
  font-weight: 900;
  line-height: 35px;
  letter-spacing: -0.3px;
`

const RoomMessage = styled.p`
  position: absolute;
  top: 53px;
  left: 18px;
  margin: 0;
  color: ${({ $tone }) => messageColors[$tone]};
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
`

const RoomNote = styled.p`
  position: absolute;
  top: 96px;
  left: 18px;
  margin: 0;
  color: #4f5d75;
  font-size: 11px;
  font-weight: 400;
  line-height: normal;
`

const RoomPanel = styled.div`
  position: absolute;
  top: 122px;
  right: 16px;
  left: 16px;
  height: 56px;
  border-radius: 12px;
  background: #ffffff;
`

const RoomMetric = styled.p`
  display: flex;
  align-items: baseline;
  margin: 0;
  padding: 12px 12px 0;
`

const MetricName = styled.span`
  color: #4f5d75;
  font-size: 12px;
  font-weight: 400;
`

const MetricFigure = styled.strong`
  margin-left: auto;
  color: #1e2a4a;
  font-size: 16px;
  font-weight: 700;
`

const MetricUnitText = styled.span`
  color: #4f5d75;
  font-size: 11px;
  font-weight: 400;
`

const RoomTrack = styled.div`
  position: absolute;
  top: 40px;
  right: 12px;
  left: 12px;
  height: 6px;
  border-radius: 3px;
  background: #e3e9f0;
`

const RoomFill = styled.span`
  display: block;
  width: ${({ $width }) => $width};
  height: 6px;
  border-radius: 3px;
  background: ${({ $color }) => $color};
`

const RoomMarker = styled.span`
  position: absolute;
  top: -3px;
  left: ${({ $left }) => $left};
  width: 2px;
  height: 12px;
  background: #1e2a4a;
  transform: translateX(-50%);
`

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
`

const Dot = styled.button`
  width: ${({ $active }) => ($active ? '18px' : '6px')};
  height: 6px;
  padding: 0;
  border: none;
  border-radius: 3px;
  background: ${({ $active }) => ($active ? '#8fa8c0' : '#b9cbe0')};
  cursor: pointer;
`

function co2Y(value) {
  const co2 = Number(value)
  if (!Number.isFinite(co2)) return 120
  const y = co2 >= 1000
    ? 65 - ((co2 - 1000) / 500) * 55
    : 120 - ((co2 - 200) / 800) * 55
  return Math.min(146, Math.max(4, y))
}

function usablePoints(points) {
  return (points ?? []).filter((point) => {
    const co2 = Number(point?.co2)
    const time = new Date(point?.at).getTime()
    return Number.isFinite(co2) && Number.isFinite(time)
  })
}

function plotOnClock(points, start, span) {
  return points.map((point) => ({
    x: 28 + ((new Date(point.at).getTime() - start) / span) * 290,
    y: co2Y(point.co2),
  }))
}

function linePath(points) {
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ')
}

function ForecastView({ data }) {
  const scrollerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  function updateActiveIndex(scroller) {
    const cards = scroller.querySelectorAll('article')
    const center = scroller.scrollLeft + scroller.clientWidth / 2
    let nextIndex = 0
    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      if (Math.abs(cardCenter - center) < Math.abs(cards[nextIndex].offsetLeft + cards[nextIndex].offsetWidth / 2 - center)) {
        nextIndex = index
      }
    })
    setActiveIndex(nextIndex)
  }

  function scrollToCard(index) {
    const scroller = scrollerRef.current
    const card = scroller?.querySelectorAll('article')[index]
    if (!scroller || !card) return
    scroller.scrollTo({ left: card.offsetLeft - 16, behavior: 'smooth' })
  }

  const measuredSource = usablePoints(data.chart.measuredPoints)
  const predictedSource = usablePoints(data.chart.predictedPoints)
  const lastMeasuredAt = measuredSource.length
    ? new Date(measuredSource[measuredSource.length - 1].at).getTime()
    : null
  const future = lastMeasuredAt == null
    ? predictedSource
    : predictedSource.filter((point) => new Date(point.at).getTime() > lastMeasuredAt)
  const timeline = [...measuredSource, ...future]
  const clock = timeline.map((point) => new Date(point.at).getTime())
  const axisFrom = new Date(data.chart.axisFrom).getTime()
  const latest = clock.length ? Math.max(...clock) : axisFrom
  const clockStart = Number.isFinite(axisFrom) ? axisFrom : (clock.length ? Math.min(...clock) : 0)
  const clockSpan = (Number.isFinite(latest) ? Math.max(latest, clockStart) : clockStart) - clockStart || 1
  const measured = plotOnClock(measuredSource, clockStart, clockSpan)
  const predicted = plotOnClock(future, clockStart, clockSpan)
  const dashed = measured.length && predicted.length
    ? [measured[measured.length - 1], ...predicted]
    : predicted
  const measuredLabelAt = measured[measured.length - 1]
  const predictedLabelAt = predicted[predicted.length - 1]
  const nowX = measuredLabelAt?.x ?? 169
  const shadeWidth = Math.max(0, 318 - nowX)

  return (
    <Forecast aria-label="수업 중 예보">
      <Summary>
        <Caption>{data.summary.caption}</Caption>
        <Title>{data.summary.title}</Title>
        <Co2Text>
          {data.summary.co2Lead}
          <strong>{data.summary.co2Value}</strong>
          {data.summary.co2Tail}
        </Co2Text>

        <Plot aria-hidden="true">
          <Shade style={{ left: nowX, width: shadeWidth }} />
          <PlotLine src={gridLine1500} alt="" width="290" height="1" $top="10px" />
          <PlotLine src={gridLine1000} alt="" width="290" height="1" $top="65px" />
          <PlotLine src={gridLine600} alt="" width="290" height="1" $top="120px" />
          <PlotSvg viewBox="0 0 326 150" aria-hidden="true">
            {measured.length > 1 ? (
              <path d={linePath(measured)} fill="none" stroke="#6D96BC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            ) : null}
            {dashed.length > 1 ? (
              <path d={linePath(dashed)} fill="none" stroke="#56A6F0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.5 4" />
            ) : null}
          </PlotSvg>
          {data.chart.yLabels.map((label) => (
            <YLabel key={label} $top={yLabelTops[label]}>{label}</YLabel>
          ))}
          <XLabel $place="start">{data.chart.times[0]}</XLabel>
          <XLabel
            $place="mid"
            style={{
              left: nowX,
              transform: nowX > 260 ? 'translateX(-100%)' : 'translateX(-50%)',
            }}
          >
            {data.chart.times[1]}
          </XLabel>
          <XLabel $place="end">{data.chart.times[2]}</XLabel>
          {measuredLabelAt && data.chart.measuredLabel !== '—' ? (
            <MeasuredValue style={{ left: measuredLabelAt.x, top: measuredLabelAt.y - 4 }}>
              {data.chart.measuredLabel}
            </MeasuredValue>
          ) : null}
          {predictedLabelAt && data.chart.predictedLabel !== '—' ? (
            <PredictedValue style={{ left: predictedLabelAt.x, top: predictedLabelAt.y - 4 }}>
              {data.chart.predictedLabel}
            </PredictedValue>
          ) : null}
        </Plot>

        <Legend>
          <LegendItem>
            <MeasuredSample />
            {data.chart.legendMeasured}
          </LegendItem>
          <LegendItem>
            <img src={predictedSample} alt="" width="17" height="2" />
            {data.chart.legendPredicted}
          </LegendItem>
          <LegendGuide>{data.chart.legendGuide}</LegendGuide>
        </Legend>
      </Summary>

      <SectionTitle>{data.sectionTitle}</SectionTitle>

      <RoomScroller ref={scrollerRef} onScroll={(event) => updateActiveIndex(event.currentTarget)}>
        {data.rooms.map((room) => (
          <RoomCard key={room.id}>
            {room.badge && (
              <RoomBadge $tone={room.badge.tone}>
                {room.badge.tone === 'now' && <BadgeDot />}
                {room.badge.text}
              </RoomBadge>
            )}
            <RoomName>{room.name}</RoomName>
            <RoomMessage $tone={room.messageTone}>{room.message}</RoomMessage>
            <RoomNote>{room.note}</RoomNote>
            <RoomPanel>
              <RoomMetric>
                <MetricName>{room.metricLabel}</MetricName>
                <MetricFigure>{room.metricValue}</MetricFigure>
                <MetricUnitText>{room.metricUnit}</MetricUnitText>
              </RoomMetric>
              <RoomTrack>
                <RoomFill $width={`${room.barPercent}%`} $color={room.barColor} />
                <RoomMarker $left={`${room.markerPercent}%`} />
              </RoomTrack>
            </RoomPanel>
          </RoomCard>
        ))}
      </RoomScroller>

      <Dots>
        {data.rooms.map((room, index) => (
          <Dot
            key={room.id}
            type="button"
            $active={index === activeIndex}
            aria-label={`${room.name} 카드로 이동`}
            onClick={() => scrollToCard(index)}
          />
        ))}
      </Dots>
    </Forecast>
  )
}

export default ForecastView

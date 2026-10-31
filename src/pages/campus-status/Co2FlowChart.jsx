import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getRoomMeasuredReadings, getRoomPredictions } from '../../api/home.js'
import { getMySettings } from '../../api/settingspage.js'

const plotWidth = 326
const plotHeight = 112
const padX = 14
const yMin = 400
const twoHours = 2 * 60 * 60 * 1000
const fiveMinutes = 5 * 60 * 1000
const tenMinutes = 10 * 60 * 1000

const Frame = styled.div`
  position: relative;
  width: ${plotWidth}px;
  height: 136px;
`

const Plot = styled.svg`
  display: block;
  width: ${plotWidth}px;
  height: ${plotHeight}px;
`

const ThresholdText = styled.span`
  position: absolute;
  right: 0;
  color: #f75255;
  font-family: Inter, 'Noto Sans KR', sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 12px;
  white-space: nowrap;
`

const Tick = styled.span`
  position: absolute;
  top: 118px;
  color: ${({ $now }) => ($now ? '#263e50' : '#6d96bc')};
  font-family: Inter, 'Noto Sans KR', sans-serif;
  font-size: 10px;
  font-weight: ${({ $now }) => ($now ? 700 : 400)};
  line-height: normal;
  white-space: nowrap;
  transform: translateX(-50%);
`

function pad(value) {
  return String(value).padStart(2, '0')
}

function stamp(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function parseLocal(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.getTime()
}

function atHour(base, hour) {
  const date = new Date(base)
  date.setHours(hour, 0, 0, 0)
  return date.getTime()
}

function toPoints(list) {
  return (list ?? [])
    .map((item) => {
      const at = parseLocal(item?.at)
      const co2 = Number(item?.co2)
      if (at == null || !Number.isFinite(co2)) return null
      return { at, co2 }
    })
    .filter(Boolean)
    .sort((left, right) => left.at - right.at)
}

function bucketFive(points) {
  const buckets = new Map()
  points.forEach((point) => {
    const date = new Date(point.at)
    date.setMinutes(date.getMinutes() - (date.getMinutes() % 5), 0, 0)
    const key = date.getTime()
    if (!buckets.has(key)) buckets.set(key, { at: key, co2: point.co2 })
  })
  return [...buckets.values()].sort((left, right) => left.at - right.at)
}

function measuredSegments(points) {
  const groups = []
  let current = []
  points.forEach((point) => {
    const previous = current[current.length - 1]
    if (previous && point.at - previous.at > tenMinutes) {
      groups.push(current)
      current = [point]
      return
    }
    current.push(point)
  })
  if (current.length) groups.push(current)
  return groups
}

function yMaxOf(values) {
  const finite = values.filter((value) => Number.isFinite(value))
  const peak = finite.length ? Math.max(...finite) : 0
  const raised = Math.max(1200, peak + 100)
  return Math.ceil(raised / 100) * 100
}

function firstOverBand(points, threshold, windowStart, windowEnd) {
  const startIndex = points.findIndex((point) => point.co2 > threshold)
  if (startIndex < 0) return null
  let end = points[startIndex].at
  for (let index = startIndex + 1; index < points.length; index += 1) {
    if (points[index].co2 <= threshold) break
    end = points[index].at
  }
  let start = points[startIndex].at
  if (end - start < fiveMinutes) {
    const middle = (start + end) / 2
    start = middle - fiveMinutes / 2
    end = middle + fiveMinutes / 2
  }
  start = Math.max(windowStart, start)
  end = Math.min(windowEnd, end)
  if (end <= start) return null
  return { start, end }
}

function chartWindow(now) {
  const windowStart = atHour(now, 9)
  const windowEnd = atHour(now, 18)
  const measuredTo = now >= windowEnd ? windowEnd + 1000 : now
  const predictFrom = now < windowStart ? windowStart : now
  const predictTo = Math.min(windowEnd, predictFrom + twoHours)
  return {
    now,
    windowStart,
    windowEnd,
    measuredFrom: now >= windowStart ? windowStart : null,
    measuredTo: now >= windowStart ? measuredTo : null,
    predictFrom: now < windowEnd && predictTo > predictFrom ? predictFrom : null,
    predictTo: now < windowEnd && predictTo > predictFrom ? predictTo : null,
    showNow: now >= windowStart && now <= windowEnd,
  }
}

async function loadChart(roomId, now) {
  const range = chartWindow(now)
  const jobs = [
    getMySettings().catch(() => null),
    range.measuredFrom == null
      ? Promise.resolve(null)
      : getRoomMeasuredReadings(roomId, {
          from: stamp(new Date(range.measuredFrom)),
          to: stamp(new Date(range.measuredTo)),
          interval: 5,
        }).catch(() => null),
    range.predictFrom == null
      ? Promise.resolve(null)
      : getRoomPredictions(roomId, {
          from: stamp(new Date(range.predictFrom)),
          to: stamp(new Date(range.predictTo)),
        }).catch(() => null),
  ]
  const [settings, measured, predicted] = await Promise.all(jobs)
  const threshold = Number(settings?.data?.co2Threshold)
  const measuredPoints = toPoints(measured?.data?.points).filter(
    (point) => point.at >= range.windowStart && point.at <= range.windowEnd,
  )
  const predictedPoints = bucketFive(
    toPoints(predicted?.data?.points).filter(
      (point) => range.predictFrom != null && point.at >= range.predictFrom && point.at <= range.predictTo,
    ),
  )
  const lastMeasured = measuredPoints[measuredPoints.length - 1]
  const forecast = predictedPoints.filter((point) => !lastMeasured || point.at > lastMeasured.at)
  const dashed = lastMeasured && forecast.length
    ? [{ at: lastMeasured.at, co2: lastMeasured.co2 }, ...forecast]
    : forecast
  return {
    ...range,
    threshold: Number.isFinite(threshold) && threshold > 0 ? threshold : 1000,
    measuredPoints,
    dashed,
    series: [...measuredPoints, ...forecast],
  }
}

function previewChart508(chart, roomNumber) {
  if (String(roomNumber) !== '508' || !chart?.measuredPoints?.length) return chart
  const lastIndex = chart.measuredPoints.length - 1
  const measuredPoints = chart.measuredPoints.map((point, index) => (
    index === lastIndex ? { ...point, co2: 950 } : point
  ))
  const dashed = chart.dashed.map((point, index) => (index === 0 ? { ...point, co2: 950 } : point))
  const forecast = chart.series.slice(chart.measuredPoints.length)
  return {
    ...chart,
    measuredPoints,
    dashed,
    series: [...measuredPoints, ...forecast],
  }
}

function Co2FlowChart({ roomId, roomNumber }) {
  const [chart, setChart] = useState(null)

  useEffect(() => {
    if (roomId == null || roomId === '') return undefined
    let cancelled = false

    const load = () => {
      loadChart(roomId, Date.now())
        .then((next) => {
          if (!cancelled) setChart(previewChart508(next, roomNumber))
        })
        .catch(() => {})
    }

    load()
    const timer = setInterval(load, 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [roomId, roomNumber])

  const now = chart?.now ?? Date.now()
  const windowStart = chart?.windowStart ?? atHour(now, 9)
  const windowEnd = chart?.windowEnd ?? atHour(now, 18)
  const showNow = chart?.showNow ?? (now >= windowStart && now <= windowEnd)
  const threshold = chart?.threshold ?? 1000
  const measuredPoints = chart?.measuredPoints ?? []
  const dashed = chart?.dashed ?? []
  const yMax = yMaxOf([...(chart?.series ?? []).map((point) => point.co2)])
  const span = windowEnd - windowStart || 1

  const xOf = (time) => padX + ((time - windowStart) / span) * (plotWidth - padX * 2)
  const yOf = (value) => {
    const clamped = Math.min(yMax, Math.max(yMin, value))
    return plotHeight - ((clamped - yMin) / (yMax - yMin)) * (plotHeight - 8) - 4
  }

  const band = firstOverBand(chart?.series ?? [], threshold, windowStart, windowEnd)
  const segments = measuredSegments(measuredPoints)
  const lastMeasured = measuredPoints[measuredPoints.length - 1]
  const ticks = [9, 12, 15, 18].filter((hour) => {
    if (!showNow) return true
    return Math.abs(atHour(now, hour) - now) > 30 * 60 * 1000
  })

  const line = (points) => points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${xOf(point.at).toFixed(1)} ${yOf(point.co2).toFixed(1)}`)
    .join(' ')

  return (
    <Frame>
      <Plot viewBox={`0 0 ${plotWidth} ${plotHeight}`} aria-hidden="true">
        {band ? (
          <rect
            x={xOf(band.start)}
            y="0"
            width={Math.max(2, xOf(band.end) - xOf(band.start))}
            height={plotHeight}
            fill="#56A6F0"
            fillOpacity="0.1"
          />
        ) : null}
        {threshold >= yMin && threshold <= yMax ? (
          <line
            x1="0"
            x2={plotWidth}
            y1={yOf(threshold)}
            y2={yOf(threshold)}
            stroke="#F75255"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
        ) : null}
        {segments.map((group) => (
          group.length > 1 ? (
            <path key={group[0].at} d={line(group)} fill="none" stroke="#319BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <circle key={group[0].at} cx={xOf(group[0].at)} cy={yOf(group[0].co2)} r="2.5" fill="#319BFF" />
          )
        ))}
        {dashed.length > 1 ? (
          <path d={line(dashed)} fill="none" stroke="#6D96BC" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round" />
        ) : null}
        {showNow ? (
          <line x1={xOf(now)} x2={xOf(now)} y1="0" y2={plotHeight} stroke="#6D96BC" strokeWidth="1" />
        ) : null}
        {showNow && lastMeasured ? (
          <circle cx={xOf(lastMeasured.at)} cy={yOf(lastMeasured.co2)} r="4.2" fill="#ffffff" stroke="#F75255" strokeWidth="2" />
        ) : null}
      </Plot>
      {threshold >= yMin && threshold <= yMax ? (
        <ThresholdText style={{ top: Math.min(plotHeight - 14, Math.max(0, yOf(threshold) - 6)) }}>
          {`${Number(threshold).toLocaleString('ko-KR')}ppm`}
        </ThresholdText>
      ) : null}
      {ticks.map((hour) => (
        <Tick key={hour} style={{ left: xOf(atHour(now, hour)) }}>
          {hour}시
        </Tick>
      ))}
      {showNow ? <Tick $now style={{ left: xOf(now) }}>지금</Tick> : null}
    </Frame>
  )
}

export default Co2FlowChart

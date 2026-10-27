import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Home from './pages/home/Home.jsx'
import CampusStatus from './pages/campus-status/CampusStatus.jsx'
import Inbox from './pages/inbox/Inbox.jsx'
import CampusTalk from './pages/campus-talk/CampusTalk.jsx'
import Onboarding from './pages/onboarding/Onboarding.jsx'
import StudentComplaint from './pages/complaint/StudentComplaint.jsx'
import { getMyZones, mapMyZones, saveMyZones } from './api/settingspage.js'

function readComplaintCode() {
  const url = new URL(window.location.href)
  const path = url.pathname.replace(/\/$/, '') || '/'
  if (path !== '/complaint') return null
  return url.searchParams.get('code') || ''
}

const Gate = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100dvh;
  padding: 24px;
  background: #ebf3ff;
  color: #2f3e4e;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
`

function App() {
  const complaintCode = readComplaintCode()
  const [page, setPage] = useState('home')
  const [zones, setZones] = useState([])
  const [zoneState, setZoneState] = useState('loading')
  const [zoneError, setZoneError] = useState('')

  useEffect(() => {
    let cancelled = false

    getMyZones()
      .then((payload) => {
        if (cancelled) return
        const next = mapMyZones(payload.data)
        setZones(next)
        setZoneState(next.length ? 'ready' : 'onboarding')
      })
      .catch((error) => {
        if (cancelled) return
        setZoneError(error.message || '담당 구역을 불러오지 못했습니다.')
        setZoneState('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (complaintCode !== null) {
    return <StudentComplaint code={complaintCode} />
  }

  if (zoneState === 'loading') {
    return <Gate>담당 구역을 확인하고 있어요</Gate>
  }

  if (zoneState === 'error') {
    return <Gate>{zoneError}</Gate>
  }

  if (zoneState === 'onboarding') {
    return (
      <Onboarding
        onDone={async (zone) => {
          const floors = Array.isArray(zone?.floors) ? zone.floors : []
          if (zone?.building === '북악관' || floors.length > 0) {
            try {
              const payload = await saveMyZones([{ building: '북악관', buildingId: 1, floors }])
              setZones(mapMyZones(payload.data))
            } catch (error) {
              setZoneError(error.message || '담당 구역을 저장하지 못했습니다.')
              setZoneState('error')
              return
            }
          }
          setZoneState('ready')
        }}
      />
    )
  }

  if (page === 'campus') {
    return <CampusStatus onNavigate={setPage} />
  }

  if (page === 'inbox') {
    return <Inbox onNavigate={setPage} />
  }

  if (page === 'talk') {
    return <CampusTalk onNavigate={setPage} />
  }

  return <Home onNavigate={setPage} zones={zones} onZonesChange={setZones} />
}

export default App

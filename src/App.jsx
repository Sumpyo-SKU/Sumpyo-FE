import { useState } from 'react'
import Home from './pages/home/Home.jsx'
import CampusStatus from './pages/campus-status/CampusStatus.jsx'
import Inbox from './pages/inbox/Inbox.jsx'
import CampusTalk from './pages/campus-talk/CampusTalk.jsx'
import Onboarding from './pages/onboarding/Onboarding.jsx'

// 테스트 중에는 완료 여부를 저장하지 않는다. 새로고침하면 온보딩부터 다시 나온다.
localStorage.removeItem('sumpyo-onboarded')

function App() {
  const [page, setPage] = useState('home')
  const [onboarded, setOnboarded] = useState(false)
  const [zones, setZones] = useState([])

  if (!onboarded) {
    return (
      <Onboarding
        onDone={(zone) => {
          const floors = Array.isArray(zone?.floors) ? zone.floors : []
          if (zone?.building === '북악관' || floors.length > 0) {
            setZones([{ building: '북악관', floors: [...floors].sort((left, right) => left - right) }])
          }
          setOnboarded(true)
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

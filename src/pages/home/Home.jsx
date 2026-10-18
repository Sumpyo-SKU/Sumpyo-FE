import Header from '../../common/Header/Header.jsx'
import Footer from '../../common/Footer/Footer.jsx'
import Card from '../../components/Card/Card.jsx'
import bgEllipse1 from '../../assets/images/bg-ellipse-1.svg'
import bgEllipse2 from '../../assets/images/bg-ellipse-2.svg'
import bgEllipse3 from '../../assets/images/bg-ellipse-3.svg'
import bgEllipse4 from '../../assets/images/bg-ellipse-4.svg'
import bgEllipse5 from '../../assets/images/bg-ellipse-5.svg'
import statusTime from '../../assets/images/status-time.svg'
import statusSignal from '../../assets/images/status-signal.svg'
import statusWifi from '../../assets/images/status-wifi.svg'
import statusBattery from '../../assets/images/status-battery.svg'
import statusIndicator from '../../assets/images/status-indicator.svg'
import gaugeImage from '../../assets/images/gauge.svg'
import characterBase from '../../assets/images/character-base.png'
import characterLeaf from '../../assets/images/character-leaf.png'
import characterWind from '../../assets/images/character-wind.png'
import characterPlug from '../../assets/images/character-plug.png'
import co2Icon from '../../assets/images/icon-co2.svg'
import temperatureIcon from '../../assets/images/icon-temperature.svg'
import humidityIcon from '../../assets/images/icon-humidity.svg'
import dividerLine from '../../assets/images/divider-line.svg'
import dustIcon from '../../assets/images/icon-dust.svg'
import outdoorTempIcon from '../../assets/images/icon-outdoor-temp.svg'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <div className="home-screen">
        <div className="home-bg" aria-hidden="true">
          <img className="bg-ellipse bg-ellipse-1" src={bgEllipse1} alt="" width="925" height="922" />
          <img className="bg-ellipse bg-ellipse-2" src={bgEllipse2} alt="" width="1009" height="1009" />
          <img className="bg-ellipse bg-ellipse-3" src={bgEllipse3} alt="" width="1109" height="1109" />
          <img className="bg-ellipse bg-ellipse-4" src={bgEllipse4} alt="" width="768" height="768" />
          <img className="bg-ellipse bg-ellipse-5" src={bgEllipse5} alt="" width="1109" height="1109" />
        </div>

        <div className="status-bar" aria-hidden="true">
          <img className="status-time" src={statusTime} alt="" width="33" height="15" />
          <img className="status-indicator" src={statusIndicator} alt="" width="6" height="6" />
          <img className="status-signal" src={statusSignal} alt="" width="20" height="14" />
          <img className="status-wifi" src={statusWifi} alt="" width="16" height="14" />
          <img className="status-battery" src={statusBattery} alt="" width="25" height="14" />
        </div>

        <Header />

        <main className="home-main">
          <div className="segment">
            <span className="segment-thumb" />
            <span className="segment-item is-selected">지금</span>
            <span className="segment-item">수업 중 예보</span>
          </div>

          <p className="score">
            <span className="score-value">86</span>
            <span className="score-suffix"> / 100 쾌적도</span>
          </p>

          <div className="hero">
            <img className="gauge" src={gaugeImage} alt="" width="296" height="226.933" />
            <div className="character">
              <img className="character-base" src={characterBase} alt="쾌적도를 나타내는 캐릭터" />
              <div className="character-leaf">
                <img src={characterLeaf} alt="" />
              </div>
              <div className="character-wind">
                <img src={characterWind} alt="" />
              </div>
              <div className="character-plug">
                <img src={characterPlug} alt="" />
              </div>
            </div>
          </div>

          <Card variant="metric" className="metrics-card">
            <div className="metric">
              <img src={co2Icon} alt="" width="24" height="24" />
              <span className="metric-label">CO₂</span>
              <p className="metric-value">
                <span className="metric-number">640</span>
                <span className="metric-unit metric-unit-ppm">ppm</span>
              </p>
            </div>
            <div className="metric-divider">
              <img src={dividerLine} alt="" width="80" height="0.7" />
            </div>
            <div className="metric">
              <img src={temperatureIcon} alt="" width="24" height="24" />
              <span className="metric-label">교실 온도</span>
              <p className="metric-value">
                <span className="metric-number">24</span>
                <span className="metric-unit">°C</span>
              </p>
            </div>
            <div className="metric-divider">
              <img src={dividerLine} alt="" width="80" height="0.7" />
            </div>
            <div className="metric">
              <img src={humidityIcon} alt="" width="24" height="24" />
              <span className="metric-label">습도</span>
              <p className="metric-value">
                <span className="metric-number">48</span>
                <span className="metric-unit">%</span>
              </p>
            </div>
          </Card>

          <p className="air-label">바깥 공기 · 창문 환기</p>

          <div className="outdoor-row">
            <Card variant="outdoor">
              <img src={dustIcon} alt="" width="35" height="35" />
              <div className="outdoor-copy">
                <span className="outdoor-name">미세먼지 농도</span>
                <p className="outdoor-value">
                  <span className="outdoor-number">28</span>
                  <span className="outdoor-unit">㎍/㎥</span>
                </p>
              </div>
            </Card>
            <Card variant="outdoor">
              <img src={outdoorTempIcon} alt="" width="35" height="35" />
              <div className="outdoor-copy">
                <span className="outdoor-name">실외 온도</span>
                <p className="outdoor-value">
                  <span className="outdoor-number">18</span>
                  <span className="outdoor-unit">°C</span>
                </p>
              </div>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default Home

import { useState } from 'react'
import styled, { css } from 'styled-components'
import backIcon from '../../assets/images/icon-settings-back.svg'
import ellipseBottom from '../../assets/images/bg-edit-ellipse.svg'
import ellipseTop from '../../assets/images/bg-settings-ellipse.svg'
import minusIcon from '../../assets/images/icon-threshold-minus.svg'
import plusIcon from '../../assets/images/icon-threshold-plus.svg'
import infoIcon from '../../assets/images/icon-threshold-info.svg'
import chevronIcon from '../../assets/images/icon-threshold-chevron.svg'
import knobIcon from '../../assets/images/icon-toggle-knob.svg'
import statusTime from '../../assets/images/status-time.svg'
import statusSignal from '../../assets/images/status-signal.svg'
import statusWifi from '../../assets/images/status-wifi.svg'
import statusBattery from '../../assets/images/status-battery.svg'
import statusIndicator from '../../assets/images/status-indicator.svg'

const MIN_PPM = 600
const MAX_PPM = 1500
const STEP = 50
const DEFAULTS = { ppm: 1000, fan: true, lead: 15 }

const presets = [
  { value: 800, label: '쾌적 우선' },
  { value: 1000, label: '권장' },
  { value: 1200, label: '에너지 절약' },
]

const marks = [
  { value: 600, label: '600', left: '0' },
  { value: 800, label: '800', left: '19.38%' },
  { value: 1000, label: '1,000', left: '40.16%' },
  { value: 1500, label: '1,500', right: '0' },
]

const leads = [10, 15, 20]

function formatNumber(value) {
  return value.toLocaleString('en-US')
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

const Main = styled.main`
  position: absolute;
  top: 115px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  overflow: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

const Glass = styled.section`
  margin: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.38);
  backdrop-filter: blur(12px);
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
`

const CardTitle = styled.h2`
  margin: 0;
  padding: 20px 24px 0;
  color: #161a2b;
  font-size: 17px;
  font-weight: 600;
  line-height: 22px;
`

const CardHint = styled.p`
  margin: 4px 0 0;
  padding: 0 24px;
  color: #5f6a8f;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`

const Stepper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding: 0 18px;
`

const StepButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: inset 0 1px 0 #ffffff;
  cursor: pointer;
`

const ValueGroup = styled.p`
  margin: 0;
  color: #1d2752;
  font-size: 40px;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: -1px;
`

const Unit = styled.span`
  color: #5f6a8f;
  font-size: 15px;
  font-weight: 500;
  line-height: 15px;
  letter-spacing: -1px;
`

const SliderBox = styled.div`
  position: relative;
  height: 44px;
  margin: 16px 18px 0;
`

const Track = styled.div`
  position: absolute;
  top: 14px;
  right: 0;
  left: 0;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, #7fd3b9 0%, #8fb3ff 35%, #efe585 62%, #ef8a6a 100%);
  opacity: 0.85;
  pointer-events: none;
`

const Range = styled.input`
  position: absolute;
  top: 4px;
  left: 0;
  width: 100%;
  height: 28px;
  margin: 0;
  background: transparent;
  cursor: pointer;
  appearance: none;

  &::-webkit-slider-runnable-track {
    height: 28px;
    background: transparent;
    -webkit-appearance: none;
  }

  &::-webkit-slider-thumb {
    width: 28px;
    height: 28px;
    margin-top: 0;
    border: 3px solid #3398f5;
    border-radius: 14px;
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(74, 87, 236, 0.35);
    -webkit-appearance: none;
    appearance: none;
  }

  &::-moz-range-track {
    height: 28px;
    border: none;
    background: transparent;
  }

  &::-moz-range-thumb {
    width: 28px;
    height: 28px;
    border: 3px solid #3398f5;
    border-radius: 14px;
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(74, 87, 236, 0.35);
  }
`

const Marks = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 15px;
  pointer-events: none;
`

const Mark = styled.span`
  position: absolute;
  top: 0;
  color: ${({ $active }) => ($active ? '#3398f5' : '#6a7598')};
  font-size: 10px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  line-height: 15px;
  ${({ $left }) => $left !== undefined && css`left: ${$left};`}
  ${({ $right }) => $right !== undefined && css`right: ${$right};`}
`

const Presets = styled.div`
  display: flex;
  gap: 6px;
  margin: 16px 18px 18px;
`

const Preset = styled.button`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 56px;
  margin: 0;
  padding: 0;
  border-radius: 16px;
  cursor: pointer;
  ${({ $on }) =>
    $on
      ? css`
          border: 2px solid #56a6f0;
          background: rgba(255, 255, 255, 0.85);
          box-shadow: 0 6px 16px rgba(79, 99, 242, 0.18);
        `
      : css`
          border: 1px solid rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.55);
        `}
`

const PresetValue = styled.span`
  color: ${({ $on }) => ($on ? '#436d94' : '#6c8aa6')};
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
`

const PresetLabel = styled.span`
  color: ${({ $on }) => ($on ? '#428bce' : '#5f6a8f')};
  font-size: 11px;
  font-weight: ${({ $on }) => ($on ? 600 : 400)};
  line-height: 17px;
`

const Info = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  height: 56px;
  margin: 20px 16px 0;
  padding: 10px 12px;
  border-radius: 14px;
  background: #cde7ff;
`

const InfoText = styled.p`
  margin: 0;
  color: #29649b;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`

const Panel = styled.section`
  margin: 21px 16px 0;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow:
    0 8px 32px rgba(60, 80, 160, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
`

const ClimatePanel = styled(Panel)`
  margin-top: 17px;
`

const FanPanel = styled(Panel)`
  margin-top: 17px;
  padding-bottom: 16px;
`

const LevelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 64px;
  padding: 14px 18px;

  & + & {
    min-height: 58px;
    border-top: 1px solid rgba(255, 255, 255, 0.75);
  }
`

const LevelTitle = styled.p`
  margin: 0;
  color: #1d2752;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
`

const LevelHint = styled.p`
  margin: 0;
  color: #5f6a8f;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`

const Pill = styled.span`
  display: flex;
  flex: none;
  align-items: center;
  height: 27px;
  padding: 0 10px;
  border-radius: 999px;
  background: ${({ $tone }) => ($tone === 'severe' ? '#fde6e2' : '#fff3dc')};
  color: ${({ $tone }) => ($tone === 'severe' ? '#b3321e' : '#8a5300')};
  font-size: 13px;
  font-weight: 700;
  line-height: 19px;
  white-space: nowrap;
`

const ClimateRow = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 18px;

  & + & {
    border-top: 1px solid rgba(255, 255, 255, 0.75);
  }
`

const ClimateLabel = styled.span`
  color: #1d2752;
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
`

const ClimateValue = styled.span`
  margin-right: 12px;
  margin-left: auto;
  color: #6a7598;
  font-size: 13px;
  font-weight: 400;
  line-height: 19px;
`

const FanHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 18px 0;
`

const FanTitle = styled.p`
  margin: 0;
  color: #1d2752;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
`

const FanHint = styled.p`
  margin: 0;
  color: #5f6a8f;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
`

const FanQuestion = styled.p`
  margin: 16px 18px 0;
  color: #3e4870;
  font-size: 13px;
  font-weight: 600;
  line-height: 19px;
`

const Switch = styled.button`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: ${({ $on }) => ($on ? 'flex-end' : 'flex-start')};
  width: 48px;
  height: 27px;
  margin: 2px 0 0;
  padding: 2px;
  border: none;
  border-radius: 30px;
  background: ${({ $on }) => ($on ? '#56a6f0' : '#d5e2ee')};
  cursor: pointer;
`

const LeadGroup = styled.div`
  display: flex;
  height: 46px;
  margin: 12px 18px 0;
  padding: 4px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.5);
`

const LeadButton = styled.button`
  flex: 1;
  margin: 0;
  border: none;
  border-radius: 10px;
  background: ${({ $on }) => ($on ? '#ffffff' : 'transparent')};
  box-shadow: ${({ $on }) => ($on ? '0 1px 2px rgba(22, 26, 43, 0.1)' : 'none')};
  color: ${({ $on }) => ($on ? '#47535f' : '#5f6a8f')};
  font-size: 13px;
  font-weight: ${({ $on }) => ($on ? 700 : 400)};
  line-height: 19px;
  cursor: pointer;
`

const SaveButton = styled.button`
  display: block;
  width: calc(100% - 32px);
  height: 56px;
  margin: 27px 16px 0;
  border: none;
  border-radius: 20px;
  background: #56a6f0;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  cursor: pointer;
`

const ResetButton = styled.button`
  display: block;
  margin: 14px auto 40px;
  padding: 0;
  border: none;
  background: transparent;
  color: #5f6a8f;
  font-size: 13px;
  font-weight: 400;
  line-height: 19px;
  cursor: pointer;
`

function ThresholdPage({ saved, onBack, onSave }) {
  const [ppm, setPpm] = useState(saved.ppm)
  const [fan, setFan] = useState(saved.fan)
  const [lead, setLead] = useState(saved.lead)
  const caution = Math.round(ppm * 0.9)
  const severe = Math.round(ppm * 1.2)

  function setClamped(next) {
    setPpm(Math.min(MAX_PPM, Math.max(MIN_PPM, next)))
  }

  return (
    <PageRoot>
      <Screen>
        <Ellipse src={ellipseBottom} alt="" width="875" height="875" $top="410px" $left="-252px" />
        <Ellipse src={ellipseTop} alt="" width="875" height="875" $top="-326px" $left="-35px" />
        <StatusBar aria-hidden="true">
          <StatusIcon src={statusTime} alt="" width="33" height="15" $top="15px" $left="31px" />
          <StatusIcon src={statusIndicator} alt="" width="6" height="6" $top="8px" $right="71px" />
          <StatusIcon src={statusSignal} alt="" width="20" height="14" $top="16px" $right="63px" />
          <StatusIcon src={statusWifi} alt="" width="16" height="14" $top="16px" $right="43px" />
          <StatusIcon src={statusBattery} alt="" width="25" height="14" $top="16px" $right="14px" />
        </StatusBar>

        <BackButton type="button" aria-label="설정으로 돌아가기" onClick={onBack}>
          <BackIcon src={backIcon} alt="" width="37" height="37" />
        </BackButton>
        <Title>환기 기준값 설정</Title>

        <Main>
          <Glass>
            <CardTitle>CO₂ 환기 기준</CardTitle>
            <CardHint>이 값을 넘을 것으로 예측되면 알림이 전송돼요</CardHint>
            <Stepper>
              <StepButton type="button" aria-label="50ppm 내리기" onClick={() => setClamped(ppm - STEP)}>
                <img src={minusIcon} alt="" width="22" height="22" />
              </StepButton>
              <ValueGroup>
                {formatNumber(ppm)}
                <Unit> ppm</Unit>
              </ValueGroup>
              <StepButton type="button" aria-label="50ppm 올리기" onClick={() => setClamped(ppm + STEP)}>
                <img src={plusIcon} alt="" width="22" height="22" />
              </StepButton>
            </Stepper>
            <SliderBox>
              <Track />
              <Range
                type="range"
                min={MIN_PPM}
                max={MAX_PPM}
                step={STEP}
                value={ppm}
                aria-label="CO2 환기 기준"
                onChange={(event) => setClamped(Number(event.target.value))}
              />
              <Marks>
                {marks.map((mark) => (
                  <Mark key={mark.value} $active={ppm === mark.value} $left={mark.left} $right={mark.right}>
                    {mark.label}
                  </Mark>
                ))}
              </Marks>
            </SliderBox>
            <Presets>
              {presets.map((preset) => (
                <Preset
                  key={preset.value}
                  type="button"
                  $on={ppm === preset.value}
                  aria-pressed={ppm === preset.value}
                  onClick={() => setPpm(preset.value)}
                >
                  <PresetValue $on={ppm === preset.value}>{formatNumber(preset.value)}</PresetValue>
                  <PresetLabel $on={ppm === preset.value}>{preset.label}</PresetLabel>
                </Preset>
              ))}
            </Presets>
          </Glass>

          <Info>
            <img src={infoIcon} alt="" width="16" height="16" />
            <InfoText>
              국내 다중이용시설 실내공기질 유지기준이 1,000ppm이
              <br />
              에요
            </InfoText>
          </Info>

          <Panel>
            <LevelRow>
              <div>
                <LevelTitle>주의 표시 시작</LevelTitle>
                <LevelHint>기준의 90%부터 노란색으로 표시해요</LevelHint>
              </div>
              <Pill>{formatNumber(caution)} ppm</Pill>
            </LevelRow>
            <LevelRow>
              <div>
                <LevelTitle>심각 표시 시작</LevelTitle>
                <LevelHint>기준의 120%부터 빨간색으로 표시해요</LevelHint>
              </div>
              <Pill $tone="severe">{formatNumber(severe)} ppm</Pill>
            </LevelRow>
          </Panel>

          <ClimatePanel>
            <ClimateRow>
              <ClimateLabel>적정 온도</ClimateLabel>
              <ClimateValue>20 – 26°C</ClimateValue>
              <img src={chevronIcon} alt="" width="18" height="18" />
            </ClimateRow>
            <ClimateRow>
              <ClimateLabel>적정 습도</ClimateLabel>
              <ClimateValue>40 – 60%</ClimateValue>
              <img src={chevronIcon} alt="" width="18" height="18" />
            </ClimateRow>
          </ClimatePanel>

          <FanPanel>
            <FanHead>
              <div>
                <FanTitle>예측되면 환풍기 알림 보내기</FanTitle>
                <FanHint>기준을 넘기 전에 자동으로 가동해요</FanHint>
              </div>
              <Switch
                type="button"
                role="switch"
                aria-checked={fan}
                aria-label="예측되면 환풍기 알림 보내기"
                $on={fan}
                onClick={() => setFan((on) => !on)}
              >
                <img src={knobIcon} alt="" width="23" height="23" />
              </Switch>
            </FanHead>
            <FanQuestion>초과 예상 몇 분 전에 켤까요?</FanQuestion>
            <LeadGroup role="radiogroup" aria-label="미리 켜는 시간">
              {leads.map((minutes) => (
                <LeadButton
                  key={minutes}
                  type="button"
                  role="radio"
                  aria-checked={lead === minutes}
                  $on={lead === minutes}
                  onClick={() => setLead(minutes)}
                >
                  {minutes}분 전
                </LeadButton>
              ))}
            </LeadGroup>
          </FanPanel>

          <SaveButton type="button" onClick={() => onSave({ ppm, fan, lead })}>
            저장하기
          </SaveButton>
          <ResetButton
            type="button"
            onClick={() => {
              setPpm(DEFAULTS.ppm)
              setFan(DEFAULTS.fan)
              setLead(DEFAULTS.lead)
            }}
          >
            기본값으로 되돌리기
          </ResetButton>
        </Main>
      </Screen>
    </PageRoot>
  )
}

export default ThresholdPage

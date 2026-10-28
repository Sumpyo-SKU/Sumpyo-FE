import { signup, saveAuthSession, login, checkLoginId } from '../../api/auth.js'
import { useState } from 'react'
import styled from 'styled-components'
import logoImage from '../../assets/images/onboarding-logo.png'
import runImage from '../../assets/images/onboarding-run.png'

function validPassword(value) {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,64}$/.test(value)
}

const Logo = styled.img`
  position: absolute;
  top: 86px;
  left: 114px;
  z-index: 2;
  object-fit: cover;
`

const Slogan = styled.p`
  position: absolute;
  top: 188px;
  right: 0;
  left: 0;
  z-index: 2;
  margin: 0;
  color: #5f6a8f;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
`

const Character = styled.img`
  position: absolute;
  top: ${({ $top }) => $top};
  left: 271px;
  z-index: 2;
  object-fit: contain;
  pointer-events: none;
`

const Field = styled.input`
  position: absolute;
  top: ${({ $top }) => $top};
  left: 32px;
  width: 326px;
  height: 45px;
  padding: 0 19px;
  border: 1px solid #56a6f0;
  border-radius: 50px;
  background: #ffffff;
  color: #161a2b;
  font: inherit;
  font-size: 13px;
  letter-spacing: -0.408px;
  outline: none;

  &::placeholder {
    color: rgba(2, 2, 13, 0.3);
  }
`

const IdField = styled(Field)`
  padding-right: 112px;
`

const CheckButton = styled.button`
  position: absolute;
  top: 318px;
  left: 255px;
  z-index: 3;
  width: 103px;
  height: 45px;
  border: none;
  border-radius: 50px;
  background: #56a6f0;
  color: #ffffff;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.408px;
  line-height: 23px;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`

const PrimaryButton = styled.button`
  position: absolute;
  top: ${({ $top }) => $top || '596px'};
  left: 32px;
  z-index: 2;
  width: 326px;
  height: 50px;
  border: none;
  border-radius: 15px;
  background: #56a6f0;
  color: #ffffff;
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`

const SignupLink = styled.button`
  position: absolute;
  top: 662px;
  left: 0;
  z-index: 2;
  width: 390px;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: #56a6f0;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.408px;
  line-height: 23px;
  cursor: pointer;
`

const SignupUnderline = styled.span`
  position: absolute;
  top: 685px;
  left: 171px;
  z-index: 2;
  width: 48px;
  height: 1px;
  background: #56a6f0;
  pointer-events: none;
`

const Hint = styled.p`
  position: absolute;
  top: ${({ $top }) => $top};
  left: 46px;
  z-index: 2;
  margin: 0;
  color: ${({ $error }) => ($error ? 'rgba(255, 15, 15, 0.48)' : 'rgba(2, 2, 13, 0.3)')};
  font-size: 11px;
  font-weight: 400;
  letter-spacing: -0.408px;
  line-height: 23px;
  white-space: ${({ $wrap }) => ($wrap ? 'normal' : 'nowrap')};
  width: ${({ $wrap }) => ($wrap ? '298px' : 'auto')};
`

export function LoginPage({ onSignup, onSuccess }) {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit() {
    if (submitting) return
    setSubmitting(true)
    setError('')
    try {
      const payload = await login({ loginId: id.trim(), password })
      saveAuthSession(payload.data)
      onSuccess(payload.data ?? {})
    } catch (error) {
      setError(`*${(error.message || '로그인에 실패했습니다.').replace(/^\*/, '')}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Logo src={logoImage} alt="숨표" width="162" height="100" />
      <Slogan>숨 쉬기 좋은 강의실을 위해</Slogan>
      <Character src={runImage} alt="" width="71" height="89" $top="267px" />
      <Field
        $top="374px"
        value={id}
        placeholder="아이디"
        autoComplete="username"
        onChange={(event) => {
          setId(event.target.value)
          setError('')
        }}
      />
      <Field
        $top="444px"
        type="password"
        value={password}
        placeholder="비밀번호"
        autoComplete="current-password"
        onChange={(event) => {
          setPassword(event.target.value)
          setError('')
        }}
      />
      {error ? <Hint $error $wrap $top="496px">{error}</Hint> : null}
      <PrimaryButton type="button" disabled={submitting} onClick={submit}>
        로그인
      </PrimaryButton>
      <SignupLink type="button" onClick={onSignup}>
        회원가입
      </SignupLink>
      <SignupUnderline />
    </>
  )
}

export function SignupPage({ onDone }) {
  const [name, setName] = useState('')
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [idAvailable, setIdAvailable] = useState(false)
  const [idError, setIdError] = useState('')
  const [showPasswordError, setShowPasswordError] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [showMissing, setShowMissing] = useState(false)
  const [missingMessage, setMissingMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [checkingId, setCheckingId] = useState(false)

  function changeId(value) {
    setId(value)
    setIdAvailable(false)
    setIdError('')
  }

  async function checkId() {
    if (checkingId) return
    setCheckingId(true)
    setIdError('')
    setIdAvailable(false)
    try {
      const payload = await checkLoginId(id.trim())
      const available = Boolean(payload.data?.available)
      setIdAvailable(available)
      setIdError(available ? '' : '*이미 사용 중인 아이디입니다.')
    } catch (error) {
      setIdAvailable(false)
      setIdError(`*${(error.message || '아이디를 확인하지 못했습니다.').replace(/^\*/, '')}`)
    } finally {
      setCheckingId(false)
    }
  }

  async function submit() {
    const missing = !name.trim() || !id.trim() || !password || !confirm
    const formatWrong = Boolean(password) && !validPassword(password)
    const mismatch = Boolean(password && confirm) && password !== confirm
    setShowMissing(missing)
    setMissingMessage('*모든 정보를 입력해 주세요.')
    setShowPasswordError(formatWrong || mismatch)
    setPasswordMessage(mismatch && !formatWrong ? '*비밀번호가 일치하지 않습니다.' : '*비밀번호 형식 오류 (영어, 숫자 포함 8글자 이상)')
    setIdError('')
    if (missing || formatWrong || mismatch || submitting) return

    setSubmitting(true)
    try {
      const payload = await signup({
        name: name.trim(),
        loginId: id.trim(),
        password,
        passwordConfirm: confirm,
      })
      saveAuthSession(payload.data)
      onDone(payload.data ?? {})
    } catch (error) {
      const message = error.message || '회원가입에 실패했습니다.'
      if (error.code === 409 || message.includes('아이디')) {
        setIdAvailable(false)
        setIdError(`*${message.replace(/^\*/, '')}`)
      } else if (message.includes('비밀번호')) {
        setShowPasswordError(true)
        setPasswordMessage(`*${message.replace(/^\*/, '')}`)
      } else if (message.includes('모든 정보')) {
        setShowMissing(true)
        setMissingMessage(`*${message.replace(/^\*/, '')}`)
      } else {
        setShowMissing(true)
        setMissingMessage(`*${message.replace(/^\*/, '')}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Character src={runImage} alt="" width="71" height="89" $top="143px" />
      <Field
        $top="253px"
        value={name}
        placeholder="이름"
        autoComplete="name"
        onChange={(event) => setName(event.target.value)}
      />
      <IdField
        $top="318px"
        value={id}
        placeholder="아이디"
        autoComplete="username"
        onChange={(event) => changeId(event.target.value)}
      />
      <CheckButton type="button" disabled={checkingId} onClick={checkId}>
        중복 확인
      </CheckButton>
      {idError ? <Hint $error $wrap $top="363px">{idError}</Hint> : null}
      {idAvailable && !idError ? <Hint $top="363px">*사용 가능한 아이디입니다.</Hint> : null}
      <Field
        $top={idError ? '420px' : '388px'}
        type="password"
        value={password}
        placeholder="비밀번호"
        autoComplete="new-password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <Field
        $top={idError ? '473px' : '441px'}
        type="password"
        value={confirm}
        placeholder="비밀번호 확인"
        autoComplete="new-password"
        onChange={(event) => setConfirm(event.target.value)}
      />
      {showPasswordError ? (
        <Hint $error $wrap $top={idError ? '526px' : '494px'}>
          {passwordMessage}
        </Hint>
      ) : null}
      {showMissing ? <Hint $error $wrap $top={idError ? '603px' : '571px'}>{missingMessage}</Hint> : null}
      <PrimaryButton type="button" disabled={submitting} $top={idError ? '628px' : '596px'} onClick={submit}>
        회원가입
      </PrimaryButton>
    </>
  )
}

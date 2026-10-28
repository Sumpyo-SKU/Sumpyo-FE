import APIService from './api.js'

const tokenKey = 'sumpyo-access-token'

export function saveAuthSession(data) {
  if (!data?.accessToken) return
  localStorage.setItem(tokenKey, data.accessToken)
}

export function readAccessToken() {
  try {
    return localStorage.getItem(tokenKey) || ''
  } catch {
    return ''
  }
}

export function clearAuthSession() {
  localStorage.removeItem(tokenKey)
}

// 내 정보. 앱을 열 때 저장된 토큰이 유효한지 확인한다. 만료되거나 위조되면 401이고, 담당 구역이 없으면 hasZones가 false다.
export function getMe() {
  return APIService.public.get('/me')
}

// 로그인. 공개. 성공하면 액세스 토큰을 받는다. 아이디가 없거나 비밀번호가 틀리면 401, 같은 주소에서 10분 안에 10번 넘게 실패하면 429다.
export function login({ loginId, password } = {}) {
  return APIService.public.post('/auth/login', { loginId, password })
}
// 아이디 중복 확인. 공개. 형식이 틀리면 400이고, available이 true면 사용할 수 있다.
export function checkLoginId(loginId) {
  const search = new URLSearchParams()
  if (loginId) search.set('loginId', loginId)
  const query = search.toString()
  return APIService.public.get(`/auth/check-login-id${query ? `?${query}` : ''}`)
}
// 회원가입. 로그인 없이 가입하고, 가입되면 바로 로그인 상태가 된다. 빈 칸은 400, 이미 있는 아이디는 409다.
export function signup({ name, loginId, password, passwordConfirm } = {}) {
  return APIService.public.post('/auth/signup', {
    name,
    loginId,
    password,
    passwordConfirm,
  })
}

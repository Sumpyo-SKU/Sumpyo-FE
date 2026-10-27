/*
    *사용법
    1. js파일은 도메인 기준으로 생성, 도메인은 스웨거에 나눠져있는 기준을 말함 User,Recipe...
    2. js파일 안에 해당 도메인의 API를 생성, 함수 이름은 어떤 기능이고 어떤 요청인지 알 수 있도록 해야함
    3. 하단의 코드는 템플릿이라고 보면 됨, API 사용 규칙을 정해놓은 것임
    4. APIService.public.{해당 요청 메소드}("{해당 요청 경로}");
    ! 경로는 환경변수 이후 경로부터 써야함 예: 환경변수=~~api/v1 이면 그 뒤의 경로만 넣으면 됨
    ? userApi.js에 예시를 만들었으니 참고하고 질문이 있다면 언제든 환영~
    TODO: 환경변수 상의하여 결정하고 노션에 적어놓기, 보통 v1까지 환경변수로 설정 함
 */

const baseURL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

async function request(method, path, { headers, body, responseType } = {}) {
  const response = await fetch(`${baseURL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const contentType = response.headers.get('content-type') || ''
  if (responseType === 'blob' && contentType.includes('image')) {
    return response.blob()
  }

  let payload
  try {
    payload = await response.json()
  } catch {
    const error = new Error('응답을 해석하지 못했습니다.')
    error.code = response.status
    throw error
  }

  if (!payload?.success) {
    const error = new Error(payload?.message || '요청에 실패했습니다.')
    error.code = payload?.code ?? response.status
    throw error
  }

  return payload
}

const APIService = {
  public: {
    get: (path, config) => request('GET', path, config),
    post: (path, body, config) => request('POST', path, { ...config, body }),
    put: (path, body, config) => request('PUT', path, { ...config, body }),
    patch: (path, body, config) => request('PATCH', path, { ...config, body }),
    delete: (path, config) => request('DELETE', path, config),
  },
}

export default APIService

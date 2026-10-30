import APIService from './api.js'

export function mapTalkFilter(data) {
  const floors = data?.floors ?? []
  return {
    buildingId: data?.buildingId ?? null,
    building: data?.building ?? '',
    floors: floors.map((item) => item.floor).filter((floor) => floor != null),
    rooms: floors.flatMap((item) =>
      (item.rooms ?? []).map((room) => ({
        floor: item.floor,
        id: room.number,
        roomId: room.roomId,
      })),
    ),
  }
}

// 연락 볼 구역 조회. 층 목록이 비면 건물 전체이고, 층의 강의실이 비면 그 층 전체다. 담당 구역이 없으면 400이다.
export function getTalkFilter({ demoLogin } = {}) {
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get('/me/talk-filter', { headers })
}

function talkFilterSaveBody({ floors = [], rooms = [] } = {}) {
  const uniqueFloors = [...new Set(floors.map(Number))]
    .filter((floor) => Number.isFinite(floor))
    .sort((left, right) => left - right)

  return {
    floors: uniqueFloors.map((floor) => ({
      floor,
      roomIds: [...new Set(
        rooms
          .filter((room) => room.floor === floor && room.roomId != null)
          .map((room) => room.roomId),
      )],
    })),
  }
}

// 연락 볼 구역 저장. 보낸 목록으로 구역 전체를 바꾼다. 층이 없으면 건물 전체, 강의실이 없으면 그 층 전체다.
export function saveTalkFilter(zone, { demoLogin } = {}) {
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.put('/me/talk-filter', talkFilterSaveBody(zone), { headers })
}

function talksPath({ status, cursor, size } = {}) {
  const search = new URLSearchParams()
  if (status) search.set('status', status)
  if (cursor != null && cursor !== '') search.set('cursor', String(cursor))
  if (size) search.set('size', String(size))
  const query = search.toString()
  return `/talks${query ? `?${query}` : ''}`
}

// 캠퍼스톡 목록. 연락 볼 구역에 맞는 글을 최신순으로 가져온다. cursor가 없으면 처음부터고, hasNext가 false면 끝이다.
export function getTalks({ status, cursor, size, demoLogin } = {}) {
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get(talksPath({ status, cursor, size }), { headers })
}

// 캠퍼스톡 보내기. 내 건물에 글을 남긴다. 층은 필수이고, 강의실은 그 층의 방을 고를 때만 보낸다. 내용은 1~300자다.
export function createTalk({ floor, roomId, content }, { demoLogin } = {}) {
  const body = { floor: Number(floor), content }
  if (roomId != null && roomId !== '') body.roomId = roomId
  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.post('/talks', body, { headers })
}

// 캠퍼스톡 답변. 내가 보낸 글에는 답할 수 없다. 답변이 달리면 글 상태는 ANSWERED가 된다.
export function createTalkReply(talkId, { content, isSuggested } = {}, { demoLogin } = {}) {
  if (talkId === undefined || talkId === null || talkId === '') {
    throw new Error('캠퍼스톡 ID가 필요합니다.')
  }

  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.post(`/talks/${talkId}/replies`, {
    content,
    isSuggested: Boolean(isSuggested),
  }, { headers })
}

// 캠퍼스톡 상세. 다른 근로생이 처음 열면 미확인이 확인 중으로 바뀌고, 추천 답변은 저장된 것을 쓰거나 없으면 바로 만든다. 글쓴이는 sender의 이름과 담당 구역이다. 보낸 사람에게는 추천 답변이 비어 있다. 담당 구역이 없으면 400, 로그인이 없으면 401, 내 건물이 아니면 403, 없는 글은 404다.
export function getTalkDetail(talkId, { demoLogin } = {}) {
  if (talkId === undefined || talkId === null || talkId === '') {
    throw new Error('캠퍼스톡 ID가 필요합니다.')
  }

  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.get(`/talks/${talkId}`, { headers })
}

// 캠퍼스톡 삭제. 내가 보낸 글만 지운다. 목록과 개수에서 빠지고, 이후 상세는 없는 글이 된다.
export function deleteTalk(talkId, { demoLogin } = {}) {
  if (talkId === undefined || talkId === null || talkId === '') {
    throw new Error('캠퍼스톡 ID가 필요합니다.')
  }

  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.delete(`/talks/${talkId}`, { headers })
}

// 캠퍼스톡 답변 삭제. 내가 쓴 답변만 지운다. 자리는 남고, 남은 답변이 없으면 글 상태가 확인 중으로 돌아간다.
export function deleteTalkReply(talkId, replyId, { demoLogin } = {}) {
  if (talkId === undefined || talkId === null || talkId === '') {
    throw new Error('캠퍼스톡 ID가 필요합니다.')
  }
  if (replyId === undefined || replyId === null || replyId === '') {
    throw new Error('답변 ID가 필요합니다.')
  }

  const headers = demoLogin ? { 'X-Demo-Login': demoLogin } : undefined
  return APIService.public.delete(`/talks/${talkId}/replies/${replyId}`, { headers })
}

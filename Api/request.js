import BASE_URL from './base.js'
import { emitSessionExpired } from './authEvents'

const getResponseData = async (response) => {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text || null
}

const request = async ({
  endpoint = '',
  method = 'GET',
  body,
  credentials = true,
  notifyOnSessionExpired = true,
} = {}) => {
  const headers = {}
  let requestBody

  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      requestBody = body
    } else {
      headers['Content-Type'] = 'application/json'
      requestBody = JSON.stringify(body)
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    ...(method !== 'GET' && method !== 'HEAD' && { body: requestBody }),
    credentials: credentials ? 'include' : 'omit',
  })

  const isSuccessful = response.status >= 200 && response.status < 300
  const sessionExpired = response.status === 401 || response.status === 403

  if (sessionExpired && notifyOnSessionExpired) {
    emitSessionExpired()
  }

  return {
    data: await getResponseData(response),
    status: response.status,
    isSuccessful,
    sessionExpired,
  }
}

export default request
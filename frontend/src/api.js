const API_ROOT = '/api'

async function request(path, { token, ...options } = {}) {
  const response = await fetch(`${API_ROOT}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const payload = await response.json()
      message = payload.message || payload.error || message
    } catch {
      if (response.status === 401) message = 'Your session expired. Please sign in again.'
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

export const api = {
  signup: (values) => request('/auth/signup', { method: 'POST', body: JSON.stringify(values) }),
  signin: (values) => request('/auth/signin', { method: 'POST', body: JSON.stringify(values) }),
  listSnippets: (token) => request('/snippets', { token }),
  createSnippet: (token, values) => request('/snippets', { token, method: 'POST', body: JSON.stringify(values) }),
  updateSnippet: (token, id, values) => request(`/snippets/${id}`, { token, method: 'PUT', body: JSON.stringify(values) }),
  deleteSnippet: (token, id) => request(`/snippets/${id}`, { token, method: 'DELETE' }),
}

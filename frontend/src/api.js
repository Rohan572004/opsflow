
const API_BASE = '/api/v1/incidents'

async function request(path = '', options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(
      message || `Request failed with status ${response.status}`,
    )
  }

  if (response.status === 204) return null

  return response.json()
}

export const incidentApi = {
  getAll: () => request(),

  create: (incident) =>
    request('', {
      method: 'POST',
      body: JSON.stringify(incident),
    }),

  update: (id, incident) =>
    request(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(incident),
    }),

  remove: (id) =>
    request(`/${id}`, {
      method: 'DELETE',
    }),
}


import { useCallback, useEffect, useState } from 'react'
import { incidentApi } from './api'
import './App.css'

function App() {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'OPEN',
  })

  const loadIncidents = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await incidentApi.getAll()
      setIncidents(data)
    } catch (err) {
      setError(err.message || 'Could not load incidents.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadIncidents()
  }, [loadIncidents])

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch = (incident.title || '')
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'ALL' || incident.status === statusFilter

    const matchesPriority =
      priorityFilter === 'ALL' || incident.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const count = (status) =>
    incidents.filter((incident) => incident.status === status).length

  async function createIncident(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      await incidentApi.create(form)
      setForm({
        title: '',
        description: '',
        priority: 'MEDIUM',
        status: 'OPEN',
      })
      setShowForm(false)
      await loadIncidents()
    } catch (err) {
      setError(err.message || 'Could not create incident.')
    } finally {
      setSaving(false)
    }
  }

  async function updateStatus(incident, status) {
    setError('')

    try {
      await incidentApi.update(incident.id, {
        title: incident.title,
        description: incident.description,
        priority: incident.priority,
        status,
      })
      await loadIncidents()
    } catch (err) {
      setError(err.message || 'Could not update incident.')
    }
  }

  async function deleteIncident(id) {
    if (!window.confirm('Delete this incident permanently?')) return

    setError('')

    try {
      await incidentApi.remove(id)
      await loadIncidents()
    } catch (err) {
      setError(err.message || 'Could not delete incident.')
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">O</div>
          <div>
            <strong>OpsFlow</strong>
            <span>INCIDENT PLATFORM</span>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>
        <button className="nav-item active">
          <span>▦</span> Dashboard
        </button>
        <button className="nav-item" onClick={() => setShowForm(true)}>
          <span>＋</span> Create incident
        </button>

        <div className="sidebar-bottom">
          <div className="status-dot" />
          <div>
            <strong>API connected</strong>
            <span>Spring Boot backend</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace / Overview</span>
            <h1>Incident dashboard</h1>
            <p>Monitor, investigate, and manage service disruptions.</p>
          </div>
          <button className="primary-button" onClick={() => setShowForm(true)}>
            ＋ New incident
          </button>
        </header>

        {error && (
          <div role="alert" className="error-banner">
            <span>{error}</span>
            <button className="secondary-button" onClick={loadIncidents}>
              Retry
            </button>
          </div>
        )}

        <section className="metrics">
          <Metric label="Total incidents" value={incidents.length} note="All recorded incidents" />
          <Metric label="Open" value={count('OPEN')} note="Awaiting investigation" />
          <Metric label="In progress" value={count('IN_PROGRESS')} note="Currently being handled" />
          <Metric label="Resolved" value={count('RESOLVED') + count('CLOSED')} note="Resolved or closed" />
        </section>

        <section className="incident-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent incidents</h2>
              <p>Live records from the OpsFlow API.</p>
            </div>
            <span className="record-count">
              {filteredIncidents.length} records
            </span>
          </div>

          <div className="filters">
            <input
              aria-label="Search incidents"
              placeholder="Search incidents..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>

            <select
              aria-label="Filter by priority"
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
            >
              <option value="ALL">All priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>INCIDENT</th>
                  <th>PRIORITY</th>
                  <th>STATUS</th>
                  <th>CREATED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="empty-state">Loading incidents...</td></tr>
                ) : filteredIncidents.length === 0 ? (
                  <tr><td colSpan="5" className="empty-state">No incidents found.</td></tr>
                ) : (
                  filteredIncidents.map((incident) => (
                    <tr key={incident.id}>
                      <td>
                        <strong className="incident-title">{incident.title}</strong>
                        <span className="incident-id">INC-{incident.id}</span>
                      </td>
                      <td>
                        <span className={`priority ${(incident.priority || 'LOW').toLowerCase()}`}>
                          {incident.priority}
                        </span>
                      </td>
                      <td>
                        <select
                          className={`status-select ${(incident.status || 'OPEN').toLowerCase()}`}
                          aria-label={`Status for ${incident.title}`}
                          value={incident.status}
                          onChange={(event) =>
                            updateStatus(incident, event.target.value)
                          }
                        >
                          <option value="OPEN">Open</option>
                          <option value="IN_PROGRESS">In progress</option>
                          <option value="RESOLVED">Resolved</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </td>
                      <td className="date-cell">
                        {incident.createdAt
                          ? new Date(incident.createdAt).toLocaleString()
                          : '—'}
                      </td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => deleteIncident(incident.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="panel-footer">
            Showing {filteredIncidents.length} of {incidents.length} incidents
            <button className="secondary-button" onClick={loadIncidents}>
              Refresh
            </button>
          </div>
        </section>

        <footer className="footer">
          OpsFlow · Cloud-native incident management
          <span>Connected to Spring Boot API</span>
        </footer>
      </main>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-heading"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <h2 id="form-heading">Create incident</h2>
                <p>Record a new service disruption.</p>
              </div>
              <button className="close-button" onClick={() => setShowForm(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={createIncident}>
              <label>
                Incident title
                <input
                  required
                  maxLength={150}
                  placeholder="e.g. API response time increased"
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                />
              </label>

              <label>
                Description
                <textarea
                  required
                  rows="4"
                  placeholder="Describe the issue..."
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                />
              </label>

              <label>
                Priority
                <select
                  value={form.priority}
                  onChange={(event) =>
                    setForm({ ...form, priority: event.target.value })
                  }
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </label>

              <label>
                Initial status
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({ ...form, status: event.target.value })
                  }
                >
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={saving}>
                  {saving ? 'Saving...' : 'Create incident'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

function Metric({ label, value, note }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  )
}

export default App

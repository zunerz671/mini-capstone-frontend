import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios.js'
import './Teams.css'

function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    win: 0,
    loss: 0
  })
  const [error, setError] = useState('')
  const { isAdmin } = useAuth()

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams')
      setTeams(response.data)
    } catch (err) {
      setError('Failed to fetch teams')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (editingTeam) {
        await api.put(`/teams/${editingTeam.id}`, formData)
      } else {
        await api.post('/teams', formData)
      }
      fetchTeams()
      resetForm()
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Operation failed')
    }
  }

  const handleEdit = (team) => {
    setEditingTeam(team)
    setFormData({
      name: team.name,
      win: team.win || 0,
      loss: team.loss || 0
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('DELETE_THIS_TEAM?')) return

    try {
      await api.delete(`/teams/${id}`)
      fetchTeams()
    } catch (err) {
      setError('Failed to delete team')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', win: 0, loss: 0 })
    setEditingTeam(null)
    setShowForm(false)
    setError('')
  }

  if (loading) {
    return (
      <Layout>
        <div className="loading">LOADING_TEAMS...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="teams-page">
        <div className="page-header">
          <h1 className="page-title">TEAMS</h1>
          {isAdmin && (
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="btn-add"
            >
              {showForm ? 'CANCEL' : 'ADD_TEAM'}
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && isAdmin && (
          <div className="form-container">
            <h2 className="form-title">
              {editingTeam ? 'EDIT_TEAM' : 'NEW_TEAM'}
            </h2>
            <form onSubmit={handleSubmit} className="team-form">
              <div className="form-group">
                <label className="form-label">TEAM_NAME</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">WINS</label>
                  <input
                    type="number"
                    value={formData.win}
                    onChange={(e) => setFormData({ ...formData, win: parseInt(e.target.value) })}
                    className="form-input"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">LOSSES</label>
                  <input
                    type="number"
                    value={formData.loss}
                    onChange={(e) => setFormData({ ...formData, loss: parseInt(e.target.value) })}
                    className="form-input"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingTeam ? 'UPDATE' : 'CREATE'}
                </button>
                <button type="button" onClick={resetForm} className="btn-cancel">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="teams-grid">
          {teams.map((team) => (
            <div key={team.id} className="team-card">
              <div className="team-header">
                <h3 className="team-name">{team.name}</h3>
              </div>
              <div className="team-stats">
                <div className="stat-item stat-win">
                  <span className="stat-label">WINS</span>
                  <span className="stat-value">{team.win || 0}</span>
                </div>
                <div className="stat-item stat-loss">
                  <span className="stat-label">LOSSES</span>
                  <span className="stat-value">{team.loss || 0}</span>
                </div>
              </div>
              {isAdmin && (
                <div className="team-actions">
                  <button 
                    onClick={() => handleEdit(team)} 
                    className="btn-edit"
                  >
                    EDIT
                  </button>
                  <button 
                    onClick={() => handleDelete(team.id)} 
                    className="btn-delete"
                  >
                    DELETE
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Teams

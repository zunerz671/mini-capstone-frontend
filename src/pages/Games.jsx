import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios.js'
import './Games.css'

function Games() {
  const [games, setGames] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingGame, setEditingGame] = useState(null)
  const [formData, setFormData] = useState({
    team1_id: '',
    team2_id: '',
    team1score: 0,
    team2score: 0
  })
  const [error, setError] = useState('')
  const { isAdmin } = useAuth()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [gamesRes, teamsRes] = await Promise.all([
        api.get('/games'),
        api.get('/teams')
      ])
      setGames(gamesRes.data)
      setTeams(teamsRes.data)
    } catch (err) {
      setError('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (editingGame) {
        await api.put(`/games/${editingGame.id}`, {
          team1: getTeamName(formData.team1_id),
          team2: getTeamName(formData.team2_id),
          team1score: parseInt(formData.team1score),
          team2score: parseInt(formData.team2score)
        })
      } else {
        await api.post('/games', {
          game: {
            team1_id: parseInt(formData.team1_id),
            team2_id: parseInt(formData.team2_id),
            team1score: parseInt(formData.team1score),
            team2score: parseInt(formData.team2score)
          }
        })
      }
      fetchData()
      resetForm()
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Operation failed')
    }
  }

  const handleEdit = (game) => {
    setEditingGame(game)
    setFormData({
      team1_id: game.team1_id,
      team2_id: game.team2_id,
      team1score: game.team1score,
      team2score: game.team2score
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('DELETE_THIS_GAME?')) return

    try {
      await api.delete(`/games/${id}`)
      fetchData()
    } catch (err) {
      setError('Failed to delete game')
    }
  }

  const resetForm = () => {
    setFormData({ team1_id: '', team2_id: '', team1score: 0, team2score: 0 })
    setEditingGame(null)
    setShowForm(false)
    setError('')
  }

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId)
    return team?.name || 'Unknown'
  }

  if (loading) {
    return (
      <Layout>
        <div className="loading">LOADING_GAMES...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="games-page">
        <div className="page-header">
          <h1 className="page-title">GAMES</h1>
          {isAdmin && (
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="btn-add"
            >
              {showForm ? 'CANCEL' : 'ADD_GAME'}
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && isAdmin && (
          <div className="form-container">
            <h2 className="form-title">
              {editingGame ? 'EDIT_GAME' : 'NEW_GAME'}
            </h2>
            <form onSubmit={handleSubmit} className="game-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">TEAM_1</label>
                  <select
                    value={formData.team1_id}
                    onChange={(e) => setFormData({ ...formData, team1_id: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="">SELECT_TEAM</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">TEAM_1_SCORE</label>
                  <input
                    type="number"
                    value={formData.team1score}
                    onChange={(e) => setFormData({ ...formData, team1score: e.target.value })}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">TEAM_2</label>
                  <select
                    value={formData.team2_id}
                    onChange={(e) => setFormData({ ...formData, team2_id: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="">SELECT_TEAM</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">TEAM_2_SCORE</label>
                  <input
                    type="number"
                    value={formData.team2score}
                    onChange={(e) => setFormData({ ...formData, team2score: e.target.value })}
                    className="form-input"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingGame ? 'UPDATE' : 'CREATE'}
                </button>
                <button type="button" onClick={resetForm} className="btn-cancel">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="games-list">
          {games.map((game) => (
            <div key={game.id} className="game-card">
              <div className="game-content">
                <div className="game-team team-left">
                  <span className="team-name">{getTeamName(game.team1_id)}</span>
                  <span className="team-score">{game.team1score}</span>
                </div>
                
                <div className="game-divider">VS</div>
                
                <div className="game-team team-right">
                  <span className="team-score">{game.team2score}</span>
                  <span className="team-name">{getTeamName(game.team2_id)}</span>
                </div>
              </div>
              
              {isAdmin && (
                <div className="game-actions">
                  <button 
                    onClick={() => handleEdit(game)} 
                    className="btn-edit"
                  >
                    EDIT
                  </button>
                  <button 
                    onClick={() => handleDelete(game.id)} 
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

export default Games

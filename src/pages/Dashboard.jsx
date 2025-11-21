import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout.jsx'
import api from '../api/axios.js'
import './Dashboard.css'

function Dashboard() {
  const [teams, setTeams] = useState([])
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [teamsRes, gamesRes] = await Promise.all([
        api.get('/teams'),
        api.get('/games')
      ])
      setTeams(teamsRes.data)
      setGames(gamesRes.data)
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId)
    return team?.name || 'Unknown'
  }

  if (loading) {
    return (
      <Layout>
        <div className="loading">LOADING_DATA...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="dashboard">
        <h1 className="page-title">DASHBOARD</h1>
        
        <div className="stats-grid">
          <div className="stat-card stat-teams">
            <div className="stat-number">{teams.length}</div>
            <div className="stat-label">TOTAL_TEAMS</div>
          </div>
          <div className="stat-card stat-games">
            <div className="stat-number">{games.length}</div>
            <div className="stat-label">TOTAL_GAMES</div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">RECENT_GAMES</h2>
          <div className="games-list">
            {games.slice(0, 5).map((game) => (
              <div key={game.id} className="game-card">
                <div className="game-teams">
                  <div className="game-team">
                    <span className="team-name">{getTeamName(game.team1_id)}</span>
                    <span className="team-score">{game.team1score}</span>
                  </div>
                  <div className="game-vs">VS</div>
                  <div className="game-team">
                    <span className="team-name">{getTeamName(game.team2_id)}</span>
                    <span className="team-score">{game.team2score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">TEAM_STANDINGS</h2>
          <div className="standings-table">
            {teams.map((team, index) => (
              <div key={team.id} className="standing-row">
                <div className="standing-rank">#{index + 1}</div>
                <div className="standing-name">{team.name}</div>
                <div className="standing-stats">
                  <span className="stat-win">W: {team.win || 0}</span>
                  <span className="stat-loss">L: {team.loss || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard

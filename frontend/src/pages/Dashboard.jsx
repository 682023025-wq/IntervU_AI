import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalInterviews: 0,
    avgScore: 0,
    recentSessions: []
  })
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      navigate('/login')
      return
    }

    // Fetch user data and stats
    fetchDashboardData()
  }, [navigate])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/stats')
      setStats(response.data)
      setUser(response.data.user || { name: 'User' })
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-light">
      {/* Navbar */}
      <nav className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">IntervU AI</h1>
          <div className="flex items-center space-x-4">
            <span className="text-light">
              Hello, {user?.name || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="bg-secondary px-4 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <h2 className="text-2xl font-bold text-primary mb-6">Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-medium text-sm mb-2">Total Interviews</h3>
            <p className="text-3xl font-bold text-primary">{stats.totalInterviews}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-medium text-sm mb-2">Average Score</h3>
            <p className="text-3xl font-bold text-primary">{stats.avgScore}%</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-medium text-sm mb-2">Recent Sessions</h3>
            <p className="text-3xl font-bold text-primary">{stats.recentSessions.length}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-primary text-white p-6 rounded-lg shadow-md hover:bg-secondary transition-colors">
            <h3 className="font-bold text-lg mb-2">Start Interview</h3>
            <p className="text-light text-sm">Practice with AI</p>
          </button>

          <button className="bg-white text-primary p-6 rounded-lg shadow-md hover:bg-gray-light transition-colors border-2 border-primary">
            <h3 className="font-bold text-lg mb-2">View CV</h3>
            <p className="text-gray-medium text-sm">Edit your resume</p>
          </button>

          <button className="bg-white text-primary p-6 rounded-lg shadow-md hover:bg-gray-light transition-colors border-2 border-primary">
            <h3 className="font-bold text-lg mb-2">Job Search</h3>
            <p className="text-gray-medium text-sm">Find opportunities</p>
          </button>

          <button className="bg-white text-primary p-6 rounded-lg shadow-md hover:bg-gray-light transition-colors border-2 border-primary">
            <h3 className="font-bold text-lg mb-2">Profile</h3>
            <p className="text-gray-medium text-sm">Account settings</p>
          </button>
        </div>

        {/* Recent Sessions */}
        {stats.recentSessions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-primary mb-4">Recent Sessions</h3>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-light">
                  <tr>
                    <th className="text-left p-4 text-gray-medium">Date</th>
                    <th className="text-left p-4 text-gray-medium">Position</th>
                    <th className="text-left p-4 text-gray-medium">Score</th>
                    <th className="text-left p-4 text-gray-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentSessions.map((session, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-4">{new Date(session.date).toLocaleDateString()}</td>
                      <td className="p-4">{session.position}</td>
                      <td className="p-4">
                        <span className={`font-bold ${session.score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                          {session.score}%
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-light text-primary rounded-full text-sm">
                          {session.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard

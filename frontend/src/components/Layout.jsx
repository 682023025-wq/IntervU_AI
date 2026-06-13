import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, FileText, Video, Briefcase, User, LogOut } from 'lucide-react'

export default function Layout() {
  const location = useLocation()
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/cv', icon: FileText, label: 'CV Builder' },
    { path: '/interview', icon: Video, label: 'Mock Interview' },
    { path: '/jobs', icon: Briefcase, label: 'Job Search' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]
  
  const handleLogout = () => {
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="https://res.cloudinary.com/dxvryfbpz/image/upload/v1781106636/Logo_IntervU_AI_ksikyh.png" 
                alt="IntervU AI Logo" 
                className="h-10 w-auto"
              />
              <h1 className="text-2xl font-bold text-primary-600">IntervU AI</h1>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header - TAMBAHKAN INI */}
      <header className="md:hidden top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="flex items-center justify-start h-16 px-4">
          <div className="flex items-center space-x-2">
            <img 
              src="https://res.cloudinary.com/dxvryfbpz/image/upload/v1781106636/Logo_IntervU_AI_ksikyh.png" 
              alt="IntervU AI Logo" 
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-bold text-primary-600">IntervU AI</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-0 md:pt-16 min-h-screen:auto pb-20 md:pb-2">
        <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2 pt-2 pb-2">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full py-1 transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className={`relative ${isActive ? 'transform scale-110' : ''} transition-transform`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'fill-current opacity-20' : ''}`} />
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary-600 rounded-full"></div>
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
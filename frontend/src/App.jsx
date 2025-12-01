import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Agenda from './pages/Agenda'
import Pacientes from './pages/Pacientes'
import DatabaseView from './pages/Database'
import Login from './pages/Login'
import PatientDashboard from './pages/PatientDashboard'
import LandingPage from './pages/LandingPage'
import SuperAdmin from './pages/SuperAdmin'

function AppRoutes() {
  const { user, isAdmin, isPatient } = useAuth()

  // Rotas públicas
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    )
  }

  // Super Admin
  if (user.tipo === 'superadmin') {
    return (
      <Layout>
        <Routes>
          <Route path="/" element={<SuperAdmin />} />
          <Route path="/admin" element={<SuperAdmin />} />
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </Layout>
    )
  }

  // Paciente
  if (isPatient) {
    return (
      <Routes>
        <Route path="/" element={<PatientDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    )
  }

  // Admin/Dentista
  if (isAdmin) {
    return (
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/database" element={<DatabaseView />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    )
  }

  return <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
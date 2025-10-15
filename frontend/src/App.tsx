import PageHeader from './components/PageHeader'
import ProtectedRoute from './components/ProtectedRoute'
import './styles/style.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { SubmitComponent } from './pages/SubmitComponent'
import { ProfilePage } from './pages/ProfilePage.tsx'
import { Login2 } from './components/login-form'
import { Signup2 } from './components/signup-form'
import { ListSubmissions } from './pages/ListSubmissions.tsx'
import { SubmissionDetail } from './pages/SubmissionDetails.tsx'
import { useLogin } from './hooks/useLogin.ts'
import { LandingPage } from './pages/LandingPage/LandingPage.tsx'

function App() {
    const { user, logout } = useLogin()

    return (
        <BrowserRouter>
            <PageHeader user={user} logout={logout} />

            <Routes>
                <Route path="/" element={<LandingPage />} />

                <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login2 />} />
                <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup2 />} />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute user={user}>
                            <ProfilePage user={user!} />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/hackaton/:id/submit"
                    element={
                        <ProtectedRoute user={user}>
                            <SubmitComponent />
                        </ProtectedRoute>
                    }
                />

                <Route path="/hackaton/:id" element={<ListSubmissions />} />
                <Route path="/hackaton/:id/submission/:submissionId" element={<SubmissionDetail />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App

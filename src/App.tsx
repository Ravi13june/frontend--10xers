import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import AdminDashboard from './pages/admin/Dashboard';
import ProductDetail from './pages/ProductDetail';
import { AuthProvider } from './context/AuthContext';
import { Box, IconButton } from '@mui/material';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/Protected';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { ErrorBoundary } from './components/ErrorBoundry';
const queryClient = new QueryClient();

function AppContent() {
  const { mode, toggleTheme } = useTheme();

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box sx={{ flex: 1, py: 3 }}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
              bgcolor: 'background.paper',
              boxShadow: 3,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            {mode === 'dark' ? <LightModeIcon/>: <DarkModeIcon/>}
          </IconButton>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProductDetail />} />
            
          </Routes>
        </Box>
    
      </Box>
    </Router>
  );
}
const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

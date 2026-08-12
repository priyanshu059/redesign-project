// ============================================================
// src/App.jsx - Main App with React Router
// ============================================================
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

// User Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import BrowseEvents from './pages/BrowseEvents';
import EventDetail from './pages/EventDetail';
import EventRegister from './pages/EventRegister';
import UserRegisterEvent from './pages/UserRegisterEvent';
import UserRegistrations from './pages/UserRegistrations';
import Feedback from './pages/Feedback';
import FeedbackList from './pages/FeedbackList';
import Assistant from './pages/Assistant';
import Contact from './pages/Contact';
import About from './pages/About';

// Admin Pages
import AdminEvents from './pages/admin/AdminEvents';
import AdminEventForm from './pages/admin/AdminEventForm';
import AdminRegistrations from './pages/admin/AdminRegistrations';
import AdminVenues from './pages/admin/AdminVenues';
import AdminVenueForm from './pages/admin/AdminVenueForm';
import AdminSpeakers from './pages/admin/AdminSpeakers';
import AdminSpeakerForm from './pages/admin/AdminSpeakerForm';
import AdminSponsorships from './pages/admin/AdminSponsorships';
import AdminSponsorshipForm from './pages/admin/AdminSponsorshipForm';
import AdminIncidents from './pages/admin/AdminIncidents';
import AdminIncidentForm from './pages/admin/AdminIncidentForm';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminNotifForm from './pages/admin/AdminNotifForm';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminIntelligence from './pages/admin/AdminIntelligence';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />

              {/* Protected Routes (login required) */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              {/* ✅ Fix 14: /events and /events/:id are now public — no login required to browse events */}
              <Route path="/events" element={<BrowseEvents />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/events/:id/register" element={<ProtectedRoute><EventRegister /></ProtectedRoute>} />
              {/* ✅ Fix 13: added :id param so useParams() gets the event ID, not undefined */}
              <Route path="/user/register/:id" element={<ProtectedRoute><UserRegisterEvent /></ProtectedRoute>} />
              <Route path="/my-registrations" element={<ProtectedRoute><UserRegistrations /></ProtectedRoute>} />
              <Route path="/feedback/:eventId" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
              <Route path="/my-feedback" element={<ProtectedRoute><FeedbackList /></ProtectedRoute>} />
              <Route path="/assistant" element={<ProtectedRoute><Assistant /></ProtectedRoute>} />

              {/* Admin Routes (admin role required) */}
              <Route path="/admin/events" element={<AdminRoute><AdminEvents /></AdminRoute>} />
              <Route path="/admin/events/add" element={<AdminRoute><AdminEventForm /></AdminRoute>} />
              <Route path="/admin/events/edit/:id" element={<AdminRoute><AdminEventForm /></AdminRoute>} />
              <Route path="/admin/registrations" element={<AdminRoute><AdminRegistrations /></AdminRoute>} />
              <Route path="/admin/venues" element={<AdminRoute><AdminVenues /></AdminRoute>} />
              <Route path="/admin/venues/add" element={<AdminRoute><AdminVenueForm /></AdminRoute>} />
              <Route path="/admin/venues/edit/:id" element={<AdminRoute><AdminVenueForm /></AdminRoute>} />
              <Route path="/admin/speakers" element={<AdminRoute><AdminSpeakers /></AdminRoute>} />
              <Route path="/admin/speakers/add" element={<AdminRoute><AdminSpeakerForm /></AdminRoute>} />
              <Route path="/admin/speakers/edit/:id" element={<AdminRoute><AdminSpeakerForm /></AdminRoute>} />
              <Route path="/admin/sponsorships" element={<AdminRoute><AdminSponsorships /></AdminRoute>} />
              <Route path="/admin/sponsorships/add" element={<AdminRoute><AdminSponsorshipForm /></AdminRoute>} />
              <Route path="/admin/sponsorships/edit/:id" element={<AdminRoute><AdminSponsorshipForm /></AdminRoute>} />
              <Route path="/admin/incidents" element={<AdminRoute><AdminIncidents /></AdminRoute>} />
              <Route path="/admin/incidents/add" element={<AdminRoute><AdminIncidentForm /></AdminRoute>} />
              <Route path="/admin/incidents/edit/:id" element={<AdminRoute><AdminIncidentForm /></AdminRoute>} />
              <Route path="/admin/notifications" element={<AdminRoute><AdminNotifications /></AdminRoute>} />
              <Route path="/admin/notifications/send" element={<AdminRoute><AdminNotifForm /></AdminRoute>} />
              <Route path="/admin/feedback" element={<AdminRoute><AdminFeedback /></AdminRoute>} />
              <Route path="/admin/intelligence" element={<AdminRoute><AdminIntelligence /></AdminRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

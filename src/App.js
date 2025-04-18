import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

// Layout Components
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

// Pages
import Home from './Pages/Home';
import CustomEvents from './Pages/Features/CustomEvents';
import TicketManagement from './Pages/Features/TicketManagement';
import InteractiveVoting from './Pages/Features/InteractiveVoting';
import CustomLinks from './Pages/Features/CustomLinks';
import AnalyticalDashboard from './Pages/Features/AnalyticalDashboard';
import MobileOptimized from './Pages/Features/MobileOptimized';

// Dashboard Pages 
import WebsiteBuilder from './Pages/Dashboard/WebsiteBuilder/SimplifiedWebsiteBuilder';
import TemplateSelector from './Pages/Dashboard/WebsiteBuilder/components/TemplateSelector';
import EventCreation from './Pages/Dashboard/Other pages/EventCreation';
import TicketScanner from './Pages/Dashboard/Other pages/TicketScanner';
import PollCreation from './Pages/Dashboard/Other pages/PollCreation';
import EventAnalytics from './Pages/Dashboard/Other pages/EventAnalytics';
import QASession from './Pages/Dashboard/Other pages/QASession';
import AttendeeManagement from './Pages/Dashboard/Other pages/AttendeeManagement';
import PollsDashboard from './Pages/Dashboard/Other pages/PollsDashboard';
import Settings from './Pages/Dashboard/Other pages/Settings';
import EditEvent from './Pages/Dashboard/Other pages/EditEvent';
import AttendeesDashboard from './Pages/Dashboard/AttendeesDashboard';
import EventSelector from './Pages/Dashboard/components/EventSelector';
import AwardsDashboard from './Pages/Dashboard/Other pages/AwardsDashboard';
import AwardCategoryCreation from './Pages/Dashboard/Other pages/AwardCategoryCreation';

import DashboardLayout from './Pages/Dashboard/components/DashboardLayout';
import DashboardHome from './Pages/Dashboard/DashboardHome';
import EventsOverview from './Pages/Dashboard/EventsOverview';
import Login from './Pages/Login';
import EventTemplateSelector from './Pages/Dashboard/WebsiteBuilder/components/EventTemplateSelector';

// Auth Pages (these would be created separately)
const Signup = () => <div>Signup Page</div>;

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1 0 auto;
`;

// New component to hold routes and useNavigate hook
function AppRoutes() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const handleTemplateSelect = async (template) => {
        try {
            console.log('Selected template:', template);
            navigate('/dashboard/website-builder', { 
                state: { template: template }
            });
        } catch (error) {
            console.error('Error loading template:', error);
        }
    };

    return (
        <>
            { !location.pathname.startsWith('/dashboard') && <Navbar /> }
            <MainContent>
                <Routes>
                    {/* Public Pages */}
                    <Route path="/" element={<Home />} />
                    <Route path="/templates" element={<TemplateSelector onSelectTemplate={handleTemplateSelect} />} />
                    <Route path="/custom-events" element={<CustomEvents />} />
                    <Route path="/ticket-management" element={<TicketManagement />} />
                    <Route path="/interactive-voting" element={<InteractiveVoting />} />
                    <Route path="/custom-links" element={<CustomLinks />} />
                    <Route path="/analytics-dashboard" element={<AnalyticalDashboard />} />
                    <Route path="/mobile-optimized" element={<MobileOptimized />} />
                    
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    {/* Dashboard Routes */}
                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<DashboardHome />} />
                        <Route path="events" element={<EventsOverview />} />
                        <Route path="events/create" element={<EventCreation />} />
                        <Route path="events/:eventId/edit" element={<EditEvent />} />
                        <Route path="events/:eventId/attendees" element={<AttendeesDashboard />} />
                        <Route path="events/:eventId/tickets" element={<TicketManagement />} />
                        <Route path="events/:eventId/tickets/scan" element={<TicketScanner />} />
                        <Route path="events/:eventId/polls" element={<PollsDashboard />} />
                        <Route path="events/:eventId/polls/create" element={<PollCreation />} />
                        <Route path="events/:eventId/qa" element={<QASession />} />
                        <Route path="events/:eventId/analytics" element={<EventAnalytics />} />
                        <Route path="events/:eventId/awards" element={<AwardsDashboard />} />
                        <Route path="events/:eventId/awards/create" element={<AwardCategoryCreation />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="events/website-templates" element={<EventTemplateSelector />} />
                        <Route path="events/:eventId/website" element={<WebsiteBuilder />} />
                        
                        {/* Event selector routes for sidebar navigation */}
                        <Route path="attendees" element={<EventSelector sectionType="attendees" />} />
                        <Route path="tickets" element={<EventSelector sectionType="tickets" />} />
                        <Route path="analytics" element={<EventSelector sectionType="analytics" />} />
                        <Route path="polls" element={<EventSelector sectionType="polls" />} />
                        <Route path="qa" element={<EventSelector sectionType="qa" />} />
                        <Route path="awards" element={<EventSelector sectionType="voting" />} />
                    </Route>
                    
                    {/* 404 Page */}
                    <Route path="*" element={<div>Page Not Found</div>} />
                </Routes>
            </MainContent>
            { !location.pathname.startsWith('/dashboard') && <Footer /> }
        </>
    );
}

function App() {
    return (
        <Router>
            <AppWrapper>
                <AppRoutes/>
            </AppWrapper>
        </Router>
    );
}

export default App;
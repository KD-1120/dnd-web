import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Calendar, 
  Users, 
  Settings, 
  BarChart2, 
  Grid, 
  Ticket, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  MessageSquare,
  Bell,
  Award
} from 'lucide-react';
import { Dropdown } from 'react-bootstrap';
import { colors, spacing, shadows, borderRadius, typography } from '../../../GlobalStyles';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: white;
  border-right: 1px solid ${colors.border};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
  transition: transform 0.3s ease;
  box-shadow: ${shadows.md};
  
  @media (max-width: 991px) {
    transform: translateX(${props => props.open ? '0' : '-100%'});
  }
`;

const SidebarHeader = styled.div`
  padding: ${spacing.md};
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-size: ${typography.fontSizes.xl};
  font-weight: 700;
  color: ${colors.primary};
  
  span {
    color: ${colors.dark};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${colors.secondary};
  display: none;
  cursor: pointer;
  
  @media (max-width: 991px) {
    display: block;
  }
  
  &:hover {
    color: ${colors.dark};
  }
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: ${spacing.sm} ${spacing.md};
  color: ${props => props.active ? colors.primary : colors.secondary};
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid ${props => props.active ? colors.primary : 'transparent'};
  background-color: ${props => props.active ? colors.primaryLight : 'transparent'};
  
  svg {
    margin-right: ${spacing.sm};
  }
  
  &:hover {
    background-color: ${colors.lightGray};
    color: ${colors.dark};
    text-decoration: none;
  }
`;

const SubMenu = styled.div`
  margin-left: ${spacing.lg};
  
  ${NavLink} {
    padding: ${spacing.xs} ${spacing.md};
    font-size: ${typography.fontSizes.small};
  }
`;

const SidebarFooter = styled.div`
  padding: ${spacing.md};
  border-top: 1px solid ${colors.border};
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${spacing.sm};
  background-color: transparent;
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.sm};
  color: ${colors.secondary};
  transition: all 0.2s;
  cursor: pointer;
  
  svg {
    margin-right: ${spacing.sm};
  }
  
  &:hover {
    background-color: ${colors.lightGray};
    color: ${colors.dark};
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 250px;
  
  @media (max-width: 991px) {
    margin-left: 0;
  }
`;

const TopBar = styled.header`
  height: 60px;
  background-color: white;
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${spacing.lg};
  position: sticky;
  top: 0;
  z-index: 900;
  box-shadow: ${shadows.sm};
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${colors.secondary};
  display: none;
  cursor: pointer;
  
  @media (max-width: 991px) {
    display: block;
  }
  
  &:hover {
    color: ${colors.dark};
  }
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${colors.lightGray};
  color: ${colors.secondary};
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  
  &:hover {
    background-color: ${colors.mediumGray};
    color: ${colors.dark};
  }
  
  .badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: ${colors.error};
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const UserDropdown = styled(Dropdown)`
  .dropdown-toggle {
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: ${spacing.sm};
    color: ${colors.dark};
    padding: 0;
    
    &::after {
      display: none;
    }
  }
  
  .dropdown-menu {
    border-color: ${colors.border};
    border-radius: ${borderRadius.sm};
    box-shadow: ${shadows.md};
    padding: ${spacing.xs};
    min-width: 200px;
    
    .dropdown-item {
      padding: ${spacing.xs} ${spacing.sm};
      border-radius: ${borderRadius.sm};
      
      &:active, &:focus {
        background-color: ${colors.primaryLight};
        color: ${colors.primary};
      }
    }
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const UserInfo = styled.div`
  @media (max-width: 767px) {
    display: none;
  }
`;

const UserName = styled.div`
  font-weight: 500;
  color: ${colors.dark};
`;

const UserRole = styled.div`
  font-size: ${typography.fontSizes.xs};
  color: ${colors.secondary};
`;

const ContentWrapper = styled.div`
  min-height: calc(100vh - 60px);
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.show ? 'block' : 'none'};
`;

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Mock user data - in a real app, this would come from auth context
  const user = {
    name: 'John Doe',
    role: 'Admin',
    initials: 'JD'
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  const handleLogout = () => {
    // Handle logout logic here
    navigate('/login');
  };

  // Check if the current path matches a pattern
  const isPathActive = (path) => {
    return location.pathname.includes(path);
  };
  
  return (
    <LayoutContainer>
      <Backdrop show={sidebarOpen} onClick={closeSidebar} />
      
      <Sidebar open={sidebarOpen}>
        <SidebarHeader>
          <Logo>Event<span>Horizon</span></Logo>
          <CloseButton onClick={closeSidebar}>
            <X size={20} />
          </CloseButton>
        </SidebarHeader>
        
        <NavMenu>
          <NavItem>
            <NavLink to="/dashboard" active={location.pathname === '/dashboard'}>
              <Grid size={18} />
              Dashboard
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink 
              to="/dashboard/events" 
              active={isPathActive('/dashboard/events') && 
                !isPathActive('/attendees') && 
                !isPathActive('/tickets') && 
                !isPathActive('/analytics') &&
                !isPathActive('/qa') &&
                !isPathActive('/polls') &&
                !isPathActive('/awards')}
            >
              <Calendar size={18} />
              Events
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/dashboard/attendees" active={isPathActive('/attendees')}>
              <Users size={18} />
              Attendees
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/dashboard/tickets" active={isPathActive('/tickets')}>
              <Ticket size={18} />
              Tickets
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/dashboard/analytics" active={isPathActive('/analytics')}>
              <BarChart2 size={18} />
              Analytics
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink 
              to="/dashboard/qa" 
              active={isPathActive('/qa') || isPathActive('/polls')}
            >
              <MessageSquare size={18} />
              Q&A & Polls
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/dashboard/awards" active={isPathActive('/awards')}>
              <Award size={18} />
              Awards & Voting
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink to="/dashboard/settings" active={isPathActive('/settings')}>
              <Settings size={18} />
              Settings
            </NavLink>
          </NavItem>
        </NavMenu>
        
        <SidebarFooter>
          <LogoutButton onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>
      
      <MainContent>
        <TopBar>
          <MenuButton onClick={toggleSidebar}>
            <Menu size={20} />
          </MenuButton>
          
          <TopBarActions>
            <IconButton>
              <Bell size={18} />
              <span className="badge">3</span>
            </IconButton>
            
            <UserDropdown>
              <Dropdown.Toggle id="dropdown-user">
                <UserAvatar>{user.initials}</UserAvatar>
                <UserInfo>
                  <UserName>{user.name}</UserName>
                  <UserRole>{user.role}</UserRole>
                </UserInfo>
                <ChevronDown size={16} />
              </Dropdown.Toggle>
              
              <Dropdown.Menu align="end">
                <Dropdown.Item as={Link} to="/dashboard/profile">Profile</Dropdown.Item>
                <Dropdown.Item as={Link} to="/dashboard/settings">Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </UserDropdown>
          </TopBarActions>
        </TopBar>
        
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};

export default DashboardLayout;
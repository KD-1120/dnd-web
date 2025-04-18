import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Menu, X, ChevronDown, User } from 'lucide-react';
import { colors, breakpoints, GreenButton, OutlineButton } from '../GlobalStyles';

const StyledNavbar = styled(BootstrapNavbar)`
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 1rem 0;
`;

const NavLink = styled(Nav.Link)`
  color: #333 !important;
  font-weight: 500;
  margin: 0 0.75rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${colors.primary};
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.3s ease;
  }
  
  &.active, &:hover {
    &:after {
      transform: scaleX(1);
    }
  }
`;

const MobileMenuButton = styled(Button)`
  background: transparent;
  border: none;
  color: #333;
  padding: 0.5rem;
  display: none;
  
  @media (max-width: ${breakpoints.lg}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &:focus, &:active, &:hover {
    background: transparent;
    box-shadow: none;
    color: ${colors.primary};
  }
`;

const NavContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    color: ${colors.primary};
    text-decoration: none;
  }
  
  span {
    color: ${colors.primary};
  }
`;

const NavItems = styled(Nav)`
  align-items: center;
  
  @media (max-width: ${breakpoints.lg}) {
    margin-top: 1rem;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  
  @media (max-width: ${breakpoints.lg}) {
    margin-top: 1rem;
    justify-content: center;
  }
`;

const MobileNav = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.open ? '0' : '-100%'};
  width: 80%;
  max-width: 300px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  
  @media (min-width: ${breakpoints.lg}) {
    display: none;
  }
`;

const MobileNavHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const MobileNavClose = styled(Button)`
  background: transparent;
  border: none;
  color: #333;
  padding: 0;
  
  &:focus, &:active, &:hover {
    background: transparent;
    box-shadow: none;
    color: ${colors.primary};
  }
`;

const MobileNavItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const MobileNavLink = styled(Link)`
  color: #333;
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem 0;
  
  &:hover {
    color: ${colors.primary};
    text-decoration: none;
  }
`;

const CustomDropdown = styled(Dropdown)`
  .dropdown-toggle::after {
    display: none;
  }
  
  .dropdown-menu {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #eee;
    padding: 0.5rem;
  }
  
  .dropdown-item {
    border-radius: 4px;
    padding: 0.5rem 1rem;
    
    &:active, &:focus {
      background-color: ${colors.primaryLight};
      color: ${colors.primary};
    }
  }
`;

const DropdownItem = styled(Dropdown.Item)`
  &:hover {
    background-color: ${colors.primaryLight};
    color: ${colors.primary};
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.show ? 'block' : 'none'};
  
  @media (min-width: ${breakpoints.lg}) {
    display: none;
  }
`;

const Navbar = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  
  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };
  
  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      <StyledNavbar expand="lg" fixed="top">
        <NavContainer>
          <Logo to="/">
            Event<span>Sphere</span>
          </Logo>
          
          <MobileMenuButton variant="link" onClick={toggleMobileNav}>
            <Menu size={24} />
          </MobileMenuButton>
          
          <BootstrapNavbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
            <NavItems className="me-auto">
              <NavLink as={Link} to="/" className={isActive('/')}>
                Home
              </NavLink>
              <NavLink as={Link} to="/templates" className={isActive('/templates')}>
                Templates
              </NavLink>
              <NavLink as={Link} to="/ticket-management" className={isActive('/ticket-management')}>
                Tickets
              </NavLink>
              <NavLink as={Link} to="/interactive-voting" className={isActive('/interactive-voting')}>
                Voting
              </NavLink>
              <NavLink as={Link} to="/custom-links" className={isActive('/custom-links')}>
                Custom Links
              </NavLink>
              <NavLink as={Link} to="/analytics-dashboard" className={isActive('/analytics-dashboard')}>
                Analytics
              </NavLink>
            </NavItems>
            
            <ButtonsWrapper>
              <Link to="/login">
                <OutlineButton>Log In</OutlineButton>
              </Link>
              <Link to="/signup">
                <GreenButton>Sign Up</GreenButton>
              </Link>
            </ButtonsWrapper>
          </BootstrapNavbar.Collapse>
        </NavContainer>
      </StyledNavbar>
      
      <Overlay show={mobileNavOpen} onClick={closeMobileNav} />
      
      <MobileNav open={mobileNavOpen}>
        <MobileNavHeader>
          <Logo to="/" onClick={closeMobileNav}>
            Event<span>Sphere</span>
          </Logo>
          <MobileNavClose variant="link" onClick={closeMobileNav}>
            <X size={24} />
          </MobileNavClose>
        </MobileNavHeader>
        
        <MobileNavItems>
          <MobileNavLink to="/" onClick={closeMobileNav}>Home</MobileNavLink>
          <MobileNavLink to="/custom-events" onClick={closeMobileNav}>Custom Events</MobileNavLink>
          <MobileNavLink to="/ticket-management" onClick={closeMobileNav}>Tickets</MobileNavLink>
          <MobileNavLink to="/interactive-voting" onClick={closeMobileNav}>Voting</MobileNavLink>
          <MobileNavLink to="/custom-links" onClick={closeMobileNav}>Custom Links</MobileNavLink>
          <MobileNavLink to="/analytics-dashboard" onClick={closeMobileNav}>Analytics</MobileNavLink>
        </MobileNavItems>
        
        <ButtonsWrapper style={{ marginTop: '2rem' }}>
          <Link to="/login" style={{ flex: 1 }} onClick={closeMobileNav}>
            <OutlineButton style={{ width: '100%' }}>Log In</OutlineButton>
          </Link>
          <Link to="/signup" style={{ flex: 1 }} onClick={closeMobileNav}>
            <GreenButton style={{ width: '100%' }}>Sign Up</GreenButton>
          </Link>
        </ButtonsWrapper>
      </MobileNav>
    </>
  );
};

export default Navbar;
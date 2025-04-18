import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import { colors, spacing, typography } from '../GlobalStyles';

const FooterWrapper = styled.footer`
  background-color: #f8f9fa;
  padding: ${spacing.xl} 0;
  margin-top: ${spacing.xxl};
  border-top: 1px solid ${colors.border};
`;

const FooterLogo = styled(Link)`
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  text-decoration: none;
  margin-bottom: ${spacing.md};
  display: inline-block;
  
  &:hover {
    color: ${colors.primary};
    text-decoration: none;
  }
  
  span {
    color: ${colors.primary};
  }
`;

const FooterDescription = styled.p`
  color: ${colors.secondary};
  margin-bottom: ${spacing.md};
  max-width: 300px;
`;

const FooterHeading = styled.h5`
  font-size: ${typography.fontSizes.lead};
  font-weight: 600;
  margin-bottom: ${spacing.md};
  color: ${colors.dark};
`;

const FooterLink = styled(Link)`
  color: ${colors.secondary};
  text-decoration: none;
  display: block;
  margin-bottom: ${spacing.sm};
  
  &:hover {
    color: ${colors.primary};
    text-decoration: none;
  }
`;

const FooterSocialLinks = styled.div`
  display: flex;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.md};
`;

const SocialLink = styled.a`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.secondary};
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${colors.primary};
    color: white;
    transform: translateY(-3px);
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${spacing.sm};
  color: ${colors.secondary};
  
  svg {
    margin-right: ${spacing.sm};
    color: ${colors.primary};
  }
`;

const Copyright = styled.div`
  margin-top: ${spacing.xl};
  padding-top: ${spacing.md};
  border-top: 1px solid ${colors.border};
  text-align: center;
  color: ${colors.secondary};
  font-size: ${typography.fontSizes.small};
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterWrapper>
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <FooterLogo to="/">
              Event<span>Sphere</span>
            </FooterLogo>
            <FooterDescription>
              Create stunning event pages, sell tickets, and engage attendees with custom shareable links.
            </FooterDescription>
            <FooterSocialLinks>
              <SocialLink href="https://facebook.com" target="_blank" aria-label="Facebook">
                <Facebook size={18} />
              </SocialLink>
              <SocialLink href="https://twitter.com" target="_blank" aria-label="Twitter">
                <Twitter size={18} />
              </SocialLink>
              <SocialLink href="https://instagram.com" target="_blank" aria-label="Instagram">
                <Instagram size={18} />
              </SocialLink>
              <SocialLink href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
                <Linkedin size={18} />
              </SocialLink>
            </FooterSocialLinks>
          </Col>
          
          <Col md={2} className="mb-4 mb-md-0">
            <FooterHeading>Company</FooterHeading>
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/team">Our Team</FooterLink>
            <FooterLink to="/careers">Careers</FooterLink>
            <FooterLink to="/blog">Blog</FooterLink>
          </Col>
          
          <Col md={2} className="mb-4 mb-md-0">
            <FooterHeading>Features</FooterHeading>
            <FooterLink to="/custom-events">Custom Events</FooterLink>
            <FooterLink to="/ticket-management">Ticket Management</FooterLink>
            <FooterLink to="/interactive-voting">Interactive Voting</FooterLink>
            <FooterLink to="/custom-links">Custom Links</FooterLink>
          </Col>
          
          <Col md={2} className="mb-4 mb-md-0">
            <FooterHeading>Support</FooterHeading>
            <FooterLink to="/help">Help Center</FooterLink>
            <FooterLink to="/faq">FAQ</FooterLink>
            <FooterLink to="/contact">Contact Us</FooterLink>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
          </Col>
          
          <Col md={2}>
            <FooterHeading>Contact</FooterHeading>
            <ContactItem>
              <Mail size={16} />
              info@eventsphere.com
            </ContactItem>
            <ContactItem>
              <Phone size={16} />
              +1 (555) 123-4567
            </ContactItem>
          </Col>
        </Row>
        
        <Copyright>
          &copy; {currentYear} EventSphere. All rights reserved.
        </Copyright>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;
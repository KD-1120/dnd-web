import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import styled, { keyframes } from 'styled-components';
import {
  Calendar,
  Ticket,
  Vote,
  Link,
  BarChart2,
  Smartphone,
  FileText,
  Image,
  Share2,
  PieChart,
  Star,
  CheckCircle,
  ChevronRight,
  Play
} from 'lucide-react';
import { GreenButton } from '../GlobalStyles';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Hero Section
const HeroSection = styled.section`
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
  padding: 6rem 1rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%);
  overflow: hidden;
`;

const HeroBackgroundCircle = styled.div`
  position: absolute;
  width: 50vw;
  height: 50vw;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,194,168,0.1) 0%, rgba(0,194,168,0) 70%);
  bottom: -25vw;
  right: -15vw;
  z-index: 0;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  animation: ${fadeIn} 1s ease-out;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, #00c2a8 0%, #007b6e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (min-width: 768px) {
    font-size: 4rem;
  }
`;

const HeroSubtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
`;

const HeroText = styled.p`
  font-size: 1.3rem;
  max-width: 700px;
  margin: 0 auto 3rem;
  color: #555;
  line-height: 1.6;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`;

const AnimatedGreenButton = styled(GreenButton)`
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgba(0, 194, 168, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 194, 168, 0.3);
  }
`;

const WatchDemoButton = styled(Button)`
  background-color: transparent;
  border: none;
  color: #444;
  padding: 0.8rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    color: #00c2a8;
    background-color: transparent;
  }
`;

const PlayIconWrap = styled.div`
  width: 32px;
  height: 32px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const StatBadges = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const StatBadge = styled.div`
  background-color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  span {
    font-weight: 600;
    color: #00c2a8;
  }
`;

// Features Section
const FeaturesSection = styled.section`
  padding: 8rem 1rem;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 5rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #222;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -0.8rem;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #00c2a8 0%, #007b6e 100%);
    border-radius: 2px;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
`;

const FeatureCard = styled.div`
  background-color: white;
  padding: 3rem 2rem;
  border-radius: 16px;
  height: 100%;
  transition: all 0.4s ease;
  box-shadow: 0 8px 30px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.03);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    
    .feature-icon-bg {
      transform: scale(1.1);
    }
  }
`;

const FeatureIconBackground = styled.div`
  width: 70px;
  height: 70px;
  background-color: ${props => props.bgColor || 'rgba(0, 194, 168, 0.1)'};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.8rem;
  transition: transform 0.4s ease;
  position: relative;
`;

const FeatureIcon = styled.div`
  svg {
    color: ${props => props.iconColor || '#00c2a8'};
    stroke-width: 2;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #222;
`;

const FeatureText = styled.p`
  color: #666;
  margin-bottom: 1.8rem;
  line-height: 1.6;
  flex-grow: 1;
`;

const LearnMoreButton = styled.button`
  background: none;
  border: none;
  color: #00c2a8;
  font-weight: 600;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
  
  &:hover {
    color: #007b6e;
    gap: 0.8rem;
  }
`;

// How It Works Section
const HowItWorksSection = styled.section`
  padding: 8rem 1rem;
  background-color: #f9fbfc;
  position: relative;
  overflow: hidden;
`;

const StepContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
  }
`;

const StepIconWrap = styled.div`
  width: 60px;
  height: 60px;
  background-color: white;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  position: relative;
  
  &:before {
    content: "${props => props.number}";
    position: absolute;
    top: -5px;
    right: -5px;
    width: 22px;
    height: 22px;
    background-color: #00c2a8;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: bold;
  }
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h4`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #222;
`;

const StepText = styled.p`
  color: #666;
  line-height: 1.6;
`;

const HowItWorksBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  opacity: 0.4;
  pointer-events: none;
  
  &:before {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,194,168,0.1) 0%, rgba(0,194,168,0) 70%);
    top: -100px;
    left: -100px;
  }
  
  &:after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,194,168,0.1) 0%, rgba(0,194,168,0) 70%);
    bottom: -150px;
    right: -150px;
  }
`;

// Testimonials Section
const TestimonialsSection = styled.section`
  padding: 8rem 1rem;
`;

const TestimonialCard = styled.div`
  background-color: white;
  padding: 3rem 2rem;
  border-radius: 16px;
  height: 100%;
  box-shadow: 0 8px 30px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.03);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
  }
`;

const TestimonialQuote = styled.div`
  font-size: 3rem;
  color: #00c2a8;
  line-height: 1;
  margin-bottom: 1.5rem;
  font-family: Georgia, serif;
`;

const TestimonialText = styled.p`
  color: #444;
  line-height: 1.8;
  font-size: 1.1rem;
  font-style: italic;
  margin-bottom: 1.5rem;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
`;

const TestimonialAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f0f0f0;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    color: #aaa;
  }
`;

const TestimonialInfo = styled.div``;

const TestimonialName = styled.div`
  font-weight: 600;
  color: #222;
`;

const TestimonialRole = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const TestimonialStars = styled.div`
  display: flex;
  margin-top: 1rem;
  color: #ffb800;
`;

// CTA Section
const CtaSection = styled.section`
  padding: 6rem 1rem;
  background: linear-gradient(135deg, #00c2a8 0%, #007b6e 100%);
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const CtaContent = styled.div`
  position: relative;
  z-index: 2;
`;

const CtaTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
`;

const CtaText = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const CtaButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const WhiteButton = styled(Button)`
  background-color: white;
  border: none;
  color: #00c2a8;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f9f9f9;
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  }
`;

const TransparentButton = styled(Button)`
  background-color: transparent;
  border: 2px solid white;
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255,255,255,0.1);
    transform: translateY(-3px);
  }
`;

const CtaBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  
  &:before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
    top: -200px;
    left: -100px;
  }
  
  &:after {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
    bottom: -250px;
    right: -100px;
  }
`;

// Modal
const VideoModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.8);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const VideoContainer = styled.div`
  width: 80%;
  max-width: 800px;
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  
  iframe {
    width: 100%;
    height: 450px;
    border: none;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

// Floating Notification
const FloatingNotification = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  gap: 1rem;
  z-index: 100;
  max-width: 300px;
  animation: ${pulseAnimation} 2s infinite;
`;

const NotificationIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: rgba(0, 194, 168, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    color: #00c2a8;
  }
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
`;

const NotificationText = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

export default function Home() {
  const navigate = useNavigate();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Show notification after 5 seconds
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 5000);

    // Hide notification after 15 seconds
    const hideTimer = setTimeout(() => {
      setShowNotification(false);
    }, 20000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      <HeroSection>
        <HeroBackgroundCircle />
        <HeroContent>
          <HeroTitle>Create stunning event pages in minutes</HeroTitle>
          <HeroSubtitle>Launch, manage, and grow your events all in one place</HeroSubtitle>
          <HeroText>
            EventSphere helps you create beautiful event pages, sell tickets, and engage attendees with custom shareable links—all without any technical skills required.
          </HeroText>
          <HeroButtons>
            <AnimatedGreenButton size="lg">Start Free Trial</AnimatedGreenButton>
            <WatchDemoButton onClick={() => setShowVideoModal(true)}>
              <PlayIconWrap>
                <Play size={14} fill="#00c2a8" color="#00c2a8" />
              </PlayIconWrap>
              Watch Demo
            </WatchDemoButton>
          </HeroButtons>
          <StatBadges>
            <StatBadge>
              <CheckCircle size={16} color="#00c2a8" />
              <span>3,500+</span> Events Created
            </StatBadge>
            <StatBadge>
              <CheckCircle size={16} color="#00c2a8" />
              <span>14-Day</span> Free Trial
            </StatBadge>
            <StatBadge>
              <CheckCircle size={16} color="#00c2a8" />
              <span>No</span> Credit Card Required
            </StatBadge>
          </StatBadges>
        </HeroContent>
      </HeroSection>

      <FeaturesSection id="features">
        <Container>
          <SectionHeader>
            <SectionTitle>Powerful Features</SectionTitle>
            <SectionSubtitle>
              Everything you need to create successful events that attendees will love and remember
            </SectionSubtitle>
          </SectionHeader>
          
          <Row className="g-4">
            <Col md={6} lg={4}>
              <FeatureCard>
                <FeatureIconBackground className="feature-icon-bg">
                  <FeatureIcon>
                    <Calendar size={30} />
                  </FeatureIcon>
                </FeatureIconBackground>
                <FeatureTitle>Custom Event Pages</FeatureTitle>
                <FeatureText>
                  Create professional, branded event pages with your own domain, colors, and design elements in just minutes.
                </FeatureText>
                <LearnMoreButton onClick={() => navigate("/custom-events")}>
                  Explore Features <ChevronRight size={16} />
                </LearnMoreButton>
              </FeatureCard>
            </Col>

            <Col md={6} lg={4}>
              <FeatureCard>
                <FeatureIconBackground className="feature-icon-bg">
                  <FeatureIcon>
                    <Ticket size={30} />
                  </FeatureIcon>
                </FeatureIconBackground>
                <FeatureTitle>Ticket Management</FeatureTitle>
                <FeatureText>
                  Create multiple ticket tiers, offer promo codes, and track sales in real-time with our powerful dashboard.
                </FeatureText>
                <LearnMoreButton onClick={() => navigate("/ticket-management")}>
                  Explore Features <ChevronRight size={16} />
                </LearnMoreButton>
              </FeatureCard>
            </Col>

            <Col md={6} lg={4}>
              <FeatureCard>
                <FeatureIconBackground className="feature-icon-bg">
                  <FeatureIcon>
                    <Vote size={30} />
                  </FeatureIcon>
                </FeatureIconBackground>
                <FeatureTitle>Interactive Voting</FeatureTitle>
                <FeatureText>
                  Boost engagement with live polls, Q&A sessions, and interactive voting features that keep attendees involved.
                </FeatureText>
                <LearnMoreButton onClick={() => navigate("/interactive-voting")}>
                  Explore Features <ChevronRight size={16} />
                </LearnMoreButton>
              </FeatureCard>
            </Col>

            <Col md={6} lg={4}>
              <FeatureCard>
                <FeatureIconBackground className="feature-icon-bg">
                  <FeatureIcon>
                    <Link size={30} />
                  </FeatureIcon>
                </FeatureIconBackground>
                <FeatureTitle>Custom Links</FeatureTitle>
                <FeatureText>
                  Create branded, memorable links for your events that are easy to share and track across all platforms.
                </FeatureText>
                <LearnMoreButton onClick={() => navigate("/custom-links")}>
                  Explore Features <ChevronRight size={16} />
                </LearnMoreButton>
              </FeatureCard>
            </Col>

            <Col md={6} lg={4}>
              <FeatureCard>
                <FeatureIconBackground className="feature-icon-bg">
                  <FeatureIcon>
                    <BarChart2 size={30} />
                  </FeatureIcon>
                </FeatureIconBackground>
                <FeatureTitle>Analytics Dashboard</FeatureTitle>
                <FeatureText>
                  Gain valuable insights with detailed analytics on visitor engagement, ticket sales, and attendee demographics.
                </FeatureText>
                <LearnMoreButton onClick={() => navigate("/analytics-dashboard")}>
                  Explore Features <ChevronRight size={16} />
                </LearnMoreButton>
              </FeatureCard>
            </Col>

            <Col md={6} lg={4}>
              <FeatureCard>
                <FeatureIconBackground className="feature-icon-bg">
                  <FeatureIcon>
                    <Smartphone size={30} />
                  </FeatureIcon>
                </FeatureIconBackground>
                <FeatureTitle>Mobile Optimized</FeatureTitle>
                <FeatureText>
                  All event pages automatically adapt to any device, ensuring a perfect experience from desktop to mobile.
                </FeatureText>
                <LearnMoreButton onClick={() => navigate("/mobile-optimized")}>
                  Explore Features <ChevronRight size={16} />
                </LearnMoreButton>
              </FeatureCard>
            </Col>
          </Row>
        </Container>
      </FeaturesSection>

      <HowItWorksSection>
        <HowItWorksBackground />
        <Container>
          <SectionHeader>
            <SectionTitle>How It Works</SectionTitle>
            <SectionSubtitle>
              Create and launch your event in just four simple steps
            </SectionSubtitle>
          </SectionHeader>
          
          <Row className="g-4">
            <Col md={6}>
              <StepContainer>
                <StepIconWrap number="1">
                  <FileText size={24} color="#00c2a8" />
                </StepIconWrap>
                <StepContent>
                  <StepTitle>Create Your Event</StepTitle>
                  <StepText>
                    Start with one of our professionally designed templates or build from scratch. Input your event details, date, and location to get started.
                  </StepText>
                </StepContent>
              </StepContainer>
            </Col>
            
            <Col md={6}>
              <StepContainer>
                <StepIconWrap number="2">
                  <Image size={24} color="#00c2a8" />
                </StepIconWrap>
                <StepContent>
                  <StepTitle>Customize Your Page</StepTitle>
                  <StepText>
                    Add your branding, images, videos, and set up ticketing options. Our intuitive editor makes customization simple with drag-and-drop functionality.
                  </StepText>
                </StepContent>
              </StepContainer>
            </Col>
            
            <Col md={6}>
              <StepContainer>
                <StepIconWrap number="3">
                  <Share2 size={24} color="#00c2a8" />
                </StepIconWrap>
                <StepContent>
                  <StepTitle>Share Your Link</StepTitle>
                  <StepText>
                    Distribute your custom branded URL across social media, email campaigns, and marketing channels. Track click-through rates in real-time.
                  </StepText>
                </StepContent>
              </StepContainer>
            </Col>
            
            <Col md={6}>
              <StepContainer>
                <StepIconWrap number="4">
                  <PieChart size={24} color="#00c2a8" />
                </StepIconWrap>
                <StepContent>
                  <StepTitle>Manage Your Event</StepTitle>
                  <StepText>
                    Monitor ticket sales, communicate with attendees, and analyze engagement metrics from your comprehensive dashboard.
                  </StepText>
                </StepContent>
              </StepContainer>
            </Col>
          </Row>
        </Container>
      </HowItWorksSection>

      <TestimonialsSection>
        <Container>
          <SectionHeader>
            <SectionTitle>Why EventSphere?</SectionTitle>
            <SectionSubtitle>
              Join the event organizers who are revolutionizing how they connect with attendees
            </SectionSubtitle>
          </SectionHeader>
          
          <Row className="g-4">
            <Col md={4}>
              <TestimonialCard>
                <TestimonialQuote>"</TestimonialQuote>
                <TestimonialText>
                  "We're building EventSphere to revolutionize event management with real-time insights, seamless ticketing, and audience engagement tools. Join us on this journey!"
                </TestimonialText>
                <TestimonialAuthor>
                  <TestimonialAvatar>
                    <Star size={24} />
                  </TestimonialAvatar>
                  <TestimonialInfo>
                    <TestimonialName>Sarah Johnson</TestimonialName>
                    <TestimonialRole>EventSphere Team</TestimonialRole>
                    <TestimonialStars>
                      <Star size={16} fill="#ffb800" />
                      <Star size={16} fill="#ffb800" />
                      <Star size={16} fill="#ffb800" />
                      <Star size={16} fill="#ffb800" />
                      <Star size={16} fill="#ffb800" />
                    </TestimonialStars>
                  </TestimonialInfo>
                </TestimonialAuthor>
              </TestimonialCard>
            </Col>

            <Col md={4}>
              <TestimonialCard>
                <TestimonialQuote>"</TestimonialQuote>
                <TestimonialText>
                "Be among the first to experience EventSphere! We're looking for event organizers to test our platform and provide feedback during our early access program."
                </TestimonialText>
                <TestimonialAuthor>
                  <TestimonialAvatar>
                    <Star size={24} />
                  </TestimonialAvatar>
                  <TestimonialInfo>
                    <TestimonialName>Michael Lee</TestimonialName>
                    <TestimonialRole>Product Manager</TestimonialRole>
                    <TestimonialStars>
                      <Star size={16} fill="#ffb800" />
                      <Star size={16} fill="#ffb800" />
                      <Star size={16} fill="#ffb800" />
                      <Star size={16} fill="#ffb800" />
                      <Star size={16} fill="#ffb800" />
                    </TestimonialStars>
                  </TestimonialInfo>
                </TestimonialAuthor>
              </TestimonialCard>
            </Col>

            <Col md={4}>
              <TestimonialCard>
                <TestimonialQuote>"</TestimonialQuote>
                <TestimonialText>
                  "Did you know 78% of event organizers struggle with real-time audience engagement? EventSphere is here to change that with our innovative interactive tools!"
                </TestimonialText>
                <TestimonialAuthor>
                  <TestimonialAvatar>
                    <Star size={24} />
                  </TestimonialAvatar>
                  <TestimonialInfo>
                    <TestimonialName>Jessica Chen</TestimonialName>
                    <TestimonialRole>Events Specialist</TestimonialRole>
                    <TestimonialStars>
                      <Star size={16} fill="#ffb800" />
                      <Star size={16} fill="#ffb800" />
                      <Star size={16} fill="#ffb800" />
                      <Star size={16} fill="#ffb800" />
                      <Star size={16} fill="#ffb800" />
                    </TestimonialStars>
                  </TestimonialInfo>
                </TestimonialAuthor>
              </TestimonialCard>
            </Col>
          </Row>
        </Container>
      </TestimonialsSection>

      <CtaSection>
        <CtaBackground />
        <CtaContent>
          <CtaTitle>Ready to elevate your events?</CtaTitle>
          <CtaText>
            Join us as we build EventSphere—the platform designed to transform how you create, manage, and grow your events. Start your free trial today and see the difference!
          </CtaText>
          <CtaButtons>
            <WhiteButton size="lg">Start Free Trial</WhiteButton>
            <TransparentButton size="lg">Schedule Demo</TransparentButton>
          </CtaButtons>
        </CtaContent>
      </CtaSection>

      {/* Video Demo Modal */}
      <VideoModal show={showVideoModal}>
        <VideoContainer>
          <CloseButton onClick={() => setShowVideoModal(false)}>✕</CloseButton>
          <iframe 
            src="/api/placeholder/800/450" 
            title="EventSphere Demo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </VideoContainer>
      </VideoModal>

      {/* Floating Notification */}
      <FloatingNotification show={showNotification}>
        <NotificationIcon>
          <Ticket size={20} />
        </NotificationIcon>
        <NotificationContent>
          <NotificationTitle>Limited Time Offer!</NotificationTitle>
          <NotificationText>Get 30% off when you sign up today.</NotificationText>
        </NotificationContent>
      </FloatingNotification>
    </>
  );
}
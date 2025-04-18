import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import {
  Monitor,
  PaintBucket,
  Image as ImageIcon,
  Search,
  FileText,
  Ticket,
  Link as LinkIcon,
  BarChart2
} from 'lucide-react';

// Theme definition
const theme = {
  colors: {
    primaryLight: '#00c2a8',
    primary: '#00a692',
    secondary: '#64748B',
    dark: '#1E293B',
    light: '#F8FAFC',
    white: '#FFFFFF',
    cardBg: '#F1F5F9',
    success: '#0CAF60',
    border: '#E2E8F0'
  },
  fonts: {
    body: 'Inter, system-ui, -apple-system, sans-serif',
    heading: 'Inter, system-ui, -apple-system, sans-serif'
  },
  fontSizes: {
    small: '0.875rem',
    body: '1rem',
    lead: '1.125rem',
    h3: '1.25rem',
    h2: '1.75rem',
    h1: '2.25rem'
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px'
  }
};

// Styled Components
const PageSection = styled.section`
  padding: ${props => props.theme.spacing.xl} 0;
  background-color: ${props => props.light ? props.theme.colors.light : props.theme.colors.white};
  position: relative;
  overflow: hidden;
`;

const MainHeading = styled.h1`
  font-size: ${props => props.theme.fontSizes.h1};
  font-weight: 700;
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.dark};
`;

const SubHeading = styled.h2`
  font-size: ${props => props.theme.fontSizes.h2};
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.dark};
  text-align: ${props => props.center ? 'center' : 'left'};
`;

const FeatureHeading = styled.h3`
  font-size: ${props => props.theme.fontSizes.h3};
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.xs};
  color: ${props => props.theme.colors.dark};
`;

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.fontSizes.body};
  line-height: 1.5;
`;

const LeadText = styled.p`
  font-size: ${props => props.theme.fontSizes.lead};
  color: ${props => props.theme.colors.secondary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const CapabilityItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const IconWrapper = styled.div`
  margin-right: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.primary};
  flex-shrink: 0;
`;

const PlaceholderImage = styled.div`
  background-color: ${props => props.theme.colors.cardBg};
  width: 100%;
  height: 240px;
  border-radius: 8px;
  margin-bottom: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const TemplateCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: ${props => props.theme.spacing.lg};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadows.sm};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const ActionButton = styled(Button)`
  padding: 0.5rem 1.5rem;
  margin-right: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
  border-radius: 4px;
  font-weight: 500;

  &.btn-primary {
    background-color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};

    &:hover {
      background-color: ${props => props.theme.colors.white}e6;
      color: ${props => props.theme.colors.primary}e6;
      border-color: ${props => props.theme.colors.primary}e6;
    }
  }

  &.btn-outline-primary {
    color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};

    &:hover {
      background-color: ${props => props.theme.colors.primaryLight};
      color: ${props => props.theme.colors.white};
    }
  }
`;

const CtaSection = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl} 0;
`;

const CardBody = styled(Card.Body)`
  padding: ${props => props.theme.spacing.lg};
`;

const FeatureIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: #e0f7f4;
  color: #00c2a8;
  border-radius: 8px;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

function CustomEvents() {
  return (
    <ThemeProvider theme={theme}>
      <Container fluid>
        <PageSection>
          <Container>
            <Row className="align-items-center">
              <Col lg={6}>
                <MainHeading>Custom Event Pages</MainHeading>
                <LeadText>Create branded event pages that reflect your unique style and engage your audience</LeadText>
              </Col>
              <Col lg={6}>
                <PlaceholderImage />
              </Col>
            </Row>
          </Container>
        </PageSection>

        <PageSection light>
          <Container>
            <Row className="align-items-center">
              <Col lg={6}>
                <PlaceholderImage />
              </Col>
              <Col lg={6}>
                <FeatureHeading>Design Without Limits</FeatureHeading>
                <FeatureDescription>
                  Our intuitive drag-and-drop editor lets you create stunning event pages without any coding knowledge. Choose from professionally designed templates or start from scratch to build your perfect event page.
                </FeatureDescription>
              </Col>
            </Row>
          </Container>
        </PageSection>

        <PageSection>
          <Container>
            <Row className="align-items-center">
              <Col lg={6}>
                <FeatureHeading>Custom Domain Integration</FeatureHeading>
                <FeatureDescription>
                  Use your own custom subdomain for your event page. Our seamless integration ensures your branding remains consistent across all touchpoints, enhancing recognition and trust with your audience.
                </FeatureDescription>
              </Col>
              <Col lg={6}>
                <PlaceholderImage />
              </Col>
            </Row>
          </Container>
        </PageSection>

        <PageSection light>
          <Container>
            <SubHeading>Key Capabilities</SubHeading>
            <Row>
              <Col md={6}>
                <CapabilityItem>
                  <IconWrapper>
                    <Monitor size={24} strokeWidth={2} />
                  </IconWrapper>
                  <div>
                    <FeatureHeading>Responsive Design</FeatureHeading>
                    <FeatureDescription>
                      Pages look perfect on any device - desktop, tablet, or mobile
                    </FeatureDescription>
                  </div>
                </CapabilityItem>
              </Col>
              <Col md={6}>
                <CapabilityItem>
                  <IconWrapper>
                    <PaintBucket size={24} strokeWidth={2} />
                  </IconWrapper>
                  <div>
                    <FeatureHeading>Custom Branding</FeatureHeading>
                    <FeatureDescription>
                      Apply your brand colors, logos, and fonts throughout
                    </FeatureDescription>
                  </div>
                </CapabilityItem>
              </Col>
              <Col md={6}>
                <CapabilityItem>
                  <IconWrapper>
                    <ImageIcon size={24} strokeWidth={2} />
                  </IconWrapper>
                  <div>
                    <FeatureHeading>Media Integration</FeatureHeading>
                    <FeatureDescription>
                      Embed images, image galleries, and social media feeds
                    </FeatureDescription>
                  </div>
                </CapabilityItem>
              </Col>
              <Col md={6}>
                <CapabilityItem>
                  <IconWrapper>
                    <Search size={24} strokeWidth={2} />
                  </IconWrapper>
                  <div>
                    <FeatureHeading>SEO Optimization</FeatureHeading>
                    <FeatureDescription>
                      Built-in tools to improve search engine visibility
                    </FeatureDescription>
                  </div>
                </CapabilityItem>
              </Col>
              <Col md={6}>
                <CapabilityItem>
                  <IconWrapper>
                    <FileText size={24} strokeWidth={2} />
                  </IconWrapper>
                  <div>
                    <FeatureHeading>Custom Forms</FeatureHeading>
                    <FeatureDescription>
                      Create registration forms with custom fields for attendee data
                    </FeatureDescription>
                  </div>
                </CapabilityItem>
              </Col>
            </Row>
          </Container>
        </PageSection>

        <PageSection>
          <Container>
            <CtaSection>
              <SubHeading center>Ready to create your custom event page?</SubHeading>
              <ActionButton variant="primary" size="lg">Start Free Trial</ActionButton>
              <ActionButton variant="outline-primary" size="lg">View All Templates</ActionButton>
            </CtaSection>
          </Container>
        </PageSection>

        <PageSection light>
          <Container>
            <SubHeading center>Related Features</SubHeading>
            <Row>
              <Col md={4}>
                <TemplateCard>
                  <CardBody>
                    <FeatureIcon>
                      <Ticket size={24} strokeWidth={2} />
                    </FeatureIcon>
                    <FeatureHeading>Ticket Management</FeatureHeading>
                    <FeatureDescription>
                      Create, manage, distribute, and track sales in one place
                    </FeatureDescription>
                    <div className="mt-4">
                      <ActionButton variant="primary" size="sm">Learn More</ActionButton>
                    </div>
                  </CardBody>
                </TemplateCard>
              </Col>
              <Col md={4}>
                <TemplateCard>
                  <CardBody>
                    <FeatureIcon>
                      <LinkIcon size={24} strokeWidth={2} />
                    </FeatureIcon>
                    <FeatureHeading>Custom Links</FeatureHeading>
                    <FeatureDescription>
                      Create unique, branded links for your events that are easy to share
                    </FeatureDescription>
                    <div className="mt-4">
                      <ActionButton variant="primary" size="sm">Learn More</ActionButton>
                    </div>
                  </CardBody>
                </TemplateCard>
              </Col>
              <Col md={4}>
                <TemplateCard>
                  <CardBody>
                    <FeatureIcon>
                      <BarChart2 size={24} strokeWidth={2} />
                    </FeatureIcon>
                    <FeatureHeading>Analytics Dashboard</FeatureHeading>
                    <FeatureDescription>
                      View registration, ticket sales, and attendee metrics
                    </FeatureDescription>
                    <div className="mt-4">
                      <ActionButton variant="primary" size="sm">Learn More</ActionButton>
                    </div>
                  </CardBody>
                </TemplateCard>
              </Col>
            </Row>
          </Container>
        </PageSection>
      </Container>
    </ThemeProvider>
  );
}

export default CustomEvents;
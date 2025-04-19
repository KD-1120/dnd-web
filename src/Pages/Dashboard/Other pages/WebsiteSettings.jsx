import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import { ChevronLeft, Globe, Palette, Layout, Edit2, Eye, Layers } from 'lucide-react';
import { EventService } from '../WebsiteBuilder/services/EventService';
import CustomDomainSettings from './CustomDomainSettings';
import { colors, spacing, shadows, borderRadius, typography } from '../../../GlobalStyles';

const PageWrapper = styled.div`
  padding: ${spacing.lg};
  background-color: ${colors.light};
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${colors.secondary};
  text-decoration: none;
  margin-bottom: ${spacing.md};
  
  &:hover {
    color: ${colors.primary};
    text-decoration: none;
  }
`;

const PageTitle = styled.h1`
  font-size: ${typography.fontSizes.h1};
  font-weight: 600;
  color: ${colors.dark};
  margin-bottom: ${spacing.md};
`;

const SectionTitle = styled.h2`
  font-size: ${typography.fontSizes.h2};
  font-weight: 600;
  color: ${colors.dark};
  margin-bottom: ${spacing.md};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
`;

const WebsiteCard = styled(Card)`
  border: none;
  box-shadow: ${shadows.sm};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.lg};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${shadows.md};
  }
`;

const TemplatePreview = styled.div`
  height: 200px;
  background-image: url(${props => props.src || '/api/placeholder/800/400'});
  background-size: cover;
  background-position: center;
  border-top-left-radius: ${borderRadius.md};
  border-top-right-radius: ${borderRadius.md};
  position: relative;
`;

const TemplateOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-top-left-radius: ${borderRadius.md};
  border-top-right-radius: ${borderRadius.md};
  
  ${WebsiteCard}:hover & {
    opacity: 1;
  }
`;

const TemplateInfo = styled.div`
  padding: ${spacing.md};
`;

const TemplateTitle = styled.h3`
  font-size: ${typography.fontSizes.large};
  font-weight: 600;
  margin-bottom: ${spacing.xs};
`;

const TemplateStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  margin-bottom: ${spacing.md};
  color: ${props => props.published ? colors.success : colors.secondary};
  font-size: ${typography.fontSizes.small};
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: ${spacing.sm};
`;

const WebsiteSettings = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [template, setTemplate] = useState(null);
  const [publishStatus, setPublishStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEventData = async () => {
      try {
        setLoading(true);
        
        // Load event details
        const eventData = await EventService.getEventById(eventId);
        setEvent(eventData);
        
        // Load website template
        const templateData = await EventService.getTemplate(eventId);
        setTemplate(templateData);
        
        // Get publishing status
        const status = await EventService.getPublishingStatus(eventId);
        setPublishStatus(status);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading event website data:', error);
        setError('Failed to load website data. Please try again.');
        setLoading(false);
      }
    };
    
    loadEventData();
  }, [eventId]);

  const handleEditWebsite = () => {
    // Open in new tab
    window.open(`/dashboard/events/${eventId}/website`, '_blank');
  };

  const handlePreviewWebsite = () => {
    const previewUrl = EventService.getPreviewUrl(eventId);
    window.open(previewUrl, '_blank');
  };

  const handleSwitchTemplate = () => {
    navigate('/dashboard/events/website-templates', { 
      state: { eventId, isNewEvent: false }
    });
  };

  if (loading) {
    return (
      <PageWrapper>
        <Container>
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading website settings...</span>
            </Spinner>
          </div>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <BackLink to={`/dashboard/events/${eventId}`}>
          <ChevronLeft size={16} />
          Back to Event
        </BackLink>
        
        <PageTitle>Event Website Settings</PageTitle>
        
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        <Row>
          <Col lg={8}>
            <SectionTitle>
              <Globe size={24} />
              Website URL
            </SectionTitle>
            
            <CustomDomainSettings 
              eventId={eventId} 
              eventTitle={event?.title || 'Event'}
            />
            
            <SectionTitle>
              <Layout size={24} />
              Website Template
            </SectionTitle>
            
            <WebsiteCard>
              <TemplatePreview src={template?.thumbnail || '/api/placeholder/800/400'}>
                <TemplateOverlay>
                  <ButtonsContainer>
                    <Button variant="light" onClick={handlePreviewWebsite}>
                      <Eye size={16} className="me-1" />
                      Preview
                    </Button>
                    <Button variant="primary" onClick={handleEditWebsite}>
                      <Edit2 size={16} className="me-1" />
                      Edit Website
                    </Button>
                  </ButtonsContainer>
                </TemplateOverlay>
              </TemplatePreview>
              <TemplateInfo>
                <TemplateTitle>{template?.name || 'Custom Website'}</TemplateTitle>
                <TemplateStatus published={publishStatus?.status === 'live'}>
                  {publishStatus?.status === 'live' ? (
                    <>
                      <Eye size={16} />
                      Published {publishStatus?.publishedAt ? new Date(publishStatus.publishedAt).toLocaleDateString() : ''}
                    </>
                  ) : (
                    <>
                      <Layers size={16} />
                      Draft - Not Published
                    </>
                  )}
                </TemplateStatus>
                <ButtonsContainer>
                  <Button variant="outline-primary" onClick={handleEditWebsite}>
                    <Edit2 size={16} className="me-1" />
                    Edit Website
                  </Button>
                  <Button variant="outline-secondary" onClick={handleSwitchTemplate}>
                    <Palette size={16} className="me-1" />
                    Switch Template
                  </Button>
                  <Button variant="outline-secondary" onClick={handlePreviewWebsite}>
                    <Eye size={16} className="me-1" />
                    Preview
                  </Button>
                </ButtonsContainer>
              </TemplateInfo>
            </WebsiteCard>
            
            <SectionTitle>
              <Palette size={24} />
              Website Settings
            </SectionTitle>
            
            <WebsiteCard>
              <Card.Body>
                <h4>SEO Settings</h4>
                <p className="text-muted">
                  Customize how your event website appears in search engines.
                </p>
                
                <Row className="mt-4">
                  <Col md={6}>
                    <div className="mb-3">
                      <h5>Meta Title</h5>
                      <p className="text-muted">
                        {event?.seoTitle || event?.title || 'Event Title'}
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <h5>Meta Description</h5>
                      <p className="text-muted">
                        {event?.seoDescription || event?.description?.substring(0, 160) || 'No description set'}
                      </p>
                    </div>
                  </Col>
                </Row>
                
                <Button variant="outline-primary" onClick={handleEditWebsite}>
                  <Edit2 size={16} className="me-1" />
                  Edit SEO Settings
                </Button>
              </Card.Body>
            </WebsiteCard>
          </Col>
          
          <Col lg={4}>
            <WebsiteCard>
              <Card.Body>
                <h4>Website Publishing</h4>
                <p className="text-muted">
                  Control the visibility of your event website.
                </p>
                
                <div className="mt-3 mb-4">
                  <h5>Current Status</h5>
                  <TemplateStatus published={publishStatus?.status === 'live'}>
                    {publishStatus?.status === 'live' ? (
                      <>
                        <Eye size={16} />
                        Published and Visible to Public
                      </>
                    ) : (
                      <>
                        <Layers size={16} />
                        Draft - Not Published
                      </>
                    )}
                  </TemplateStatus>
                </div>
                
                {publishStatus?.status === 'live' ? (
                  <>
                    <p>
                      Your website was published on {publishStatus?.publishedAt ? new Date(publishStatus.publishedAt).toLocaleDateString() : 'N/A'}
                    </p>
                    <Button variant="outline-danger" className="w-100">
                      Unpublish Website
                    </Button>
                  </>
                ) : (
                  <>
                    <p>
                      Your website is currently in draft mode and not visible to the public.
                    </p>
                    <Button variant="success" className="w-100">
                      Publish Website
                    </Button>
                  </>
                )}
              </Card.Body>
            </WebsiteCard>
            
            <WebsiteCard>
              <Card.Body>
                <h4>Website Statistics</h4>
                <p className="text-muted">
                  View analytics for your event website.
                </p>
                
                <div className="mt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Page Views:</span>
                    <strong>{event?.pageViews || 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Unique Visitors:</span>
                    <strong>{event?.uniqueVisitors || 0}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Last Published:</span>
                    <strong>{publishStatus?.publishedAt ? new Date(publishStatus.publishedAt).toLocaleDateString() : 'Never'}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Last Modified:</span>
                    <strong>{publishStatus?.lastModified ? new Date(publishStatus.lastModified).toLocaleDateString() : 'Never'}</strong>
                  </div>
                </div>
                
                <Button variant="outline-secondary" className="w-100 mt-3" onClick={() => navigate(`/dashboard/events/${eventId}/analytics`)}>
                  View Full Analytics
                </Button>
              </Card.Body>
            </WebsiteCard>
          </Col>
        </Row>
      </Container>
    </PageWrapper>
  );
};

export default WebsiteSettings;
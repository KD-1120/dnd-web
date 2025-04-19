import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Form, Button, Alert } from 'react-bootstrap';
import { Globe, Share2, Settings } from 'lucide-react';
import { EventService } from '../services/EventService';
import { SubdomainService } from '../services/SubdomainServices';

const SettingsContainer = styled.div`
  padding: 20px;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FormGroup = styled(Form.Group)`
  margin-bottom: 16px;
`;

export function WebsiteSettingsPanel({ eventId, onClose }) {
  const [settings, setSettings] = useState({
    subdomain: '',
    seoTitle: '',
    seoDescription: '',
    isPublic: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const eventData = await EventService.getEventById(eventId);
      const subdomain = await SubdomainService.getSubdomainForEvent(eventId);
      
      setSettings({
        subdomain: subdomain || '',
        seoTitle: eventData.seoTitle || eventData.title || '',
        seoDescription: eventData.seoDescription || eventData.description || '',
        isPublic: eventData.isPublic ?? true,
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      setError('Failed to load website settings');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const checkSubdomainAvailability = async (subdomain) => {
    if (!subdomain) return;
    
    try {
      const isAvailable = await SubdomainService.isSubdomainAvailable(subdomain);
      setAvailabilityStatus({
        available: isAvailable,
        message: isAvailable ? 'This subdomain is available!' : 'This subdomain is already taken'
      });
    } catch (error) {
      setAvailabilityStatus({
        available: false,
        message: 'Invalid subdomain format'
      });
    }
  };

  const handleSubdomainChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSettings(prev => ({ ...prev, subdomain: value }));
    setAvailabilityStatus(null);
  };

  const handleBlur = () => {
    if (settings.subdomain) {
      checkSubdomainAvailability(settings.subdomain);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      // Update subdomain if changed
      if (settings.subdomain) {
        await SubdomainService.registerSubdomain(eventId, settings.subdomain);
      }
      
      // Update SEO and visibility settings
      await EventService.updateEvent(eventId, {
        seoTitle: settings.seoTitle,
        seoDescription: settings.seoDescription,
        isPublic: settings.isPublic,
      });
      
      setSuccess('Website settings updated successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save website settings');
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <SettingsContainer>
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Section>
          <SectionTitle>
            <Globe size={16} />
            Custom Domain
          </SectionTitle>
          <FormGroup>
            <Form.Label>Subdomain</Form.Label>
            <div className="input-group">
              <Form.Control
                type="text"
                value={settings.subdomain}
                onChange={handleSubdomainChange}
                onBlur={handleBlur}
                placeholder="your-event"
                isValid={availabilityStatus?.available}
                isInvalid={availabilityStatus?.available === false}
              />
              <span className="input-group-text">.eventhorizon.com</span>
            </div>
            {availabilityStatus && (
              <Form.Text className={availabilityStatus.available ? 'text-success' : 'text-danger'}>
                {availabilityStatus.message}
              </Form.Text>
            )}
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>
            <Share2 size={16} />
            SEO Settings
          </SectionTitle>
          <FormGroup>
            <Form.Label>SEO Title</Form.Label>
            <Form.Control
              type="text"
              value={settings.seoTitle}
              onChange={(e) => setSettings(prev => ({ ...prev, seoTitle: e.target.value }))}
              placeholder="Enter SEO title"
            />
          </FormGroup>
          <FormGroup>
            <Form.Label>SEO Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={settings.seoDescription}
              onChange={(e) => setSettings(prev => ({ ...prev, seoDescription: e.target.value }))}
              placeholder="Enter SEO description"
            />
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>
            <Settings size={16} />
            Visibility Settings
          </SectionTitle>
          <FormGroup>
            <Form.Check
              type="switch"
              id="visibility-switch"
              label="Make this event public and searchable"
              checked={settings.isPublic}
              onChange={(e) => setSettings(prev => ({ ...prev, isPublic: e.target.checked }))}
            />
          </FormGroup>
        </Section>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </div>
      </Form>
    </SettingsContainer>
  );
}

export default WebsiteSettingsPanel;
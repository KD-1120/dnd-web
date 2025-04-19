import React, { useState, useEffect } from 'react';
import { SubdomainService } from '../services/SubdomainServices';

export const CustomDomainSettings = ({ eventId, eventTitle }) => {
  const [subdomain, setSubdomain] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCurrentSubdomain();
  }, [eventId]);

  const loadCurrentSubdomain = async () => {
    try {
      setIsLoading(true);
      const currentSubdomain = await SubdomainService.getSubdomainForEvent(eventId);
      setSubdomain(currentSubdomain || '');
    } catch (error) {
      setError('Failed to load current subdomain');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestSubdomain = async () => {
    try {
      const suggestion = await SubdomainService.suggestSubdomain(eventTitle);
      setSubdomain(suggestion);
      setError('');
    } catch (error) {
      setError('Failed to generate suggestion');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      
      if (!subdomain) {
        setError('Please enter a subdomain');
        return;
      }

      await SubdomainService.registerSubdomain(eventId, subdomain);
      setSuccess('Domain settings updated successfully!');
    } catch (error) {
      setError(error.message || 'Failed to update domain settings');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="custom-domain-settings">
      <h2>Website Domain Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Subdomain
            <div className="subdomain-input-group">
              <input
                type="text"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
                placeholder="your-event"
              />
              <span className="domain-suffix">.eventhorizon.com</span>
            </div>
          </label>
          <button type="button" onClick={handleSuggestSubdomain}>
            Suggest Subdomain
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-actions">
          <button type="submit">
            Save Domain Settings
          </button>
        </div>
      </form>

      <style jsx>{`
        .custom-domain-settings {
          padding: 20px;
          max-width: 600px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .subdomain-input-group {
          display: flex;
          align-items: center;
          margin-top: 8px;
        }
        .domain-suffix {
          margin-left: 8px;
          color: #666;
        }
        input {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          width: 200px;
        }
        button {
          padding: 8px 16px;
          background: #0066cc;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-left: 8px;
        }
        button:hover {
          background: #0052a3;
        }
        .error-message {
          color: #dc3545;
          margin-bottom: 16px;
        }
        .success-message {
          color: #28a745;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
};

export default CustomDomainSettings;
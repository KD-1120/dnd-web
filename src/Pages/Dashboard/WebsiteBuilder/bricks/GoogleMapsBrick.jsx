// src/Pages/Dashboard/WebsiteBuilder/bricks/GoogleMapsBrick.jsx
import React from 'react';
import styled from 'styled-components';
import { Map, MapPin } from 'lucide-react';

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: ${props => props.height || '400px'};
  border-radius: ${props => props.borderRadius || '8px'};
  overflow: hidden;
  margin-top: ${props => props.marginTop || '0'};
  margin-bottom: ${props => props.marginBottom || '0'};
  margin-left: ${props => props.marginLeft || '0'};
  margin-right: ${props => props.marginRight || '0'};
  border: ${props => props.border || 'none'};
  box-shadow: ${props => props.boxShadow || 'none'};
`;

const MapIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(245, 245, 245, 0.9);
  padding: 20px;
  text-align: center;
`;

const MapIcon = styled.div`
  font-size: 40px;
  color: #2563eb;
  margin-bottom: 16px;
`;

const LocationTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const LocationAddress = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #666;
`;

const LocationDetails = styled.div`
  position: ${props => props.position || 'absolute'};
  bottom: ${props => props.position === 'absolute' ? '20px' : 'auto'};
  left: ${props => props.position === 'absolute' ? '20px' : 'auto'};
  background-color: ${props => props.bgColor || 'white'};
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: ${props => props.position === 'absolute' ? '300px' : '100%'};
  border-left: ${props => props.accentColor ? `4px solid ${props.accentColor}` : 'none'};
  margin-top: ${props => props.position !== 'absolute' ? '16px' : '0'};
  width: ${props => props.position !== 'absolute' ? '100%' : 'auto'};
`;

const LocationName = styled.h4`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const LocationInfo = styled.p`
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GetDirectionsButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: ${props => props.bgColor || '#2563eb'};
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.hoverBgColor || '#1d4ed8'};
    transform: translateY(-2px);
  }
`;

export function GoogleMapsBrickComponent({ brick, onSelect, isSelected }) {
  const { id, props = {} } = brick;
  
  // Generate Google Maps URL based on address or coordinates
  const getGoogleMapsEmbedUrl = () => {
    if (props.address) {
      return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(props.address)}`;
    } else if (props.latitude && props.longitude) {
      return `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${props.latitude},${props.longitude}&zoom=${props.zoom || 15}`;
    }
    return '';
  };
  
  const getGoogleMapsDirectionsUrl = () => {
    if (props.address) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(props.address)}`;
    } else if (props.latitude && props.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${props.latitude},${props.longitude}`;
    }
    return '#';
  };
  
  const hasValidLocation = props.address || (props.latitude && props.longitude);
  
  return (
    <div 
      style={{ 
        position: 'relative',
        padding: '4px',
        border: isSelected ? '1px dashed #2563eb' : 'none',
        borderRadius: '4px'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(id);
      }}
    >
      <MapContainer
        height={props.height}
        borderRadius={props.borderRadius}
        marginTop={props.marginTop}
        marginBottom={props.marginBottom}
        marginLeft={props.marginLeft}
        marginRight={props.marginRight}
        border={props.border}
        boxShadow={props.boxShadow}
      >
        {hasValidLocation ? (
          <MapIframe 
            src={getGoogleMapsEmbedUrl()}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
          />
        ) : (
          <MapOverlay>
            <MapIcon>
              <Map size={48} />
            </MapIcon>
            <LocationTitle>Map Location</LocationTitle>
            <LocationAddress>Enter an address or coordinates to display the map</LocationAddress>
          </MapOverlay>
        )}
        
        {props.showLocationDetails && props.locationDetailsPosition === 'overlay' && (
          <LocationDetails 
            position="absolute"
            bgColor={props.locationDetailsBgColor}
            accentColor={props.accentColor}
          >
            <LocationName>{props.locationName || 'Event Venue'}</LocationName>
            <LocationInfo>
              <MapPin size={16} />
              {props.address || 'Enter venue address'}
            </LocationInfo>
            {props.showDirectionsButton && (
              <GetDirectionsButton 
                href={getGoogleMapsDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                bgColor={props.buttonBgColor}
                hoverBgColor={props.buttonHoverBgColor}
              >
                <Map size={16} />
                Get Directions
              </GetDirectionsButton>
            )}
          </LocationDetails>
        )}
      </MapContainer>
      
      {props.showLocationDetails && props.locationDetailsPosition === 'below' && (
        <LocationDetails 
          position="relative"
          bgColor={props.locationDetailsBgColor}
          accentColor={props.accentColor}
        >
          <LocationName>{props.locationName || 'Event Venue'}</LocationName>
          <LocationInfo>
            <MapPin size={16} />
            {props.address || 'Enter venue address'}
          </LocationInfo>
          {props.showDirectionsButton && (
            <GetDirectionsButton 
              href={getGoogleMapsDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              bgColor={props.buttonBgColor}
              hoverBgColor={props.buttonHoverBgColor}
            >
              <Map size={16} />
              Get Directions
            </GetDirectionsButton>
          )}
        </LocationDetails>
      )}
    </div>
  );
}

export const GoogleMapsBrickInspector = {
  displayName: 'Google Maps',
  props: {
    // Location settings
    address: { type: 'text', label: 'Address', defaultValue: '' },
    latitude: { type: 'text', label: 'Latitude', defaultValue: '' },
    longitude: { type: 'text', label: 'Longitude', defaultValue: '' },
    zoom: { type: 'number', label: 'Zoom Level', defaultValue: 15 },
    
    // Map appearance
    height: { type: 'text', label: 'Height', defaultValue: '400px' },
    borderRadius: { type: 'number', label: 'Border Radius', defaultValue: 8, unit: 'px' },
    border: { type: 'text', label: 'Border', defaultValue: 'none' },
    boxShadow: { type: 'text', label: 'Box Shadow', defaultValue: '0 4px 12px rgba(0, 0, 0, 0.1)' },
    
    // Location details
    showLocationDetails: { type: 'boolean', label: 'Show Location Details', defaultValue: true },
    locationDetailsPosition: { type: 'select', label: 'Details Position', options: ['overlay', 'below'], defaultValue: 'overlay' },
    locationDetailsBgColor: { type: 'colorpicker', label: 'Details Background', defaultValue: 'white' },
    accentColor: { type: 'colorpicker', label: 'Accent Color', defaultValue: '#2563eb' },
    locationName: { type: 'text', label: 'Location Name', defaultValue: 'Event Venue' },
    
    // Button settings
    showDirectionsButton: { type: 'boolean', label: 'Show Directions Button', defaultValue: true },
    buttonBgColor: { type: 'colorpicker', label: 'Button Color', defaultValue: '#2563eb' },
    buttonHoverBgColor: { type: 'colorpicker', label: 'Button Hover Color', defaultValue: '#1d4ed8' },
    
    // Margins
    marginTop: { type: 'number', label: 'Margin Top', defaultValue: 0, unit: 'px' },
    marginBottom: { type: 'number', label: 'Margin Bottom', defaultValue: 0, unit: 'px' },
    marginLeft: { type: 'number', label: 'Margin Left', defaultValue: 0, unit: 'px' },
    marginRight: { type: 'number', label: 'Margin Right', defaultValue: 0, unit: 'px' },
  }
};
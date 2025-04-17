// src/Pages/Dashboard/WebsiteBuilder/bricks/SocialMediaSharingBrick.jsx
import React from 'react';
import styled from 'styled-components';
import { Facebook, Twitter, Linkedin, Instagram, Link as LinkIcon } from 'lucide-react';

const SharingContainer = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  align-items: center;
  justify-content: ${props => props.alignment || 'flex-start'};
  gap: ${props => props.gap || '16px'};
  margin-top: ${props => props.marginTop || '0'};
  margin-bottom: ${props => props.marginBottom || '0'};
  margin-left: ${props => props.marginLeft || '0'};
  margin-right: ${props => props.marginRight || '0'};
  width: 100%;
`;

const Title = styled.div`
  font-family: ${props => props.fontFamily || 'Inter, sans-serif'};
  font-size: ${props => props.fontSize || '16px'};
  font-weight: ${props => props.fontWeight || '600'};
  color: ${props => props.color || '#333'};
  margin-right: ${props => props.showTitle ? '16px' : '0'};
  display: ${props => props.showTitle ? 'block' : 'none'};
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: ${props => props.shape === 'circle' ? '50%' : '8px'};
  background-color: ${props => props.bgColor || '#f5f5f5'};
  color: ${props => props.iconColor || '#333'};
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: ${props => props.hoverBgColor || props.bgColor || '#f5f5f5'};
    color: ${props => props.hoverIconColor || props.iconColor || '#333'};
  }
`;

const SocialButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: ${props => props.bgColor || '#f5f5f5'};
  color: ${props => props.textColor || '#333'};
  font-family: ${props => props.fontFamily || 'Inter, sans-serif'};
  font-size: ${props => props.fontSize || '14px'};
  font-weight: ${props => props.fontWeight || '500'};
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: ${props => props.hoverBgColor || props.bgColor || '#f5f5f5'};
    color: ${props => props.hoverTextColor || props.textColor || '#333'};
  }
`;

export function SocialMediaSharingBrickComponent({ brick, onSelect, isSelected }) {
  const { id, props = {} } = brick;
  
  const networks = props.networks || ['facebook', 'twitter', 'linkedin', 'instagram'];
  const style = props.style || 'icon'; // 'icon' or 'button'
  
  const getIconComponent = (network) => {
    switch (network) {
      case 'facebook':
        return <Facebook size={props.iconSize || 20} />;
      case 'twitter':
        return <Twitter size={props.iconSize || 20} />;
      case 'linkedin':
        return <Linkedin size={props.iconSize || 20} />;
      case 'instagram':
        return <Instagram size={props.iconSize || 20} />;
      default:
        return <LinkIcon size={props.iconSize || 20} />;
    }
  };
  
  const getNetworkName = (network) => {
    switch (network) {
      case 'facebook':
        return 'Facebook';
      case 'twitter':
        return 'Twitter';
      case 'linkedin':
        return 'LinkedIn';
      case 'instagram':
        return 'Instagram';
      default:
        return network;
    }
  };
  
  const getShareUrl = (network) => {
    // In a real implementation, you would use the actual page URL
    const eventUrl = encodeURIComponent(props.eventUrl || 'https://yourevent.com');
    const eventTitle = encodeURIComponent(props.eventTitle || 'My Event');
    const eventDescription = encodeURIComponent(props.eventDescription || 'Join us at this amazing event!');
    
    switch (network) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${eventUrl}&text=${eventTitle}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${eventUrl}`;
      case 'instagram':
        // Instagram doesn't have a direct sharing URL, so we might link to the Instagram profile
        return props.instagramProfileUrl || '#';
      default:
        return '#';
    }
  };
  
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
      <SharingContainer 
        direction={props.direction || 'row'}
        alignment={props.alignment || 'flex-start'}
        gap={props.gap || '16px'}
        marginTop={props.marginTop || '0'}
        marginBottom={props.marginBottom || '0'}
        marginLeft={props.marginLeft || '0'}
        marginRight={props.marginRight || '0'}
      >
        <Title 
          showTitle={props.showTitle}
          fontFamily={props.fontFamily}
          fontSize={props.fontSize}
          fontWeight={props.fontWeight}
          color={props.textColor}
        >
          {props.title || 'Share On:'}
        </Title>
        
        {networks.map((network, index) => (
          style === 'icon' ? (
            <SocialIcon 
              key={`${network}-${index}`}
              href={getShareUrl(network)}
              target="_blank"
              rel="noopener noreferrer"
              size={props.size || '40px'}
              shape={props.shape || 'circle'}
              bgColor={props[`${network}BgColor`] || props.bgColor || '#f5f5f5'}
              iconColor={props[`${network}IconColor`] || props.iconColor || '#333'}
              hoverBgColor={props[`${network}HoverBgColor`] || props.hoverBgColor}
              hoverIconColor={props[`${network}HoverIconColor`] || props.hoverIconColor}
              title={`Share on ${getNetworkName(network)}`}
            >
              {getIconComponent(network)}
            </SocialIcon>
          ) : (
            <SocialButton
              key={`${network}-${index}`}
              href={getShareUrl(network)}
              target="_blank"
              rel="noopener noreferrer"
              bgColor={props[`${network}BgColor`] || props.bgColor || '#f5f5f5'}
              textColor={props[`${network}TextColor`] || props.textColor || '#333'}
              hoverBgColor={props[`${network}HoverBgColor`] || props.hoverBgColor}
              hoverTextColor={props[`${network}HoverTextColor`] || props.hoverTextColor}
              fontFamily={props.fontFamily}
              fontSize={props.fontSize}
              fontWeight={props.fontWeight}
            >
              {getIconComponent(network)}
              {getNetworkName(network)}
            </SocialButton>
          )
        ))}
      </SharingContainer>
    </div>
  );
}

export const SocialMediaSharingBrickInspector = {
  displayName: 'Social Media Sharing',
  props: {
    // General settings
    showTitle: { type: 'boolean', label: 'Show Title', defaultValue: true },
    title: { type: 'text', label: 'Title Text', defaultValue: 'Share On:' },
    style: { type: 'select', label: 'Display Style', options: ['icon', 'button'], defaultValue: 'icon' },
    networks: { type: 'multiselect', label: 'Networks', options: ['facebook', 'twitter', 'linkedin', 'instagram'], defaultValue: ['facebook', 'twitter', 'linkedin', 'instagram'] },
    direction: { type: 'select', label: 'Direction', options: ['row', 'column'], defaultValue: 'row' },
    alignment: { type: 'select', label: 'Alignment', options: ['flex-start', 'center', 'flex-end', 'space-between'], defaultValue: 'flex-start' },
    gap: { type: 'text', label: 'Gap Between Elements', defaultValue: '16px' },
    
    // Icon settings
    size: { type: 'text', label: 'Icon Size', defaultValue: '40px' },
    shape: { type: 'select', label: 'Icon Shape', options: ['circle', 'square'], defaultValue: 'circle' },
    iconSize: { type: 'number', label: 'Inner Icon Size', defaultValue: 20 },
    
    // Colors
    bgColor: { type: 'colorpicker', label: 'Background Color', defaultValue: '#f5f5f5' },
    iconColor: { type: 'colorpicker', label: 'Icon Color', defaultValue: '#333333' },
    textColor: { type: 'colorpicker', label: 'Text Color', defaultValue: '#333333' },
    hoverBgColor: { type: 'colorpicker', label: 'Hover Background Color', defaultValue: '#e0e0e0' },
    hoverIconColor: { type: 'colorpicker', label: 'Hover Icon Color', defaultValue: '#000000' },
    hoverTextColor: { type: 'colorpicker', label: 'Hover Text Color', defaultValue: '#000000' },
    
    // Network-specific colors
    facebookBgColor: { type: 'colorpicker', label: 'Facebook Background', defaultValue: '#3b5998' },
    facebookIconColor: { type: 'colorpicker', label: 'Facebook Icon Color', defaultValue: '#ffffff' },
    twitterBgColor: { type: 'colorpicker', label: 'Twitter Background', defaultValue: '#1da1f2' },
    twitterIconColor: { type: 'colorpicker', label: 'Twitter Icon Color', defaultValue: '#ffffff' },
    linkedinBgColor: { type: 'colorpicker', label: 'LinkedIn Background', defaultValue: '#0077b5' },
    linkedinIconColor: { type: 'colorpicker', label: 'LinkedIn Icon Color', defaultValue: '#ffffff' },
    instagramBgColor: { type: 'colorpicker', label: 'Instagram Background', defaultValue: '#e1306c' },
    instagramIconColor: { type: 'colorpicker', label: 'Instagram Icon Color', defaultValue: '#ffffff' },
    
    // Font settings
    fontFamily: { type: 'select', label: 'Font Family', options: ['Inter, sans-serif', 'Georgia, serif', 'Montserrat, sans-serif', 'Roboto, sans-serif', 'Open Sans, sans-serif'], defaultValue: 'Inter, sans-serif' },
    fontSize: { type: 'text', label: 'Font Size', defaultValue: '16px' },
    fontWeight: { type: 'select', label: 'Font Weight', options: ['400', '500', '600', '700'], defaultValue: '600' },
    
    // Margins
    marginTop: { type: 'number', label: 'Margin Top', defaultValue: 0, unit: 'px' },
    marginBottom: { type: 'number', label: 'Margin Bottom', defaultValue: 0, unit: 'px' },
    marginLeft: { type: 'number', label: 'Margin Left', defaultValue: 0, unit: 'px' },
    marginRight: { type: 'number', label: 'Margin Right', defaultValue: 0, unit: 'px' },
    
    // Event information for sharing
    eventUrl: { type: 'text', label: 'Event URL', defaultValue: '' },
    eventTitle: { type: 'text', label: 'Event Title', defaultValue: '' },
    eventDescription: { type: 'textarea', label: 'Event Description', defaultValue: '' },
    instagramProfileUrl: { type: 'text', label: 'Instagram Profile URL', defaultValue: '' },
  }
};
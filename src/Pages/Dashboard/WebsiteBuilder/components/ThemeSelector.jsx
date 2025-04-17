// src/Pages/Dashboard/WebsiteBuilder/components/ThemeSelector.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Check, Palette } from 'lucide-react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 800px;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
`;

const ThemeCard = styled.div`
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${props => props.selected ? '#2563eb' : '#eee'};
  cursor: pointer;
  box-shadow: ${props => props.selected ? '0 0 0 2px rgba(37, 99, 235, 0.3)' : 'none'};
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const ThemePreview = styled.div`
  height: 120px;
  display: flex;
  flex-direction: column;
`;

const ThemeHeader = styled.div`
  height: 40px;
  background-color: ${props => props.backgroundColor};
  display: flex;
  align-items: center;
  padding: 0 12px;
`;

const ThemeHeaderText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.color};
`;

const ThemeBody = styled.div`
  flex: 1;
  background-color: ${props => props.backgroundColor};
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ThemeTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.color};
`;

const ThemeText = styled.div`
  font-size: 12px;
  color: ${props => props.color};
`;

const ThemeButton = styled.div`
  align-self: flex-start;
  font-size: 12px;
  padding: 4px 8px;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
  border-radius: 4px;
  margin-top: 8px;
`;

const ThemeInfo = styled.div`
  padding: 12px;
  border-top: 1px solid #eee;
`;

const ThemeName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const ThemeDescription = styled.div`
  font-size: 12px;
  color: #666;
`;

const ThemeColors = styled.div`
  display: flex;
  margin-top: 8px;
  gap: 4px;
`;

const ColorSwatch = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f1f3f4;
  border: 1px solid #ddd;
  color: #666;
  
  &:hover:not(:disabled) {
    background: #e0e0e0;
  }
`;

const ApplyButton = styled(Button)`
  background: #2563eb;
  border: 1px solid #2563eb;
  color: white;
  
  &:hover:not(:disabled) {
    background: #1d4ed8;
  }
`;

// Theme presets
const themes = [
  {
    id: 'classic-blue',
    name: 'Classic Blue',
    description: 'Professional and trustworthy blue theme',
    colors: {
      primary: '#2563eb',
      secondary: '#3b82f6',
      background: '#ffffff',
      text: '#1e293b',
      accent: '#dbeafe'
    }
  },
  {
    id: 'emerald',
    name: 'Emerald',
    description: 'Fresh and natural green theme',
    colors: {
      primary: '#10b981',
      secondary: '#34d399',
      background: '#ffffff',
      text: '#1e293b',
      accent: '#d1fae5'
    }
  },
  {
    id: 'rose',
    name: 'Rose',
    description: 'Vibrant and energetic pink theme',
    colors: {
      primary: '#e11d48',
      secondary: '#fb7185',
      background: '#ffffff',
      text: '#1e293b',
      accent: '#ffe4e6'
    }
  },
  {
    id: 'amber',
    name: 'Amber',
    description: 'Warm and inviting yellow theme',
    colors: {
      primary: '#d97706',
      secondary: '#fbbf24',
      background: '#ffffff',
      text: '#1e293b',
      accent: '#fef3c7'
    }
  },
  {
    id: 'purple',
    name: 'Purple',
    description: 'Creative and luxurious purple theme',
    colors: {
      primary: '#7c3aed',
      secondary: '#a78bfa',
      background: '#ffffff',
      text: '#1e293b',
      accent: '#ede9fe'
    }
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Sleek dark theme with light accents',
    colors: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      background: '#1e293b',
      text: '#f8fafc',
      accent: '#334155'
    }
  }
];

const ThemeSelector = ({ isOpen, onClose, onApply }) => {
  const [selectedTheme, setSelectedTheme] = useState(null);
  
  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
  };
  
  const handleApply = () => {
    if (selectedTheme) {
      onApply(selectedTheme);
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Select Color Theme</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <ThemeGrid>
            {themes.map((theme) => (
              <ThemeCard 
                key={theme.id}
                selected={selectedTheme?.id === theme.id}
                onClick={() => handleThemeSelect(theme)}
              >
                <ThemePreview>
                  <ThemeHeader backgroundColor={theme.colors.primary}>
                    <ThemeHeaderText color={theme.colors.background}>
                      {theme.name}
                    </ThemeHeaderText>
                  </ThemeHeader>
                  <ThemeBody backgroundColor={theme.colors.background}>
                    <ThemeTitle color={theme.colors.text}>
                      Sample Title
                    </ThemeTitle>
                    <ThemeText color={theme.colors.text}>
                      Sample text content
                    </ThemeText>
                    <ThemeButton 
                      backgroundColor={theme.colors.primary}
                      color={theme.colors.background}
                    >
                      Button
                    </ThemeButton>
                  </ThemeBody>
                </ThemePreview>
                <ThemeInfo>
                  <ThemeName>{theme.name}</ThemeName>
                  <ThemeDescription>{theme.description}</ThemeDescription>
                  <ThemeColors>
                    <ColorSwatch color={theme.colors.primary} />
                    <ColorSwatch color={theme.colors.secondary} />
                    <ColorSwatch color={theme.colors.accent} />
                    <ColorSwatch color={theme.colors.text} />
                  </ThemeColors>
                </ThemeInfo>
              </ThemeCard>
            ))}
          </ThemeGrid>
        </ModalBody>
        
        <ModalFooter>
          <CancelButton onClick={onClose}>
            Cancel
          </CancelButton>
          <ApplyButton 
            onClick={handleApply}
            disabled={!selectedTheme}
          >
            Apply Theme
          </ApplyButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ThemeSelector;
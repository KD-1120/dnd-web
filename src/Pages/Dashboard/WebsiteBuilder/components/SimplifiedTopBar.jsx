import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
  Menu,
  ChevronDown,
  RotateCcw,
  Save,
  Monitor,
  Smartphone,
  Eye,
  Palette,
  ArrowLeft,
  Globe,
  Settings
} from 'lucide-react';
import { useBuilderContext } from '../context/BuilderContext';
import { usePageContext } from '../context/PageContext';
import { useViewMode } from '../context/ViewModeContext';
import ThemeSelector from './ThemeSelector';

/* ------------------ Animations & Shared Styles ------------------ */
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const focusRingStyles = css`
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

/* ------------------ Container Components ------------------ */
const TopBarContainer = styled.div`
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 20px;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.3s ease-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

/* ------------------ Tooltip Components ------------------ */
const TooltipContainer = styled.div`
  position: relative;
  display: flex;
`;

const TooltipContent = styled.div`
  position: absolute;
  z-index: 10;
  padding: 6px 8px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  background-color: #333;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 4px;
  white-space: nowrap;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #333;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

/* ------------------ Button Components ------------------ */
const BaseButton = styled.button`
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  ${focusRingStyles}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const IconButtonElement = styled(BaseButton)`
  background: transparent;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  color: ${props => props.active ? '#3b82f6' : '#5f6368'};
  background-color: ${props => props.active ? '#eff6ff' : 'transparent'};
  margin: 0 2px;
  
  &:hover {
    background-color: ${props => props.active ? '#dbeafe' : '#f1f3f4'};
  }
`;

const ActionButtonElement = styled(BaseButton)`
  height: 40px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  padding: 0 16px;
  margin-left: 12px;
  
  ${props => {
    switch(props.buttonType) {
      case 'blue':
        return css`
          background-color: #1a73e8;
          color: white;
          &:hover:not(:disabled) {
            background-color: #1765cc;
          }
        `;
      case 'green':
        return css`
          background-color: #34a853;
          color: white;
          &:hover:not(:disabled) {
            background-color: #2e9549;
          }
        `;
      case 'orange':
        return css`
          background-color: #ff5722;
          color: white;
          &:hover:not(:disabled) {
            background-color: #e64a19;
          }
        `;
      default:
        return css`
          background-color: white;
          color: #5f6368;
          border: 1px solid #dadce0;
          &:hover:not(:disabled) {
            background-color: #f8f9fa;
          }
          ${props.active && css`
            background-color: #f1f3f4;
            border-color: #999;
          `}
        `;
    }
  }}
`;

const BackButtonElement = styled(BaseButton)`
  display: flex;
  align-items: center;
  background: transparent;
  color: #5f6368;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 4px;
  margin-right: 8px;
  
  &:hover {
    background-color: #f1f3f4;
  }
  
  svg {
    margin-right: 4px;
  }
`;

/* ------------------ Other UI Components ------------------ */
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 12px;
`;

const PageTitle = styled.span`
  font-size: 16px;
  color: #202124;
  font-weight: 500;
  margin-right: 4px;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #1a73e8;
  }
`;

const InlineTitleInput = styled.input`
  font-size: 16px;
  font-weight: 500;
  color: #202124;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
  width: 220px;
  outline: none;
  ${focusRingStyles}
  
  &:focus {
    border-color: #999;
  }
`;

const EventTypeTag = styled.span`
  background: #f1f3f4;
  color: #5f6368;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 8px;
`;

const ViewSwitcherContainer = styled.div`
  display: flex;
  border: 1px solid #dadce0;
  border-radius: 4px;
  height: 36px;
  overflow: hidden;
  margin-left: 16px;
`;

const ViewButton = styled(BaseButton)`
  width: 50px;
  text-align: center;
  background: ${props => props.active ? '#f1f3f4' : '#fff'};
  border: none;
  border-right: ${props => props.last ? 'none' : '1px solid #dadce0'};
  color: #5f6368;
  
  &:hover {
    background-color: ${props => props.active ? '#f1f3f4' : '#f8f9fa'};
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const SavedIndicator = styled.div`
  color: #34a853;
  font-size: 13px;
  display: flex;
  align-items: center;
  margin-left: 8px;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.5s ease;
`;

const PageSelectorIndicator = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 4px;
  color: #5f6368;
`;

/* ------------------ Compound Components ------------------ */
const Tooltip = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <TooltipContainer
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && <TooltipContent>{text}</TooltipContent>}
    </TooltipContainer>
  );
};

const IconButton = ({ onClick, ariaLabel, tooltip, children, active }) => (
  <Tooltip text={tooltip}>
    <IconButtonElement
      onClick={onClick}
      aria-label={ariaLabel}
      active={active}
    >
      {children}
    </IconButtonElement>
  </Tooltip>
);

const ActionButton = ({ onClick, disabled, buttonType, tooltip, icon, children, active }) => (
  <Tooltip text={tooltip}>
    <ActionButtonElement
      onClick={onClick}
      disabled={disabled}
      buttonType={buttonType}
      active={active}
    >
      {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
      {children}
    </ActionButtonElement>
  </Tooltip>
);

const BackButton = ({ onClick }) => (
  <Tooltip text="Return to templates">
    <BackButtonElement onClick={onClick}>
      <ArrowLeft size={16} />
      Back to Templates
    </BackButtonElement>
  </Tooltip>
);

const TitleSection = ({ 
  isRenaming, 
  tempName, 
  handleTitleClick,
  handleNameChange,
  handleNameBlur,
  handleNameKeyDown,
  currentPage,
  eventData,
  templateName,
  getEventType
}) => (
  <TitleWrapper>
    {isRenaming ? (
      <InlineTitleInput
        type="text"
        value={tempName}
        onChange={handleNameChange}
        onBlur={handleNameBlur}
        onKeyDown={handleNameKeyDown}
        autoFocus
      />
    ) : (
      <Tooltip text="Rename page">
        <PageTitle onClick={handleTitleClick}>
          {currentPage ? currentPage.name : (eventData?.title || templateName)}
        </PageTitle>
      </Tooltip>
    )}
    <EventTypeTag>{getEventType()}</EventTypeTag>
  </TitleWrapper>
);

const ViewSwitcherComponent = ({ viewMode, setViewMode }) => (
  <ViewSwitcherContainer>
    <Tooltip text="Desktop view">
      <ViewButton
        active={viewMode === 'desktop'}
        onClick={() => setViewMode('desktop')}
      >
        <Monitor size={16} />
      </ViewButton>
    </Tooltip>
    <Tooltip text="Mobile view">
      <ViewButton
        active={viewMode === 'mobile'}
        onClick={() => setViewMode('mobile')}
        last
      >
        <Smartphone size={16} />
      </ViewButton>
    </Tooltip>
  </ViewSwitcherContainer>
);

export function SimplifiedTopBar({ 
  onToggleSidebar, 
  onToggleProperties, 
  onBackToTemplates, 
  onSave,
  onReset,
  onPreview,
  onPublish,
  onSettings,
  showSettings,
  templateName = 'Untitled',
  eventData = null
}) {
  const { undo, redo, saveCurrentState, pageData, setPageData } = useBuilderContext();
  const { viewMode, setViewMode } = useViewMode();
  const { pages = [], currentPage, renamePage } = usePageContext();

  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempName, setTempName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsRenaming(false);
    setTempName(currentPage?.name || eventData?.title || templateName);
  }, [templateName, eventData, currentPage?.name]);

  const handleTitleClick = () => {
    if (!currentPage) return;
    setTempName(currentPage.name);
    setIsRenaming(true);
  };

  const handleNameChange = (e) => {
    setTempName(e.target.value);
  };

  const handleNameBlur = () => {
    if (currentPage && tempName.trim() !== '') {
      renamePage(currentPage.id, tempName.trim());
    }
    setIsRenaming(false);
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (currentPage && tempName.trim() !== '') {
        renamePage(currentPage.id, tempName.trim());
      }
      setIsRenaming(false);
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveCurrentState();
      if (onSave) {
        await onSave(pageData);
      }
      
      // Show saved indicator
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = async () => {
    // Save current state before previewing
    if (onSave) {
      await onSave(pageData);
    }
    
    // Open preview in new tab
    const previewUrl = `/events/${eventData?.id}/preview`;
    window.open(previewUrl, '_blank');
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // First save the latest template state
      await saveCurrentState();
      
      // Then call publish handler
      if (onPublish) {
        await onPublish();
      }
      
      // Show saved indicator with publish message
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    } catch (error) {
      console.error('Error publishing:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  // Theme application logic
  const handleApplyTheme = (theme) => {
    const themeColors = theme.colors;
    const updateNestedComponentColors = (components) => {
      return components.map(component => {
        const newComponent = { ...component };
        switch (newComponent.type) {
          case 'title':
            newComponent.props = { ...newComponent.props, color: themeColors.text };
            break;
          case 'text':
            newComponent.props = { ...newComponent.props, color: themeColors.text };
            break;
          case 'button':
            newComponent.props = {
              ...newComponent.props,
              bgColor: themeColors.primary,
              color: themeColors.background,
              borderColor: themeColors.primary
            };
            break;
          default:
            break;
        }
        if (newComponent.components && newComponent.components.length) {
          newComponent.components = updateNestedComponentColors(newComponent.components);
        }
        return newComponent;
      });
    };

    const updatedData = pageData.map(block => {
      const newBlock = { ...block };
      switch (block.type) {
        case 'container':
          newBlock.props = {
            ...newBlock.props,
            bgColor: block.props.bgColor === 'transparent' ? 'transparent' : themeColors.background
          };
          break;
        case 'title':
          newBlock.props = { ...newBlock.props, color: themeColors.text };
          break;
        case 'text':
          newBlock.props = { ...newBlock.props, color: themeColors.text };
          break;
        case 'button':
          newBlock.props = {
            ...newBlock.props,
            bgColor: themeColors.primary,
            color: themeColors.background,
            borderColor: themeColors.primary
          };
          break;
        default:
          break;
      }
      if (newBlock.components && newBlock.components.length) {
        newBlock.components = updateNestedComponentColors(newBlock.components);
      }
      return newBlock;
    });

    // Update the page data
    setPageData(updatedData);

    // Use the page context to update the data
    if (currentPage) {
      // In a real app, we would trigger a state update through the page context
      console.log('Updating theme colors for page:', currentPage.id);
    }
    
    // Show saved indicator
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
    
    setShowThemeSelector(false);
  };

  // Get appropriate event type/category or fallback to template category
  const getEventType = () => {
    if (eventData?.category) {
      return eventData.category.charAt(0).toUpperCase() + eventData.category.slice(1);
    }
    return 'Event';
  };

  return (
    <TopBarContainer>
      <Tooltip text="Toggle properties panel">
        <IconButtonElement 
          onClick={onToggleProperties} 
          aria-label="Toggle properties panel"
        >
          <Menu size={20} />
        </IconButtonElement>
      </Tooltip>

      <BackButton onClick={onBackToTemplates} />

      <TitleSection
        isRenaming={isRenaming}
        tempName={tempName}
        handleTitleClick={handleTitleClick}
        handleNameChange={handleNameChange}
        handleNameBlur={handleNameBlur}
        handleNameKeyDown={handleNameKeyDown}
        currentPage={currentPage}
        eventData={eventData}
        templateName={templateName}
        getEventType={getEventType}
      />

      {pages.length > 1 && (
        <Tooltip text="Select page">
          <PageSelectorIndicator>
            <ChevronDown size={18} />
          </PageSelectorIndicator>
        </Tooltip>
      )}

      <IconButton 
        onClick={undo} 
        ariaLabel="Undo"
        tooltip="Undo"
      >
        <RotateCcw size={18} />
      </IconButton>
      
      <IconButton 
        onClick={redo} 
        ariaLabel="Redo"
        tooltip="Redo"
      >
        <RotateCcw size={18} style={{ transform: 'rotate(180deg)' }} />
      </IconButton>

      <ViewSwitcherComponent 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
      />

      <Spacer />

      <SavedIndicator visible={showSaved}>
        {isPublishing ? 'Published successfully!' : 'Changes saved'}
      </SavedIndicator>

      <ActionButton
        onClick={() => setShowThemeSelector(true)}
        buttonType="default"
        tooltip="Change theme"
        icon={<Palette size={16} />}
      >
      </ActionButton>

      <ActionButton
        onClick={onSettings}
        buttonType="default"
        tooltip="Settings"
        icon={<Settings size={16} />}
        active={showSettings}
      />

      <ActionButton
        onClick={handlePreview}
        buttonType="orange"
        tooltip="Preview page"
        icon={<Eye size={16} />}
      >
      </ActionButton>

      <ActionButton
        onClick={handleSave}
        disabled={isSaving}
        buttonType="blue"
        tooltip="Save changes"
        icon={<Save size={16} />}
      >
        {isSaving ? 'Saving...' : ''}
      </ActionButton>
      
      <ActionButton
        onClick={handlePublish}
        disabled={isPublishing}
        buttonType="green"
        tooltip="Publish page"
        icon={<Globe size={16} />}
      >
        {isPublishing ? 'Publishing...' : ''}
      </ActionButton>
      
      <IconButton 
        onClick={onReset} 
        ariaLabel="Reset template"
        tooltip="Reset to default"
      >
        <RotateCcw size={20} />
      </IconButton>

      {showThemeSelector && (
        <ThemeSelector
          isOpen={true}
          onClose={() => setShowThemeSelector(false)}
          onApply={handleApplyTheme}
        />
      )}
    </TopBarContainer>
  );
}

export default SimplifiedTopBar;
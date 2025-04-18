import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Menu,
  ChevronDown,
  RotateCcw,
  Save,
  Monitor,
  Smartphone,
  Eye,
  X,
  Palette,
  ArrowLeft
} from 'lucide-react';
import { useBuilderContext } from '../context/BuilderContext';
import { usePageContext } from '../context/PageContext';
import { useViewMode } from '../context/ViewModeContext';
import ThemeSelector from './ThemeSelector';

/* ------------------ Animations & Basic Styles ------------------ */
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const TopBarContainer = styled.div`
  height: 60px;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 20px;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.3s ease-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5f6368;
  margin: 0 2px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  &:hover {
    background-color: #f1f3f4;
  }
`;

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
  &:focus {
    border-color: #999;
  }
`;

const ExtraActions = styled.div`
  display: flex;
  align-items: center;
  margin-left: 8px;
`;

const ViewSwitcher = styled.div`
  display: flex;
  border: 1px solid #dadce0;
  border-radius: 4px;
  height: 36px;
  overflow: hidden;
  margin-left: 16px;
`;

const ViewButton = styled.button`
  background: ${props => (props.active ? '#f1f3f4' : '#fff')};
  border: none;
  border-right: ${props => (props.last ? 'none' : '1px solid #dadce0')};
  padding: 0 12px;
  font-size: 14px;
  color: #5f6368;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: ${props => (props.active ? '#f1f3f4' : '#f8f9fa')};
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const SaveButton = styled.button`
  height: 40px;
  background-color: #1a73e8;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  padding: 0 20px;
  display: flex;
  align-items: center;
  color: white;
  transition: background-color 0.2s;
  margin-left: 16px;
  cursor: pointer;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: #1765cc;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const PublishButton = styled(SaveButton)`
  background-color: #34a853;
  
  &:hover {
    background-color: #2e9549;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: #5f6368;
  font-size: 14px;
  cursor: pointer;
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

const ThemeButton = styled.button`
  height: 40px;
  background-color: #ffffff;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  padding: 0 20px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
  margin-left: 16px;
  cursor: pointer;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: #f1f3f4;
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

export function SimplifiedTopBar({ 
  onToggleSidebar, 
  onToggleProperties, 
  onBackToTemplates, 
  onSave,
  onReset,
  templateName = 'Untitled',
  eventType = 'Event'
}) {
  const { undo, redo, saveCurrentState, pageData, setPageData } = useBuilderContext();
  const {
    pages,
    setSelectedPageId,
    createPage,
    currentPage,
    renamePage,
    duplicatePage,
    deletePage,
    movePageUp,
    movePageDown,
    setPageVisibility
  } = usePageContext();
  const { viewMode, setViewMode } = useViewMode();

  /* Inline rename states */
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempName, setTempName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  /* Theme selector state */
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  useEffect(() => {
    setIsRenaming(false);
    setTempName(currentPage ? currentPage.name : templateName);
  }, [currentPage, templateName]);

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
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      await saveCurrentState();
      if (onSave) {
        await onSave(pageData, { publish: true });
      }
    } catch (error) {
      console.error('Error publishing:', error);
    } finally {
      setIsSaving(false);
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

    setPageData(updatedData);
    setShowThemeSelector(false);
  };

  return (
    <TopBarContainer>
      <IconButton onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <Menu size={20} />
      </IconButton>

      <BackButton onClick={onBackToTemplates}>
        <ArrowLeft size={16} />
        Back to Templates
      </BackButton>

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
          <PageTitle onClick={handleTitleClick}>
            {currentPage ? currentPage.name : templateName}
          </PageTitle>
        )}
        <EventTypeTag>{eventType}</EventTypeTag>
      </TitleWrapper>

      {pages.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ChevronDown size={18} color="#5f6368" />
        </div>
      )}

      <IconButton onClick={undo} aria-label="Undo">
        <RotateCcw size={18} />
      </IconButton>
      <IconButton onClick={redo} aria-label="Redo">
        <RotateCcw size={18} style={{ transform: 'rotate(180deg)' }} />
      </IconButton>

      <ViewSwitcher aria-label="View switcher">...
      </ViewSwitcher>

      <Spacer />

      <ThemeButton onClick={() => setShowThemeSelector(true)}>
        <Palette size={16} />
        Theme
      </ThemeButton>

      <SaveButton onClick={handleSave} disabled={isSaving}>
        <Save size={16} />
        {isSaving ? 'Saving...' : 'Save'}
      </SaveButton>
      <PublishButton onClick={handlePublish} disabled={isSaving}>
        Publish
      </PublishButton>
      <IconButton
        onClick={onToggleProperties}
        aria-label="Toggle properties panel"
        style={{ marginLeft: 8 }}
      >
        <X size={20} />
      </IconButton>

      <IconButton onClick={onReset} aria-label="Reset template">
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

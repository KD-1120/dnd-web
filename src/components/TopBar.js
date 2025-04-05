// src/components/TopBar.js
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
  Info,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  FileText
} from 'lucide-react';
import { Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useBuilderContext } from '../context/BuilderContext';
import { usePageContext } from '../context/PageContext';
import { useViewMode } from '../context/ViewModeContext';

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

const PageDropdown = styled(Dropdown)`
  display: flex;
  align-items: center;
  .dropdown-toggle {
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    padding: 0;
    box-shadow: none !important;
    margin-left: 4px;
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

const SaveButton = styled(Button)`
  height: 40px;
  background-color: #1a73e8;
  border-color: #1a73e8;
  font-size: 14px;
  font-weight: 500;
  padding: 0 20px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s, border-color 0.2s;
  margin-left: 16px;
  svg {
    margin-right: 8px;
  }
  &:hover,
  &:active,
  &:focus {
    background-color: #1765cc !important;
    border-color: #1765cc !important;
  }
`;

/* ------------------ Tooltip ------------------ */
const renderTooltip = (text) => (props) => (
  <Tooltip id="tooltip" {...props}>
    {text}
  </Tooltip>
);

/* ------------------ TopBar Component ------------------ */
export function TopBar({ onToggleSidebar, onToggleProperties }) {
  const { undo, redo, saveCurrentState } = useBuilderContext();
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

  useEffect(() => {
    setIsRenaming(false);
    setTempName(currentPage ? currentPage.name : '');
  }, [currentPage]);

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
    await saveCurrentState();
    // Could add toast notification here
  };

  const handleLoadTemplates = () => {
    // TODO: Implement template loading logic
    console.log('Loading templates...');
  };

  return (
    <TopBarContainer>
      {/* Left Drawer (Sidebar Toggle) */}
      <IconButton onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <Menu size={20} />
      </IconButton>

      {/* Page Title with Inline Rename */}
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
            {currentPage ? currentPage.name : 'Untitled'}
          </PageTitle>
        )}
      </TitleWrapper>

      {/* Page Switcher Dropdown */}
      <PageDropdown>
        <Dropdown.Toggle variant="link" bsPrefix="page-dropdown-toggle">
          <ChevronDown size={18} color="#5f6368" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {pages.map((p) => (
            <Dropdown.Item key={p.id} onClick={() => setSelectedPageId(p.id)}>
              {p.name}
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => createPage('New Page')}>
            + New Page
          </Dropdown.Item>
        </Dropdown.Menu>
      </PageDropdown>

      {/* Extra Actions for Page Management */}
      <ExtraActions>
        <OverlayTrigger placement="bottom" overlay={renderTooltip('Duplicate Page')}>
          <IconButton onClick={() => duplicatePage(currentPage.id)} aria-label="Duplicate Page">
            <Copy size={18} />
          </IconButton>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={renderTooltip('Delete Page')}>
          <IconButton onClick={() => deletePage(currentPage.id)} aria-label="Delete Page">
            <Trash2 size={18} />
          </IconButton>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={renderTooltip('Move Page Up')}>
          <IconButton onClick={() => movePageUp(currentPage.id)} aria-label="Move Page Up">
            <ArrowUp size={18} />
          </IconButton>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={renderTooltip('Move Page Down')}>
          <IconButton onClick={() => movePageDown(currentPage.id)} aria-label="Move Page Down">
            <ArrowDown size={18} />
          </IconButton>
        </OverlayTrigger>
        <OverlayTrigger
          placement="bottom"
          overlay={renderTooltip(
            currentPage && currentPage.visibility === 'public'
              ? 'Set Private'
              : 'Set Public'
          )}
        >
          <IconButton
            onClick={() =>
              setPageVisibility(
                currentPage.id,
                currentPage.visibility === 'public' ? 'private' : 'public'
              )
            }
            aria-label="Toggle Page Visibility"
          >
            {currentPage && currentPage.visibility === 'public' ? (
              <Lock size={18} />
            ) : (
              <Unlock size={18} />
            )}
          </IconButton>
        </OverlayTrigger>
      </ExtraActions>

      {/* Info Icon with Tooltip */}
      <OverlayTrigger placement="bottom" overlay={renderTooltip('Page Information')}>
        <IconButton aria-label="Page Information">
          <Info size={20} />
        </IconButton>
      </OverlayTrigger>

      {/* Undo/Redo Buttons */}
      <IconButton onClick={undo} aria-label="Undo">
        <RotateCcw size={18} />
      </IconButton>
      <IconButton onClick={redo} aria-label="Redo">
        <RotateCcw size={18} style={{ transform: 'rotate(180deg)' }} />
      </IconButton>

      {/* View Switcher */}
      <ViewSwitcher aria-label="View switcher">
        <ViewButton
          active={viewMode === 'desktop'}
          onClick={() => setViewMode('desktop')}
          aria-label="Desktop view"
        >
          <Monitor size={16} />
        </ViewButton>
        <ViewButton
          active={viewMode === 'mobile'}
          onClick={() => setViewMode('mobile')}
          aria-label="Mobile view"
        >
          <Smartphone size={16} />
        </ViewButton>
        <ViewButton
          active={viewMode === 'preview'}
          last
          onClick={() => setViewMode('preview')}
          aria-label="Preview mode"
        >
          <Eye size={16} />
        </ViewButton>
      </ViewSwitcher>

      {/* Templates Button */}
      <OverlayTrigger placement="bottom" overlay={renderTooltip('Load Templates')}>
        <IconButton 
          onClick={handleLoadTemplates}
          aria-label="Load templates"
          style={{ marginLeft: 8 }}
        >
          <FileText size={18} />
        </IconButton>
      </OverlayTrigger>

      <Spacer />

      {/* Save Button */}
      <SaveButton onClick={handleSave} aria-label="Save changes">
        <Save size={16} />
        Save
      </SaveButton>

      {/* Right Drawer (Properties Panel Toggle) */}
      <IconButton
        onClick={onToggleProperties}
        aria-label="Toggle properties panel"
        style={{ marginLeft: 8 }}
      >
        <X size={20} />
      </IconButton>
    </TopBarContainer>
  );
}

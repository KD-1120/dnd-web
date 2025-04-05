import React, { useState } from 'react';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { Renderer } from './Renderer';
import { Layout, Navigation } from 'lucide-react';

const CanvasWrapper = styled.div`
  padding: 2rem;
  background: #f0f0f0;
  min-height: 100vh;
`;

const EditorSection = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  overflow: hidden;
`;

const EditorHeader = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EditorTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
`;

const EditorContent = styled.div`
  padding: 2rem;
  background: ${props => props.selected ? '#f8f9fa' : 'transparent'};
  border: ${props => props.selected ? '2px solid #0073aa' : '2px solid transparent'};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: #f8f9fa;
  }
`;

const PreviewLabel = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 1rem;
  font-style: italic;
`;

export function GlobalLayoutCanvas() {
  const { globalLayouts, selectedBrickId, selectGlobalElement } = useBuilderContext();
  
  if (!globalLayouts) return null;

  // Get the first navigation/footer component from the global layouts
  const navigationBlock = globalLayouts.navigation?.children?.[0] || globalLayouts.navigation;
  const footerBlock = globalLayouts.footer?.children?.[0] || globalLayouts.footer;

  return (
    <CanvasWrapper>
      <EditorSection>
        <EditorHeader>
          <Navigation size={16} />
          <EditorTitle>Navigation Menu</EditorTitle>
        </EditorHeader>
        <EditorContent 
          selected={selectedBrickId === globalLayouts.navigation?.id}
          onClick={() => selectGlobalElement('Site Navigation')}
        >
          <PreviewLabel>Navigation Preview</PreviewLabel>
          {navigationBlock && <Renderer bricks={[navigationBlock]} />}
        </EditorContent>
      </EditorSection>

      <EditorSection>
        <EditorHeader>
          <Layout size={16} />
          <EditorTitle>Footer</EditorTitle>
        </EditorHeader>
        <EditorContent
          selected={selectedBrickId === globalLayouts.footer?.id}
          onClick={() => selectGlobalElement('Site Footer')}
        >
          <PreviewLabel>Footer Preview</PreviewLabel>
          {footerBlock && <Renderer bricks={[footerBlock]} />}
        </EditorContent>
      </EditorSection>
    </CanvasWrapper>
  );
}

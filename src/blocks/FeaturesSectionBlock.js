// src/components/FeaturesSectionBrick.js
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useBuilderContext } from '../context/BuilderContext';
import { FeatureBrickComponent } from '../bricks/FeatureBrick';
import { GasPump } from '@phosphor-icons/react';

// Styled components for the container
const FeaturesContainer = styled(Container)`
  padding: ${(props) => props.padding || '80px 20px'};
  max-width: ${(props) => props.maxWidth || '1200px'};
  margin: 0 auto;
  background-color: ${(props) => props.bgColor || 'transparent'};
`;

const FeatureCol = styled(Col)`
  margin-bottom: 40px;
  text-align: center;
  background-color: ${(props) => props.columnBgColor || 'transparent'};
  padding: 20px;
  border-radius: 4px;
`;

const AddButton = styled(Button)`
  display: block;
  margin: 20px auto;
`;

export const FeaturesSectionBrickComponent = ({ brick, onSelect }) => {
  const { id, props, components = [] } = brick;
  const { padding, maxWidth, bgColor, columnCount = 3 } = props;
  const { 
    updateNestedBrickProps, 
    addNestedComponent, 
    removeNestedComponent,
    selectedBrickId,
    setSelectedBrickId,
  } = useBuilderContext();

  // Updated: Create a new feature brick with nested components stored in its data.
  const handleAddFeature = () => {
    const featureId = uuidv4();
    addNestedComponent(id, 'feature', {
      bgColor: '#f8f8f8',
      width: '200px',
      height: '200px',
      Gap: '16px',
      // Provide default nested bricks so they exist in pageData:
      components: [
        { 
          id: `${featureId}-icon`, 
          type: "icon", 
          parentId: featureId,
          props: { iconName: "⚡", size: 32, color: "#0ca678" } 
        },
        { 
          id: `${featureId}-title`, 
          type: "title", 
          parentId: featureId,
          props: { text: "Feature Title", fontSize: 24, alignment: "center", color: "#333333" } 
        },
        { 
          id: `${featureId}-text`, 
          type: "text", 
          parentId: featureId,
          props: { text: "Feature description", fontSize: 16, alignment: "center", color: "#666666" } 
        }
      ]
    });
  };

  const handleFeatureSelect = (componentId) => {
    // Directly set the selected brick ID
    setSelectedBrickId(componentId);
  };

  return (
    <FeaturesContainer
      fluid
      padding={padding}
      maxWidth={maxWidth}
      bgColor={bgColor}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      <Row>
        {components.map((component) => (
          <FeatureCol key={component.id} md={12 / columnCount} sm={12}>
            <FeatureBrickComponent 
              brick={component}
              onSelect={handleFeatureSelect}
              isSelected={selectedBrickId === component.id}
            />
          </FeatureCol>
        ))}
      </Row>
      <AddButton onClick={handleAddFeature}>Add Feature</AddButton>
    </FeaturesContainer>
  );
};

export const FeaturesSectionInspector = {
  displayName: 'Features Section',
  /**
   * getInspectorProps returns the inspector configuration based on
   * the current selection. If a nested feature is selected, it returns the
   * feature’s content fields. Otherwise, it returns the container settings.
   */
  getInspectorProps: (brick, selectedBrickId) => {
    // If a nested feature is selected, return its inspector configuration
    const selectedFeature = brick.components?.find(comp => comp.id === selectedBrickId);
    if (selectedFeature) {
      return {
        id: selectedFeature.id,
        displayName: 'Feature',
        props: {
          icon: { type: 'text', label: 'Icon', defaultValue: selectedFeature.props.icon || '⚡' },
          title: { type: 'text', label: 'Title', defaultValue: selectedFeature.props.title || 'Feature Title' },
          description: { type: 'textarea', label: 'Description', defaultValue: selectedFeature.props.description || 'Feature description goes here' }
        }
      };
    }
    // Otherwise, return container (Features Section) inspector configuration
    return {
      id: brick.id,
      displayName: 'Features Section',
      props: {
        columnCount: { type: 'number', label: 'Column Count', defaultValue: brick.props.columnCount || 3 },
        paddingTop: { type: 'number', label: 'Padding', defaultValue: brick.props.padding || 20, unit: 'px' },
        paddingBottom: { type: 'number', label: 'Padding', defaultValue: brick.props.padding || 20, unit: 'px' },
        paddingLeft: { type: 'number', label: 'Padding', defaultValue: brick.props.padding || 80, unit: 'px' },
        paddingRight: { type: 'number', label: 'Padding', defaultValue: brick.props.padding || 80, unit: 'px' },
        maxWidth: { type: 'number', label: 'Max Width', defaultValue: brick.props.maxWidth || 1200, unit: 'px' },
        bgColor: { type: 'colorpicker', label: 'Background Color', defaultValue: brick.props.bgColor || '#ffffff' }
      }
    };
  }
};

export default FeaturesSectionBrickComponent;

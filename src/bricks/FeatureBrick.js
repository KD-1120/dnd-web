// src/bricks/FeatureBrick.js
import React from "react";
import styled from "styled-components";
import { useBuilderContext } from "../context/BuilderContext";
import { TitleBrickComponent, TitleBrickInspector } from "./TitleBrick";
import { TextBrickComponent, TextBrickInspector } from "./TextBrick";
import { IconBrickComponent, IconBrickInspector } from "./IconBrick";

// Styled container for the Feature brick.
const FeatureContainer = styled.div`
  border: ${(props) => (props.isSelected ? "2px solid #10a5e0" : "none")};
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.bgColor || "#f8f8f8"};
  width: ${(props) => props.width || "250px"};
  height: ${(props) => props.height || "200px"};
  cursor: pointer;
`;

export function FeatureBrickComponent({ brick, onSelect }) {
  const { id, props, components = [] } = brick;
  const { selectedBrickId, updateNestedBrickProps } = useBuilderContext();

  // Simplified selection handler
  const handleSelect = (e) => {
    e.stopPropagation();
    onSelect(id);
  };

  // Handle child selection
  const handleChildSelect = (childId) => {
    onSelect(childId);
  };

  return (
    <FeatureContainer
      isSelected={selectedBrickId === id}
      bgColor={props.bgColor}
      width={props.width}
      height={props.height}
      onClick={handleSelect}
    >
      {components.map((subBrick) => {
        const Component = {
          icon: IconBrickComponent,
          title: TitleBrickComponent,
          text: TextBrickComponent
        }[subBrick.type];

        return Component ? (
          <Component
            key={subBrick.id}
            brick={subBrick}
            isSelected={selectedBrickId === subBrick.id}
            onSelect={() => handleChildSelect(subBrick.id)}
            onUpdate={(newProps) => updateNestedBrickProps(id, subBrick.id, newProps)}
          />
        ) : null;
      })}
    </FeatureContainer>
  );
}

// Inspector configuration for Feature Brick
export const FeatureBrickInspector = {
  displayName: "Feature",
  getInspectorProps: (brick, selectedBrickId) => {
    const selectedComponent = brick.components?.find((comp) => comp.id === selectedBrickId);
    
    if (selectedComponent) {
      switch (selectedComponent.type) {
        case "icon":
          return { id: selectedComponent.id, displayName: "Icon", props: selectedComponent.props };
        case "title":
          return { id: selectedComponent.id, displayName: "Title", props: selectedComponent.props };
        case "text":
          return { id: selectedComponent.id, displayName: "Text", props: selectedComponent.props };
        default:
          return null;
      }
    }

    return {
      id: brick.id,
      displayName: "Feature",
      props: {
        bgColor: { type: "colorpicker", label: "Background Color", defaultValue: "#f8f8f8" },
        width: { type: "number", label: "Width", defaultValue: 250, unit: "px" },
        height: { type: "number", label: "Height", defaultValue: 200, unit: "px" },
        paddingTop: { type: 'number', label: 'Padding Top', defaultValue: brick.props.padding || 20, unit: 'px' },
        paddingBottom: { type: 'number', label: 'Padding Bottom', defaultValue: brick.props.padding || 20, unit: 'px' },
        paddingLeft: { type: 'number', label: 'Padding Left', defaultValue: brick.props.padding || 80, unit: 'px' },
        paddingRight: { type: 'number', label: 'Padding Right', defaultValue: brick.props.padding || 80, unit: 'px' },
        marginTop: { type: 'number', label: 'Margin Top', defaultValue: brick.props.margin || 20, unit: 'px' },
        marginBottom: { type: 'number', label: 'Margin Bottom', defaultValue: brick.props.margin || 20, unit: 'px' },
        marginLeft: { type: 'number', label: 'Margin Left', defaultValue: brick.props.margin || 80, unit: 'px' },
        marginRight: { type: 'number', label: 'Margin Right', defaultValue: brick.props.margin || 80, unit: 'px' },
      },
    };
  },
};

export default FeatureBrickComponent;

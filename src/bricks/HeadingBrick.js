import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { TitleBrickComponent } from './TitleBrick';

const HeaderWrapper = styled.div`
  padding: ${(props) => props.padding || '3rem 0'};
  background-color: ${(props) => props.bgColor || '#ffffff'};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const HeadingBrickComponent = ({ brick, onSelect }) => {
  const { id, props } = brick;
  const { padding, bgColor } = props || {};
  const { selectedBrickId } = useBuilderContext();
  const isSelected = selectedBrickId === id;

  return (
    <HeaderWrapper
      padding={padding}
      bgColor={bgColor}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      style={{ border: isSelected ? '2px solid #007bff' : 'none' }}
    >
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={7} md={10} sm={12} className="mx-auto">
            <TitleBrickComponent brick={brick} />
          </Col>
        </Row>
      </Container>
    </HeaderWrapper>
  );
};

export const HeadingInspector = {
  displayName: 'Header',
  tabs: {
    content: [
      {
        sectionTitle: 'Text',
        fields: [
          { type: 'textarea', label: 'Heading Text', prop: 'text', defaultValue: 'React Bricks is great for developers and marketing teams.' }
        ]
      }
    ],
    style: [
      {
        sectionTitle: 'Layout',
        fields: [
          { type: 'number', label: 'Padding', prop: 'padding', defaultValue: 48 },
          { type: 'colorpicker', label: 'Background Color', prop: 'bgColor', defaultValue: '#ffffff' }
        ]
      }
    ],
    advanced: [
      {
        sectionTitle: 'Advanced',
        fields: [
          { type: 'text', label: 'Custom CSS Class', prop: 'className', defaultValue: '' }
        ]
      }
    ]
  }
};

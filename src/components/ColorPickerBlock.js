// src/components/ColorPickerBlock.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { SketchPicker } from 'react-color';

const Wrapper = styled.div`
  margin-bottom: 0.75rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
`;

const PickerWrapper = styled.div`
  position: relative;
`;

const Swatch = styled.div`
  width: 36px;
  height: 14px;
  border-radius: 2px;
  background: ${(props) => props.color};
  cursor: pointer;
  border: 1px solid #ccc;
`;

const Popover = styled.div`
  position: absolute;
  z-index: 999;
  top: 30px;
  left: 0;
`;

const Cover = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export function ColorPickerBlock({ label, value, onChange }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChangeComplete = (color) => {
    onChange(color.hex);
  };

  return (
    <Wrapper className="form-group">
      <Label>{label}</Label>
      <PickerWrapper className="color-picker">
        <Swatch color={value} onClick={handleClick} />
        {displayColorPicker && (
          <Popover>
            <Cover onClick={handleClose} />
            <SketchPicker color={value} onChangeComplete={handleChangeComplete} />
          </Popover>
        )}
      </PickerWrapper>
    </Wrapper>
  );
}

// src/components/PanelBlock.js
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-bottom: 0.75rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.25rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.25rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

export function PanelBlock({ label, type, value, onChange, options }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  if (type === 'select') {
    return (
      <Wrapper className="form-group">
        <Label>{label}</Label>
        <Select value={value} onChange={handleChange}>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>
      </Wrapper>
    );
  }

  return (
    <Wrapper className="form-group">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={handleChange} />
    </Wrapper>
  );
}

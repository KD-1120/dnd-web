// src/styles/globalStyles.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background: #f0f2f5;
    height: 100vh;
    overflow: hidden;
    color: #333;
  }
  .properties-panel {
    padding: 1rem;
    background: #ffffff;
    border-left: 1px solid #dee2e6;
    overflow-y: auto;
  }
  .properties-panel h5 {
    margin-top: 0;
    font-size: 1.25rem;
    color: #333;
  }
  .properties-panel h6 {
    margin: 1rem 0 0.5rem;
    font-size: 0.85rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .properties-panel .form-group {
    margin-bottom: 1rem;
  }
  .properties-panel .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  .properties-panel .form-group input,
  .properties-panel .form-group select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
  }
  .properties-panel .color-picker {
    display: flex;
    align-items: center;
  }
  .properties-panel .color-picker input {
    margin-left: 0.5rem;
  }
`;

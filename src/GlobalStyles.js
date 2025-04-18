
// src/GlobalStyles.js
import styled, { createGlobalStyle } from 'styled-components';
import { Button } from 'react-bootstrap';

// Define color palette
export const colors = {
  primary: 'rgb(0, 157, 136)',
  primaryHover: '#00a692',
  primaryLight: '#e0f7f4',
  secondary: '#64748B',
  dark: '#1E293B',
  light: '#F8FAFC',
  lighterGray: '#f9f9f9',
  lightGray: '#f5f5f5',
  mediumGray: '#eee',
  gray: '#666',
  white: '#FFFFFF',
  black: '#000000',
  cardBg: '#F1F5F9',
  success: '#0CAF60',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  border: '#E2E8F0'
};

// Define typography
export const typography = {
  fontFamily: "'Inter', sans-serif",
  headingFamily: "'Inter', sans-serif",
  fontSizes: {
    xs: '0.75rem',     // 12px
    small: '0.875rem',  // 14px
    base: '1rem',       // 16px
    lead: '1.125rem',   // 18px
    large: '1.25rem',   // 20px
    xl: '1.5rem',       // 24px
    xxl: '1.875rem',    // 30px
    h3: '1.25rem',      // 20px
    h2: '1.75rem',      // 28px
    h1: '2.25rem',      // 36px
    display: '3rem'     // 48px
  }
};

// Define spacing
export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '1rem',      // 16px
  md: '1.5rem',    // 24px
  lg: '2rem',      // 32px
  xl: '3rem',      // 48px
  xxl: '4rem'      // 64px
};

// Define shadows
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

// Define breakpoints
export const breakpoints = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px'
};

// Define responsive mixins
export const media = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  maxSm: `@media (max-width: ${breakpoints.sm})`,
  maxMd: `@media (max-width: ${breakpoints.md})`,
  maxLg: `@media (max-width: ${breakpoints.lg})`,
  maxXl: `@media (max-width: ${breakpoints.xl})`
};

// Define border radiuses
export const borderRadius = {
  sm: '0.25rem',  // 4px
  md: '0.5rem',   // 8px
  lg: '1rem',     // 16px
  xl: '1.5rem',   // 24px
  pill: '9999px'
};

// Define global styles
export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: ${typography.fontFamily};
    font-size: ${typography.fontSizes.base};
    line-height: 1.5;
    color: ${colors.dark};
    background-color: ${colors.light};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${typography.headingFamily};
    margin-top: 0;
    line-height: 1.2;
  }

  h1 {
    font-size: ${typography.fontSizes.h1};
  }

  h2 {
    font-size: ${typography.fontSizes.h2};
  }

  h3 {
    font-size: ${typography.fontSizes.h3};
  }

  p {
    margin-top: 0;
    margin-bottom: ${spacing.md};
  }

  a {
    color: ${colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }
  
  button {
    cursor: pointer;
  }
`;

// Reusable styled components
export const GreenButton = styled(Button)`
  background-color: ${colors.primary};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: ${borderRadius.sm};
  font-weight: 500;
  
  &:hover {
    background-color: ${colors.primaryHover};
  }
  
  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(0, 157, 136, 0.25);
  }
`;

export const OutlineButton = styled(Button)`
  background-color: transparent;
  border: 1px solid ${colors.primary};
  color: ${colors.primary};
  padding: 0.5rem 1rem;
  border-radius: ${borderRadius.sm};
  font-weight: 500;
  
  &:hover {
    background-color: ${colors.primaryLight};
  }
  
  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(0, 157, 136, 0.25);
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${spacing.md};
`;

export const SectionTitle = styled.h2`
  font-size: ${typography.fontSizes.h2};
  font-weight: bold;
  text-align: ${props => props.center ? 'center' : 'left'};
  margin-bottom: ${spacing.lg};
  color: ${colors.dark};
`;

export const SectionSubtitle = styled.p`
  font-size: ${typography.fontSizes.lead};
  color: ${colors.secondary};
  margin-bottom: ${spacing.lg};
  text-align: ${props => props.center ? 'center' : 'left'};
  max-width: ${props => props.center ? '700px' : 'none'};
  margin-left: ${props => props.center ? 'auto' : '0'};
  margin-right: ${props => props.center ? 'auto' : '0'};
`;

export const PageHeader = styled.header`
  padding: ${spacing.lg} 0;
  background-color: ${colors.light};
  border-bottom: 1px solid ${colors.border};
  margin-bottom: ${spacing.lg};
`;

export const PageTitle = styled.h1`
  font-size: ${typography.fontSizes.h1};
  font-weight: bold;
  margin-bottom: ${spacing.sm};
  color: ${colors.dark};
`;

export const Card = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.sm};
  padding: ${spacing.md};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${shadows.md};
    transform: translateY(-3px);
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${props => props.minWidth || '300px'}, 1fr));
  gap: ${props => props.gap || spacing.md};
`;

export const Flex = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'stretch'};
  flex-wrap: ${props => props.wrap ? 'wrap' : 'nowrap'};
  gap: ${props => props.gap || '0'};
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 0.25em 0.75em;
  font-size: ${typography.fontSizes.xs};
  font-weight: 600;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  border-radius: ${borderRadius.pill};
  background-color: ${props => 
    props.primary ? colors.primary : 
    props.success ? colors.success :
    props.warning ? colors.warning :
    props.error ? colors.error :
    props.info ? colors.info :
    colors.lightGray};
  color: ${props => 
    (props.primary || props.success || props.error || props.info) ? colors.white : 
    props.warning ? colors.dark : 
    colors.dark};
`;

export const Avatar = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: ${props => props.square ? borderRadius.sm : '50%'};
  background-color: ${colors.primary};
  color: ${colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Alert = styled.div`
  padding: ${spacing.sm} ${spacing.md};
  margin-bottom: ${spacing.md};
  border-radius: ${borderRadius.md};
  background-color: ${props => 
    props.success ? '#ecfdf5' : 
    props.warning ? '#fffbeb' :
    props.error ? '#fee2e2' :
    props.info ? '#eff6ff' :
    '#f3f4f6'};
  border-left: 4px solid ${props => 
    props.success ? colors.success : 
    props.warning ? colors.warning :
    props.error ? colors.error :
    props.info ? colors.info :
    colors.mediumGray};
  color: ${props => 
    props.success ? '#064e3b' : 
    props.warning ? '#78350f' :
    props.error ? '#7f1d1d' :
    props.info ? '#1e3a8a' :
    colors.dark};
`;

export const Divider = styled.hr`
  border: 0;
  border-top: 1px solid ${colors.border};
  margin: ${spacing.md} 0;
`;

export const Tag = styled.span`
  display: inline-block;
  padding: 0.25em 0.75em;
  font-size: ${typography.fontSizes.xs};
  line-height: 1.5;
  border-radius: ${borderRadius.pill};
  background-color: ${colors.lightGray};
  color: ${colors.dark};
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: ${typography.fontSizes.base};
  line-height: 1.5;
  color: ${colors.dark};
  background-color: ${colors.white};
  background-clip: padding-box;
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.sm};
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  
  &:focus {
    color: ${colors.dark};
    background-color: ${colors.white};
    border-color: ${colors.primary};
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(0, 157, 136, 0.25);
  }
  
  &::placeholder {
    color: ${colors.secondary};
    opacity: 1;
  }
`;

export const TextArea = styled.textarea`
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: ${typography.fontSizes.base};
  line-height: 1.5;
  color: ${colors.dark};
  background-color: ${colors.white};
  background-clip: padding-box;
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.sm};
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    color: ${colors.dark};
    background-color: ${colors.white};
    border-color: ${colors.primary};
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(0, 157, 136, 0.25);
  }
  
  &::placeholder {
    color: ${colors.secondary};
    opacity: 1;
  }
`;

export const Select = styled.select`
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: ${typography.fontSizes.base};
  line-height: 1.5;
  color: ${colors.dark};
  background-color: ${colors.white};
  background-clip: padding-box;
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.sm};
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  
  &:focus {
    color: ${colors.dark};
    background-color: ${colors.white};
    border-color: ${colors.primary};
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(0, 157, 136, 0.25);
  }
`;

export const FormGroup = styled.div`
  margin-bottom: ${spacing.md};
`;

export const FormLabel = styled.label`
  display: inline-block;
  margin-bottom: ${spacing.xs};
  font-weight: 500;
`;

export const Spinner = styled.div`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border: 4px solid rgba(0, 157, 136, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${colors.primary};
  animation: spin 1s linear infinite;
  margin: ${props => props.center ? '0 auto' : '0'};
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.lg};
  max-width: 90vw;
  width: ${props => props.width || '500px'};
  max-height: 90vh;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  padding: ${spacing.md};
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ModalTitle = styled.h4`
  margin: 0;
  font-size: ${typography.fontSizes.large};
  font-weight: 600;
`;

export const ModalBody = styled.div`
  padding: ${spacing.md};
`;

export const ModalFooter = styled.div`
  padding: ${spacing.md};
  border-top: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${spacing.sm};
`;

export const FeatureCard = styled(Card)`
  padding: ${spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${colors.primaryLight};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${spacing.md};
  color: ${colors.primary};
  
  svg {
    width: 30px;
    height: 30px;
  }
`;

export const FeatureTitle = styled.h3`
  font-size: ${typography.fontSizes.large};
  font-weight: 600;
  margin-bottom: ${spacing.sm};
`;

export const FeatureText = styled.p`
  color: ${colors.secondary};
  margin-bottom: ${spacing.md};
`;

export default GlobalStyle;

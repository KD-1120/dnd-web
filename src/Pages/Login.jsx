import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { LogIn } from 'lucide-react';
import { colors, spacing, shadows, borderRadius, typography } from '../GlobalStyles';

const LoginWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.light};
  padding: ${spacing.md};
`;

const LoginCard = styled.div`
  background-color: white;
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.md};
  width: 100%;
  max-width: 400px;
  padding: ${spacing.lg};
`;

const Logo = styled.div`
  font-size: ${typography.fontSizes.xxl};
  font-weight: 700;
  text-align: center;
  margin-bottom: ${spacing.lg};
  color: ${colors.primary};
  
  span {
    color: ${colors.dark};
  }
`;

const FormTitle = styled.h1`
  font-size: ${typography.fontSizes.xl};
  font-weight: 600;
  text-align: center;
  margin-bottom: ${spacing.md};
  color: ${colors.dark};
`;

const FormGroup = styled(Form.Group)`
  margin-bottom: ${spacing.md};
`;

const FormLabel = styled(Form.Label)`
  font-weight: 500;
  color: ${colors.dark};
`;

const FormControl = styled(Form.Control)`
  padding: ${spacing.sm};
  border-color: ${colors.border};
  border-radius: ${borderRadius.sm};
  
  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 0.25rem rgba(0, 157, 136, 0.25);
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  padding: ${spacing.sm};
  background-color: ${colors.primary};
  border-color: ${colors.primary};
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.xs};
  
  &:hover, &:focus {
    background-color: ${colors.primaryHover};
    border-color: ${colors.primaryHover};
  }
`;

const LinkContainer = styled.div`
  text-align: center;
  margin-top: ${spacing.md};
  font-size: ${typography.fontSizes.small};
  
  a {
    color: ${colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: ${spacing.md} 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${colors.border};
  }
  
  span {
    padding: 0 ${spacing.sm};
    color: ${colors.secondary};
    font-size: ${typography.fontSizes.small};
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to authenticate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful login
      localStorage.setItem('isAuthenticated', 'true');
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <LoginWrapper>
      <Container>
        <LoginCard>
          <Logo>Event<span>Hub</span></Logo>
          <FormTitle>Log In</FormTitle>
          
          {error && (
            <Alert variant="danger">{error}</Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel>Email Address</FormLabel>
              <FormControl
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>Password</FormLabel>
              <FormControl
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </FormGroup>
            
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Logging in...' : (
                <>
                  <LogIn size={16} />
                  Log In
                </>
              )}
            </SubmitButton>
          </Form>
          
          <LinkContainer>
            <Link to="/forgot-password">Forgot password?</Link>
          </LinkContainer>
          
          <Divider>
            <span>OR</span>
          </Divider>
          
          <LinkContainer>
            Don't have an account? <Link to="/register">Register</Link>
          </LinkContainer>
        </LoginCard>
      </Container>
    </LoginWrapper>
  );
};

export default Login;
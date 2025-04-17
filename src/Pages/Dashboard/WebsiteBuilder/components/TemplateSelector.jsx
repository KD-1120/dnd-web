import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TemplateService } from '../services/TemplateService';

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  background: ${props => props.active ? '#4338ca' : '#fff'};
  color: ${props => props.active ? '#fff' : '#333'};
  border: 1px solid ${props => props.active ? '#4338ca' : '#ddd'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#4338ca' : '#f7f7f7'};
  }
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const TemplateCard = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const TemplateImage = styled.div`
  height: 200px;
  width: 100%;
  background-color: #f1f1f1;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-bottom: 1px solid #eee;
`;

const TemplateInfo = styled.div`
  padding: 1.5rem;
`;

const TemplateName = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const TemplateCategory = styled.span`
  display: inline-block;
  font-size: 0.8rem;
  background: #f1f1f1;
  color: #666;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  margin-bottom: 0.75rem;
`;

const TemplateDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const UseTemplateButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #4338ca;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #4f46e5;
  }
`;

const BlankTemplateCard = styled(TemplateCard)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  height: 100%;
  min-height: 350px;
  border: 2px dashed #ddd;
  background: #f9f9f9;
`;

const BlankTemplateIcon = styled.div`
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 1rem;
`;

const BlankTemplateTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const BlankTemplateDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.5rem;
`;

const CreateBlankButton = styled(UseTemplateButton)`
  background: #333;
  
  &:hover {
    background: #555;
  }
`;

const TemplateSelector = ({ onSelectTemplate, onCreateFromScratch }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true);
      try {
        const data = await TemplateService.getTemplates();
        setTemplates(data);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTemplates();
  }, []);
  
  const categories = ['All', ...new Set(templates.map(t => t.category))];
  
  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);
  
  return (
    <Container>
      <Header>
        <Title>Choose an Event Template</Title>
        <Subtitle>
          Select a pre-designed template to get started quickly or create a blank website
          that you can customize from scratch.
        </Subtitle>
      </Header>
      
      <FilterContainer>
        {categories.map(category => (
          <FilterButton 
            key={category}
            active={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </FilterButton>
        ))}
      </FilterContainer>
      
      <TemplateGrid>
        {/* Blank Template Option */}
        <BlankTemplateCard>
          <BlankTemplateIcon>+</BlankTemplateIcon>
          <BlankTemplateTitle>Blank Template</BlankTemplateTitle>
          <BlankTemplateDescription>
            Start with a blank canvas and build your event website from scratch.
          </BlankTemplateDescription>
          <CreateBlankButton onClick={onCreateFromScratch}>
            Create Blank Website
          </CreateBlankButton>
        </BlankTemplateCard>
        
        {/* Template Cards */}
        {filteredTemplates.map(template => (
          <TemplateCard key={template.id}>
            <TemplateImage src={template.thumbnail} />
            <TemplateInfo>
              <TemplateName>{template.name}</TemplateName>
              <TemplateCategory>{template.category}</TemplateCategory>
              <TemplateDescription>
                {template.description}
              </TemplateDescription>
              <UseTemplateButton onClick={() => onSelectTemplate(template.id)}>
                Use This Template
              </UseTemplateButton>
            </TemplateInfo>
          </TemplateCard>
        ))}
        
        {loading && <div>Loading templates...</div>}
        
        {!loading && filteredTemplates.length === 0 && selectedCategory !== 'All' && (
          <div>No templates found in this category.</div>
        )}
      </TemplateGrid>
    </Container>
  );
};

export default TemplateSelector;
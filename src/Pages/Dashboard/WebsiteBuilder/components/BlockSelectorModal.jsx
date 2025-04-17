// src/Pages/Dashboard/WebsiteBuilder/components/BlockSelectorModal.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  X, 
  Search, 
  ChevronRight, 
  Star, 
  Clock, 
  Layout, 
  Type, 
  Image, 
  Calendar, 
  Users,
  MapPin,
  Share2
} from 'lucide-react';
import { getAllBrickTypes, getComponentsByCategory } from '../bricks/BrickRegistry';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 900px;
  height: 85vh;
  max-width: 92vw;
  max-height: 85vh;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.2s ease-out;
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0.8; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  
  &:hover {
    color: #111827;
    background: #f3f4f6;
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 220px;
  border-right: 1px solid #eee;
  overflow-y: auto;
  padding: 16px 0;
  background: #f9fafb;
`;

const MainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SearchBar = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0 12px;
  background: #f9fafb;
  transition: all 0.2s;
  
  &:focus-within {
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 10px 12px;
    font-size: 14px;
    outline: none;
  }
  
  svg {
    color: #6b7280;
  }
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
`;

const CategoryItem = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: ${props => props.active ? '#e0e7ff' : 'transparent'};
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#4f46e5' : '#374151'};
  border-left: 3px solid ${props => props.active ? '#4f46e5' : 'transparent'};
  
  &:hover {
    background: ${props => props.active ? '#e0e7ff' : '#f3f4f6'};
  }

  svg {
    margin-right: 12px;
    color: ${props => props.active ? '#4f46e5' : '#6b7280'};
  }
`;

const ContentArea = styled.div`
  padding: 0;
  overflow-y: auto;
  flex: 1;
`;

const RecentSection = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
    color: #6b7280;
  }
`;

const ViewAllButton = styled.button`
  background: transparent;
  border: none;
  font-size: 13px;
  color: #4f46e5;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    text-decoration: underline;
  }
  
  svg {
    margin-left: 4px;
    width: 14px;
    height: 14px;
  }
`;

const RecentBlocksRow = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;

const RecentBlockCard = styled.button`
  min-width: 120px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  gap: 8px;
  
  &:hover {
    border-color: #4f46e5;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(79, 70, 229, 0.1);
  }
`;

const CategorySection = styled.div`
  padding: 24px;
`;

const CategoryTitle = styled.h4`
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
`;

const BlockGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const BlockCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #4f46e5;
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  }
`;

const BlockIcon = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 12px;
  color: #4f46e5;
  margin-bottom: 12px;
`;

const BlockName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  text-align: center;
`;

const BlockDescription = styled.span`
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  margin-top: 4px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #6b7280;
  text-align: center;
  
  svg {
    color: #d1d5db;
    margin-bottom: 16px;
  }
`;

// Map category names to icons
const categoryIcons = {
  'All': Search,
  'Recent': Clock,
  'Favorites': Star,
  'Layout': Layout,
  'Text': Type,
  'Media': Image,
  'Components': Layout,
  'Events': Calendar,
  'People': Users,
  'Location': MapPin,
  'Social': Share2
};

// Sample block descriptions for better UI
const blockDescriptions = {
  title: 'Add a heading to your page',
  text: 'Add a paragraph of text',
  button: 'Add a clickable button',
  image: 'Display an image or photo',
  container: 'Create a layout container',
  socialMediaSharing: 'Add social media sharing buttons',
  googleMaps: 'Display a location on Google Maps',
  ticketSalesWidget: 'Sell tickets to your event',
  scheduleAgenda: 'Show your event schedule',
  countdownTimer: 'Add a countdown to your event',
  speakerGallery: 'Showcase your event speakers'
};

const BlockSelectorModal = ({ isOpen, onClose, onBlockSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [recentBlocks, setRecentBlocks] = useState([
    { type: 'text', label: 'Text' },
    { type: 'button', label: 'Button' },
    { type: 'image', label: 'Image' },
    { type: 'container', label: 'Container' }
  ]);
  const [favoriteBlocks, setFavoriteBlocks] = useState([
    { type: 'title', label: 'Title' },
    { type: 'container', label: 'Container' }
  ]);
  
  // Get all brick types from registry
  const allBlocks = getAllBrickTypes();
  
  // Get blocks by category
  const blocksByCategory = getComponentsByCategory();
  
  // Make sure we include "All" blocks
  blocksByCategory['All'] = allBlocks;
  
  // Add Recent and Favorites categories to the sidebar
  const sidebarCategories = ['All', 'Recent', 'Favorites', ...Object.keys(blocksByCategory).filter(cat => !['All', 'Recent', 'Favorites'].includes(cat))];
  
  // Filter blocks based on search query
  const filteredBlocks = searchQuery 
    ? allBlocks.filter(block => 
        block.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        block.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blockDescriptions[block.type] && blockDescriptions[block.type].toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];
  
  // Determine which blocks to show based on active category and search
  const getDisplayBlocks = () => {
    if (searchQuery) return filteredBlocks;
    if (activeCategory === 'Recent') return recentBlocks;
    if (activeCategory === 'Favorites') return favoriteBlocks;
    return blocksByCategory[activeCategory] || [];
  };
  
  // Handle selecting a block and update recent blocks
  const handleBlockSelect = (blockType) => {
    // Update recent blocks (would be persisted in localStorage in a real app)
    const selectedBlock = allBlocks.find(block => block.type === blockType);
    if (selectedBlock) {
      const newRecents = [
        selectedBlock,
        ...recentBlocks.filter(block => block.type !== blockType).slice(0, 3)
      ];
      setRecentBlocks(newRecents);
    }
    
    // Call the provided handler
    onBlockSelect(blockType);
    onClose();
  };
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  // Focus search input when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const searchInput = document.getElementById('block-search-input');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  }, [isOpen]);
  
  const displayBlocks = getDisplayBlocks();
  
  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Add a Block</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <Sidebar>
            <CategoryList>
              {sidebarCategories.map((category) => {
                const CategoryIcon = categoryIcons[category] || Layout;
                return (
                  <CategoryItem 
                    key={category}
                    active={activeCategory === category}
                    onClick={() => {
                      setActiveCategory(category);
                      setSearchQuery('');
                    }}
                  >
                    <CategoryIcon size={18} />
                    {category}
                  </CategoryItem>
                );
              })}
            </CategoryList>
          </Sidebar>
          
          <MainArea>
            <SearchBar>
              <SearchInput>
                <Search size={16} />
                <input 
                  id="block-search-input"
                  type="text" 
                  placeholder="Search blocks..." 
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    if (e.target.value) {
                      setActiveCategory('All');
                    }
                  }}
                />
              </SearchInput>
            </SearchBar>
            
            <ContentArea>
              {!searchQuery && activeCategory === 'All' && (
                <RecentSection>
                  <SectionHeader>
                    <SectionTitle>
                      <Clock size={16} />
                      Recently Used
                    </SectionTitle>
                    <ViewAllButton onClick={() => setActiveCategory('Recent')}>
                      View all <ChevronRight size={14} />
                    </ViewAllButton>
                  </SectionHeader>
                  
                  <RecentBlocksRow>
                    {recentBlocks.map(block => {
                      const Icon = block.icon || categoryIcons[blocksByCategory[block.category]] || Layout;
                      return (
                        <RecentBlockCard
                          key={block.type}
                          onClick={() => handleBlockSelect(block.type)}
                        >
                          <Icon size={24} />
                          <BlockName>{block.label}</BlockName>
                        </RecentBlockCard>
                      );
                    })}
                  </RecentBlocksRow>
                </RecentSection>
              )}
              
              {searchQuery ? (
                <CategorySection>
                  <CategoryTitle>Search Results</CategoryTitle>
                  {displayBlocks.length > 0 ? (
                    <BlockGrid>
                      {displayBlocks.map(block => {
                        const Icon = block.icon || categoryIcons[block.category] || Layout;
                        return (
                          <BlockCard 
                            key={block.type}
                            onClick={() => handleBlockSelect(block.type)}
                          >
                            <BlockIcon>
                              <Icon size={28} />
                            </BlockIcon>
                            <BlockName>{block.label}</BlockName>
                            {blockDescriptions[block.type] && (
                              <BlockDescription>{blockDescriptions[block.type]}</BlockDescription>
                            )}
                          </BlockCard>
                        );
                      })}
                    </BlockGrid>
                  ) : (
                    <EmptyState>
                      <Search size={32} />
                      <p>No matching blocks found.</p>
                      <small>Try a different search term or browse categories</small>
                    </EmptyState>
                  )}
                </CategorySection>
              ) : (
                // Show category-specific blocks when not searching
                <CategorySection>
                  <CategoryTitle>
                    {activeCategory === 'Recent' ? 'Recently Used Blocks' : 
                     activeCategory === 'Favorites' ? 'Favorite Blocks' : 
                     `${activeCategory} Blocks`}
                  </CategoryTitle>
                  
                  {displayBlocks.length > 0 ? (
                    <BlockGrid>
                      {displayBlocks.map(block => {
                        const Icon = block.icon || categoryIcons[block.category] || Layout;
                        return (
                          <BlockCard 
                            key={block.type}
                            onClick={() => handleBlockSelect(block.type)}
                          >
                            <BlockIcon>
                              <Icon size={28} />
                            </BlockIcon>
                            <BlockName>{block.label}</BlockName>
                            {blockDescriptions[block.type] && (
                              <BlockDescription>{blockDescriptions[block.type]}</BlockDescription>
                            )}
                          </BlockCard>
                        );
                      })}
                    </BlockGrid>
                  ) : (
                    <EmptyState>
                      {activeCategory === 'Favorites' ? (
                        <>
                          <Star size={32} />
                          <p>No favorite blocks yet</p>
                          <small>Blocks you mark as favorites will appear here</small>
                        </>
                      ) : (
                        <>
                          <Layout size={32} />
                          <p>No blocks in this category</p>
                          <small>Try another category from the sidebar</small>
                        </>
                      )}
                    </EmptyState>
                  )}
                </CategorySection>
              )}
            </ContentArea>
          </MainArea>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BlockSelectorModal;
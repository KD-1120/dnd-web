// src/components/Sidebar.js
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { BrickRegistry } from '../bricks/BrickRegistry';
import { patterns } from '../patterns';
import { Tabs, Tab, InputGroup, FormControl } from 'react-bootstrap';
import { Search, ChevronRight, Grid, Layout } from 'lucide-react';
import { Modal } from './common/Modals';

// ----- STYLED COMPONENTS -----
const SidebarWrapper = styled.div`
  width: 300px;
  background: #ffffff;
  color: #444;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const StyledTabs = styled(Tabs)`
  background: #f1f3f5;
  border-bottom: none;
  padding: 0;
  .nav-item .nav-link {
    color: #6d7882;
    border: none;
    border-radius: 0;
    padding: 12px 0;
    text-align: center;
    font-weight: 500;
    margin: 0;
    transition: all 0.2s ease;
    &:hover {
      color: #333;
      background: #e6e9ec;
    }
    &.active {
      color: #333;
      background: #ffffff;
      border-top: 2px solid #0073aa;
    }
  }
`;

const SidebarContent = styled.div`
  overflow-y: auto;
  padding: 1rem;
  flex: 1;
  background: #ffffff;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f3f5;
  }
  &::-webkit-scrollbar-thumb {
    background: #0073aa;
    border-radius: 3px;
  }
`;

const SearchBarWrapper = styled.div`
  margin-bottom: 1rem;
  position: relative;
`;

const StyledInputGroup = styled(InputGroup)`
  .form-control {
    background: #f1f3f5;
    border: 1px solid #d5dadf;
    color: #444;
    padding-left: 2.5rem;
    &::placeholder {
      color: #a4afb7;
    }
    &:focus {
      box-shadow: 0 0 0 0.2rem rgba(0, 115, 170, 0.25);
      border-color: #0073aa;
    }
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 10px;
  top: 8px;
  z-index: 4;
  color: #a4afb7;
`;

const CategorySection = styled.div`
  margin-bottom: 1rem;
`;

const CategoryHeading = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
  color: #0073aa;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e6e9ec;
  cursor: pointer;
  user-select: none;
  svg {
    transition: transform 0.2s ease;
    transform: ${({ isOpen }) => (isOpen ? 'rotate(90deg)' : 'rotate(0)')};
  }
`;

const CategoryContent = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const BrickCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  border: 1px solid #d5dadf;
  border-radius: 5px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  &:hover {
    background: #e6e9ec;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  svg {
    margin-bottom: 0.5rem;
    color: #0073aa;
  }
  span {
    font-size: 14px;
    color: #444;
  }
`;

const PatternItem = styled.div`
  background: #f1f3f5;
  color: #444;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  border-radius: 3px;
  transition: all 0.2s ease;
  &:hover {
    background: #e6e9ec;
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 1rem;
`;

const MediaItem = styled.div`
  position: relative;
  cursor: pointer;
  border-radius: 3px;
  overflow: hidden;
  transition: all 0.2s ease;
  border: 1px solid #d5dadf;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    border-color: #0073aa;
    &::after {
      opacity: 1;
    }
  }
  &::after {
    content: "Insert";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 115, 170, 0.9);
    color: white;
    text-align: center;
    padding: 4px 0;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  img {
    width: 100%;
    display: block;
  }
`;

const TabText = styled.span`
  margin-left: 8px;
`;

const ColumnModal = ({ isOpen, onClose, onConfirm }) => {
  const [columns, setColumns] = useState(2);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3>Configure Columns</h3>
      <div style={{ marginBottom: '20px' }}>
        <label>Number of columns:</label>
        <input
          type="number"
          min="1"
          max="4"
          value={columns}
          onChange={(e) =>
            setColumns(Math.max(1, Math.min(4, parseInt(e.target.value, 10))))
          }
          style={{ marginLeft: '10px', width: '60px' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button onClick={() => onConfirm(columns)}>Create Columns</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export function Sidebar() {
  const { 
    addBrickToRoot, 
    selectGlobalElement,
    activeTab, 
    setActiveTab 
  } = useBuilderContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategories, setOpenCategories] = useState({});
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [pendingColumnAction, setPendingColumnAction] = useState(null);

  const blocksFromRegistry = useMemo(() => {
    return Object.entries(BrickRegistry).map(([type, def]) => ({
      type,
      label: def.label || type,
      icon: def.icon,
      category: def.category || 'Others',
    }));
  }, []);

  const groupedBlocks = useMemo(() => {
    return blocksFromRegistry.reduce((acc, block) => {
      const cat = block.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(block);
      return acc;
    }, {});
  }, [blocksFromRegistry]);

  const toggleCategory = (categoryName) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) return groupedBlocks;
    const lower = searchTerm.toLowerCase();
    const filtered = {};
    Object.keys(groupedBlocks).forEach((cat) => {
      const filteredBlocks = groupedBlocks[cat].filter((b) =>
        b.label.toLowerCase().includes(lower)
      );
      if (filteredBlocks.length) {
        filtered[cat] = filteredBlocks;
      }
    });
    return filtered;
  }, [groupedBlocks, searchTerm]);

  const renderBlocksTab = () => (
    <>
      <SearchBarWrapper>
        <StyledInputGroup>
          <SearchIconWrapper>
            <Search size={16} />
          </SearchIconWrapper>
          <FormControl
            placeholder="Search blocks"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </StyledInputGroup>
      </SearchBarWrapper>

      {Object.keys(filteredGroups).map((category) => {
        const isOpen = openCategories[category] ?? true;
        return (
          <CategorySection key={category}>
            <CategoryHeading
              onClick={() => toggleCategory(category)}
              isOpen={isOpen}
            >
              <ChevronRight size={16} />
              <span style={{ marginLeft: '8px' }}>{category}</span>
            </CategoryHeading>
            <CategoryContent isOpen={isOpen}>
              <CardsGrid>
                {filteredGroups[category].map((block) => (
                  <BrickCard
                    key={block.type}
                    onClick={() => {
                      if (block.type === 'container') {
                        addBrickToRoot('container', {
                          props: {
                            gap: 20,
                            padding: '20px',
                          },
                          components: [
                            {
                              type: 'column',
                              props: {
                                width: '100%',
                                bgColor: '#ffffff',
                                padding: '1rem',
                                height: '200px',
                              },
                            },
                          ],
                        });
                      } else {
                        addBrickToRoot(block.type);
                      }
                    }}
                  >
                    {block.icon && <block.icon size={24} />}
                    <span>{block.label}</span>
                  </BrickCard>
                ))}
              </CardsGrid>
            </CategoryContent>
          </CategorySection>
        );
      })}
    </>
  );

  const renderLayoutTab = () => (
    <div>
      <CardsGrid>
        {patterns
          .filter((pattern) => pattern.category === 'Site Framework')
          .map((pattern) => (
            <BrickCard
              key={pattern.name}
              onClick={() => {
                selectGlobalElement(pattern.name);
              }}
            >
              {pattern.icon && <pattern.icon size={24} />}
              <span>{pattern.name}</span>
            </BrickCard>
          ))}
      </CardsGrid>
    </div>
  );

  const renderMediaTab = () => (
    <div>
      <SearchBarWrapper>
        <StyledInputGroup>
          <SearchIconWrapper>
            <Search size={16} />
          </SearchIconWrapper>
          <FormControl placeholder="Search media library" />
        </StyledInputGroup>
      </SearchBarWrapper>
      <MediaGrid>
        {[
          'https://via.placeholder.com/300x200.png?text=Media+1',
          'https://via.placeholder.com/300x200.png?text=Media+2',
          'https://via.placeholder.com/300x200.png?text=Media+3',
          'https://via.placeholder.com/300x200.png?text=Media+4',
        ].map((url, index) => (
          <MediaItem
            key={index}
            onClick={() => {
              addBrickToRoot('image');
            }}
          >
            <img src={url} alt={`Media item ${index + 1}`} />
          </MediaItem>
        ))}
      </MediaGrid>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'blocks':
        return renderBlocksTab();
      case 'global':
        return renderLayoutTab();
      case 'media':
        return renderMediaTab();
      default:
        return null;
    }
  };

  return (
    <SidebarWrapper>
      <StyledTabs
        id="sidebar-tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-0"
        fill
      >
        <Tab eventKey="blocks" title={<><Grid size={16} /><TabText>Blocks</TabText></>} />
        <Tab eventKey="global" title={<><Layout size={16} /><TabText>Global</TabText></>} />
        <Tab eventKey="media" title="Media" />
      </StyledTabs>
      <SidebarContent>{renderTabContent()}</SidebarContent>
      <ColumnModal
        isOpen={showColumnModal}
        onClose={() => setShowColumnModal(false)}
        onConfirm={(count) => {
          pendingColumnAction(count);
          setShowColumnModal(false);
        }}
      />
    </SidebarWrapper>
  );
}

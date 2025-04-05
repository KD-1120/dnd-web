// src/bricks/IconBrick.js
import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { Tooltip } from 'react-tippy';
import { FixedSizeGrid as Grid } from 'react-window';
import * as LuIcons from 'react-icons/lu';
import * as PhosphorIcons from '@phosphor-icons/react';
import * as IconoirIcons from 'iconoir-react';
import { useViewMode } from '../context/ViewModeContext';
import { PreviewWrapper } from '../components/PreviewWrapper';

const IconWrapper = styled.div`
  text-align: center;
  display: inline-block;
  cursor: pointer;
  position: relative;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 16px;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 70vh;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TabNavigation = styled.div`
  margin-bottom: 16px;
`;

const TabButton = styled.button`
  padding: 8px 16px;
  margin-right: 8px;
  background: ${(props) => (props.active ? '#007bff' : '#f0f0f0')};
  color: ${(props) => (props.active ? 'white' : 'black')};
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;

  &:hover {
    background: #ff4d4d;
    border-color: #ff4d4d;
    color: white;
  }

  ${IconWrapper}:hover & {
    opacity: 1;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
`;

const SliderContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SizeSlider = styled.input`
  flex: 1;
  min-width: 100px;
`;

const ColorInput = styled.input`
  width: 40px;
  height: 32px;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
`;

// Icon libraries configuration
const libraries = {
  Lucide: {
    icons: LuIcons,
    filter: (name) => name.startsWith('Lu'),
  },
  Phosphor: {
    icons: PhosphorIcons,
    filter: (name) =>
      name[0] === name[0].toUpperCase() && !name.includes('Weight'),
  },
  Iconoir: {
    icons: IconoirIcons,
    filter: (name) => name[0] === name[0].toUpperCase(),
  },
};

const CELL_WIDTH = 150; // Increased from 120px to 150px for more space
const CELL_HEIGHT = 100; // Height of each cell
const COLUMN_COUNT = 5; // Fixed 5 columns

function getIconByName(iconName) {
  if (LuIcons[iconName]) return LuIcons[iconName];
  if (PhosphorIcons[iconName]) return PhosphorIcons[iconName];
  if (IconoirIcons[iconName]) return IconoirIcons[iconName];
  return LuIcons.LuHandshake; // Default to LuHandshake
}

export function IconBrickComponent({ brick, onSelect, onUpdate, isSelected, onDelete, isTemporary, onClose }) {
  const { props = {} } = brick;
  const { iconName = 'LuHandshake', size = 32, color = '#0ca678' } = props;

  const [tempSize, setTempSize] = useState(size);
  const [tempColor, setTempColor] = useState(color);
  const [isModalOpen, setModalOpen] = useState(isTemporary); // Open modal immediately if temporary
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Lucide');
  const { viewMode } = useViewMode();
  const isPreview = viewMode === 'preview';

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect?.();
    setModalOpen(true);
  };

  const handleClose = () => {
    if (isTemporary) {
      onClose?.();
    } else {
      setModalOpen(false);
    }
  };

  const handleUpdate = (newProps) => {
    const updatedProps = {
      iconName: newProps.iconName || iconName,
      size: newProps.size || tempSize,
      color: newProps.color || tempColor
    };
    
    if (isTemporary) {
      onUpdate(updatedProps);
      onClose?.();
    } else {
      onUpdate?.(updatedProps);
      setModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      setTempSize(size);
      setTempColor(color);
    }
  }, [isModalOpen, size, color]);

  const iconList = useMemo(() => {
    const { icons, filter } = libraries[activeTab];
    let filtered = Object.entries(icons).filter(([name]) => filter(name));
    if (searchTerm.trim()) {
      filtered = filtered.filter(([name]) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [activeTab, searchTerm]);

  const rowCount = Math.ceil(iconList.length / COLUMN_COUNT);

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const iconIndex = rowIndex * COLUMN_COUNT + columnIndex;
    if (iconIndex >= iconList.length) return null;
    const [name, IconComponent] = iconList[iconIndex];
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '10px',
          cursor: 'pointer',
        }}
        onClick={() => handleUpdate({ iconName: name })}
      >
        <Tooltip title={name} inertia>
          <IconComponent size={tempSize} color={tempColor} />
        </Tooltip>
        <span
          style={{
            fontSize: '12px',
            marginTop: '5px',
            textAlign: 'center',
            maxWidth: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </span>
      </div>
    );
  };

  const renderModalContent = () => (
    <ModalContent onClick={(e) => e.stopPropagation()} style={{ overflow: 'hidden', width: '100%' }}>
      <h3>Select an Icon</h3>
      <Controls>
        <SliderContainer>
          <span>Size:</span>
          <SizeSlider
            type="range"
            min="12"
            max="64"
            value={tempSize}
            onChange={(e) => setTempSize(Number(e.target.value))}
          />
          <span>{tempSize}px</span>
        </SliderContainer>
        <ColorContainer>
          <span>Color:</span>
          <ColorInput
            type="color"
            value={tempColor}
            onChange={(e) => setTempColor(e.target.value)}
          />
        </ColorContainer>
      </Controls>
      <SearchInput
        type="text"
        placeholder="Search icons..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TabNavigation>
        {Object.keys(libraries).map((library) => (
          <TabButton
            key={library}
            active={activeTab === library}
            onClick={() => setActiveTab(library)}
          >
            {library}
          </TabButton>
        ))}
      </TabNavigation>
      <Grid
        columnCount={COLUMN_COUNT}
        columnWidth={CELL_WIDTH}
        height={400}
        rowCount={rowCount}
        rowHeight={CELL_HEIGHT}
        width={CELL_WIDTH * COLUMN_COUNT}
        style={{ overflowX: 'hidden' }}
      >
        {Cell}
      </Grid>
    </ModalContent>
  );

  const IconComp = getIconByName(iconName);

  if (isTemporary) {
    return (
      <ModalOverlay onClick={handleClose}>
        {renderModalContent()}
      </ModalOverlay>
    );
  }

  return (
    <PreviewWrapper isSelected={isSelected}>
      <IconWrapper>
        <div
          onClick={(e) => {
            if (!isPreview) {
              e.stopPropagation();
              onSelect?.();
            }
          }}
          style={{
            cursor: isPreview ? 'default' : 'pointer',
            border: isSelected ? '1px solid #10a5e0' : 'none',
            padding: '4px',
          }}
        >
          {IconComp && <IconComp size={size} color={color} />}
        </div>
        {!isPreview && onDelete && (
          <DeleteButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete Icon"
          >
            <LuIcons.LuTrash2 size={12} />
          </DeleteButton>
        )}
      </IconWrapper>

      {!isPreview && isModalOpen && (
        <ModalOverlay onClick={handleClose}>
          {renderModalContent()}
        </ModalOverlay>
      )}
    </PreviewWrapper>
  );
}

export const IconBrickInspector = {
  displayName: 'Icon',
  props: {
    size: {
      type: 'number',
      label: 'Size',
      defaultValue: 32,
    },
    color: {
      type: 'colorpicker',
      label: 'Color',
      defaultValue: '#0ca678',
    },
    iconName: {
      type: 'select',
      label: 'Icon',
      options: [
        ...Object.keys(LuIcons).filter((name) => name.startsWith('Lu')),
        ...Object.keys(PhosphorIcons).filter(
          (name) => name[0] === name[0].toUpperCase() && !name.includes('Weight')
        ),
        ...Object.keys(IconoirIcons).filter((name) => name[0] === name[0].toUpperCase()),
      ],
      defaultValue: 'LuHandshake',
    },
  },
};
// src/bricks/ImageBrick.js
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { useBuilderContext } from '../context/BuilderContext';
import { Upload, Link, X } from 'lucide-react';
import { useViewMode } from '../context/ViewModeContext';
import { PreviewWrapper } from '../components/PreviewWrapper';

const ImageWrapper = styled.div`
  position: relative;
  margin: 0.5rem 0;
  min-height: 100px;
  border: ${(props) =>
    props.isDragOver
      ? '2px dashed #007bff'
      : props.isSelected
      ? '2px solid #007bff'
      : '1px dashed #ccc'};
  border-radius: 4px;
  overflow: hidden;

  img {
    max-width: 100%;
    display: block;
  }
`;

const UploadOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  cursor: pointer;

  ${ImageWrapper}:hover & {
    opacity: 1;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ActionButton = styled.button`
  background: ${(props) => (props.variant === 'primary' ? '#007bff' : 'white')};
  color: ${(props) => (props.variant === 'primary' ? 'white' : '#007bff')};
  border: 1px solid #007bff;
  padding: 8px 16px;
  border-radius: 4px;
  margin: 0 8px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const AltText = styled.div`
  margin-top: 0.5rem;
  color: #666;
  font-size: 14px;
  outline: none;
  min-height: 1.2em;
  padding: 4px;
  border: 1px solid transparent;
  border-radius: 4px;
  
  &:hover {
    border-color: #ddd;
  }
  
  &:focus {
    border-color: #007bff;
  }
`;

export function ImageBrickComponent({ brick, onSelect }) {
  const { id, props } = brick;
  const { imageUrl = '', altText = '', width = 'auto', height = 'auto', objectFit = 'cover', borderRadius = 0 } = props;

  const { updateBrickProps, selectedBrickId } = useBuilderContext();
  const { viewMode } = useViewMode();
  const isPreview = viewMode === 'preview';
  const isSelected = selectedBrickId === id;

  const [imageSrc, setImageSrc] = useState(imageUrl);
  const [showCropper, setShowCropper] = useState(false);
  const [cropperSrc, setCropperSrc] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);
  const altRef = useRef(null);

  // Sync local state with props changes
  useEffect(() => {
    setImageSrc(imageUrl);
  }, [imageUrl]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropperSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      const croppedImage = croppedCanvas.toDataURL();
      setImageSrc(croppedImage);
      updateBrickProps(id, { imageUrl: croppedImage });
      setShowCropper(false);
    }
  };

  const handleSrcChange = (e) => {
    const newUrl = e.target.value;
    setImageSrc(newUrl);
    updateBrickProps(id, { imageUrl: newUrl });
  };

  const handleAltBlur = () => {
    const newAlt = altRef.current?.innerText || '';
    updateBrickProps(id, { altText: newAlt });
  };

  const handleWrapperClick = (e) => {
    e.stopPropagation();
    onSelect && onSelect(id); // Pass the brick id to onSelect
  };

  return (
    <PreviewWrapper isSelected={isSelected}>
      <ImageWrapper
        isDragOver={!isPreview && isDragOver}
        onClick={!isPreview ? handleWrapperClick : undefined}
        style={{ cursor: isPreview ? 'default' : 'pointer' }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={altText}
            style={{ 
              width,
              height,
              borderRadius: `${borderRadius}px`,
              objectFit
            }}
          />
        ) : !isPreview && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
            Drop image here or click to upload
          </div>
        )}

        {!isPreview && <UploadOverlay>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />
          <ActionButton onClick={() => fileInputRef.current?.click()}>
            <Upload size={20} />
          </ActionButton>
        </UploadOverlay>}
      </ImageWrapper>

      {!isPreview && showCropper && (
        <Modal onClick={() => setShowCropper(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div style={{ marginBottom: '20px' }}>
              <Cropper
                ref={cropperRef}
                src={cropperSrc}
                style={{ height: 400, width: '100%' }}
                aspectRatio={width && height ? width / height : NaN}
                guides={true}
                viewMode={1}
              />
            </div>
            <div style={{ textAlign: 'right' }}>
              <ActionButton onClick={() => setShowCropper(false)}>
                Cancel
              </ActionButton>
              <ActionButton variant="primary" onClick={handleCrop}>
                Apply
              </ActionButton>
            </div>
          </ModalContent>
        </Modal>
      )}
    </PreviewWrapper>
  );
}

export const ImageInspector = {
  displayName: 'Image',
  defaultProps: {
    imageUrl: '',
    altText: '',
    width: 'auto',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: 0,
    className: ''
  },
  props: {
    imageUrl: {
      type: 'text',
      label: 'Image URL',
      defaultValue: '',
      placeholder: 'Enter image URL'
    },
    altText: {
      type: 'text',
      label: 'Alt Text',
      defaultValue: '',
      placeholder: 'Enter alt text'
    },
    width: {
      type: 'number',
      label: 'Width',
      defaultValue: 'auto',
      unit: 'px'
    },
    height: {
      type: 'number',
      label: 'Height',
      defaultValue: 'auto',
      unit: 'px'
    },
    objectFit: {
      type: 'select',
      label: 'Object Fit',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
      defaultValue: 'cover'
    },
    borderRadius: {
      type: 'number',
      label: 'Border Radius',
      defaultValue: 0,
      unit: 'px'
    },
    className: {
      type: 'text',
      label: 'Custom CSS Class',
      defaultValue: ''
    }
  }
};

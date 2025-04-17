// src/Pages/Dashboard/WebsiteBuilder/components/ImageGallery.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Upload, Image as ImageIcon, Check } from 'lucide-react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 800px;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #333;
  }
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
`;

const Tab = styled.button`
  padding: 12px 24px;
  background: ${props => props.active ? '#f5f7fa' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#2563eb' : 'transparent'};
  color: ${props => props.active ? '#2563eb' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#f5f7fa' : '#f9fafb'};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  flex: 1;
  overflow-y: auto;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

const GalleryItem = styled.div`
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
  border: 2px solid ${props => props.selected ? '#2563eb' : 'transparent'};
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SelectedIndicator = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const UploadContainer = styled.div`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  
  &:hover {
    border-color: #2563eb;
    background: #f9fafb;
  }
`;

const UploadIcon = styled.div`
  width: 64px;
  height: 64px;
  background: #f5f7fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #2563eb;
`;

const UploadText = styled.div`
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
`;

const UploadSubtext = styled.div`
  font-size: 14px;
  color: #999;
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f1f3f4;
  border: 1px solid #ddd;
  color: #666;
  
  &:hover:not(:disabled) {
    background: #e0e0e0;
  }
`;

const SelectButton = styled(Button)`
  background: #2563eb;
  border: 1px solid #2563eb;
  color: white;
  
  &:hover:not(:disabled) {
    background: #1d4ed8;
  }
`;

const ImageGallery = ({ isOpen, onClose, onSelect }) => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageGallery, setImageGallery] = useState([]);
  
  // Mock loading gallery images
  useEffect(() => {
    if (isOpen && activeTab === 'gallery') {
      const mockGallery = [
        '/api/placeholder/800/800?text=Image+1',
        '/api/placeholder/800/800?text=Image+2',
        '/api/placeholder/800/800?text=Image+3',
        '/api/placeholder/800/800?text=Image+4',
        '/api/placeholder/800/800?text=Image+5',
        '/api/placeholder/800/800?text=Image+6',
        '/api/placeholder/800/800?text=Image+7',
        '/api/placeholder/800/800?text=Image+8',
      ];
      setImageGallery(mockGallery);
    }
  }, [isOpen, activeTab]);
  
  const handleImageSelect = (imageSrc) => {
    setSelectedImage(imageSrc);
  };
  
  const handleConfirm = () => {
    if (selectedImage) {
      onSelect(selectedImage);
      onClose();
    }
  };
  
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload to a server here
      // For demo purposes, we'll just create an object URL
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setImageGallery(prev => [imageUrl, ...prev]);
      setActiveTab('gallery');
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Select Image</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>
        
        <TabContainer>
          <Tab 
            active={activeTab === 'gallery'} 
            onClick={() => setActiveTab('gallery')}
          >
            Gallery
          </Tab>
          <Tab 
            active={activeTab === 'upload'} 
            onClick={() => setActiveTab('upload')}
          >
            Upload
          </Tab>
        </TabContainer>
        
        <ModalBody>
          {activeTab === 'gallery' ? (
            <GalleryGrid>
              {imageGallery.map((imageSrc, index) => (
                <GalleryItem 
                  key={index}
                  selected={selectedImage === imageSrc}
                  onClick={() => handleImageSelect(imageSrc)}
                >
                  <GalleryImage src={imageSrc} alt={`Gallery image ${index + 1}`} />
                  {selectedImage === imageSrc && (
                    <SelectedIndicator>
                      <Check size={16} />
                    </SelectedIndicator>
                  )}
                </GalleryItem>
              ))}
            </GalleryGrid>
          ) : (
            <label htmlFor="image-upload">
              <input
                type="file"
                id="image-upload"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleUpload}
              />
              <UploadContainer>
                <UploadIcon>
                  <Upload size={32} />
                </UploadIcon>
                <UploadText>Click to upload an image</UploadText>
                <UploadSubtext>JPG, PNG, GIF up to 10MB</UploadSubtext>
              </UploadContainer>
            </label>
          )}
        </ModalBody>
        
        <ModalFooter>
          <CancelButton onClick={onClose}>
            Cancel
          </CancelButton>
          <SelectButton 
            onClick={handleConfirm}
            disabled={!selectedImage}
          >
            Select Image
          </SelectButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ImageGallery;
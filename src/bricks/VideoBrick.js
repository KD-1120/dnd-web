import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useBuilderContext } from '../context/BuilderContext';
import { Upload, Link } from 'lucide-react';

const VideoWrapper = styled.div`
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

  ${VideoWrapper}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: white;
  color: #007bff;
  border: 1px solid #007bff;
  padding: 8px 16px;
  border-radius: 4px;
  margin: 0 8px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export function VideoBrickComponent({ brick, onSelect }) {
  const { id, props } = brick;
  const { videoUrl = '', autoplay = false, controls = true, loop = false, muted = false, width = '100%', height = 'auto' } = props;

  const { updateBrickProps, selectedBrickId } = useBuilderContext();
  const isSelected = selectedBrickId === id;
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    const url = URL.createObjectURL(file);
    updateBrickProps(id, { videoUrl: url });
  };

  const handleWrapperClick = (e) => {
    e.stopPropagation();
    onSelect && onSelect(id);
  };

  return (
    <VideoWrapper
      isSelected={isSelected}
      isDragOver={isDragOver}
      onClick={handleWrapperClick}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {videoUrl ? (
        <video
          src={videoUrl}
          style={{ width, height, display: 'block', maxWidth: '100%' }}
          controls={controls}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
        />
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
          Drop video here or click to upload
        </div>
      )}

      <UploadOverlay>
        <input
          type="file"
          ref={fileInputRef}
          accept="video/*"
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
      </UploadOverlay>
    </VideoWrapper>
  );
}

export const VideoInspector = {
  displayName: 'Video',
  defaultProps: {
    videoUrl: '',
    autoplay: true,
    controls: true,
    loop: false,
    muted: false,
    width: '100%',
    height: 'auto'
  },
  props: {
    videoUrl: {
      type: 'text',
      label: 'Video URL',
      defaultValue: '',
      placeholder: 'Enter video URL',
      section: 'Video'
    },
    autoplay: {
      type: 'boolean',
      label: 'Autoplay',
      defaultValue: false,
      section: 'Video'
    },
    controls: {
      type: 'boolean',
      label: 'Show Controls',
      defaultValue: true,
      section: 'Video'
    },
    loop: {
      type: 'boolean',
      label: 'Loop',
      defaultValue: false,
      section: 'Video'
    },
    muted: {
      type: 'boolean',
      label: 'Muted',
      defaultValue: false,
      section: 'Video'
    },
    width: {
      type: 'number',
      label: 'Width',
      section: 'Layout',
      defaultValue: 100,
      unit: '%',
    },
    height: {
      type: 'number',
      label: 'Height',
      section: 'Layout',
      defaultValue: 100,
      unit: '%',
    }
  }
};

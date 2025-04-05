import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

const UploadContainer = styled.div`
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  color: #666;
  &:hover {
    border-color: #aaa;
  }
`;

const ImageUpload = ({ onUpload }) => {
  const onDrop = useCallback(acceptedFiles => {
    // Here, you would typically upload the file to your server or cloud storage
    // and get back the URL. For this example, we simply use a temporary object URL.
    const file = acceptedFiles[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onUpload(imageUrl);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  return (
    <UploadContainer {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag & drop an image, or click to select one</p>
    </UploadContainer>
  );
};

export default ImageUpload;

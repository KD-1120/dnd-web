import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const BrickCard = styled.button`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
`;

export const PlusModal = ({ isOpen, onClose, onAdd, allowedBricks }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>Add Brick</h2>
        <CardsGrid>
          {allowedBricks.map((type) => (
            <BrickCard key={type} onClick={() => onAdd(type)}>
              {type}
            </BrickCard>
          ))}
        </CardsGrid>
        <button onClick={onClose}>Close</button>
      </ModalContent>
    </ModalOverlay>
  );
};
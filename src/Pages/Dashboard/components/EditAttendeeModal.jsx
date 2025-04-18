import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, Form, Button } from 'react-bootstrap';

const ErrorText = styled.div`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const EditAttendeeModal = ({ show, onHide, attendee, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'confirmed'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (attendee) {
      setFormData({
        name: attendee.name || '',
        email: attendee.email || '',
        status: attendee.status || 'confirmed'
      });
    }
  }, [attendee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await onSave(formData);
      onHide();
    } catch (error) {
      setError(error.message || 'An error occurred while saving');
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Attendee</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </Form.Select>
          </Form.Group>

          {error && <ErrorText>{error}</ErrorText>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditAttendeeModal;
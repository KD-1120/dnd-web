import React, { useState, useCallback } from 'react';
import { Container, Card, Alert, Badge, Tabs, Tab, Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { Check, X, RotateCcw, History, MapPin } from 'lucide-react';
import { QrReader } from 'react-qr-reader';
import { EventTicketService } from './services/EventTicketService';
import CheckInHistory from './components/CheckInHistory';

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 24px;
`;

const ScannerContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

const ResultCard = styled(Card)`
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: 24px;
`;

const StatusIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  background: ${props => props.isValid ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.isValid ? '#16a34a' : '#dc2626'};
`;

const ResultTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
  color: ${props => props.isValid ? '#16a34a' : '#dc2626'};
`;

const ResultDetails = styled.div`
  text-align: center;
  color: #64748b;
  margin-bottom: 16px;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  color: #64748b;
  width: 120px;
`;

const DetailValue = styled.span`
  color: #1a202c;
  font-weight: 500;
  flex: 1;
`;

const CheckInForm = styled.form`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
`;

const HistoryList = styled.div`
  margin-top: 16px;
`;

const HistoryItem = styled.div`
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const HistoryTime = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const ManualEntry = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
`;

const TicketScanner = () => {
  const [scanning, setScanning] = useState(true);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('scan');
  const [checkInLocation, setCheckInLocation] = useState('Main Entrance');
  const [manualCode, setManualCode] = useState('');
  const [ticketHistory, setTicketHistory] = useState([]);
  const [checkingIn, setCheckingIn] = useState(false);

  // In a real app, this would come from user context
  const staffMember = 'John Staff';
  const eventId = 'current_event_id';

  const handleScan = useCallback(async (data) => {
    if (data) {
      try {
        setScanning(false);
        const validationResult = await EventTicketService.validateTicket(data);
        setScanResult(validationResult);
        
        if (validationResult.valid) {
          // Load ticket history
          const history = await EventTicketService.getTicketHistory(data);
          setTicketHistory(history);
        }
        
        setError(null);
      } catch (error) {
        setError('Error validating ticket. Please try again.');
        setScanResult(null);
      }
    }
  }, []);

  const handleError = (err) => {
    setError('Error accessing camera. Please check permissions.');
    console.error(err);
  };

  const handleScanAgain = () => {
    setScanning(true);
    setScanResult(null);
    setError(null);
    setTicketHistory([]);
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!scanResult?.valid) return;

    try {
      setCheckingIn(true);
      await EventTicketService.recordCheckIn(eventId, scanResult.ticket.id, {
        location: checkInLocation,
        staffMember
      });

      // Reload ticket history
      const history = await EventTicketService.getTicketHistory(scanResult.ticket.id);
      setTicketHistory(history);

      // Show success message
      setScanResult({
        ...scanResult,
        checkInSuccess: true
      });
    } catch (error) {
      setError('Error recording check-in. Please try again.');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleManualEntry = async (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    
    try {
      const validationResult = await EventTicketService.validateTicket(manualCode);
      setScanResult(validationResult);
      setScanning(false);
      
      if (validationResult.valid) {
        const history = await EventTicketService.getTicketHistory(manualCode);
        setTicketHistory(history);
      }
      
      setError(null);
    } catch (error) {
      setError('Error validating ticket. Please check the code and try again.');
      setScanResult(null);
    }
  };

  return (
    <Container>
      <PageTitle>Ticket Scanner</PageTitle>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Tabs activeKey={activeTab} onSelect={k => setActiveTab(k)} className="mb-4">
        <Tab eventKey="scan" title="Scan QR">
          <ScannerContainer>
            {scanning ? (
              <Card>
                <Card.Body className="p-0">
                  <QrReader
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: '100%' }}
                  />
                </Card.Body>
              </Card>
            ) : (
              <ResultCard>
                <Card.Body>
                  {scanResult?.valid ? (
                    <>
                      <StatusIcon isValid>
                        <Check size={24} />
                      </StatusIcon>
                      <ResultTitle isValid>
                        {scanResult.checkInSuccess ? 'Check-in Successful' : 'Ticket Valid'}
                      </ResultTitle>
                      <ResultDetails>
                        {scanResult.checkInSuccess 
                          ? 'Attendee has been checked in successfully'
                          : 'This ticket can be used for entry'}
                      </ResultDetails>

                      <div className="mb-4">
                        <DetailRow>
                          <DetailLabel>Event</DetailLabel>
                          <DetailValue>{scanResult.ticket.eventName}</DetailValue>
                        </DetailRow>
                        <DetailRow>
                          <DetailLabel>Ticket Type</DetailLabel>
                          <DetailValue>{scanResult.ticket.ticketType}</DetailValue>
                        </DetailRow>
                        <DetailRow>
                          <DetailLabel>Attendee</DetailLabel>
                          <DetailValue>{scanResult.ticket.attendeeName || 'N/A'}</DetailValue>
                        </DetailRow>
                        <DetailRow>
                          <DetailLabel>Purchase Date</DetailLabel>
                          <DetailValue>
                            {new Date(scanResult.ticket.purchaseDate).toLocaleDateString()}
                          </DetailValue>
                        </DetailRow>
                        <DetailRow>
                          <DetailLabel>Usage</DetailLabel>
                          <DetailValue>
                            <Badge bg={scanResult.ticket.usageCount > 1 ? 'warning' : 'success'}>
                              Used {scanResult.ticket.usageCount} of {scanResult.ticket.quantity} times
                            </Badge>
                          </DetailValue>
                        </DetailRow>
                      </div>

                      {!scanResult.checkInSuccess && (
                        <CheckInForm onSubmit={handleCheckIn}>
                          <Form.Group className="mb-3">
                            <Form.Label>Check-in Location</Form.Label>
                            <Form.Select
                              value={checkInLocation}
                              onChange={(e) => setCheckInLocation(e.target.value)}
                            >
                              <option value="Main Entrance">Main Entrance</option>
                              <option value="VIP Entrance">VIP Entrance</option>
                              <option value="Side Entrance">Side Entrance</option>
                            </Form.Select>
                          </Form.Group>
                          <Button 
                            type="submit" 
                            variant="success" 
                            className="w-100"
                            disabled={checkingIn}
                          >
                            {checkingIn ? 'Recording Check-in...' : 'Check In Attendee'}
                          </Button>
                        </CheckInForm>
                      )}

                      {ticketHistory.length > 0 && (
                        <HistoryList>
                          <h6 className="mb-3">
                            <History size={16} className="me-2" />
                            Check-in History
                          </h6>
                          {ticketHistory.map((record) => (
                            <HistoryItem key={record.id}>
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <strong>
                                    <MapPin size={14} className="me-1" />
                                    {record.location}
                                  </strong>
                                  <HistoryTime>
                                    {new Date(record.timestamp).toLocaleString()}
                                  </HistoryTime>
                                </div>
                                <Badge bg="info">{record.staffMember}</Badge>
                              </div>
                            </HistoryItem>
                          ))}
                        </HistoryList>
                      )}
                    </>
                  ) : (
                    <>
                      <StatusIcon>
                        <X size={24} />
                      </StatusIcon>
                      <ResultTitle>Ticket Invalid</ResultTitle>
                      <ResultDetails>
                        {scanResult?.message || 'This ticket cannot be used for entry'}
                      </ResultDetails>
                    </>
                  )}

                  <Button
                    variant="primary"
                    className="w-100 mt-4"
                    onClick={handleScanAgain}
                  >
                    <RotateCcw size={16} className="me-2" />
                    Scan Another Ticket
                  </Button>
                </Card.Body>
              </ResultCard>
            )}

            <ManualEntry>
              <h6>Manual Entry</h6>
              <Form onSubmit={handleManualEntry}>
                <Form.Group className="mb-3">
                  <Form.Label>Ticket Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter ticket code"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                  />
                </Form.Group>
                <Button type="submit" variant="secondary" className="w-100">
                  Validate Ticket
                </Button>
              </Form>
            </ManualEntry>
          </ScannerContainer>
        </Tab>
        
        <Tab eventKey="history" title="Recent Check-ins">
          <Card>
            <Card.Body>
              <CheckInHistory eventId={eventId} />
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default TicketScanner;
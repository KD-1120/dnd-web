// src/Pages/Dashboard/WebsiteBuilder/bricks/TicketSalesWidgetBrick.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Ticket, Calendar, Users, Clock, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';

const WidgetContainer = styled.div`
  background-color: ${props => props.bgColor || 'white'};
  border-radius: ${props => props.borderRadius || '8px'};
  box-shadow: ${props => props.boxShadow || '0 4px 12px rgba(0, 0, 0, 0.1)'};
  padding: ${props => props.padding || '24px'};
  width: 100%;
  margin-top: ${props => props.marginTop || '0'};
  margin-bottom: ${props => props.marginBottom || '0'};
  margin-left: ${props => props.marginLeft || '0'};
  margin-right: ${props => props.marginRight || '0'};
  border: ${props => props.border || 'none'};
  font-family: ${props => props.fontFamily || 'Inter, sans-serif'};
`;

const WidgetHeader = styled.div`
  margin-bottom: 24px;
`;

const WidgetTitle = styled.h3`
  font-size: ${props => props.fontSize || '24px'};
  font-weight: ${props => props.fontWeight || '700'};
  color: ${props => props.color || '#1a202c'};
  margin: 0 0 8px 0;
`;

const WidgetDescription = styled.p`
  font-size: ${props => props.fontSize || '16px'};
  color: ${props => props.color || '#4a5568'};
  margin: 0;
`;

const TicketList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TicketCard = styled.div`
  border: 1px solid ${props => props.borderColor || '#e2e8f0'};
  border-radius: ${props => props.borderRadius || '6px'};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.activeBorderColor || props.borderColor || '#cbd5e0'};
    box-shadow: ${props => props.hoverBoxShadow || '0 2px 8px rgba(0, 0, 0, 0.05)'};
  }
`;

const TicketHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${props => props.bgColor || 'white'};
  cursor: pointer;
  border-left: ${props => props.isActive ? `4px solid ${props.accentColor || '#3182ce'}` : '4px solid transparent'};
`;

const TicketInfo = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const TicketIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${props => props.bgColor || '#ebf8ff'};
  color: ${props => props.color || '#3182ce'};
  border-radius: 50%;
`;

const TicketName = styled.div`
  display: flex;
  flex-direction: column;
`;

const TicketNameText = styled.div`
  font-weight: 600;
  color: ${props => props.color || '#2d3748'};
  font-size: 16px;
`;

const TicketPrice = styled.div`
  color: ${props => props.color || '#4a5568'};
  font-size: 14px;
`;

const TicketAction = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TicketDetails = styled.div`
  padding: 16px;
  border-top: 1px solid ${props => props.borderColor || '#e2e8f0'};
  background-color: ${props => props.bgColor || '#f7fafc'};
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const TicketDetailsItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TicketDetailsIcon = styled.div`
  color: ${props => props.color || '#718096'};
  display: flex;
  align-items: center;
`;

const TicketDetailsText = styled.div`
  color: ${props => props.color || '#4a5568'};
  font-size: 14px;
`;

const TicketControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.borderColor || '#e2e8f0'};
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: ${props => props.disabled ? '#e2e8f0' : props.bgColor || 'white'};
  color: ${props => props.disabled ? '#a0aec0' : props.color || '#4a5568'};
  border: 1px solid ${props => props.disabled ? '#e2e8f0' : props.borderColor || '#cbd5e0'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:hover:not(:disabled) {
    background-color: ${props => props.hoverBgColor || '#f7fafc'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const QuantityText = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.color || '#2d3748'};
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.bgColor || '#3182ce'};
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.hoverBgColor || '#2b6cb0'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CheckoutSection = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.borderColor || '#e2e8f0'};
  display: ${props => props.show ? 'block' : 'none'};
`;

const CartItems = styled.div`
  margin-bottom: 16px;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.borderColor || '#e2e8f0'};
  
  &:last-child {
    border-bottom: none;
  }
`;

const CartItemName = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const CartItemQuantity = styled.span`
  font-size: 14px;
  color: ${props => props.color || '#718096'};
`;

const CartItemPrice = styled.div`
  font-weight: 600;
  color: ${props => props.color || '#2d3748'};
`;

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-top: 1px solid ${props => props.borderColor || '#e2e8f0'};
  font-weight: 700;
  color: ${props => props.color || '#1a202c'};
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${props => props.bgColor || '#38a169'};
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.hoverBgColor || '#2f855a'};
  }
`;

export function TicketSalesWidgetBrickComponent({ brick, onSelect, isSelected }) {
  const { id, props = {} } = brick;
  
  // State to track which ticket type's details are expanded
  const [expandedTicket, setExpandedTicket] = useState(null);
  
  // State to track quantities of each ticket type
  const [quantities, setQuantities] = useState({});
  
  // State to track cart items
  const [cart, setCart] = useState([]);
  
  // Mock ticket types - in a real app, these would come from the props or an API
  const ticketTypes = props.tickets || [
    {
      id: 'early-bird',
      name: 'Early Bird',
      price: 99.99,
      description: 'Get the best price with our early bird tickets. Limited availability.',
      date: 'Valid until May 15, 2025',
      remainingTickets: 50,
      maxPerOrder: 4,
      icon: <Ticket />
    },
    {
      id: 'standard',
      name: 'Standard Admission',
      price: 149.99,
      description: 'Regular admission ticket with access to all main areas.',
      date: 'Valid for event dates',
      remainingTickets: 200,
      maxPerOrder: 8,
      icon: <Ticket />
    },
    {
      id: 'vip',
      name: 'VIP Experience',
      price: 299.99,
      description: 'Enhanced experience with exclusive access and premium perks.',
      date: 'Valid for event dates',
      remainingTickets: 25,
      maxPerOrder: 2,
      icon: <Ticket />
    }
  ];
  
  const toggleExpand = (ticketId) => {
    setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
  };
  
  const decreaseQuantity = (ticketId) => {
    setQuantities(prev => ({
      ...prev,
      [ticketId]: Math.max(0, (prev[ticketId] || 0) - 1)
    }));
  };
  
  const increaseQuantity = (ticketId, maxLimit) => {
    setQuantities(prev => ({
      ...prev,
      [ticketId]: Math.min(maxLimit, (prev[ticketId] || 0) + 1)
    }));
  };
  
  const addToCart = (ticketId) => {
    const ticket = ticketTypes.find(t => t.id === ticketId);
    const quantity = quantities[ticketId] || 0;
    
    if (quantity > 0) {
      // Check if ticket already exists in cart
      const existingIndex = cart.findIndex(item => item.id === ticketId);
      
      if (existingIndex >= 0) {
        // Update quantity if item exists
        setCart(cart.map((item, index) => 
          index === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        ));
      } else {
        // Add new item
        setCart([...cart, {
          id: ticketId,
          name: ticket.name,
          price: ticket.price,
          quantity
        }]);
      }
      
      // Reset quantity
      setQuantities(prev => ({
        ...prev,
        [ticketId]: 0
      }));
    }
  };
  
  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  return (
    <div 
      style={{ 
        position: 'relative',
        padding: '4px',
        border: isSelected ? '1px dashed #2563eb' : 'none',
        borderRadius: '4px'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(id);
      }}
    >
      <WidgetContainer
        bgColor={props.bgColor}
        borderRadius={props.borderRadius}
        boxShadow={props.boxShadow}
        padding={props.padding}
        marginTop={props.marginTop}
        marginBottom={props.marginBottom}
        marginLeft={props.marginLeft}
        marginRight={props.marginRight}
        border={props.border}
        fontFamily={props.fontFamily}
      >
        <WidgetHeader>
          <WidgetTitle
            fontSize={props.titleFontSize}
            fontWeight={props.titleFontWeight}
            color={props.titleColor}
          >
            {props.title || 'Get Your Tickets'}
          </WidgetTitle>
          <WidgetDescription
            fontSize={props.descriptionFontSize}
            color={props.descriptionColor}
          >
            {props.description || 'Select from available ticket options below.'}
          </WidgetDescription>
        </WidgetHeader>
        
        <TicketList>
          {ticketTypes.map((ticket) => {
            const isOpen = expandedTicket === ticket.id;
            const quantity = quantities[ticket.id] || 0;
            
            return (
              <TicketCard 
                key={ticket.id}
                borderColor={props.cardBorderColor}
                borderRadius={props.cardBorderRadius}
                activeBorderColor={props.accentColor}
                hoverBoxShadow={props.cardHoverBoxShadow}
              >
                <TicketHeader 
                  onClick={() => toggleExpand(ticket.id)}
                  isActive={isOpen}
                  accentColor={props.accentColor}
                  bgColor={props.cardHeaderBgColor}
                >
                  <TicketInfo>
                    <TicketIcon 
                      bgColor={props.iconBgColor || '#ebf8ff'}
                      color={props.iconColor || props.accentColor}
                    >
                      {ticket.icon}
                    </TicketIcon>
                    <TicketName>
                      <TicketNameText color={props.cardTitleColor}>
                        {ticket.name}
                      </TicketNameText>
                      <TicketPrice color={props.cardPriceColor}>
                        ${ticket.price.toFixed(2)}
                      </TicketPrice>
                    </TicketName>
                  </TicketInfo>
                  <TicketAction>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </TicketAction>
                </TicketHeader>
                
                <TicketDetails 
                  isOpen={isOpen}
                  borderColor={props.cardBorderColor}
                  bgColor={props.cardDetailsBgColor}
                >
                  <TicketDetailsItem>
                    <TicketDetailsIcon color={props.detailsIconColor}>
                      <Calendar size={16} />
                    </TicketDetailsIcon>
                    <TicketDetailsText color={props.detailsTextColor}>
                      {ticket.date}
                    </TicketDetailsText>
                  </TicketDetailsItem>
                  
                  <TicketDetailsItem>
                    <TicketDetailsIcon color={props.detailsIconColor}>
                      <Users size={16} />
                    </TicketDetailsIcon>
                    <TicketDetailsText color={props.detailsTextColor}>
                      {ticket.remainingTickets} tickets remaining
                    </TicketDetailsText>
                  </TicketDetailsItem>
                  
                  <TicketDetailsItem>
                    <TicketDetailsIcon color={props.detailsIconColor}>
                      <Clock size={16} />
                    </TicketDetailsIcon>
                    <TicketDetailsText color={props.detailsTextColor}>
                      Max {ticket.maxPerOrder} per order
                    </TicketDetailsText>
                  </TicketDetailsItem>
                  
                  <TicketDetailsText color={props.detailsTextColor} style={{ marginTop: '12px', marginBottom: '12px' }}>
                    {ticket.description}
                  </TicketDetailsText>
                  
                  <TicketControls borderColor={props.cardBorderColor}>
                    <QuantitySelector>
                      <QuantityButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          decreaseQuantity(ticket.id);
                        }}
                        disabled={quantity === 0}
                        bgColor={props.buttonBgColor}
                        color={props.buttonTextColor}
                        borderColor={props.buttonBorderColor}
                        hoverBgColor={props.buttonHoverBgColor}
                      >
                        -
                      </QuantityButton>
                      
                      <QuantityText color={props.quantityTextColor}>
                        {quantity}
                      </QuantityText>
                      
                      <QuantityButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          increaseQuantity(ticket.id, ticket.maxPerOrder);
                        }}
                        disabled={quantity >= ticket.maxPerOrder || quantity >= ticket.remainingTickets}
                        bgColor={props.buttonBgColor}
                        color={props.buttonTextColor}
                        borderColor={props.buttonBorderColor}
                        hoverBgColor={props.buttonHoverBgColor}
                      >
                        +
                      </QuantityButton>
                    </QuantitySelector>
                    
                    <AddButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(ticket.id);
                      }}
                      disabled={quantity === 0}
                      bgColor={props.addButtonBgColor || props.accentColor}
                      hoverBgColor={props.addButtonHoverBgColor}
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </AddButton>
                  </TicketControls>
                </TicketDetails>
              </TicketCard>
            );
          })}
        </TicketList>
        
        <CheckoutSection 
          show={cart.length > 0}
          borderColor={props.cardBorderColor}
        >
          <WidgetTitle
            fontSize={props.titleFontSize}
            fontWeight={props.titleFontWeight}
            color={props.titleColor}
            style={{ marginBottom: '16px' }}
          >
            Your Order
          </WidgetTitle>
          
          <CartItems>
            {cart.map((item, index) => (
              <CartItem key={index} borderColor={props.cardBorderColor}>
                <CartItemName>
                  {item.name}
                  <CartItemQuantity color={props.detailsTextColor}>
                    × {item.quantity}
                  </CartItemQuantity>
                </CartItemName>
                <CartItemPrice color={props.cardTitleColor}>
                  ${(item.price * item.quantity).toFixed(2)}
                </CartItemPrice>
              </CartItem>
            ))}
          </CartItems>
          
          <CartTotal 
            borderColor={props.cardBorderColor}
            color={props.titleColor}
          >
            <span>Total</span>
            <span>${getTotal().toFixed(2)}</span>
          </CartTotal>
          
          <CheckoutButton 
            bgColor={props.checkoutButtonBgColor || '#38a169'}
            hoverBgColor={props.checkoutButtonHoverBgColor || '#2f855a'}
          >
            Proceed to Checkout
          </CheckoutButton>
        </CheckoutSection>
      </WidgetContainer>
    </div>
  );
}

export const TicketSalesWidgetBrickInspector = {
  displayName: 'Ticket Sales Widget',
  props: {
    // General settings
    title: { type: 'text', label: 'Widget Title', defaultValue: 'Get Your Tickets' },
    description: { type: 'text', label: 'Widget Description', defaultValue: 'Select from available ticket options below.' },
    fontFamily: { type: 'select', label: 'Font Family', options: ['Inter, sans-serif', 'Georgia, serif', 'Montserrat, sans-serif', 'Roboto, sans-serif', 'Open Sans, sans-serif'], defaultValue: 'Inter, sans-serif' },
    
    // Widget appearance
    bgColor: { type: 'colorpicker', label: 'Background Color', defaultValue: 'white' },
    borderRadius: { type: 'number', label: 'Border Radius', defaultValue: 8, unit: 'px' },
    boxShadow: { type: 'text', label: 'Box Shadow', defaultValue: '0 4px 12px rgba(0, 0, 0, 0.1)' },
    padding: { type: 'text', label: 'Padding', defaultValue: '24px' },
    border: { type: 'text', label: 'Border', defaultValue: 'none' },
    
    // Typography
    titleFontSize: { type: 'text', label: 'Title Font Size', defaultValue: '24px' },
    titleFontWeight: { type: 'select', label: 'Title Font Weight', options: ['400', '500', '600', '700', '800'], defaultValue: '700' },
    titleColor: { type: 'colorpicker', label: 'Title Color', defaultValue: '#1a202c' },
    descriptionFontSize: { type: 'text', label: 'Description Font Size', defaultValue: '16px' },
    descriptionColor: { type: 'colorpicker', label: 'Description Color', defaultValue: '#4a5568' },
    
    // Card appearance
    cardBorderColor: { type: 'colorpicker', label: 'Card Border Color', defaultValue: '#e2e8f0' },
    cardBorderRadius: { type: 'number', label: 'Card Border Radius', defaultValue: 6, unit: 'px' },
    cardHoverBoxShadow: { type: 'text', label: 'Card Hover Shadow', defaultValue: '0 2px 8px rgba(0, 0, 0, 0.05)' },
    cardHeaderBgColor: { type: 'colorpicker', label: 'Card Header BG', defaultValue: 'white' },
    cardDetailsBgColor: { type: 'colorpicker', label: 'Card Details BG', defaultValue: '#f7fafc' },
    cardTitleColor: { type: 'colorpicker', label: 'Card Title Color', defaultValue: '#2d3748' },
    cardPriceColor: { type: 'colorpicker', label: 'Card Price Color', defaultValue: '#4a5568' },
    
    // Icon and details
    accentColor: { type: 'colorpicker', label: 'Accent Color', defaultValue: '#3182ce' },
    iconBgColor: { type: 'colorpicker', label: 'Icon Background', defaultValue: '#ebf8ff' },
    iconColor: { type: 'colorpicker', label: 'Icon Color', defaultValue: '#3182ce' },
    detailsIconColor: { type: 'colorpicker', label: 'Details Icon Color', defaultValue: '#718096' },
    detailsTextColor: { type: 'colorpicker', label: 'Details Text Color', defaultValue: '#4a5568' },
    
    // Button styling
    buttonBgColor: { type: 'colorpicker', label: 'Quantity Button BG', defaultValue: 'white' },
    buttonTextColor: { type: 'colorpicker', label: 'Quantity Button Text', defaultValue: '#4a5568' },
    buttonBorderColor: { type: 'colorpicker', label: 'Quantity Button Border', defaultValue: '#cbd5e0' },
    buttonHoverBgColor: { type: 'colorpicker', label: 'Quantity Button Hover', defaultValue: '#f7fafc' },
    quantityTextColor: { type: 'colorpicker', label: 'Quantity Text Color', defaultValue: '#2d3748' },
    
    // Action buttons
    addButtonBgColor: { type: 'colorpicker', label: 'Add Button BG', defaultValue: '#3182ce' },
    addButtonHoverBgColor: { type: 'colorpicker', label: 'Add Button Hover', defaultValue: '#2b6cb0' },
    checkoutButtonBgColor: { type: 'colorpicker', label: 'Checkout Button BG', defaultValue: '#38a169' },
    checkoutButtonHoverBgColor: { type: 'colorpicker', label: 'Checkout Button Hover', defaultValue: '#2f855a' },
    
    // Margins
    marginTop: { type: 'number', label: 'Margin Top', defaultValue: 0, unit: 'px' },
    marginBottom: { type: 'number', label: 'Margin Bottom', defaultValue: 0, unit: 'px' },
    marginLeft: { type: 'number', label: 'Margin Left', defaultValue: 0, unit: 'px' },
    marginRight: { type: 'number', label: 'Margin Right', defaultValue: 0, unit: 'px' },
    
    // Ticket data - in a real app, this would link to your Event Horizon ticketing system
    eventId: { type: 'text', label: 'Event ID', defaultValue: '' },
    ticketSystemUrl: { type: 'text', label: 'Ticketing System URL', defaultValue: 'https://api.eventhorizon.com/tickets' },
    tickets: { type: 'json', label: 'Ticket Types (JSON)', defaultValue: '' }
  }
};
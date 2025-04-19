import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { WebsiteRouter } from './WebsiteRouter';

export const EventWebsiteRouter = () => {
  return (
    <Routes>
      {/* Preview route */}
      <Route path="/events/:eventId/preview" element={<WebsiteRouter />} />
      
      {/* Published website route */}
      <Route path="/events/:eventId" element={<WebsiteRouter />} />
      
      {/* Custom subdomain route - this will be handled by the WebsiteRouter */}
      <Route path="/" element={<WebsiteRouter />} />
    </Routes>
  );
};

export default EventWebsiteRouter;
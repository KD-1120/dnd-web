import React, { useState, useEffect } from 'react';
import { EventService } from '../WebsiteBuilder/services/EventService';
import { SubdomainService } from '../WebsiteBuilder/services/SubdomainServices';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const EventWebsiteAnalytics = ({ eventId }) => {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [websiteInfo, setWebsiteInfo] = useState(null);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load website stats
      const visitStats = await EventService.getVisitStats(eventId, period);
      setStats(visitStats);

      // Load website info
      const subdomain = await SubdomainService.getSubdomainForEvent(eventId);
      const publishStatus = await EventService.getPublishingStatus(eventId);
      
      setWebsiteInfo({
        subdomain,
        url: subdomain ? SubdomainService.getFullUrl(subdomain) : EventService.getPublishedUrl(eventId),
        status: publishStatus.status,
        publishedAt: publishStatus.publishedAt,
        lastModified: publishStatus.lastModified
      });

    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [eventId, period]);

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="analytics-dashboard">
      <div className="website-info">
        <h2>Website Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Website URL</label>
            <div className="value">
              <a href={websiteInfo.url} target="_blank" rel="noopener noreferrer">
                {websiteInfo.url}
              </a>
            </div>
          </div>
          <div className="info-item">
            <label>Status</label>
            <div className={`status-badge ${websiteInfo.status}`}>
              {websiteInfo.status}
            </div>
          </div>
          {websiteInfo.publishedAt && (
            <div className="info-item">
              <label>Published</label>
              <div className="value">
                {new Date(websiteInfo.publishedAt).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="stats-controls">
        <h2>Website Analytics</h2>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Visits</h3>
          <div className="stat-value">{stats.totalVisits}</div>
        </div>
        <div className="stat-card">
          <h3>Unique Visitors</h3>
          <div className="stat-value">{stats.uniqueVisitors}</div>
        </div>
        <div className="stat-card">
          <h3>Avg. Daily Visits</h3>
          <div className="stat-value">
            {Math.round(stats.totalVisits / stats.dailyStats.length)}
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Daily Visits</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.referrers}
                dataKey="count"
                nameKey="source"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {stats.referrers.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Device Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.devices}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="device" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style jsx>{`
        .analytics-dashboard {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .website-info {
          background: white;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-top: 16px;
        }

        .info-item label {
          color: #64748b;
          font-size: 14px;
          display: block;
          margin-bottom: 4px;
        }

        .info-item .value {
          font-size: 16px;
          color: #1e293b;
        }

        .info-item a {
          color: #3b82f6;
          text-decoration: none;
        }

        .info-item a:hover {
          text-decoration: underline;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 500;
        }

        .status-badge.published {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.draft {
          background: #fee2e2;
          color: #991b1b;
        }

        .stats-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .stats-controls select {
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: white;
        }

        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .stat-card h3 {
          color: #64748b;
          font-size: 14px;
          margin: 0 0 8px 0;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .chart-container {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .chart-container h3 {
          margin: 0 0 16px 0;
          color: #1e293b;
          font-size: 16px;
        }

        .error-message {
          color: #dc2626;
          background: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
};

export default EventWebsiteAnalytics;
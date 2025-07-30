import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/Button';
import { formatDate } from '../lib/utils';
import { ArrowLeft, Store } from 'lucide-react';

export function MessageDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message;

  if (!message) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Message not found</p>
          <Button
            onClick={() => navigate('/messages')}
            variant="outline"
            className="mt-4"
          >
            Back to Messages
          </Button>
        </div>
      </Layout>
    );
  }

  const selectedStores = Array.isArray(message.list_of_stores) ? message.list_of_stores : [];

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button
            onClick={() => navigate('/messages')}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            <span>Back to Messages</span>
          </button>
          <h1>Message Details</h1>
        </div>

        <div className="card">
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
              <div className="form-group">
                <label className="form-label">
                  Message ID
                </label>
                <p style={{ fontFamily: 'monospace', backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '4px', border: '1px solid #e7e7e7' }}>
                  {message.id}
                </p>
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Date Created
                </label>
                <p style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '4px', border: '1px solid #e7e7e7' }}>
                  {formatDate(message.date_created)}
                </p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Subject
              </label>
              <p style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '4px', border: '1px solid #e7e7e7' }}>
                {message.title}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">
                Message
              </label>
              <div style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '4px', border: '1px solid #e7e7e7', whiteSpace: 'pre-wrap' }}>
                {message.body}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Selected Stores ({selectedStores.length})
              </label>
              {selectedStores.length > 0 ? (
                <div className="selected-stores">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                    {selectedStores.map((store: any, index: number) => (
                      <div key={store.id || index} className="store-item">
                        <Store style={{ width: '16px', height: '16px', color: '#666666', marginRight: '8px' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {store.code}
                          </p>
                          <p style={{ fontSize: '11px', color: '#666666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {store.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p style={{ color: '#666666', backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '4px', border: '1px solid #e7e7e7' }}>
                  No stores selected
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
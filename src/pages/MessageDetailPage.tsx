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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate('/messages')}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Messages</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Message Details</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message ID
                </label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded">
                  {message.id}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Created
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">
                  {formatDate(message.date_created)}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">
                {message.title}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded whitespace-pre-wrap">
                {message.body}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected Stores ({selectedStores.length})
              </label>
              {selectedStores.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedStores.map((store: any, index: number) => (
                      <div
                        key={store.id || index}
                        className="bg-white px-3 py-2 rounded border flex items-center space-x-2"
                      >
                        <Store className="h-4 w-4 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {store.code}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {store.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 bg-gray-50 px-3 py-2 rounded">
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
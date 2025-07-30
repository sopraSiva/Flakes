import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/Button';
import { supabase, Database } from '../lib/supabase';
import { formatDate } from '../lib/utils';
import { Plus, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

type Message = Database['public']['Tables']['messages']['Row'];

export function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);
  const messagesPerPage = 10;
  const navigate = useNavigate();

  const fetchMessages = async () => {

    setLoading(true);
    
    // Get total count for pagination
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true });

    setTotalPages(Math.ceil((count || 0) / messagesPerPage));

    // Get messages for current page
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('date_created', { ascending: false })
      .range(
        (currentPage - 1) * messagesPerPage,
        currentPage * messagesPerPage - 1
      );

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [currentPage]);

  const handleDelete = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    setDeleting(messageId);
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    } else {
      await fetchMessages();
    }
    
    setDeleting(null);
  };

  const handleView = (message: Message) => {
    navigate(`/messages/${message.id}`, { state: { message } });
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1>Messages</h1>
          <button
            onClick={() => navigate('/messages/create')}
            className="btn btn-success btn-lg"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus style={{ width: '20px', height: '20px' }} />
            <span>Create Message</span>
          </button>
        </div>

        <div className="table-container">
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>
                    ID
                  </th>
                  <th>
                    Date Created
                  </th>
                  <th>
                    Title
                  </th>
                  <th>
                    Body
                  </th>
                  <th style={{ textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {messages.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '48px 24px', color: '#666666' }}>
                      No messages found. Create your first message to get started.
                    </td>
                  </tr>
                ) : (
                  messages.map((message) => (
                    <tr key={message.id}>
                      <td style={{ whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                        {message.id.split('-')[0]}...
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {formatDate(message.date_created)}
                      </td>
                      <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span title={message.title}>{message.title}</span>
                      </td>
                      <td style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span title={message.body}>{message.body}</span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => handleView(message)}
                            className="btn btn-secondary btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Eye style={{ width: '16px', height: '16px' }} />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleDelete(message.id)}
                            className="btn btn-danger btn-sm"
                            disabled={deleting === message.id}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Trash2 style={{ width: '16px', height: '16px' }} />
                            <span>{deleting === message.id ? 'Deleting...' : 'Delete'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
                <span>Previous</span>
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>Next</span>
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
            <div className="pagination-info">
              Showing {Math.min((currentPage - 1) * messagesPerPage + 1, messages.length)} to{' '}
              {Math.min(currentPage * messagesPerPage, (currentPage - 1) * messagesPerPage + messages.length)} of{' '}
              {(totalPages - 1) * messagesPerPage + messages.length} messages
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
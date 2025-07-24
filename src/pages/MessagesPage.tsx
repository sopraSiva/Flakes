import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/Button';
import { supabase, Database } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
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
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchMessages = async () => {
    if (!user) return;

    setLoading(true);
    
    // Get total count for pagination
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    setTotalPages(Math.ceil((count || 0) / messagesPerPage));

    // Get messages for current page
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', user.id)
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
  }, [currentPage, user]);

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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <Button
            onClick={() => navigate('/messages/create')}
            variant="success"
            size="lg"
            className="flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Message</span>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Body
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No messages found. Create your first message to get started.
                    </td>
                  </tr>
                ) : (
                  messages.map((message) => (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {message.id.split('-')[0]}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(message.date_created)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {message.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                        {message.body}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            onClick={() => handleView(message)}
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </Button>
                          <Button
                            onClick={() => handleDelete(message.id)}
                            variant="danger"
                            size="sm"
                            disabled={deleting === message.id}
                            className="flex items-center space-x-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>{deleting === message.id ? 'Deleting...' : 'Delete'}</span>
                          </Button>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-gray-600">
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
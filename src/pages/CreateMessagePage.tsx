import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/Button';
import { supabase, Database } from '../lib/supabase';
import { X, Store, List, Globe, ArrowLeft } from 'lucide-react';

type Store = Database['public']['Tables']['stores']['Row'];

export function CreateMessagePage() {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
  });
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStores, setSelectedStores] = useState<Store[]>([]);
  const [storeSelectionMode, setStoreSelectionMode] = useState<'none' | 'manual' | 'picker' | 'all'>('none');
  const [manualStoreInput, setManualStoreInput] = useState('');
  const [showStorePickerModal, setShowStorePickerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('status', 'Active')
      .order('name');

    if (error) {
      console.error('Error fetching stores:', error);
    } else {
      setStores(data || []);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleManualStoreInput = () => {
    setStoreSelectionMode('manual');
    setSelectedStores([]);
  };

  const handleStorePickerOpen = () => {
    setShowStorePickerModal(true);
    setStoreSelectionMode('picker');
  };

  const handleSelectAllStores = () => {
    setSelectedStores(stores);
    setStoreSelectionMode('all');
  };

  const handleProcessManualStores = () => {
    const storeCodes = manualStoreInput
      .split(',')
      .map(code => code.trim().toUpperCase())
      .filter(code => code.length > 0);

    const matchedStores = stores.filter(store => 
      storeCodes.includes(store.code.toUpperCase())
    );

    setSelectedStores(matchedStores);
  };

  const handleStorePickerSubmit = (selectedStoreIds: string[]) => {
    const selected = stores.filter(store => selectedStoreIds.includes(store.id));
    setSelectedStores(selected);
    setShowStorePickerModal(false);
  };

  const removeSelectedStore = (storeId: string) => {
    setSelectedStores(prev => prev.filter(store => store.id !== storeId));
  };

  const handleCancel = () => {
    navigate('/messages');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Subject is required';
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Message is required';
    }

    if (selectedStores.length === 0) {
      newErrors.stores = 'Please select at least one store';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }


    setLoading(true);

    const { error } = await supabase
      .from('messages')
      .insert({
        title: formData.title.trim(),
        body: formData.body.trim(),
        list_of_stores: selectedStores.map(store => ({
          id: store.id,
          code: store.code,
          name: store.name,
        })),
        user_id: '00000000-0000-0000-0000-000000000000', // Default user ID for demo
      });

    if (error) {
      console.error('Error creating message:', error);
      setErrors({ general: 'Failed to create message. Please try again.' });
    } else {
      navigate('/messages');
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleCancel}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Messages</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Create Message</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter message subject"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div className="lg:col-span-2">
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="body"
                  name="body"
                  rows={6}
                  value={formData.body}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.body ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your message content"
                />
                {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body}</p>}
              </div>
            </div>

            {/* Store Selection Buttons */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Store Selection</h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  type="button"
                  onClick={handleManualStoreInput}
                  variant={storeSelectionMode === 'manual' ? 'primary' : 'outline'}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Store className="h-6 w-6" />
                  <span className="text-sm">Enter list of stores</span>
                </Button>

                <Button
                  type="button"
                  onClick={handleStorePickerOpen}
                  variant={storeSelectionMode === 'picker' ? 'primary' : 'outline'}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <List className="h-6 w-6" />
                  <span className="text-sm">Choose stores from list</span>
                </Button>

                <Button
                  type="button"
                  onClick={handleSelectAllStores}
                  variant={storeSelectionMode === 'all' ? 'primary' : 'outline'}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Globe className="h-6 w-6" />
                  <span className="text-sm">Send to all stores</span>
                </Button>

                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="secondary"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <X className="h-6 w-6" />
                  <span className="text-sm">Cancel action</span>
                </Button>
              </div>

              {errors.stores && <p className="text-sm text-red-600">{errors.stores}</p>}
            </div>

            {/* Manual Store Input */}
            {storeSelectionMode === 'manual' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Enter Store Codes (comma-separated)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={manualStoreInput}
                    onChange={(e) => setManualStoreInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., STR001, STR002, STR003"
                  />
                  <Button
                    type="button"
                    onClick={handleProcessManualStores}
                    variant="outline"
                  >
                    Process
                  </Button>
                </div>
              </div>
            )}

            {/* Selected Stores Display */}
            {selectedStores.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Selected Stores ({selectedStores.length})
                </label>
                <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <div className="space-y-2">
                    {selectedStores.map((store) => (
                      <div
                        key={store.id}
                        className="flex items-center justify-between bg-white px-3 py-2 rounded border"
                      >
                        <span className="text-sm">
                          <span className="font-medium">{store.code}</span> - {store.name}
                          {store.area && <span className="text-gray-500"> ({store.area})</span>}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSelectedStore(store.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                variant="success"
              >
                {loading ? 'Creating Message...' : 'Create Message'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Store Picker Modal */}
      {showStorePickerModal && (
        <StorePickerModal
          stores={stores}
          selectedStores={selectedStores}
          onSubmit={handleStorePickerSubmit}
          onClose={() => setShowStorePickerModal(false)}
        />
      )}
    </Layout>
  );
}

interface StorePickerModalProps {
  stores: Store[];
  selectedStores: Store[];
  onSubmit: (selectedStoreIds: string[]) => void;
  onClose: () => void;
}

function StorePickerModal({ stores, selectedStores, onSubmit, onClose }: StorePickerModalProps) {
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>(
    selectedStores.map(store => store.id)
  );
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (store.area && store.area.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleToggleStore = (storeId: string) => {
    setTempSelectedIds(prev =>
      prev.includes(storeId)
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId]
    );
  };

  const handleSelectAll = () => {
    setTempSelectedIds(filteredStores.map(store => store.id));
  };

  const handleDeselectAll = () => {
    setTempSelectedIds([]);
  };

  const handleSubmit = () => {
    onSubmit(tempSelectedIds);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Select Stores</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mt-4 space-y-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search stores..."
            />
            
            <div className="flex space-x-2">
              <Button
                type="button"
                onClick={handleSelectAll}
                variant="outline"
                size="sm"
              >
                Select All ({filteredStores.length})
              </Button>
              <Button
                type="button"
                onClick={handleDeselectAll}
                variant="outline"
                size="sm"
              >
                Deselect All
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-2">
            {filteredStores.map((store) => (
              <label
                key={store.id}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={tempSelectedIds.includes(store.id)}
                  onChange={() => handleToggleStore(store.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {store.code} - {store.name}
                  </div>
                  {store.area && (
                    <div className="text-xs text-gray-500">{store.area}</div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="p-6 border-t flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {tempSelectedIds.length} store{tempSelectedIds.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex space-x-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              variant="primary"
            >
              Select Stores
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
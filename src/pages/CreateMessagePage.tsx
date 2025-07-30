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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button
            onClick={handleCancel}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            <span>Back to Messages</span>
          </button>
          <h1>Create Message</h1>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            {errors.general && (
              <div className="error-message">
                {errors.general}
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Subject
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  placeholder="Enter message subject"
                />
                {errors.title && <div className="error-message" style={{ marginTop: '8px' }}>{errors.title}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="body" className="form-label">
                  Message
                </label>
                <textarea
                  id="body"
                  name="body"
                  rows={6}
                  value={formData.body}
                  onChange={handleInputChange}
                  className={`form-textarea ${errors.body ? 'error' : ''}`}
                  placeholder="Enter your message content"
                />
                {errors.body && <div className="error-message" style={{ marginTop: '8px' }}>{errors.body}</div>}
              </div>
            </div>

            {/* Store Selection Buttons */}
            <div style={{ marginBottom: '24px' }}>
              <h3 className="subheading">Store Selection</h3>
              
              <div className="store-selection-grid">
                <button
                  type="button"
                  onClick={handleManualStoreInput}
                  className={`store-selection-btn ${storeSelectionMode === 'manual' ? 'active' : ''}`}
                >
                  <Store style={{ width: '24px', height: '24px' }} />
                  <span>Enter list of stores</span>
                </button>

                <button
                  type="button"
                  onClick={handleStorePickerOpen}
                  className={`store-selection-btn ${storeSelectionMode === 'picker' ? 'active' : ''}`}
                >
                  <List style={{ width: '24px', height: '24px' }} />
                  <span>Choose stores from list</span>
                </button>

                <button
                  type="button"
                  onClick={handleSelectAllStores}
                  className={`store-selection-btn ${storeSelectionMode === 'all' ? 'active' : ''}`}
                >
                  <Globe style={{ width: '24px', height: '24px' }} />
                  <span>Send to all stores</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="store-selection-btn"
                >
                  <X style={{ width: '24px', height: '24px' }} />
                  <span>Cancel action</span>
                </button>
              </div>

              {errors.stores && <div className="error-message">{errors.stores}</div>}
            </div>

            {/* Manual Store Input */}
            {storeSelectionMode === 'manual' && (
              <div className="form-group">
                <label className="form-label">
                  Enter Store Codes (comma-separated)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={manualStoreInput}
                    onChange={(e) => setManualStoreInput(e.target.value)}
                    className="form-input"
                    style={{ flex: 1 }}
                    placeholder="e.g., STR001, STR002, STR003"
                  />
                  <button
                    type="button"
                    onClick={handleProcessManualStores}
                    className="btn btn-secondary"
                  >
                    Process
                  </button>
                </div>
              </div>
            )}

            {/* Selected Stores Display */}
            {selectedStores.length > 0 && (
              <div className="form-group">
                <label className="form-label">
                  Selected Stores ({selectedStores.length})
                </label>
                <div className="selected-stores">
                  <div>
                    {selectedStores.map((store) => (
                      <div key={store.id} className="store-item">
                        <span>
                          <strong>{store.code}</strong> - {store.name}
                          {store.area && <span style={{ color: '#666666' }}> ({store.area})</span>}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSelectedStore(store.id)}
                          style={{ color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <X style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', paddingTop: '24px', borderTop: '2px solid #47207d', marginTop: '24px' }}>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-success"
              >
                {loading ? 'Creating Message...' : 'Create Message'}
              </button>
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
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <h3 className="modal-title">Select Stores</h3>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666666' }}
            >
              <X style={{ width: '24px', height: '24px' }} />
            </button>
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              placeholder="Search stores..."
            />
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={handleSelectAll}
                className="btn btn-secondary btn-sm"
              >
                Select All ({filteredStores.length})
              </button>
              <button
                type="button"
                onClick={handleDeselectAll}
                className="btn btn-secondary btn-sm"
              >
                Deselect All
              </button>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div>
            {filteredStores.map((store) => (
              <label
                key={store.id}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '8px', 
                  cursor: 'pointer',
                  borderRadius: '4px',
                  marginBottom: '8px'
                }}
              >
                <input
                  type="checkbox"
                  checked={tempSelectedIds.includes(store.id)}
                  onChange={() => handleToggleStore(store.id)}
                  style={{ width: '16px', height: '16px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {store.code} - {store.name}
                  </div>
                  {store.area && (
                    <div style={{ fontSize: '11px', color: '#666666' }}>{store.area}</div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <span style={{ fontSize: '12px', color: '#666666' }}>
            {tempSelectedIds.length} store{tempSelectedIds.length !== 1 ? 's' : ''} selected
          </span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              Select Stores
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
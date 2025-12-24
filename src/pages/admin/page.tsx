import { useState, useEffect } from 'react';
import { awsClient, type Tribute, type GalleryItem } from '../../utils/aws-client';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'tributes' | 'gallery' | 'manage'>('tributes');
  const [pendingTributes, setPendingTributes] = useState<Tribute[]>([]);
  const [pendingGallery, setPendingGallery] = useState<GalleryItem[]>([]);
  const [approvedGallery, setApprovedGallery] = useState<GalleryItem[]>([]);
  const [approvedTributes, setApprovedTributes] = useState<Tribute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // Store original order to check for changes
  const [originalOrder, setOriginalOrder] = useState<string[]>([]);

  // Legacy items to migrate
  const LEGACY_PHOTOS = [
    {
      id: 1,
      category: 'academic',
      title: 'Delivering Keynote at International Conference',
      description: 'Professor Pavanaguru presenting his research on sedimentary formations at the 2018 International Geology Conference.',
      year: '2018',
      src: '/assets/images/keynote-speech.jpg',
      type: 'image'
    },
    {
      id: 2,
      category: 'field-work',
      title: 'Geological Survey in Western Ghats',
      description: 'Leading a field expedition to study rock formations in the Western Ghats mountain range.',
      year: '2015',
      src: '/assets/images/nanna-casual.jpg',
      type: 'image'
    },
    {
      id: 3,
      category: 'personal',
      title: 'Family Gathering',
      description: 'A cherished moment during a family gathering.',
      year: '2019',
      src: '/assets/images/nanna-formal.jpg',
      type: 'image'
    },
    {
      id: 4,
      category: 'academic',
      title: 'In His Laboratory',
      description: 'Working in his geology laboratory, examining rock specimens under microscope.',
      year: '2020',
      src: '/assets/images/laboratory-work.jpg',
      type: 'image'
    },
    {
      id: 5,
      category: 'students',
      title: 'Field Trip with Undergraduate Class',
      description: 'Leading undergraduate students on an educational field trip to study local geological formations.',
      year: '2017',
      src: '/assets/images/nanna-casual.jpg',
      type: 'image'
    },
    {
      id: 6,
      category: 'personal',
      title: 'Family Celebration',
      description: 'Enjoying a family gathering with children and grandchildren during his 70th birthday celebration.',
      year: '2018',
      src: '/assets/images/nanna-casual.jpg',
      type: 'image'
    },
    {
      id: 21,
      category: 'personal',
      title: 'Reading to Grandchildren',
      description: 'Sharing his love of science by reading geology picture books to his young grandchildren.',
      year: '2021',
      src: '/assets/images/nanna-casual.jpg',
      type: 'image'
    },
    {
      id: 23,
      category: 'students',
      title: 'Final Lecture',
      description: 'Delivering his final lecture before retirement, with a packed auditorium of students and colleagues.',
      year: '2022',
      src: '/assets/images/dr-pavanaguru-portrait.jpg',
      type: 'image'
    },
    {
      id: 24,
      category: 'academic',
      title: 'Legacy Portrait',
      description: 'Official university portrait for the geology department hall of fame.',
      year: '2022',
      src: '/assets/images/nanna-formal.jpg',
      type: 'image'
    }
  ];

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'manage') {
        loadApprovedContent();
      } else {
        loadPendingContent();
      }
    }
  }, [isAuthenticated, activeTab]);

  const loadPendingContent = async () => {
    setIsLoading(true);
    const { tributes, gallery } = await awsClient.getPendingContent();
    setPendingTributes(tributes);
    setPendingGallery(gallery);
    setSelectedIds([]);
    setIsLoading(false);
  };

  const loadApprovedContent = async () => {
    setIsLoading(true);
    const { gallery, tributes } = await awsClient.getApprovedContent();
    setApprovedGallery(gallery);
    setApprovedTributes(tributes || []);
    setOriginalOrder(gallery.map(g => g.id!));
    setIsLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const handleAction = async (type: 'tributes' | 'gallery', id: string, status: 'approved' | 'deleted') => {
    // Optimistic UI Update for management tab
    if (activeTab === 'manage' && status === 'deleted') {
      if (confirm('Are you sure you want to delete this item? This cannot be undone.')) {
        const success = await awsClient.deleteApprovedContent(id);
        if (success) {
          if (type === 'tributes') {
            setApprovedTributes(prev => prev.filter(t => t.id !== id));
          } else {
            setApprovedGallery(prev => prev.filter(g => g.id !== id));
          }
        } else {
          alert('Failed to delete item');
        }
      }
      return;
    }

    const item = type === 'tributes' ? pendingTributes.find(t => t.id === id) : pendingGallery.find(g => g.id === id);
    if (!item) return;

    // Standard approval flow
    const success = await awsClient.updateContentStatus(type, id, status);
    if (success) {
      if (type === 'tributes') {
        setPendingTributes(prev => prev.filter(t => t.id !== id));
      } else {
        setPendingGallery(prev => prev.filter(g => g.id !== id));
      }
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    } else {
      alert('Failed to update status');
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newGallery = [...approvedGallery];
    if (direction === 'up' && index > 0) {
      [newGallery[index], newGallery[index - 1]] = [newGallery[index - 1], newGallery[index]];
    } else if (direction === 'down' && index < newGallery.length - 1) {
      [newGallery[index], newGallery[index + 1]] = [newGallery[index + 1], newGallery[index]];
    }
    setApprovedGallery(newGallery);
  };

  const saveOrder = async () => {
    const currentOrder = approvedGallery.map(g => g.id!);
    // Check if order changed
    if (JSON.stringify(currentOrder) === JSON.stringify(originalOrder)) {
      alert('No changes to save');
      return;
    }

    setIsLoading(true);
    const items = approvedGallery.map((g, index) => ({ id: g.id!, order: index }));
    const success = await awsClient.reorderGallery(items);
    if (success) {
      alert('Gallery order updated successfully');
      setOriginalOrder(currentOrder);
    } else {
      alert('Failed to update gallery order');
    }
    setIsLoading(false);
  };

  const handleBulkAction = async (status: 'approved' | 'deleted') => {
    if (selectedIds.length === 0) return;
    
    setIsLoading(true);
    const success = await awsClient.updateContentStatus(activeTab as 'tributes' | 'gallery', selectedIds, status);
    if (success) {
      if (activeTab === 'tributes') {
        setPendingTributes(prev => prev.filter(t => !selectedIds.includes(t.id!)));
      } else {
        setPendingGallery(prev => prev.filter(g => !selectedIds.includes(g.id!)));
      }
      setSelectedIds([]);
    } else {
      alert(`Failed to bulk ${status} items`);
    }
    setIsLoading(false);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleMigration = async () => {
    if (confirm(`Are you sure you want to migrate ${LEGACY_PHOTOS.length} legacy items to the database? This should only be done once.`)) {
      setIsLoading(true);
      const success = await awsClient.seedGallery(LEGACY_PHOTOS);
      if (success) {
        alert('Migration successful! Legacy items are now in the database.');
        loadApprovedContent(); // Reload to see them
      } else {
        alert('Migration failed. Please check console for details.');
      }
      setIsLoading(false);
    }
  };

  const toggleSelectAll = () => {
    const currentItems = activeTab === 'tributes' ? pendingTributes : pendingGallery;
    if (selectedIds.length === currentItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentItems.map(i => i.id!));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
          <div className="text-center mb-8">
            <i className="ri-shield-user-line text-5xl text-amber-600 mb-4 inline-block"></i>
            <h1 className="text-3xl font-serif text-slate-800">Admin Portal</h1>
            <p className="text-slate-600">Please enter password to access moderation tools</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              required
            />
            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-medium transition-colors shadow-lg"
            >
              Access Dashboard
            </button>
          </form>
          <div className="mt-8 text-center">
            <a href="/" className="text-sm text-slate-500 hover:text-amber-600 transition-colors">
              <i className="ri-arrow-left-line mr-1"></i> Back to Memorial Site
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Admin Header */}
      <header className="bg-slate-800 text-white py-6 px-10 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif">Admin Moderation Dashboard</h1>
          <p className="text-slate-400 text-sm">Reviewing submitted memories and media</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={activeTab === 'manage' ? loadApprovedContent : loadPendingContent}
            className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <i className="ri-refresh-line mr-2"></i> Refresh
          </button>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="bg-amber-700/20 hover:bg-amber-700/30 text-amber-200 px-4 py-2 rounded-lg text-sm border border-amber-700/50 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm inline-flex">
            <button
              onClick={() => setActiveTab('tributes')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'tributes' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Tributes <span className="ml-2 bg-black/10 px-2 py-0.5 rounded-full text-xs">{pendingTributes.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'gallery' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Pending Media <span className="ml-2 bg-black/10 px-2 py-0.5 rounded-full text-xs">{pendingGallery.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'manage' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Manage Content
            </button>
          </div>

          {activeTab !== 'manage' && selectedIds.length > 0 && (
            <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 p-4 rounded-xl animate-fade-in">
              <span className="text-amber-800 font-medium text-sm">
                {selectedIds.length} items selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('approved')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md"
                >
                  Approve All
                </button>
                <button
                  onClick={() => handleBulkAction('deleted')}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {activeTab === 'manage' && (
             <div className="flex items-center gap-4">
                <button
                  onClick={handleMigration}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg flex items-center gap-2"
                >
                  <i className="ri-database-2-line text-lg"></i>
                  Migrate Legacy Data
                </button>
                <button
                  onClick={saveOrder}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg flex items-center gap-2"
                >
                  <i className="ri-save-line text-lg"></i>
                  Save Order
                </button>
             </div>
          )}
        </div>

        {activeTab !== 'manage' && (
            <div className="mb-6 flex items-center justify-between px-4">
            <button 
                onClick={toggleSelectAll}
                className="text-sm text-slate-600 hover:text-amber-600 flex items-center gap-2 font-medium"
            >
                <i className={selectedIds.length > 0 && selectedIds.length === (activeTab === 'tributes' ? pendingTributes.length : pendingGallery.length) 
                ? "ri-checkbox-fill text-xl text-amber-600" 
                : "ri-checkbox-blank-line text-xl"}></i>
                {selectedIds.length === (activeTab === 'tributes' ? pendingTributes.length : pendingGallery.length) && selectedIds.length > 0
                ? "Deselect All" 
                : "Select All"}
            </button>
            </div>
        )}

        {isLoading ? (
          <div className="text-center py-20">
            <i className="ri-loader-4-line text-4xl text-slate-400 animate-spin mb-4 inline-block"></i>
            <p className="text-slate-600">Loading items...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {activeTab === 'tributes' ? (
              pendingTributes.length === 0 ? (
                <div className="bg-white p-20 rounded-2xl shadow-sm text-center border-2 border-dashed border-stone-200">
                  <i className="ri-chat-check-line text-6xl text-stone-300 mb-4 inline-block"></i>
                  <h3 className="text-xl font-medium text-slate-800">Clear queue!</h3>
                  <p className="text-slate-500">All submitted tributes have been reviewed.</p>
                </div>
              ) : (
                pendingTributes.map((tribute) => (
                  <div 
                    key={tribute.id} 
                    className={`bg-white p-6 rounded-2xl shadow-md border-2 transition-all animate-fade-in flex items-start gap-4 ${
                      selectedIds.includes(tribute.id!) ? 'border-amber-400 bg-amber-50/10' : 'border-stone-200'
                    }`}
                  >
                    <button 
                      onClick={() => toggleSelection(tribute.id!)}
                      className="mt-4 text-2xl text-slate-300 hover:text-amber-500 transition-colors"
                    >
                      <i className={selectedIds.includes(tribute.id!) ? "ri-checkbox-fill text-amber-600" : "ri-checkbox-blank-line"}></i>
                    </button>

                    <div className="flex-1 flex items-start gap-6">
                      <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="ri-user-line text-2xl text-slate-600"></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-serif text-slate-800">{tribute.name}</h3>
                            <p className="text-amber-600 font-medium text-sm">{tribute.relationship}</p>
                            <p className="text-slate-400 text-xs mt-1">{tribute.email}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAction('tributes', tribute.id!, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction('tributes', tribute.id!, 'deleted')}
                              className="bg-rose-100 text-rose-700 hover:bg-rose-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-700 leading-relaxed italic bg-stone-50 p-4 rounded-lg border-l-4 border-stone-300">
                          "{tribute.message}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : activeTab === 'gallery' ? (
              pendingGallery.length === 0 ? (
                <div className="bg-white p-20 rounded-2xl shadow-sm text-center border-2 border-dashed border-stone-200">
                  <i className="ri-image-2-line text-6xl text-stone-300 mb-4 inline-block"></i>
                  <h3 className="text-xl font-medium text-slate-800">No pending photos</h3>
                  <p className="text-slate-500">The media queue is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pendingGallery.map((item) => (
                    <div 
                      key={item.id} 
                      className={`bg-white rounded-2xl shadow-md overflow-hidden border-2 transition-all group relative ${
                        selectedIds.includes(item.id!) ? 'border-amber-400' : 'border-stone-200'
                      }`}
                    >
                      <button 
                        onClick={() => toggleSelection(item.id!)}
                        className="absolute top-4 left-4 z-10 text-3xl drop-shadow-lg text-white/80 hover:text-white transition-colors"
                      >
                        <i className={selectedIds.includes(item.id!) ? "ri-checkbox-fill text-amber-500" : "ri-checkbox-blank-line text-white/50"}></i>
                      </button>

                      <div className="aspect-video relative overflow-hidden bg-slate-100">
                        {item.key?.toLowerCase().endsWith('.mp4') || item.key?.toLowerCase().endsWith('.mov') || item.key?.toLowerCase().endsWith('.avi') ? (
                          <div className="w-full h-full flex items-center justify-center bg-slate-900">
                            <i className="ri-video-line text-5xl text-white/30"></i>
                            <video className="absolute inset-0 w-full h-full object-cover opacity-60">
                              <source src={item.src} />
                            </video>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <i className="ri-play-circle-fill text-5xl text-white/80 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                            </div>
                            <span className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white font-bold tracking-wider">VIDEO</span>
                          </div>
                        ) : (
                          <img 
                            src={item.src} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white">
                          {item.category}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-serif text-slate-800 mb-2 truncate">{item.title}</h3>
                        <p className="text-sm text-slate-500 mb-6">{item.year}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction('gallery', item.id!, 'approved')}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction('gallery', item.id!, 'deleted')}
                            className="flex-1 bg-rose-100 text-rose-700 hover:bg-rose-200 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
                <div className="space-y-12">
                  {/* Approved Tributes Section */}
                  <div>
                    <h2 className="text-xl font-serif text-slate-800 mb-6 flex items-center gap-2">
                      <i className="ri-message-3-line text-amber-600"></i>
                      Approved Tributes ({approvedTributes.length})
                    </h2>
                    {approvedTributes.length === 0 ? (
                      <p className="text-slate-500 italic">No approved tributes yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {approvedTributes.map((tribute) => (
                           <div key={tribute.id} className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                             <div className="flex justify-between items-start mb-3">
                               <div>
                                 <h3 className="font-serif font-bold text-slate-800">{tribute.name}</h3>
                                 <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">{tribute.relationship}</p>
                               </div>
                               <button
                                  onClick={() => handleAction('tributes', tribute.id!, 'deleted')}
                                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                                  title="Delete Tribute"
                               >
                                  <i className="ri-delete-bin-line text-lg"></i>
                               </button>
                             </div>
                             <p className="text-slate-600 text-sm italic leading-relaxed mb-4">"{tribute.message}"</p>
                             <div className="text-xs text-slate-400 border-t pt-3 flex justify-between">
                               <span>{new Date(tribute.date || Date.now()).toLocaleDateString()}</span>
                             </div>
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Approved Gallery Section */}
                  <div>
                    <h2 className="text-xl font-serif text-slate-800 mb-6 flex items-center gap-2">
                       <i className="ri-image-line text-amber-600"></i>
                       Approved Gallery Media ({approvedGallery.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {approvedGallery.map((item, index) => (
                        <div 
                          key={item.id} 
                          className="bg-white rounded-2xl shadow-md overflow-hidden border-2 border-stone-200 transition-all group relative"
                        >
                          <div className="aspect-video relative overflow-hidden bg-slate-100">
                            {item.key?.toLowerCase().endsWith('.mp4') || item.key?.toLowerCase().endsWith('.mov') || item.key?.toLowerCase().endsWith('.avi') ? (
                              <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                <i className="ri-video-line text-5xl text-white/30"></i>
                                <video className="absolute inset-0 w-full h-full object-cover opacity-60">
                                  <source src={item.src} />
                                </video>
                              </div>
                            ) : (
                              <img 
                                src={item.src} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                            
                            {/* Order Controls */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => moveItem(index, 'up')}
                                    disabled={index === 0}
                                    className="w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <i className="ri-arrow-up-s-line"></i>
                                </button>
                                <button 
                                    onClick={() => moveItem(index, 'down')}
                                    disabled={index === approvedGallery.length - 1}
                                    className="w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/80 text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <i className="ri-arrow-down-s-line"></i>
                                </button>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-base font-serif text-slate-800 truncate max-w-[150px]">{item.title}</h3>
                                    <p className="text-xs text-slate-500">{item.category} • {item.year}</p>
                                </div>
                                <button
                                    onClick={() => handleAction('gallery', item.id!, 'deleted')}
                                    className="text-rose-600 hover:text-rose-800 transition-colors"
                                >
                                    <i className="ri-delete-bin-line text-xl"></i>
                                </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

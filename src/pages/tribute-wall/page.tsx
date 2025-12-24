import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { awsClient, type Tribute } from '../../utils/aws-client';

export default function TributeWall() {
  const [showForm, setShowForm] = useState(false);
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    message: '',
    email: ''
  });

  useEffect(() => {
    const loadTributes = async () => {
      setIsLoading(true);
      const data = await awsClient.getTributes();
      setTributes(data);
      setIsLoading(false);
    };
    loadTributes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.message.trim()) {
      alert('Please fill in your name and message.');
      return;
    }

    if (formData.message.length > 500) {
      alert('Message must be 500 characters or less.');
      return;
    }

    try {
      const success = await awsClient.submitTribute(formData);

      if (success) {
        alert('Thank you for your tribute. It will be reviewed and published soon.');
        setFormData({ name: '', relationship: '', message: '', email: '' });
        setShowForm(false);
      } else {
        alert('There was an error submitting your tribute. Please try again.');
      }
    } catch (error) {
      alert('There was an error submitting your tribute. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section 
        className="relative py-24 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.92), rgba(241, 245, 249, 0.95)), url('/assets/images/tribute-peaceful-bg.jpg')`
        }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8">
            <i className="ri-heart-3-line text-6xl text-slate-600"></i>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-slate-800 mb-6">Tribute Wall</h1>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed mb-4">
            A sacred space to honor the memory of Professor Dr. R. Pavanaguru
          </p>
          <p className="text-base text-slate-600 max-w-3xl mx-auto leading-relaxed italic">
            "A true guru illuminates the path, a mentor guides with wisdom, a friend walks beside you with compassion. 
            Share your memories of a soul who embodied peace, knowledge, and unconditional love."
          </p>
        </div>
      </section>

      {/* Character Tribute Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-slate-800 mb-4">A Life of Wisdom & Compassion</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Remembering a gentle soul whose life touched countless hearts through knowledge, kindness, and unwavering dedication
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-b from-blue-50 to-white rounded-lg border border-blue-100">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full">
                <i className="ri-book-open-line text-3xl text-blue-600"></i>
              </div>
              <h3 className="text-lg font-serif text-slate-800 mb-2">Intellectual</h3>
              <p className="text-sm text-slate-600">A brilliant mind dedicated to the pursuit of knowledge and truth</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-b from-green-50 to-white rounded-lg border border-green-100">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-green-100 rounded-full">
                <i className="ri-leaf-line text-3xl text-green-600"></i>
              </div>
              <h3 className="text-lg font-serif text-slate-800 mb-2">Peace Loving</h3>
              <p className="text-sm text-slate-600">A gentle spirit who radiated tranquility and harmony</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-b from-amber-50 to-white rounded-lg border border-amber-100">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-amber-100 rounded-full">
                <i className="ri-lightbulb-line text-3xl text-amber-600"></i>
              </div>
              <h3 className="text-lg font-serif text-slate-800 mb-2">Mentor & Guru</h3>
              <p className="text-sm text-slate-600">A guiding light who inspired generations of students</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-b from-rose-50 to-white rounded-lg border border-rose-100">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-rose-100 rounded-full">
                <i className="ri-user-heart-line text-3xl text-rose-600"></i>
              </div>
              <h3 className="text-lg font-serif text-slate-800 mb-2">Friend</h3>
              <p className="text-sm text-slate-600">A compassionate companion who cherished every relationship</p>
            </div>
          </div>
        </div>
      </section>

      {/* Share Tribute Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-stone-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="mb-8">
            <i className="ri-quill-pen-line text-5xl text-slate-600"></i>
          </div>
          <h2 className="text-4xl font-serif text-slate-800 mb-6">Share Your Memories</h2>
          <p className="text-lg text-slate-700 mb-8 leading-relaxed">
            Your words of remembrance help preserve his legacy and bring comfort to those who knew him. 
            Share a memory, a lesson learned, or simply express what he meant to you.
          </p>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-slate-700 hover:bg-slate-800 text-white px-10 py-4 rounded-lg font-medium transition-all shadow-md hover:shadow-lg cursor-pointer whitespace-nowrap"
          >
            <i className="ri-edit-line mr-2"></i>
            Write Your Tribute
          </button>
        </div>
      </section>

      {/* Tribute Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-serif text-slate-800">Share Your Tribute</h2>
                  <p className="text-sm text-slate-600 mt-2">Your message will be reviewed before publication</p>
                </div>
                <button 
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                >
                  <i className="ri-close-line text-3xl"></i>
                </button>
              </div>
              
              <form id="tribute-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-sm"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="relationship" className="block text-sm font-medium text-slate-700 mb-2">
                    Your Relationship to Professor Pavanaguru
                  </label>
                  <select
                    id="relationship"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-sm"
                  >
                    <option value="">Select relationship</option>
                    <option value="Former Student">Former Student</option>
                    <option value="PhD Student">PhD Student</option>
                    <option value="Master's Student">Master's Student</option>
                    <option value="Undergraduate Student">Undergraduate Student</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Research Collaborator">Research Collaborator</option>
                    <option value="Family Member">Family Member</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-sm"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Your Tribute Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    maxLength={500}
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 text-sm resize-none"
                    placeholder="Share your memories, thoughts, or reflections about Professor Pavanaguru..."
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.message.length}/500 characters
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap shadow-md"
                  >
                    Submit Tribute
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 py-3 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tributes Display Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-slate-800 mb-4">Messages of Remembrance</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Heartfelt tributes from those whose lives were touched by Professor Pavanaguru's wisdom, kindness, and guidance
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-slate-100 rounded-full animate-pulse">
                <i className="ri-loader-4-line text-4xl text-slate-400 animate-spin"></i>
              </div>
              <p className="text-slate-600">Loading tributes...</p>
            </div>
          ) : tributes.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-slate-100 rounded-full">
                <i className="ri-message-3-line text-5xl text-slate-400"></i>
              </div>
              <h3 className="text-2xl font-serif text-slate-700 mb-4">Be the First to Share</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Your tribute will be the first to honor Professor Pavanaguru's memory. 
                Share your thoughts and help preserve his legacy.
              </p>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap shadow-md"
              >
                Write the First Tribute
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {tributes.map((tribute) => (
                <div key={tribute.id} className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-8 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-slate-200 rounded-full">
                      <i className="ri-user-line text-2xl text-slate-600"></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-serif text-slate-800">{tribute.name}</h3>
                          <p className="text-slate-600 font-medium text-sm">{tribute.relationship}</p>
                        </div>
                        <span className="text-slate-500 text-sm">
                          {tribute.date 
                            ? new Date(tribute.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                            : 'Date unavailable'}
                        </span>
                      </div>
                      <blockquote className="text-slate-700 leading-relaxed italic border-l-4 border-slate-300 pl-4">
                        "{tribute.message}"
                      </blockquote>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Memorial Quote */}
      <section className="py-20 bg-gradient-to-r from-slate-700 to-slate-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="mb-6">
            <i className="ri-double-quotes-l text-5xl text-slate-300"></i>
          </div>
          <blockquote className="text-2xl md:text-3xl font-serif italic text-white leading-relaxed mb-6">
            "The greatest teachers are those who show you where to look, but don't tell you what to see. 
            They inspire you to discover the wonders for yourself."
          </blockquote>
          <cite className="text-slate-200 text-lg">— In loving memory of Dr. R. Pavanaguru</cite>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-stone-300 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <p className="text-xl font-serif text-white mb-4">
              "Every rock tells a story, and every student carries the potential to unlock these ancient secrets."
            </p>
            <p className="text-stone-400">
              Forever Remembered • 1948 - 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

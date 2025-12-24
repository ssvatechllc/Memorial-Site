
import { useState } from 'react';
import Navbar from '../../components/Navbar';

export default function Home() {
  const [showQuote, setShowQuote] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-stone-100">
      <Navbar />

      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.7), rgba(71, 85, 105, 0.6)), url('/assets/images/hero-geology.jpg')`
        }}
      >
        <div className="text-center text-white max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <img 
              src="/assets/images/nanna-formal.jpg"
              alt="Dr. R. Pavanaguru"
              className="w-48 h-64 mx-auto rounded-lg shadow-2xl object-cover object-top border-4 border-stone-200/20"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif mb-6 text-stone-100 leading-tight">
            Dr. R. Pavanaguru
          </h1>
          
          <p className="text-xl md:text-2xl text-stone-200 mb-8 font-light">
            Emeritus Professor of Geology<br />
            <span className="text-lg text-stone-300">1948 - 2025</span>
          </p>

          <div className="mb-12">
            <button 
              onClick={() => setShowQuote(!showQuote)}
              className="bg-amber-600/80 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer whitespace-nowrap"
            >
              {showQuote ? 'Hide Quote' : 'His Words of Wisdom'}
            </button>
          </div>

          {showQuote && (
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-8 mx-auto max-w-3xl border border-stone-300/20 animate-fade-in">
              <blockquote className="text-xl md:text-2xl font-serif italic text-stone-100 leading-relaxed">
                "The Earth speaks to those who listen with patience and observe with wonder. Every rock tells a story spanning millions of years, and every student carries the potential to unlock these ancient secrets."
              </blockquote>
              <cite className="block mt-4 text-stone-300 text-lg">— Professor Dr. R. Pavanaguru</cite>
            </div>
          )}
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <i className="ri-arrow-down-line text-2xl"></i>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif text-slate-800 mb-6">A Life Dedicated to Earth Sciences</h2>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Professor Dr. R. Pavanaguru devoted over four decades to the study of geology, inspiring countless students and contributing groundbreaking research to our understanding of Earth's geological processes. His passion for teaching and mentorship created a lasting impact on the academic community.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed mb-8">
                Known for his encyclopedic knowledge of sedimentary formations and his ability to make complex geological concepts accessible to students of all levels, Professor Pavanaguru was more than an educator—he was a guide who helped others discover the wonder hidden beneath our feet.
              </p>
              <div className="flex space-x-4">
                <a href="/biography" className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap">
                  Read His Biography
                </a>
                <a href="/academic-legacy" className="border-2 border-slate-700 text-slate-700 hover:bg-slate-700 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap">
                  View Academic Legacy
                </a>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/assets/images/nanna-casual.jpg"
                alt="Professor Pavanaguru teaching"
                className="rounded-lg shadow-xl object-cover object-top w-full h-96"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

          {/* Legacy Highlights */}
      <section className="py-20 bg-gradient-to-r from-slate-100 to-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-serif text-center text-slate-800 mb-16">His Lasting Legacy</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-book-open-line text-2xl text-amber-600"></i>
              </div>
              <h3 className="text-2xl font-serif text-slate-800 mb-4">Academic Excellence</h3>
              <p className="text-slate-600 leading-relaxed">
                Published over 150 research papers and authored 8 textbooks that became standard references in geological education across universities worldwide.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-group-line text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-2xl font-serif text-slate-800 mb-4">Mentorship Impact</h3>
              <p className="text-slate-600 leading-relaxed">
                Guided 47 PhD students and over 200 masters students, many of whom now lead geological departments and research institutions globally.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <i className="ri-award-line text-2xl text-green-600"></i>
              </div>
              <h3 className="text-2xl font-serif text-slate-800 mb-4">Recognition & Awards</h3>
              <p className="text-slate-600 leading-relaxed">
                Recipient of the National Excellence in Teaching Award, Geological Society Lifetime Achievement Award, and honorary doctorates from 5 universities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Family Tributes Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-serif text-slate-800 mb-4">Family Memories</h2>
              <p className="text-xl text-stone-600 leading-relaxed">
                Cherished moments and personal tributes from those who knew him best—his children, grandchildren, and extended family.
              </p>
            </div>
            <a 
              href="/tribute-wall" 
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              Share Your Memory
            </a>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Video Tributes Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: "Grandfather's Stories", author: "The Grandchildren", duration: "2:15", type: 'video' },
                { title: "A Father's Wisdom", author: "The Family", duration: "3:40", type: 'video' },
                { title: "Teaching the Next Generation", author: "His Son", thumbnail: "/assets/images/nanna-casual.jpg", type: 'image' },
                { title: "Family Traditions", author: "Extended Family", thumbnail: "/assets/images/family-heritage.jpg", type: 'image' }
              ].map((item, idx) => (
                <div key={idx} className="group relative bg-stone-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer aspect-[4/5]">
                  <img 
                    src={item.thumbnail || `/assets/images/memory-placeholder-${idx+1}.jpg`} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516534775068-ba3e84589b9c?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                    {item.type === 'video' && (
                      <div className="absolute top-4 right-4 bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded tracking-widest flex items-center gap-1">
                        <i className="ri-vidicon-fill"></i> VIDEO
                      </div>
                    )}
                    <h4 className="text-white font-serif text-xl mb-1">{item.title}</h4>
                    <p className="text-stone-300 text-sm">{item.author}</p>
                    <div className="mt-4 flex items-center text-amber-400 font-medium text-xs tracking-widest uppercase">
                      <span className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 transition-colors">
                        <i className={item.type === 'video' ? "ri-play-fill" : "ri-eye-line"}></i>
                        {item.type === 'video' ? 'Play Video' : 'View Memory'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Featured Quote/Letter */}
            <div className="bg-slate-50 rounded-3xl p-10 md:p-16 border border-stone-100 shadow-inner relative">
              <i className="ri-double-quotes-l text-7xl text-amber-600/10 absolute top-8 left-8"></i>
              <div className="relative z-10">
                <span className="text-amber-600 font-bold tracking-[0.2em] text-sm uppercase mb-6 block">Featured Tribute</span>
                <blockquote className="text-2xl md:text-3xl font-serif text-slate-800 leading-relaxed mb-8 italic">
                  "Nanna didn't just teach us about the Earth; he taught us how to be grounded. His patience was as deep as the rock layers he studied, and his love was as enduring as the mountains."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-stone-200 rounded-full flex items-center justify-center font-serif text-xl text-stone-500">SR</div>
                  <div>
                    <p className="text-slate-900 font-bold">Shyam Rayaprolu</p>
                    <p className="text-stone-500 text-sm">Son</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


        {/* Legacy Section */}
      {/* Call to Action */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-serif text-white mb-6">Share Your Memories</h2>
          <p className="text-xl text-stone-300 mb-8 leading-relaxed">
            Professor Pavanaguru touched many lives throughout his career. We invite you to share your memories, stories, and photos to celebrate his remarkable life and contributions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/tribute-wall'}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              Add Your Tribute
            </button>
            <button 
              onClick={() => window.location.href = '/tribute-wall'}
              className="border-2 border-stone-300 text-stone-300 hover:bg-stone-300 hover:text-slate-800 px-8 py-4 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              View Tribute Wall
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-stone-300 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-serif text-white mb-4">In Memory Of</h3>
              <p className="leading-relaxed">
                Dr. R. Pavanaguru<br />
                Emeritus Professor of Geology<br />
                A teacher, mentor, and friend who will be forever remembered.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-serif text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/biography" className="hover:text-amber-200 transition-colors cursor-pointer">Biography</a></li>
                <li><a href="/academic-legacy" className="hover:text-amber-200 transition-colors cursor-pointer">Academic Legacy</a></li>
                <li><a href="/gallery" className="hover:text-amber-200 transition-colors cursor-pointer">Gallery</a></li>
                <li><a href="/tribute-wall" className="hover:text-amber-200 transition-colors cursor-pointer">Tribute Wall</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-serif text-white mb-4">Memorial Scholarship</h3>
              <p className="leading-relaxed mb-4">
                Honor his legacy by supporting the next generation of geologists through the Dr. R. Pavanaguru Memorial Scholarship Fund.
              </p>
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap">
                Learn More
              </button>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 text-center">
            <p className="text-stone-400 mb-2">
              "The Earth speaks to those who listen with patience and observe with wonder."
            </p>
            <p className="text-stone-500">
              Forever Remembered • 1948 - 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

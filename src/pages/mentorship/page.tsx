
import { useState } from 'react';
import Navbar from '../../components/Navbar';

export default function Mentorship() {
  const [activeTab, setActiveTab] = useState('philosophy');

  const mentorshipStats = [
    { number: '47', label: 'PhD Students Guided', icon: 'ri-graduation-cap-line' },
    { number: '200+', label: 'Masters Students', icon: 'ri-book-open-line' },
    { number: '1,500+', label: 'Undergraduate Students', icon: 'ri-group-line' },
    { number: '40+', label: 'Years of Teaching', icon: 'ri-time-line' }
  ];

  const studentAchievements = [
    {
      name: 'Dr. Priya Sharma',
      position: 'Professor of Geology, IIT Delhi',
      achievement: 'Recipient of Young Scientist Award for groundbreaking research in sedimentology',
      year: '2018',
      image: '/assets/images/priya-achievement.jpg'
    },
    {
      name: 'Dr. Michael Chen',
      position: 'Director, Geological Survey Institute',
      achievement: 'Led international team in discovering new mineral formations in the Himalayas',
      year: '2020',
      image: '/assets/images/michael-achievement.jpg'
    },
    {
      name: 'Dr. Sarah Williams',
      position: 'Chief Geologist, Mining Corporation',
      achievement: 'Pioneered sustainable mining techniques adopted globally',
      year: '2019',
      image: '/assets/images/nanna-casual.jpg'
    },
    {
      name: 'Dr. Rajesh Kumar',
      position: 'Senior Research Scientist, ISRO',
      achievement: 'Contributed to Mars Orbiter Mission geological analysis',
      year: '2021',
      image: '/assets/images/rajesh-achievement.jpg'
    }
  ];

  const testimonials = [
    {
      quote: "Dr. Pavanaguru didn't just teach geology; he taught us to see the Earth as a living, breathing entity with stories to tell. His passion was infectious and shaped my entire career.",
      author: "Dr. Anita Desai",
      position: "Professor of Environmental Geology",
      year: "PhD Graduate, 1995"
    },
    {
      quote: "His door was always open, his guidance unwavering. He believed in us even when we didn't believe in ourselves. That confidence he instilled in me carries me through every challenge.",
      author: "Dr. James Morrison",
      position: "Director of Geological Research",
      year: "PhD Graduate, 2003"
    },
    {
      quote: "Professor Pavanaguru taught me that being a scientist means being curious about everything. His interdisciplinary approach opened my mind to possibilities I never imagined.",
      author: "Dr. Meera Patel",
      position: "Climate Change Researcher",
      year: "PhD Graduate, 2010"
    }
  ];

  const teachingPhilosophy = [
    {
      principle: "Curiosity-Driven Learning",
      description: "Encouraging students to ask questions and explore beyond textbooks",
      icon: "ri-question-line"
    },
    {
      principle: "Hands-On Experience",
      description: "Believing that geology is best learned in the field, not just in classrooms",
      icon: "ri-hammer-line"
    },
    {
      principle: "Interdisciplinary Thinking",
      description: "Connecting geology with physics, chemistry, biology, and environmental science",
      icon: "ri-links-line"
    },
    {
      principle: "Ethical Responsibility",
      description: "Teaching the importance of environmental stewardship and sustainable practices",
      icon: "ri-leaf-line"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-stone-100">
      <Navbar />

      {/* Hero Section */}
      <section 
        className="relative py-24 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.8), rgba(71, 85, 105, 0.7)), url('/assets/images/nanna-casual.jpg')`
        }}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">A Legacy of Mentorship</h1>
          <p className="text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed">
            For over four decades, Dr. Pavanaguru shaped minds, inspired careers, and created a family of geologists who continue to make their mark on the world.
          </p>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mentorshipStats.map((stat, index) => (
              <div key={index} className="text-center p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-stone-200">
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 bg-amber-100 rounded-full">
                  <i className={`${stat.icon} text-2xl text-amber-600`}></i>
                </div>
                <div className="text-4xl font-bold text-slate-800 mb-2">{stat.number}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-center mb-16">
            <div className="bg-white rounded-lg p-1 shadow-lg border border-stone-200">
              <button
                onClick={() => setActiveTab('philosophy')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'philosophy'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-amber-600'
                }`}
              >
                Teaching Philosophy
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'achievements'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-amber-600'
                }`}
              >
                Student Achievements
              </button>
              <button
                onClick={() => setActiveTab('testimonials')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'testimonials'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-amber-600'
                }`}
              >
                Testimonials
              </button>
            </div>
          </div>

          {/* Teaching Philosophy Tab */}
          {activeTab === 'philosophy' && (
            <div className="space-y-12">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-serif text-slate-800 mb-6">Teaching Philosophy</h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  Dr. Pavanaguru believed that great teachers don't just impart knowledge—they ignite passion and nurture the next generation of discoverers.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {teachingPhilosophy.map((item, index) => (
                  <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-stone-200">
                    <div className="w-12 h-12 flex items-center justify-center bg-amber-100 rounded-lg mb-6">
                      <i className={`${item.icon} text-xl text-amber-600`}></i>
                    </div>
                    <h3 className="text-xl font-serif text-slate-800 mb-4">{item.principle}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-slate-100 to-stone-100 p-8 rounded-lg border border-stone-200">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 flex items-center justify-center bg-amber-100 rounded-full flex-shrink-0">
                    <i className="ri-quote-text text-2xl text-amber-600"></i>
                  </div>
                  <div>
                    <p className="text-lg text-slate-700 italic leading-relaxed mb-4 font-serif">
                      "A teacher's greatest achievement is not in the knowledge they share, but in the curiosity they awaken. When a student surpasses their teacher, that is when education has truly succeeded."
                    </p>
                    <p className="text-slate-600 font-medium">— Dr. Pavanaguru's Teaching Motto</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Student Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-12">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-serif text-slate-800 mb-6">Student Achievements</h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  The true measure of a mentor's success lies in the accomplishments of those they guide. Here are just a few of the remarkable achievements of Dr. Pavanaguru's students.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {studentAchievements.map((student, index) => (
                  <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-stone-200">
                    <div className="flex items-start space-x-4 mb-6">
                      <img
                        src={student.image}
                        alt={student.name}
                        className="w-20 h-20 rounded-full object-cover object-top"
                      />
                      <div>
                        <h3 className="text-xl font-serif text-slate-800 mb-1">{student.name}</h3>
                        <p className="text-amber-600 font-medium mb-2">{student.position}</p>
                        <span className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm">
                          {student.year}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{student.achievement}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-8 rounded-lg text-white text-center">
                <h3 className="text-2xl font-serif mb-4">Continuing the Legacy</h3>
                <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                  Many of Dr. Pavanaguru's students have gone on to become mentors themselves, creating a ripple effect of knowledge and inspiration that spans generations. His teaching methods and values continue to influence geology education worldwide.
                </p>
              </div>
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <div className="space-y-12">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-serif text-slate-800 mb-6">Student Testimonials</h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  In their own words, former students share how Dr. Pavanaguru's mentorship shaped their lives and careers.
                </p>
              </div>

              <div className="space-y-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white p-8 rounded-lg shadow-lg border border-stone-200">
                    <div className="flex items-start space-x-6">
                      <div className="w-12 h-12 flex items-center justify-center bg-amber-100 rounded-full flex-shrink-0">
                        <i className="ri-double-quotes-l text-xl text-amber-600"></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-lg text-slate-700 leading-relaxed mb-6 italic font-serif">
                          "{testimonial.quote}"
                        </p>
                        <div className="border-t border-stone-200 pt-4">
                          <p className="font-bold text-slate-800">{testimonial.author}</p>
                          <p className="text-amber-600 font-medium">{testimonial.position}</p>
                          <p className="text-slate-500 text-sm">{testimonial.year}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-slate-100 to-stone-100 p-8 rounded-lg border border-stone-200">
                <div className="text-center">
                  <h3 className="text-2xl font-serif text-slate-800 mb-4">Share Your Memory</h3>
                  <p className="text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                    Were you mentored by Dr. Pavanaguru? We'd love to hear how he impacted your life and career. Your story could inspire future generations of geologists.
                  </p>
                  <a
                    href="/tribute-wall"
                    className="inline-flex items-center bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-heart-line mr-2"></i>
                    Share Your Story
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-serif text-white mb-6">Continue His Legacy</h2>
          <p className="text-xl text-stone-300 mb-8 leading-relaxed">
            Professor Pavanaguru's mentorship continues to inspire new generations of geologists. Share your memories of his guidance and teaching impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/tribute-wall'}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              Share Your Memories
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="border-2 border-stone-300 text-stone-300 hover:bg-stone-300 hover:text-slate-800 px-8 py-4 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              Return to Memorial
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-stone-300 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-serif text-white mb-4">Dr. Pavanaguru Memorial</h3>
              <p className="leading-relaxed">
                Celebrating the life, achievements, and lasting impact of a remarkable geologist, teacher, and mentor.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-amber-200 transition-colors cursor-pointer">Home</a></li>
                <li><a href="/biography" className="hover:text-amber-200 transition-colors cursor-pointer">Biography</a></li>
                <li><a href="/academic-legacy" className="hover:text-amber-200 transition-colors cursor-pointer">Academic Legacy</a></li>
                <li><a href="/mentorship" className="hover:text-amber-200 transition-colors cursor-pointer">Mentorship</a></li>
                <li><a href="/tribute-wall" className="hover:text-amber-200 transition-colors cursor-pointer">Tribute Wall</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legacy</h4>
              <p className="leading-relaxed">
                His teachings continue to inspire new generations of earth scientists around the world.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-stone-400">
              © 2024 Dr. Pavanaguru Memorial. Created with love and remembrance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

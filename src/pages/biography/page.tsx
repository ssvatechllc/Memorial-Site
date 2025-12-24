
import { useState } from 'react';
import Navbar from '../../components/Navbar';

export default function Biography() {
  const [activeYear, setActiveYear] = useState<string | null>(null);

  const timelineEvents = [
    {
      year: '1948',
      title: 'Birth and Early Years',
      description: 'Born in a small village with a natural curiosity about rocks and minerals found in local streams.',
      image: '/assets/images/hero-geology.jpg'
    },
    {
      year: '1966-1975',
      title: 'PhD in Geology - Osmania University',
      description: 'Pursued Doctor of Philosophy (PhD) in Geology/Earth Science at Osmania University, Hyderabad. Achieved Grade A+ with brilliant academic performance. Topped the list of first class candidates in M.Sc. in 1972 and obtained top ranks in UPSC Geologists\' Examination.',
      image: '/assets/images/osmania-university.jpg'
    },
    {
      year: '1975',
      title: 'PhD Completion & Early Career',
      description: 'Successfully completed PhD in 1975. Became Advisory committee member in different R&D bodies in Government. Served as Visiting Professor to KU and was Founder Secretary of Osmania Geology Alumni Association, Hyderabad.',
      image: '/assets/images/nanna-formal.jpg'
    },
    {
      year: '1976',
      title: 'Assistant Professor',
      description: 'Began teaching career with infectious enthusiasm that immediately drew students to geology.',
      image: '/assets/images/nanna-casual.jpg'
    },
    {
      year: '1985',
      title: 'Associate Professor',
      description: 'Established the university\'s first modern geological laboratory and field research program.',
      image: '/assets/images/nanna-casual.jpg'
    },
    {
      year: '1995',
      title: 'Full Professor',
      description: 'Promoted to full professor, recognized internationally for contributions to sedimentology.',
      image: '/assets/images/nanna-formal.jpg'
    },
    {
      year: '2011',
      title: 'Emeritus Professor',
      description: 'Appointed as Emeritus Professor in the Geology Department, Osmania University, Hyderabad. Continued as member in professional bodies connected with R&D activities in University and Government bodies. Served as Visiting Professor and Professional Consultant for Earth Sciences.',
      image: '/assets/images/nanna-casual.jpg'
    },
    {
      year: '2025',
      title: 'Legacy Continues',
      description: 'His influence lives on through hundreds of students now leading geological research worldwide.',
      image: '/assets/images/legacy-memorial.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-slate-800 to-slate-700">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">The Life of a Scholar</h1>
          <p className="text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed">
            From a curious child collecting rocks by village streams to becoming one of India's most respected geologists, 
            Professor Dr. R. Pavanaguru's journey was marked by unwavering dedication to understanding our Earth.
          </p>
        </div>
      </section>

      {/* Personal Reflection */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif text-slate-800 mb-6">A Man of Gentle Wisdom</h2>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Those who knew Professor Pavanaguru remember not just his encyclopedic knowledge of geology, but his remarkable ability to see potential in every student. He believed that understanding the Earth required both scientific rigor and poetic imagination.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                His office was always open, filled with the aroma of tea and the gentle sound of his voice explaining complex geological processes with simple analogies. "The Earth is patient," he would say, "and so must we be in learning her secrets."
              </p>
              <blockquote className="border-l-4 border-amber-500 pl-6 italic text-slate-700 text-lg">
                "A brilliant academic career marked by excellence at every step - from topping his M.Sc. class in 1972 to achieving top ranks in the prestigious UPSC Geologists' Examination, culminating in his PhD from Osmania University in 1975 with Grade A+."
              </blockquote>
            </div>
            <div>
              <img 
                src="/assets/images/nanna-casual.jpg"
                alt="Professor in his study"
                className="rounded-lg shadow-xl object-cover object-top w-full h-96"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Educational Background Section */}
      <section className="py-20 bg-gradient-to-r from-slate-100 to-stone-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-serif text-center text-slate-800 mb-16">Educational Excellence</h2>
          
          <div className="bg-white rounded-lg shadow-xl p-8 border border-stone-200">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-graduation-cap-line text-3xl text-amber-600"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-serif text-slate-800 mb-3">Osmania University, Hyderabad</h3>
                <div className="mb-4">
                  <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
                    Doctor of Philosophy (PhD)
                  </span>
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
                    Geology/Earth Science
                  </span>
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Grade: A+
                  </span>
                </div>
                <p className="text-lg text-slate-700 mb-4">
                  <strong>Duration:</strong> 1966 - 1975
                </p>
                
                <div className="bg-slate-50 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold text-slate-800 mb-3">Academic Achievements:</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start">
                      <i className="ri-star-fill text-amber-500 mt-1 mr-2 flex-shrink-0"></i>
                      Brilliant academic career with exceptional performance throughout
                    </li>
                    <li className="flex items-start">
                      <i className="ri-trophy-fill text-amber-500 mt-1 mr-2 flex-shrink-0"></i>
                      Topped the list of first class candidates in M.Sc. in 1972
                    </li>
                    <li className="flex items-start">
                      <i className="ri-medal-fill text-amber-500 mt-1 mr-2 flex-shrink-0"></i>
                      Obtained top ranks in UPSC Geologists' Examination
                    </li>
                    <li className="flex items-start">
                      <i className="ri-book-fill text-amber-500 mt-1 mr-2 flex-shrink-0"></i>
                      Successfully completed Ph.D. in 1975 with Grade A+
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-800 mb-3">Professional Activities &amp; Societies:</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start">
                      <i className="ri-government-line text-blue-600 mt-1 mr-2 flex-shrink-0"></i>
                      Advisory committee member in different R&amp;D bodies in Government
                    </li>
                    <li className="flex items-start">
                      <i className="ri-school-line text-blue-600 mt-1 mr-2 flex-shrink-0"></i>
                      Visiting Professor to Kakatiya University (KU)
                    </li>
                    <li className="flex items-start">
                      <i className="ri-team-line text-blue-600 mt-1 mr-2 flex-shrink-0"></i>
                      Founder Secretary of Osmania Geology Alumni Association, Hyderabad
                    </li>
                    <li className="flex items-start">
                      <i className="ri-star-line text-blue-600 mt-1 mr-2 flex-shrink-0"></i>
                      Emeritus Professor, Geology Department, Osmania University (2011-Present)
                    </li>
                    <li className="flex items-start">
                      <i className="ri-briefcase-line text-blue-600 mt-1 mr-2 flex-shrink-0"></i>
                      Professional Consultant for Earth Sciences
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-serif text-center text-slate-800 mb-16">Life Timeline</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-amber-500 h-full"></div>
            
            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <div key={event.year} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div 
                      className={`bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                        activeYear === event.year ? 'ring-2 ring-amber-500' : ''
                      }`}
                      onClick={() => setActiveYear(activeYear === event.year ? null : event.year)}
                    >
                      <h3 className="text-2xl font-serif text-slate-800 mb-2">{event.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{event.description}</p>
                      {activeYear === event.year && (
                        <div className="mt-4 animate-fade-in">
                          <img 
                            src={event.image}
                            alt={event.title}
                            className="w-full h-48 object-cover object-top rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-sm">{event.year}</span>
                    </div>
                  </div>
                  
                  <div className="w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Personal Interests */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-serif text-center text-slate-800 mb-16">Beyond Academia</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-plant-line text-3xl text-green-600"></i>
              </div>
              <h3 className="text-2xl font-serif text-slate-800 mb-4">Gardening</h3>
              <p className="text-slate-600 leading-relaxed">
                He maintained a beautiful garden with plants from different geological regions, often using it to teach students about soil formation and mineral content.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-camera-line text-3xl text-blue-600"></i>
              </div>
              <h3 className="text-2xl font-serif text-slate-800 mb-4">Photography</h3>
              <p className="text-slate-600 leading-relaxed">
                An avid photographer of geological formations, his images were used in textbooks worldwide and captured the beauty of Earth's structures.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-music-line text-3xl text-purple-600"></i>
              </div>
              <h3 className="text-2xl font-serif text-slate-800 mb-4">Classical Music</h3>
              <p className="text-slate-600 leading-relaxed">
                He found parallels between musical harmony and geological patterns, often playing classical ragas while examining rock samples in his laboratory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-stone-300 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <p className="text-xl font-serif text-white mb-4">
              "A life well-lived leaves ripples that extend far beyond our time on Earth."
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

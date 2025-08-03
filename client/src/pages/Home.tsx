import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex flex-col justify-between">
      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-white shadow-md">
        <h1 className="text-2xl font-bold text-green-700">Mentorship Platform</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded hover:from-green-600 hover:to-blue-600"
          >
            Login
          </button>
          <button
  onClick={() => navigate('/register')}
  className="border-2 border-transparent bg-white text-green-700 font-semibold px-4 py-2 rounded hover:text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-500 hover:border-none transition-all duration-300"
  style={{
    borderImage: 'linear-gradient(to right, #22c55e, #3b82f6) 1',
    borderStyle: 'solid',
    borderWidth: '2px',
  }}
>
  Register
</button>

        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h2 className="text-4xl font-bold text-green-800 mb-4">Empowering Growth Through Mentorship</h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Connect mentors and mentees to share knowledge, develop skills, and grow together.
        </p>
      </section>

      {/* How It Works */}
      <section className="bg-white py-12 px-6">
        <h3 className="text-2xl font-bold text-center text-green-700 mb-8">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { title: '1. Admin Creates Users', text: 'Admins manage users, assign roles, and oversee the platform.' },
            { title: '2. Mentors Set Availability', text: 'Mentors share their expertise and accept session requests.' },
            { title: '3. Mentees Book Sessions', text: 'Mentees explore mentors, request guidance, and learn.' }
          ].map((step, i) => (
            <div key={i} className="bg-green-50 p-6 rounded-xl shadow">
              <h4 className="font-semibold text-lg text-green-800 mb-2">{step.title}</h4>
              <p className="text-gray-600 text-sm">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Mentors */}
      <section className="py-12 px-6">
        <h3 className="text-2xl font-bold text-center text-green-700 mb-8">Featured Mentors</h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {['Alice', 'James', 'Fatima'].map((name, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <img
                src={`https://i.pravatar.cc/150?img=${i + 20}`}
                alt={name}
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h4 className="font-bold text-lg text-green-700">{name}</h4>
              <p className="text-sm text-gray-500">Expert in {i === 0 ? 'Marketing' : i === 1 ? 'UI/UX' : 'Data Science'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-green-50 py-12 px-6">
        <h3 className="text-2xl font-bold text-center text-green-700 mb-8">What People Are Saying</h3>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow text-sm">
            <p className="text-gray-700 italic">"This platform connected me to an amazing mentor who helped me land my dream job!"</p>
            <p className="text-right text-green-700 mt-2 font-semibold">— Ada, Mentee</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-sm">
            <p className="text-gray-700 italic">"Mentoring here is seamless and rewarding. The scheduling and feedback system is top-notch."</p>
            <p className="text-right text-green-700 mt-2 font-semibold">— David, Mentor</p>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="bg-white py-12 px-6">
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto text-center">
          {[
            { label: 'Mentors', value: '120+' },
            { label: 'Mentees', value: '500+' },
            { label: 'Sessions Booked', value: '1,200+' },
            { label: 'Avg Rating', value: '4.9 ★' },
          ].map((stat, i) => (
            <div key={i} className="bg-green-100 p-6 rounded-xl shadow text-green-800">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="mt-1 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 bg-gradient-to-r from-green-600 to-blue-600 text-white text-center px-6">
        <h3 className="text-3xl font-bold mb-4">Ready to Start Your Mentorship Journey?</h3>
        <button
          onClick={() => navigate('/register')}
          className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-100 transition"
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 text-white text-center py-4">
        © {new Date().getFullYear()} Mentorship Platform | Built with ❤️ by Your Team
      </footer>
    </div>
  );
};

export default Home;


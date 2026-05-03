import React from 'react';
import { Hospital, Activity, Heart, Baby, MessageCircle, Phone, MapPin } from 'lucide-react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <Hospital className="logo-icon" size={28} />
          <span>JINNAH HOSPITAL</span>
        </div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact" className="btn-primary">Contact Us</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <span className="badge">Trusted Healthcare in Karachi</span>
          <h1>Compassionate Care for a <span>Healthier Tomorrow</span></h1>
          <p>Experience world-class medical services at Jinnah Hospital. Our dedicated team of specialists is here to provide you with the highest quality care using state-of-the-art technology.</p>
          <div className="hero-btns">
            <a href="#services" className="btn-secondary">Our Services</a>
            <a href="#" className="btn-chat">
              <MessageCircle size={20} /> Chat with AI Assistant
            </a>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="stats-card">
            <div className="stat-item">
              <strong>500+</strong>
              <span>Doctors</span>
            </div>
            <div className="stat-item">
              <strong>24/7</strong>
              <span>Emergency</span>
            </div>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000" 
            alt="Hospital Building" 
            className="hero-img"
          />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="section-header">
          <h2>Our Specialized Services</h2>
          <p>Comprehensive healthcare solutions tailored to your needs.</p>
        </div>
        <div className="service-grid">
          <div className="service-card">
            <div className="icon-wrapper"><Activity size={32} /></div>
            <h3>Emergency Care</h3>
            <p>Round-the-clock emergency medical services with expert trauma teams.</p>
          </div>
          <div className="service-card">
            <div className="icon-wrapper"><Heart size={32} /></div>
            <h3>Cardiology</h3>
            <p>Advanced cardiac care and surgical procedures by top specialists.</p>
          </div>
          <div className="service-card">
            <div className="icon-wrapper"><Baby size={32} /></div>
            <h3>Pediatrics</h3>
            <p>Specialized healthcare services for infants, children, and adolescents.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="contact-grid">
          <div className="contact-info">
             <h2>Get In Touch</h2>
             <p>Have questions? We're here to help you 24/7.</p>
             <div className="info-item">
                <Phone size={20} className="text-primary" />
                <span>+92 21 99201300</span>
             </div>
             <div className="info-item">
                <MapPin size={20} className="text-primary" />
                <span>Rafiqui Shaheed Road, Karachi, Pakistan</span>
             </div>
          </div>
          <div className="contact-form-placeholder">
             <div className="form-card">
                <h3>Send us a Message</h3>
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Your Email" />
                <textarea placeholder="How can we help?"></textarea>
                <button className="btn-primary-full">Submit Inquiry</button>
             </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 Jinnah Hospital Karachi. Built with React.js</p>
      </footer>
    </div>
  );
}

export default App;

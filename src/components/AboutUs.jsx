import React, { useEffect } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../css/AboutUs.css';
import logo from '../components/uitls/ak_logo1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faGoogle, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const AboutUs = () => {
  useEffect(() => {
    AOS.init({ 
      duration: 1000,
      easing: 'ease-out', 
      once: true 
    });
  }, []);
  

  return (
    <div className="container my-2">
    <div className="row align-items-center">
      <div className="col-md-6 order-md-2 my-3" data-aos="fade-left">
        <img src={logo} alt="About Us" className="logoImg img-fluid rounded small-img" />
      </div>
      <div className="col-md-6 order-md-1" data-aos="fade-right">
        <h2 className="font-weight-bold abtHead">About Us</h2>
        <div className="typical-text mb-4">
          <Typewriter
            words={[
              'Creating memories.',
              'Exceptional photography.',
              'Passionate professionals.'
            ]}
            loop={true}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </div>
        <p data-aos="fade-up abtPara">
            Welcome to <strong style={{ fontSize: '1.1rem' }}>AK Digitals</strong>, where we bring your moments to life through our lens. Our studio is dedicated to capturing the essence of every event, whether it's a wedding, corporate event, or personal photoshoot.
          </p>
          <p data-aos="fade-up abtPara">
            At <strong style={{ fontSize: '1.1rem' }}>AK Digitals</strong>, we believe photography is an art. We blend technical skill with creative vision, using state-of-the-art equipment to ensure perfection in every shot.
          </p>
          <p data-aos="fade-up abtPara">
            We pride ourselves on offering a personalized experience, understanding each client's unique needs, and delivering images that exceed expectations. Let us capture your special moments and create timeless memories.
          </p>
        <p data-aos="fade-up abtPara" style={{ fontSize:'1.2rem' }}>
        <strong style={{ fontSize: '1.4rem' }}>Connect</strong> with us on social media:
        </p>

        {/* social media icons */}

        <div className="social-icons" data-aos="fade-up">
          <a href="mailto:someone@example.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGoogle} size="2x" />
          </a>
          <a href="https://wa.me/yourwhatsappnumber" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faWhatsapp} size="2x" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} size="2x" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} size="2x" />
          </a>
        </div>
      </div>
    </div>

    <footer className="footer mt-5">
      <p className="text-center" style={{ fontSize:'1.2rem' }}>
        Made with <FontAwesomeIcon icon={faHeart} style={{ color: 'black' }} /> by CODE MONKS
      </p>
      <p className="text-center">
        &copy; {new Date().getFullYear()} All rights reserved.
      </p>
    </footer>
  </div>
);
};

export default AboutUs;

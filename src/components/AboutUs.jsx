import React, { useEffect } from 'react';
import { Typewriter } from 'react-simple-typewriter';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../css/AboutUs.css';
import logo from '../components/uitls/ak_logo1.png';

const AboutUs = () => {
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  return (
    <div className="container my-2">
      <div className="row align-items-center">
        <div className="col-md-6 order-md-2 my-3" data-aos="fade-left">
          <img src={logo} alt="About Us" className="img-fluid rounde small-img" />
        </div>
        <div className="col-md-6 order-md-1" data-aos="fade-right">
          <h2 className="font-weight-bold">About Us</h2>
          <div className="typical-text">
            <Typewriter
              words={[
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                'Nullam scelerisque leo at libero consectetur.',
                'Aenean ac urna at urna hendrerit tincidunt.'
              ]}
              loop={true}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </div>
          <p data-aos="fade-up">Donec facilisis, orci non cursus ultricies, purus eros posuere metus, vel sollicitudin lectus leo ac nulla. Etiam non felis convallis, feugiat leo eu, accumsan justo. Morbi fringilla ipsum et libero luctus, vel convallis odio dictum.</p>
          <p data-aos="fade-up">Donec facilisis, orci non cursus ultricies, purus eros posuere metus, vel sollicitudin lectus leo ac nulla. Etiam non felis convallis, feugiat leo eu, accumsan justo. Morbi fringilla ipsum et libero luctus, vel convallis odio dictum.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

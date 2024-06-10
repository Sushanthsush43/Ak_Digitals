import React, { useEffect, useState } from 'react';
import { ImArrowUp2 } from "react-icons/im";

const FloatingScrollBtn = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    if (window.scrollY  > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="scroll-to-top-float-btn" onClick={scrollToTop} style={{ display: isVisible ? 'flex' : 'none' }}>
     <ImArrowUp2 />
    </div>
  );
};

export default FloatingScrollBtn;
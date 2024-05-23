import React, { useEffect, useState } from 'react';

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
      &#8593;
    </div>
  );
};

export default FloatingScrollBtn;

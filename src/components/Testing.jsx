// import React, { useState } from 'react';
// import { IntersectionObserver } from 'react-intersection-observer';

// function LazyImage({ src , alt , key}) {
//   const [isVisible, setIsVisible] = useState(false);

//   const handleIntersection = (entries) => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         setIsVisible(true);
//         console.log(`${key} visible`);
//       } else {
//         setIsVisible(false);
//         console.log(`${key} not visible`);
//       }
//     });
//   };

//   return (
//     <IntersectionObserver onChange={handleIntersection}>
//       <div style={{ display: isVisible ? 'block' : 'none' }}>
//         <img src={isVisible ? src : ''} alt={alt} />
//       </div>
//     </IntersectionObserver>
//   );
// }

// export default LazyImage;
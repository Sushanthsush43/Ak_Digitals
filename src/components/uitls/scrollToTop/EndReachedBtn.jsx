const EndReachedBtn = () => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  };

  return (
    <div className='scroll-to-top-end-main'>

        <div className='scroll-to-top-end-text'>
            In a World Full of Images, Thank You for Focusing on Mine.
        </div>

        <div className="scroll-to-top-end-btn" onClick={scrollToTop}>
        &#8593; Go to top
        </div>
    </div>
  );
};

export default EndReachedBtn;

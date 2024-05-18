import { Link } from 'react-router-dom';

const Header = () => {

  return (
    <div className='header-Main'>
        
        <div className="heading-container">
            <h1 className="sofia-regular">sushanth sherigar</h1>
        </div>

        <div className='header-links'>
            <Link to='/ContactPage' className="teko-headings">CONTACT</Link>
        </div>

  </div>
  );
};

export default Header;
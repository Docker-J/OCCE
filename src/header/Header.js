import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ReactComponent as CloseMenu } from "../assets/close.svg";
import { ReactComponent as MenuIcon } from "../assets/menu.svg";
import { ReactComponent as Logo } from "../assets/logo.svg";
import "./header.css";

const Header = (props) => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrolled && window.scrollY > 30) {
        setScrolled(true);
      } else if (scrolled && window.scrollY <= 30) {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={scrolled ? 'fix-container scrolled' : 'fix-container'}>
      <div className="header">
        <div className="logo-nav">
          <div className="logo-container">
            <Link to='/'>
              <Logo className="logo" />
            </Link>
          </div>

          <nav>
            <ul className={click ? "nav-options active" : "nav-options"}>
              <li className="option" onClick={closeMobileMenu}>
                <Link to="/about"> 교회소개</Link>
              </li>
              <li className="option" onClick={closeMobileMenu}>
                <Link to="/announcement">교회소식</Link>
              </li>
              <li className="option" onClick={closeMobileMenu}>
                <Link to="/photos">사진</Link>
              </li>
              <li className="option mobile-option" onClick={closeMobileMenu}>
                <a href="#">로그인</a>
              </li>
              <li className=" option mobile-option" onClick={closeMobileMenu}>
                <Link to="/signup" className="sign-up">회원가입</Link>
              </li>
            </ul>
          </nav>
        </div>

        <ul className="signin-up">
          <li className="sign-in" onClick={closeMobileMenu}>
            <a href="#">로그인</a>
          </li>
          <li onClick={closeMobileMenu}>
            <Link to="/signup" className="signup-btn">회원가입</Link>
          </li>
        </ul>
        <div className="mobile-menu" onClick={handleClick}>
          {click ? (
            <CloseMenu className="menu-icon" />
          ) : (
            <MenuIcon className="menu-icon" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
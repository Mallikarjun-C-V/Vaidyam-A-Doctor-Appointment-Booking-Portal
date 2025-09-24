import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate(); 

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-gray-50 rounded-[50px] border-t border-gray-200 pt-16 px-6 md:px-12 lg:px-20 mb-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 mb-14 text-sm">

        {/* left */}
        <div>
          <img
            onClick={() => handleNavigate('/')}
            className="mb-6 w-44 cursor-pointer hover:opacity-90 transition-opacity duration-300"
            src={assets.logo}
            alt="Vaidyam Logo"
          />
          <p className="w-full md:w-2/3 text-gray-600 leading-relaxed text-[15px]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae libero ea quo nihil exercitationem, animi nesciunt culpa cumque quasi eaque ratione, autem facilis cum sequi quis, iste magnam provident minus. Quis distinctio assumenda laborum dolore.
          </p>
        </div>

        {/* center */}
        <div>
          <p className="text-lg font-semibold mb-5 text-gray-800 tracking-wide">Company</p>
          <ul className="flex flex-col gap-2.5 text-gray-600">
            <li className="cursor-pointer hover:text-primary transition-colors duration-300" onClick={() => handleNavigate('/')}>Home</li>
            <li className="cursor-pointer hover:text-primary transition-colors duration-300" onClick={() => handleNavigate('/about')}>About us</li>
            <li className="cursor-pointer hover:text-primary transition-colors duration-300" onClick={() => handleNavigate('/contact')}>Contact us</li>
            <li className="cursor-pointer hover:text-primary transition-colors duration-300" onClick={() => handleNavigate('/privacy')}>Privacy policy</li>
          </ul>
        </div>

        {/* right */}
        <div>
          <p className="text-lg font-semibold mb-5 text-gray-800 tracking-wide">Get in Touch</p>
          <ul className="flex flex-col gap-2.5 text-gray-600">
            <li className="hover:text-primary transition-colors duration-300">📞 +91-9876598765</li>
            <li className="hover:text-primary transition-colors duration-300">✉️ vaidyam@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* copyright */}
      <hr className="border-gray-300" />
      <p className="py-6 text-sm text-gray-500 text-center tracking-wide">
        © 2025 <span className="font-semibold text-primary">Vaidyam</span> — All Rights Reserved
      </p>
    </div>
  );
};

export default Footer;
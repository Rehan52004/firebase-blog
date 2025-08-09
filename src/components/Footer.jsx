import React from 'react';
import { SiApple } from 'react-icons/si';
import playIcon from '../assets/playstore.png';
import usaFlag from '../assets/united-states.png';

function Footer() {
  return (
    <>
      <div className='px-3 py-20 dark:bg-black'>
        <div className='grid lg:grid-cols-2 max-w-4xl mx-auto'>
          <div>
            <div className='flex'>
              <div className='mr-10 flex items-center hover:scale-105 transition-all ease-in-out duration-100'>
                <div className='w-4 h-7 bg-black dark:bg-white rounded-r-full mr-2'></div>
                <div className='font-light text-lg dark:text-white'>
                  BlogSphere
                </div>
              </div>
              <button className='bg-slate-200 py-1 px-3 rounded-full text-xs font-semibold flex items-center'>
                <img src={usaFlag} alt='' width={18} />
                <p className='pt-1 pl-1'>English</p>
              </button>
            </div>
            <p className='text-sm text-slate-400 max-w-md my-3'>
              Empowering college students and aspiring coders with expert tips,
              coding challenges, and career advice. Join our community for
              invaluable resources!
            </p>
            <div className='flex my-5'>
              <div className='flex items-center bg-black max-w-fit rounded-lg text-white leading-none px-2 py-1 mr-2'>
                <div className='mr-1'>
                  <SiApple size={25} className='text-white' />
                </div>
                <div>
                  <small className='text-[10px]'>Download on the</small>
                  <h3>App Store</h3>
                </div>
              </div>
              <div className='flex items-center bg-black max-w-fit rounded-lg text-white leading-none px-2 py-1'>
                <div className='mr-1'>
                  <img src={playIcon} alt='' width='24px' />
                </div>
                <div>
                  <small className='text-[10px]'>Get it on</small>
                  <h3>Google Play</h3>
                </div>
              </div>
            </div>
            <p className='text-sm text-slate-400'>
              © 2025 BlogShere — Building in 🏙 Lucknow, India 🇮🇳
            </p>
          </div>
          <div className='flex mt-10 lg:mt-0 lg:pl-40'>
            <div className='text-slate-400 text-sm mr-20'>
              <h4 className='font-semibold text-slate-600 text-[15px]'>
                Company
              </h4>
              <p className='my-3'>About us</p>
              <p className='my-3'>Career</p>
              <p className='my-3'>Contact Us</p>
            </div>
            <div className='text-slate-400 text-sm'>
              <h4 className='font-semibold text-slate-600 text-[15px]'>
                Community
              </h4>
              <p className='my-3'>Facebook</p>
              <p className='my-3'>Twitter</p>
              <p className='my-3'>Discord</p>
              <p className='my-3'>Telegram</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;

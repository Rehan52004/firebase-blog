import React from 'react';
import { Outlet } from 'react-router-dom';

//components
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useFirebase } from '../context/firebase';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Layout() {
  const firebase = useFirebase();
  return (
    <>
      <ToastContainer
        position='top-center'
        autoClose={4000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        transition:Bounce
      />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;

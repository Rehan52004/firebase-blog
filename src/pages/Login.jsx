import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/firebase';
import { ScaleLoader } from 'react-spinners';
import { Bounce, toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';

function Login() {
  //state for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //custom hook
  const firebase = useFirebase();

  //state that set error
  const [error, setError] = useState('');

  //loader
  const [loader, setLoader] = useState(false);

  const notify = (msg) =>
    toast.success(msg, {
      position: 'top-center',
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
    });

  async function userSignIn() {
    //setting loader true while loginUser get response
    setLoader(true);
    const res = await firebase.loginUser(email, password);
    if (res) {
      setError('');
      notify('Logged in successfully');
    } else {
      setError('Email or Password Incorrect');
    }
    setLoader(false);
  }

  async function googleSignIn() {
    try {
      const res = await firebase.signInWithGoogle();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  //showing loader to user while logging
  if (loader) {
    return (
      <>
        <div className='min-h-screen flex justify-center items-center dark:bg-black'>
          <ScaleLoader
            color={document.body.classList.contains('dark') ? 'white' : 'black'}
            height={40}
            width={6}
            radius={4}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className='pt-20 min-h-screen dark:bg-black'>
        <div className='w-full sm:w-1/2 xl:w-1/4 mx-auto p-2 sm:p-5 rounded-xl'>
          <h3 className='text-center text-3xl my-2 dark:text-white'>Login</h3>
          {error && <p className='text-center text-red-600'>{error}</p>}
          <input
            type='email'
            className='w-full border py-2 px-3 rounded-full my-3 dark:bg-black dark:border-slate-600 dark:placeholder-white dark:text-white outline-none'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type='password'
            className='w-full border py-2 px-3 rounded-full my-3 dark:bg-black dark:border-slate-600 dark:placeholder-white dark:text-white outline-none'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={(e) => (e.key === 'Enter' ? userSignIn() : '')}
          />

          <button
            onClick={userSignIn}
            className='bg-black dark:bg-white text-white dark:text-black px-5 py-2 rounded-full w-full text-lg mt-3 mb-1'
          >
            Login
          </button>
          <small className='text-xs text-slate-500 pl-2'>
            Don't have an Account?{' '}
            <span className='text-sky-600 underline text-xs cursor-pointer'>
              <Link to={'/sign-up'}>Signup</Link>
            </span>
          </small>
          {/* <div className='flex items-center'>
            <div className='h-[1px] w-full bg-slate-300 dark:bg-slate-600 mx-3'></div>
            <p className='text-center dark:text-white'>or</p>
            <div className='h-[1px] w-full bg-slate-300 dark:bg-slate-600 mx-3'></div>
          </div> */}
          {/* <button
						onClick={googleSignIn}
						className="flex items-center justify-center border border-slate-300 px-5 py-2 rounded-full w-full text-lg mt-3 dark:text-white dark:border-slate-600"
					>
						<FcGoogle size={25} className="mx-2" />
						Continue with Google
					</button> */}
        </div>
      </div>
      {/* <div className="py-5 sm:py-36 dark:bg-black">
				<div className="w-full sm:w-1/2 xl:w-1/4 mx-auto p-2 sm:p-5 rounded-xl">
					<h3 className="text-2xl leading-9 tracking-tight text-gray-900">
						Login
					</h3>
					<p className="text-slate-500 text-sm mb-5">Welcome Back</p>
					{error && (
						<p className="text-center text-red-600">{error}</p>
					)}
					<input
						type="email"
						className="w-full rounded-md border-0 px-2 py-1.5 outline-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<input
						type="password"
						className="w-full rounded-md border-0 px-2 py-1.5 mt-3 outline-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<button
						onClick={userSignIn}
						className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 mt-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Login
					</button>
					<small className="text-xs text-slate-500 pl-2">
						Don't have an Account?{" "}
						<span className="text-sky-600 underline text-xs cursor-pointer">
							<Link to={"/sign-up"}>Signup</Link>
						</span>
					</small>
					<div className="flex items-center">
						<div className="h-[1px] w-full bg-slate-300 mx-3"></div>
						<p className="text-center text-xl">or</p>
						<div className="h-[1px] w-full bg-slate-300 mx-3"></div>
					</div>
					<button
						onClick={googleSignIn}
						className="flex items-center justify-center w-full rounded-md border-0 px-2 py-1.5 mt-3 outline-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					>
						<FcGoogle size={25} className="mx-2" />
						<p className="text-sm font-semibold text-gray-500">
							Continue with Google
						</p>
					</button>
				</div>
			</div> */}
    </>
  );
}

export default Login;

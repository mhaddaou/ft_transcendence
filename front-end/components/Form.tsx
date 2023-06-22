import React from 'react';
import Router from 'next/router';

const Form = () => {

  const auth = () =>{
    const router = Router;
    // router.push('http://10.12.2.9:5000/auth/42');
  }

  return (
    <div className="h-full p-4 flex flex-col justify-between items-center  bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl shadow-full mt-1">
      <div className="mb-4">

        <div>animate-bounce</div>
        <div>animate-bounce</div>
        <div>animate-bounce</div>
        <div>animate-bounce</div>
        <div>animate-bounce</div>
        <div>animate-bounce</div>
        <div>animate-bounce</div>
        <div>animate-bounce</div>
        <div>animate-bounce</div>
        <div>animate-bounce</div>
        <div>animate-bounce</div>
        <div>animate-bounce</div>
        <div>animate-bounce</div>
        <div>animate-bounce</div>
      </div>
      <div className="w-full">
        <div
          className="h-1 bg-gradient-to-r from-blue-500 to-red-500"
          style={{ backgroundSize: '200% 100%', backgroundPosition: 'left' }}
        ></div>
      </div>
      <div className="w-full flex justify-center ">
        <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full h-20 relative shadow-2xl rounded-xl animate-ping'></div>
      <button onClick={auth} className="absolute bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 animate-pulse">
        Sign In with Intra
      </button>
    </div>
    </div>
  );
};

export default Form;

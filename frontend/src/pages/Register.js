import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/authSlice';
import { Navigate } from 'react-router-dom';



function Register() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const user = useSelector((state) => state.auth.user)
  const error = useSelector((state) => state.auth.error)
  const dispatch = useDispatch()

  const submitHandler = e => {
    e.preventDefault();
    dispatch(register({username, password, email}))
    .then((res) => {
      setUsername('');
      setPassword('');
      setEmail('');
    });
  }

  return (
    <div >
      <form className='mx-auto border-2 p-9 md:p-12 w-72 md:w-96 border-black-400 mt-36 h-84' onSubmit={submitHandler}>
        <h3 className='pb-6 text-2xl text-center text-black'>Register</h3>
        <label className='block mb-1 text-xl text-black-400' htmlFor='username'>Username</label>
        <input className='w-full h-8 p-1 mb-6 focus:outline-none' id='username' type='text' value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label className='block mb-1 text-xl text-black-400' htmlFor='password'>Password</label>
        <input className='w-full h-8 p-1 mb-6 focus:outline-none' id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        <label className='block mb-1 text-xl text-black-400' htmlFor='email'>Email</label>
        <input className='w-full h-8 p-1 mb-6 focus:outline-none' id='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div className='flex justify-between'>
          <button className='px-3 py-1 rounded-sm bg-blue-400' type='submit'>Submit</button>
        </div>
        {error ? <p className='pt-10 text-center text-red-600'>{error}</p> : null}
        {user ? <Navigate to='/TaskList' replace={true} state={user}/> : null}
      </form>
    </div>
  );
}

export default Register;

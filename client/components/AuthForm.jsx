import React, { useState } from 'react';
import './AuthForm.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function AuthForm() {
  const[name,setName]=useState('')
  const[email,setEmail]=useState('')
  const[password,setPassword]=useState()
  const navigate = useNavigate();
  const [isSignInActive, setIsSignInActive] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!name) {
      newErrors.name = 'Name is required';
    } else if (/\d/.test(name)) {
      newErrors.name = 'Name cannot contain numbers';
    }
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      newErrors.password = 'Password must be at least 8 characters long with letters and numbers';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
       e.preventDefault();
       if(!validateForm()){
        return;
       }
       axios.post('http://localhost:3001/register',{name , email , password})
       .then((response) => {
        const result = response.data;
        if (result === "Account created"){
          toast.success("Registration is successful");
        }else{
          toast.error("Already Registred")
        }
        
       })
       .catch(err => console.log(err))
  };
  const handleSubmit0 = (e) => {
       e.preventDefault();
       axios.post('http://localhost:3001/login',{email , password})
       .then((response) => {
        const result = response.data;
        if (result === "Success"){
          navigate('/');
        }else if (result === "the password is incorrect"){
          toast.error('incorrect password , try again');
        }else{
          toast.error('Register first')
        }
        
       })
       .catch(err => console.log(err))
  }



  return (
    <div className="auth-form-container">
      <ToastContainer />

      {/* SIGN UP Panel */}
      <div
        className={`form-panel sign-up-panel ${isSignInActive ? 'collapsed' : 'expanded'}`}
        onClick={() => setIsSignInActive(false)}
        style={{ cursor: isSignInActive ? 'pointer' : 'default' }}
      >
        <h2 className="sign-up-text" onClick={() => setIsSignInActive(true)}>SIGN UP</h2>
        {!isSignInActive && (
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                autoComplete='off'
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? 'error' : ''}
              />
              <span className={`error-message ${errors.name ? 'visible' : ''}`}>{errors.name || ' '}</span>
            </div>
            <div className="input-container">
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                autoComplete='off'
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'error' : ''}
              />
              <span className={`error-message ${errors.email ? 'visible' : ''}`}>{errors.email || ' '}</span>
            </div>
            <div className="input-container">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                autoComplete='off'
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? 'error' : ''}
              />
              <span className={`error-message ${errors.password ? 'visible' : ''}`}>{errors.password || ' '}</span>
            </div>
            <button className="form-button" type="submit">Sign Up</button>
          </form>
        )}
      </div>

      {/* SIGN IN Panel */}
      <div
        className={`form-panel sign-in-panel ${isSignInActive ? 'expanded' : 'collapsed'}`}
        onClick={() => setIsSignInActive(true)}
        style={{ cursor: !isSignInActive ? 'pointer' : 'default' }}
      >
        <h2 className="sign-in-text" onClick={() => setIsSignInActive(true)}>SIGN IN</h2>
        {isSignInActive && (
          <form onSubmit={handleSubmit0}>
            <div className="input-container">
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'error' : ''}
              />
              <span className={`error-message ${errors.email ? 'visible' : ''}`}>{errors.email || ' '}</span>
            </div>
            <div className="input-container">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? 'error' : ''}
              />
              <span className={`error-message ${errors.password ? 'visible' : ''}`}>{errors.password || ' '}</span>
            </div>
            <button className="form-button" type="submit">Sign In</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthForm;

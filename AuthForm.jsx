import React, { useState } from 'react';
import './AuthForm.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AuthForm() {
  const [isSignInActive, setIsSignInActive] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  
  //const [userName, setUserName] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!isSignInActive && !formData.name) {
      newErrors.name = 'Name is required';
    } else if (!isSignInActive && /\d/.test(formData.name)) {
      newErrors.name = 'Name cannot contain numbers';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8 || !/[a-zA-Z]/.test(formData.password) || !/\d/.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long with letters and numbers';
    }
    if (!isSignInActive && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password does not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error for the current field
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const url = isSignInActive ? '/api/users/login' : '/api/users'; // Set URL based on active panel
        const method = 'POST';
        const body = JSON.stringify(formData);
  
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        });
  
        if (!response.ok) {
          throw new Error('Failed to sign up or sign in');
        }
  
        const data = await response.json();
  
        if (data.success) { // Check for success response from API
          toast.success(data.message || (isSignInActive ? 'Welcome Back!' : 'Welcome!'));
          // Handle successful login/signup (e.g., store token)
          // Replace with your logic for storing and utilizing tokens
          localStorage.setItem('authToken', data.accessToken || ''); // Placeholder for token
        } else {
          toast.error(data.error || 'Failed to sign up or sign in');
        }
  
      } catch (error) {
        toast.error('Failed to sign up or sign in. Please try again.');
        console.error('Error:', error);
      }
    } else {
      toast.error('Please fix the errors in the form.');
    }
  };
  // Placeholder functions for API integration
const signUpUser = async (formData) => {
  try {
    const response = await fetch('https://your-backend-api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to sign up');
    }

    const data = await response.json();
    return data; // This will be the result of the API call, e.g., success message or user data
  } catch (error) {
    console.error('Sign up error:', error);
    throw error; // Rethrow the error for the UI to handle it
  }
};

const signInUser = async (formData) => {
  try {
    const response = await fetch('https://your-backend-api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to sign in');
    }

    const data = await response.json();
    return data; // This will be the result of the API call, e.g., token or user data
  } catch (error) {
    console.error('Sign in error:', error);
    throw error; // Rethrow the error for the UI to handle it
  }
};


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
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
              />
              <span className={`error-message ${errors.name ? 'visible' : ''}`}>{errors.name || ' '}</span>
            </div>
            <div className="input-container">
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
              />
              <span className={`error-message ${errors.email ? 'visible' : ''}`}>{errors.email || ' '}</span>
            </div>
            <div className="input-container">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
              />
              <span className={`error-message ${errors.password ? 'visible' : ''}`}>{errors.password || ' '}</span>
            </div>
            <div className="input-container">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
              <span className={`error-message ${errors.confirmPassword ? 'visible' : ''}`}>{errors.confirmPassword || ' '}</span>
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
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'error' : ''}
              />
              <span className={`error-message ${errors.email ? 'visible' : ''}`}>{errors.email || ' '}</span>
            </div>
            <div className="input-container">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
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

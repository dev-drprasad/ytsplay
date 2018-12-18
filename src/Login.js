import React from 'react';
import ArrowRightIcon from 'react-feather/dist/icons/arrow-right';
import LockIcon from 'react-feather/dist/icons/lock';

import './Login.css';

// {"method":"auth.login","params":["deluge"],"id":2}
// {"method":"auth.delete_session","params":[],"id":198}
const Login = ({ onLogIn }) => {
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const password = event.target.elements.password.value;
    if (password) {
      const loginUrl = '/api/login';
      fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      })
        .then(response => {
          return response.json();
        })
        .then((json) => {
          const cookieMatch = json.cookie.match(/_session_id=\w+/);
          if (cookieMatch) {
            [document.cookie, ] = cookieMatch;
            onLogIn();
          }
        })
    }
  }
  return (
    <div className="Login">
      <form action="get" onSubmit={handleFormSubmit}>
        <div className="InputGroup">
          <LockIcon size={16} />
          <input type="password" name="password" placeholder="Password" id="password"/>
          <button type="submit" name="submit" value="Login"><ArrowRightIcon size={22} /></button>
        </div>
      </form>
    </div>
  );
};

export default Login;

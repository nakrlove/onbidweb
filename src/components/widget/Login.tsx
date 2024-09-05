import React, { useState } from 'react';
import { useInput } from '../hooks/useInput';
import { removeCommas } from '../utils/Utils';

export default function Login() {
    const [days,setDays] = useState('23')
    const {
      value: emailValue,
      handleInputChange: handleEmailChange,
      hasError: emailHasError,
    } = useInput("", (value) => value.includes("@"));
  
    const {
      value: passwordValue,
      handleInputChange: handlePasswordChange,
      hasError: passwordHasError,
    } = useInput("", (value) => value.length >= 4);
  
    function handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
      event.preventDefault();
      console.log(removeCommas(emailValue), passwordValue);
        setDays(prevDays => {
            console.log(prevDays); // This will log '23'
            return '55';
          })
        console.log(`days ${days}`);
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="control">
          <label>Email</label>
          <input onChange={handleEmailChange} value={emailValue} />
          {emailHasError && <p>Please enter a valid email</p>}
        </div>
        <div className="control">
          <label>Password</label>
          <input
            type="password"
            onChange={handlePasswordChange}
            value={passwordValue}
           // error={passwordHasError && "Please enter a valid password"}
          />
        </div>
        <p>
          <button type="submit">Submit</button>
        </p>
      </form>
    );
  }

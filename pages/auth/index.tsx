import axios from "axios";
import React, { FormEvent, FormEventHandler, useRef, useState } from "react";
import classes from "../index.module.css";
import authClasses from "./auth.module.css";
import { AuthContext } from "../../context/auth-context";
import { useContext } from "react";
import { AuthContextType } from "@/context/auth";

const Auth: React.FC = (props) => {
  const [login, isLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const email = React.createRef<HTMLInputElement>();
  const password = React.createRef<HTMLInputElement>();
  const firstName = React.createRef<HTMLInputElement>();
  const lastName = React.createRef<HTMLInputElement>();
  const auth = useContext(AuthContext) as AuthContextType;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailEl = email.current?.value;
    const passwordEl = password.current?.value;

    if (emailEl?.trim().length === 0 && passwordEl?.trim().length === 0) return;

    axios
      .post(
        "https://easy-event.onrender.com/graphql",
        login === false
          ? {
              query: `
        mutation {
            createUser(userInput: {email: "${emailEl}", password: "${passwordEl}"}){
            _id
            email
            }
        }
      `,
            }
          : {
              query: `
        query {
            login(email: "${emailEl}", password: "${passwordEl}"){
            userId
            token
            tokenExpiration
            }
        }
      `,
            }
      )
      .then((response) => {
        if (response.data.data.login.token) {
          auth?.login(
            response.data.data.login.token,
            response.data.data.login.userId,
            response.data.data.login.tokenExpiration
          );
        }
      })
      .catch(function (error) {
        // console.log(error)
        setErrorMsg(error.message);
        if(error.message === "Request failed with status code 500"){
          setErrorMsg(error.response?.data.errors[0].message)
        }
        console.log(errorMsg)
        
      });
  };

  const signup = !login ? (
    <div className={classes.signup}>
      <div className={classes.form_control}>
        <label htmlFor="first-name">First Name</label>
        <input
          type="first-name"
          id="first-name"
          className={classes.input}
          ref={firstName}
        />
      </div>
      <div className={classes.form_control}>
        <label htmlFor="last-name">Last Name</label>
        <input
          type="last-name"
          id="last-name"
          className={classes.input}
          ref={lastName}
        />
      </div>
    </div>
  ) : null;

  return (
    <form className={authClasses.auth_form} onSubmit={handleSubmit}>
      {signup}
      <div className={classes.form_control}>
        <label htmlFor="email" className="email">
          E-Mail
        </label>
        <input type="email" id="email" className={classes.input} ref={email} />
      </div>
      <div className={classes.form_control}>
        <label htmlFor="password" className="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          className={classes.input}
          ref={password}
        />
        <p style={{ color : 'red'}}>{errorMsg}</p>
      </div>
      <div className={classes.form_actions}>
        <button type="submit">Submit</button>
        <button type="button" onClick={() => isLogin(!login)}>
          Switch to {login === true ? "Signup" : "Login"}
        </button>
      </div>
    </form>
  );
};

export default Auth;

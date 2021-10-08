import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { useState } from "react";
import './App.css';
import initializeAuthentication from './Firebase/firebase.initialize';

initializeAuthentication();
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();


function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({})

  const auth = getAuth();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
    .then (result => {
      const {displayName, email, photoURL} = result.user;
      const loggedInUser = {
        name: displayName,
        email: email,
        photo: photoURL
      };
      setUser(loggedInUser);
    })
    .catch(error => {
      console.log(error.message)
    })
  }

  const handleGithubSignIn = () => {
    signInWithPopup (auth, githubProvider)
    .then (result => {
      const {displayName, photoURL, email} = result.user;
      const loggedInUser = {
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(loggedInUser);
    })
  }

  const handleSignOut = () => {
    signOut(auth)
    .then ( () => {
      setUser({});
    })
  }

  const toggleLogin = e => {
    setIsLogin(e.target.checked)
  }

  const handleNameChange = e => {
    setName(e.target.value);
  }

  const handleEmailChange = e => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  }

  const handleRegistration = e => {
    e.preventDefault();
    console.log(email, password);
    if (password.length < 6) {
      setError('Password Must be at least 6 characters long')
      return;
    }
    
    // isLogin ? processLogin(email, password) : registerNewUser(email, password);
    if (isLogin) {
      processLogin(email, password);
    }
    else {
      registerNewUser(email, password);
    }
  }

  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(result => {
      const user = result.user;
      console.log(user);
      setError('');
    })
    .catch(error => {
      setError(error.message);
    })
  }

  const registerNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
    .then (result => {
      const user = result.user;
      console.log(user);
      setError('');
      verifyEmail();
      setUserName();
    })
    .catch(error => {
      setError(error.message);
    })
  }

  const setUserName = () => {
      updateProfile(auth.currentUser, {displayName: name})
      .then (result => {})
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
    .then(result => {
      console.log(result);
    })
  }

const handleResetPassword = () => {
  sendPasswordResetEmail(auth, email)
  .then(result => {})
}

  return (
    <div className="mx-5">

        <form onSubmit={handleRegistration}>
          <h3 className="text-primary">Please {isLogin ? 'Login' : 'Register'}</h3>
          {!isLogin && <div className="row mb-3">
            <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-10">
              <input type="text" onBlur={handleNameChange} className="form-control" id="inputName" placeholder="Your Name"/>
            </div>
          </div>}
          <div className="row mb-3">
            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
            <div className="col-sm-10">
              <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" required/>
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
            <div className="col-sm-10">
              <input onBlur={handlePasswordChange} type="password" className="form-control" id="inputPassword3" required/>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-10 offset-sm-2">
              <div className="form-check">
                <input onChange={toggleLogin} className="form-check-input" type="checkbox" id="gridCheck1"/>
                <label className="form-check-label" htmlFor="gridCheck1">
                  Already Registered?
                </label>
              </div>
            </div>
          </div>
          <div className="row mb-3 text-danger">{error}</div>
          <button type="submit" className="btn btn-primary"> {isLogin ? 'Login' : 'Register'} </button>
          <button type="button" onClick={handleResetPassword} className="btn btn-secondary btn-sm">Reset Password</button>

        </form>
      <br /><br />
      {/* <form onSubmit={handleRegistration}>
        <h3>Please Register</h3>
        <label htmlhtmlFor="email">Email: </label>
        <input type="text" name="email" id="" />
        <br />
        <label htmlhtmlFor="password">Password: </label>
        <input type="password" name="password" id="" />
        <br />
        <input type="submit" value="Register" />
      </form> */}
      
      <br /><br /><br />
      { !user.name ?
        <div>
        <button onClick={handleGoogleSignIn}>Google sign in</button>
        <button onClick={handleGithubSignIn}>Github Sign In</button>
        </div> :
        <button onClick={handleSignOut}>Sign Out</button>
      }
        
        <br />
        {
          user.email && <div>
            <h2>Welcome {user.name}</h2>
            <p>I know your email address: {user.email}</p>
            <img src={user.photo} alt="" />
          </div>
        }
    </div>
  );
}

export default App;

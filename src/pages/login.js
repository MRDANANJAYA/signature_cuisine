import { useNavigate } from "react-router-dom";
import logo from "../img/scLogo.png";
import { LoginContext } from "../context/LoginContext";
import { useContext, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeFirebase } from "../database/firebaseConfig";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
const Login = () => {
  const navigate = useNavigate();
  const { setLogin } = useContext(LoginContext);
  const [isloding, setIsloding] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const app = initializeFirebase();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
    } else {
      setIsloding(true);
      console.log("email and password ", email, password);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // ...
          console.log("userCredential", user);
          getUserRole(user.uid)
         // setIsloding(false);
        })
        .catch((error) => {
          setIsloding(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("signInWith errorCode", errorCode);
          console.log("signInWith errorMessage", errorMessage);
          if(errorCode ==='auth/invalid-credential'){
            alert('invalid credential! please check your email and password');
          }else{
            alert(errorMessage);
          }
          
        });
    }
  };

  async function getUserRole(id){
    const docRef = doc(db, "auth", `${id}`);
    try {
      const documentSnapshot = await getDoc(docRef);
      if (documentSnapshot.exists()) {
        const documentData = documentSnapshot.data();
        console.log("Auth role data:", documentData.role);
        if(documentData.role === 'staff'){
          localStorage.setItem("islogin", "true");
          setLogin(true);
          navigate("/staff_dashboard");
        }else if(documentData.role === 'admin'){

        }else{
          
          localStorage.setItem("islogin", "true");
          setLogin(true);
          navigate("/dashboard");
        }

      } else {
        console.log("Document not found.");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
    

    setIsloding(false);
  }

  return (
    <div className="d-flex justify-content-center" style={{ height: "100vh" }}>
      <div className="form-signin  m-auto" style={{ minWidth: "20%" }}>
        <form onSubmit={handleLogin}>
          <img className="mb-4 b" src={logo} alt="" width="72" height="57" />
          <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

          <div className="form-floating">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
            <label htmlFor="floatingInput">Email address</label>
            <div className="invalid-feedback" id="floatingInputFeedback">
              Please enter your Email.
            </div>
          </div>
          <div className="form-floating my-3">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <label htmlFor="floatingPassword">Password</label>
            <div className="invalid-feedback" id="floatingPasswordFeedback">
              Please enter your Password.
            </div>
          </div>

          <div className="form-check text-start my-3">
            <input
              className="form-check-input"
              type="checkbox"
              value="remember-me"
              id="flexCheckDefault"
              onChange={(event)=>{ if (event.target.checked) {
                alert('checked');
              } else {
                alert('not checked');
              }}}
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Remember me
            </label>
          </div>

          <button className="btn btn-primary w-100 py-2" type="submit">
            {isloding && (
              <span
              className="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              />
            )}
            Sign in
          </button>
          <p className="mt-5 mb-3 text-body-secondary">
            Signature cuisine © 2017–2024
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

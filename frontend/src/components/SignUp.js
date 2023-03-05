import { useState } from "react";
import FirebaseSignUp from "./FirebaseSignUp";

const SignUp = () => {

  const [email, setEmail] = useState("");
  const [password, setPW] = useState("");

  return (
    <div>
      <form>
        Phone Number: <input type="email" onChange={(e) => setEmail(e.target.value)} required></input><br></br>
        Password: <input type="password" onChange={(e) => setPW(e.target.value)} required></input>
      </form>
      <button onClick={() => {FirebaseSignUp(email, password)}}>회원가입</button>
      <button onClick={console.log("Test")}>회원가입</button>
    </div>
  );
}

export default SignUp;
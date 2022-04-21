import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseInstance } from "../firebase";

  const FirebaseSignUp = (email, password) => {
    const auth = firebaseInstance.getAuth();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
  }

export default FirebaseSignUp 
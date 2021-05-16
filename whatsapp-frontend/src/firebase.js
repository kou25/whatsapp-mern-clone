import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyAl7ISwYbyHbFn0eOfKWL3AhojBCj_wG4Q",
    authDomain: "whatsapp-clone-32da5.firebaseapp.com",
    projectId: "whatsapp-clone-32da5",
    storageBucket: "whatsapp-clone-32da5.appspot.com",
    messagingSenderId: "618644818276",
    appId: "1:618644818276:web:2588a34f4aaca61ec6d271"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db=firebaseApp.firestore()
  const auth=firebase.auth()
  const provider= new firebase.auth.GoogleAuthProvider();

  export{auth, provider}
  export default db;
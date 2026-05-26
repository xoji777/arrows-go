/* Firebase Auth (compat) for Arrows Puzzle */
const firebaseConfig = {
    apiKey: 'AIzaSyALAi-u8Sfuv2SZZcj6KyLSXKsWwS3Gbm0',
    authDomain: 'arrows-puzzle-dd9b1.firebaseapp.com',
    projectId: 'arrows-puzzle-dd9b1',
    storageBucket: 'arrows-puzzle-dd9b1.firebasestorage.app',
    messagingSenderId: '451364262923',
    appId: '1:451364262923:web:ec8e7e370dbf4c13a4a30e',
    measurementId: 'G-RZVF0DEJSQ'
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

window.ArrowsFirebase = {
    auth,
    signInWithGoogle() {
        return auth.signInWithPopup(googleProvider);
    },
    signOut() {
        return auth.signOut();
    },
    onAuthStateChanged(callback) {
        return auth.onAuthStateChanged(callback);
    },
    getCurrentUser() {
        return auth.currentUser;
    }
};

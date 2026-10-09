// src/firebase/firebase.config.js
// Local Mocking Engine replacing native Firebase dependencies

// Helper functions to manage mock state inside the browser's localStorage
const getLocalData = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setLocalData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Seed mock data for tutors if local store is empty
if (getLocalData('local_tutors').length === 0) {
  setLocalData('local_tutors', [
    { id: 'tutor-1', name: 'Alex Johnson', hourly_rate: 25, languages_spoken: ['English', 'Spanish'], subjects: ['English'] },
    { id: 'tutor-2', name: 'Maria Silva', hourly_rate: 30, languages_spoken: ['Portuguese', 'English'], subjects: ['Portuguese'] }
  ]);
}

// Emulated Auth Core Instance
export const auth = {
  currentUser: JSON.parse(sessionStorage.getItem('active_session_user')) || null
};

// Emulated Database (Firestore) Operations Module
export const db = {
  collection: (collectionName) => ({
    get: async () => {
      const data = getLocalData(`local_${collectionName}`);
      return { docs: data.map(item => ({ id: item.id, data: () => item })) };
    },
    add: async (payload) => {
      const current = getLocalData(`local_${collectionName}`);
      const newRecord = { id: crypto.randomUUID(), ...payload };
      current.push(newRecord);
      setLocalData(`local_${collectionName}`, current);
      return { id: newRecord.id };
    }
  })
};

// Email/Password Authentication Handlers
export const signInWithEmailAndPassword = async (authInstance, email, password) => {
  const users = getLocalData('local_users');
  const matchedUser = users.find(u => u.email === email && u.password === password);
  
  if (!matchedUser) throw new Error("auth/user-not-found");
  
  auth.currentUser = { uid: matchedUser.id, email: matchedUser.email, displayName: matchedUser.displayName || "Local User" };
  sessionStorage.setItem('active_session_user', JSON.stringify(auth.currentUser));
  return { user: auth.currentUser };
};

export const createUserWithEmailAndPassword = async (authInstance, email, password) => {
  const users = getLocalData('local_users');
  if (users.some(u => u.email === email)) throw new Error("auth/email-already-in-use");

  const newUser = { id: crypto.randomUUID(), email, password, displayName: email.split('@')[0] };
  users.push(newUser);
  setLocalData('local_users', users);

  auth.currentUser = { uid: newUser.id, email: newUser.email, displayName: newUser.displayName };
  sessionStorage.setItem('active_session_user', JSON.stringify(auth.currentUser));
  return { user: auth.currentUser };
};

// Social Logins (Google & Facebook Mocking Pipeline)
export const signInWithPopup = async (authInstance, providerInstance) => {
  // Generate a mock profile instantly containing all expected fields
  const mockSocialUser = {
    uid: `social-mock-${crypto.randomUUID().slice(0, 8)}`,
    email: "mock.student@example.com",
    displayName: "Jane Doe",
    photoURL: "https://unsplash.com"
  };

  const users = getLocalData('local_users');
  if (!users.some(u => u.email === mockSocialUser.email)) {
    users.push({ id: mockSocialUser.uid, email: mockSocialUser.email, password: "oauth-pass-bypass", displayName: mockSocialUser.displayName });
    setLocalData('local_users', users);
  }

  auth.currentUser = mockSocialUser;
  sessionStorage.setItem('active_session_user', JSON.stringify(auth.currentUser));
  return { user: mockSocialUser };
};

// Session Destroy Methods
export const signOut = async () => {
  auth.currentUser = null;
  sessionStorage.removeItem('active_session_user');
};

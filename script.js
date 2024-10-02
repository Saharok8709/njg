// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
 apiKey: "AIzaSyAgf9vRXldMDbuRihbC0mSRKMAr0md1y6Q",
 authDomain: "site-of-timetable.firebaseapp.com",
 projectId: "site-of-timetable",
 storageBucket: "site-of-timetable.appspot.com",
 messagingSenderId: "189529331236",
 appId: "1:189529331236:web:d2bba2d9019be760e32ab1",
 measurementId: "G-9YHL317HSJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
function showSection(sectionId) {
  const sections = ['registration', 'timetable', 'profile'];
  sections.forEach(id => {
    document.getElementById(id).style.display = id === sectionId ? 'block' : 'none';
  });
}

// Получение данных пользователя
async function getUserData() {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL || userDoc.data()?.photoURL,
  };
}

// Обновление интерфейса профиля
function updateProfileUI(userData) {
  document.getElementById("profile-name").textContent = userData.displayName || userData.email;
  document.getElementById("profile-email").textContent = userData.email;
  document.getElementById("profile-image").src = userData.photoURL || 'placeholder.png';
  document.getElementById("profile-image").alt = userData.displayName || userData.email;
}

// Обновление данных профиля
async function updateProfileData(displayName, photoURL) {
  const user = auth.currentUser;
  if (!user) {
    return;
  }
  await updateProfile(user, {
    displayName: displayName
  });
  if (photoURL) {
    await updateDoc(doc(db, 'users', user.uid), {
      photoURL: photoURL
    });
  }
}

// Загрузка изображения профиля
async function uploadProfileImage(file) {
  const user = auth.currentUser;
  if (!user) {
    return;
  }
  const storageRef = ref(storage, `profile-images/${user.uid}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  await updateProfileData(null, downloadURL);
  return downloadURL;
}

// Выход из профиля
function signOut() {
  auth.signOut().then(() => {
    showSection('registration'); // Показываем форму регистрации после выхода
  }).catch((error) => {
    console.error("Error signing out: ", error);
  });
}

// Обработка изменения изображения профиля
document.getElementById("profile-image-input").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (file) {
    const downloadURL = await uploadProfileImage(file);
    document.getElementById("profile-image").src = downloadURL;
  }
});

// Обработка обновления данных профиля
document.getElementById("update-profile-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const displayName = document.getElementById("display-name").value;
  await updateProfileData(displayName);
  updateProfileUI({displayName: displayName});
});
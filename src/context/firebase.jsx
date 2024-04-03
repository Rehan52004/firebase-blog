import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";

//env variables in string format
import conf from "../conf/conf";

//random id generator
import { v4 } from "uuid";

//firebase import
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

//firestore database imports
import {
	getFirestore,
	addDoc,
	doc,
	collection,
	deleteDoc,
	getDoc,
	getDocs,
	where,
	query,
	updateDoc,
} from "firebase/firestore";

//firebase storage/images folder imports
import {
	deleteObject,
	getDownloadURL,
	getStorage,
	ref,
	uploadBytes,
} from "firebase/storage";

//authentication imports from firebase
import {
	getAuth,
	onAuthStateChanged,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
	GoogleAuthProvider,
	signInWithPopup,
} from "firebase/auth";

//firebase configrationation
const firebaseConfig = {
	apiKey: conf.apiKey,
	authDomain: conf.authDomain,
	projectId: conf.projectId,
	storageBucket: conf.storageBucket,
	messagingSenderId: conf.messagingSenderId,
	appId: conf.appId,
	measurementId: conf.measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//authentication
const auth = getAuth();

//database or firestore
const db = getFirestore(app);

//storage or bucket
const storage = getStorage();

//creating context
const services = createContext();

//custom hook
export const useFirebase = () => useContext(services);

export function FirebaseProvider({ children }) {
	const [user, setUser] = useState(null);

	//get current logged in user
	function getCurrentUser() {
		onAuthStateChanged(auth, (user) => {
			if (res) {
				const res = user;
				setUser(uid);
			}
		});
	}

	//register user
	async function createUser(email, password, name) {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
				name
			);
			const res = userCredential.user;
			setUser(res);

			let userId = res.uid;

			//setting user profile
			if (res) {
				const docRef = await addDoc(collection(db, "user"), {
					avatarURL: "",
					name,
					userId,
				});
			}
			console.log("Document written with ID: ", docRef);
			return true;
		} catch (error) {
			return error.message;
		}
	}

	async function signInWithGoogle() {
		const provider = new GoogleAuthProvider();
		const auth = getAuth();
		signInWithPopup(auth, provider)
			.then((result) => {
				const credential =
					GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				const user = result.user;
				console.log(user);
			})
			.catch((error) => {
				console.log("Sign in With Google:", error);
			});
	}

	//login user
	async function loginUser(email, password) {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const res = userCredential.user;
			setUser(res);
			return true;
		} catch (error) {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log("Login User" + errorCode + errorMessage);
			return false;
		}
	}

	//update user profile
	async function updateUserProfile(
		avatarURL = "",
		name = "",
		userDocId = ""
	) {
		const docRef = doc(db, "user", userDocId);
		const docSnap = await getDoc(docRef);

		if (avatarURL && name) {
			if (docSnap.exists()) {
				console.log("Document data:", docSnap.data());
				if (docSnap.data().avatarURL) {
					const deleteRes = await deleteFiles(
						docSnap.data().avatarURL
					);
					console.log(deleteRes);
				}
			} else {
				console.log("No such document!");
			}
			if (userDocId) {
				const res = await updateDoc(docRef, {
					avatarURL,
					name,
				});
				return res;
			}
		} else if (!avatarURL && name) {
			if (userDocId) {
				const res = await updateDoc(docRef, {
					name,
				});
				return res;
			}
		} else if (!name && avatarURL) {
			const res = await updateDoc(docRef, {
				avatarURL,
			});
			return res;
		}
	}

	async function getUser(userId) {
		try {
			if (userId) {
				console.log(userId);
				const q = query(
					collection(db, "user"),
					where("userId", "==", userId)
				);
				const querySnapshot = await getDocs(q);
				return querySnapshot;
			}
		} catch (error) {
			console.log("Get user: ", error);
		}
	}

	//logout user
	async function logoutUser() {
		try {
			const res = await signOut(auth);
			setUser(null);
			return true;
		} catch (error) {
			return false;
		}
	}

	//create post
	async function createPost(
		title,
		description,
		content,
		imgURL,
		userId,
		category
	) {
		try {
			let date = new Date();
			let strDate = String(date);
			const docRef = await addDoc(collection(db, "blog"), {
				content,
				description,
				imgURL,
				title,
				userId,
				strDate,
				tag: category,
			});
			console.log("Document written with ID: ", docRef);
			return docRef;
		} catch (e) {
			console.error("Create post: ", e);
			return false;
		}
	}

	//update post
	async function updatePost(
		postId,
		content,
		description,
		imgURL,
		title,
		category
	) {
		try {
			const docRef = doc(db, "blog", postId);
			let date = new Date();
			let strDate = String(date);
			if (imgURL) {
				const res = await updateDoc(docRef, {
					content,
					description,
					imgURL,
					title,
					strDate,
					tag: category,
				});
			} else {
				const res = await updateDoc(docRef, {
					content,
					description,
					title,
					strDate,
					tag: category,
				});
			}
			return true;
		} catch (e) {
			console.error("Create post: ", e);
			return false;
		}
	}

	//get single post
	async function getPost(postId) {
		const docRef = doc(db, "blog", postId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			// console.log("Document data:", docSnap.data());
			return docSnap.data();
		} else {
			console.log("No such document!");
			return docSnap;
		}
	}

	//get all posts
	async function getPosts(userId) {
		try {
			if (userId) {
				console.log(userId);
				const q = query(
					collection(db, "blog"),
					where("userId", "==", userId)
				);
				const querySnapshot = await getDocs(q);
				return querySnapshot;
			} else {
				const querySnapshot = await getDocs(collection(db, "blog"));
				return querySnapshot;
			}
		} catch (error) {
			console.log("Get All Posts: ", error);
		}
	}

	//delete post
	async function deletePost(postId) {
		try {
			const res = await deleteDoc(doc(db, "blog", postId));
			console.log(res);
			return true;
		} catch (error) {
			console.log("Delete post: ", error);
			return false;
		}
	}

	//upload file
	async function uploadFiles(filePath, file) {
		try {
			const imgRef = ref(storage, `${filePath + v4()}`);
			const res = await uploadBytes(imgRef, file);
			return res;
		} catch (error) {
			console.log("upload file", error);
			return null;
		}
	}

	async function deleteFiles(file) {
		try {
			const desertRef = ref(storage, file);
			// Delete the file
			const res = await deleteObject(desertRef);
			console.log(res);
		} catch (error) {
			console.log("Delete File: ", error);
		}
	}

	//preview image
	async function previewImage(imgId) {
		try {
			const url = await getDownloadURL(ref(storage, imgId));
			return url;
		} catch (error) {
			console.log("Preview image: ", error);
		}
	}

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				const res = user;
				setUser(res);
			}
		});
	}, [user]);

	return (
		<services.Provider
			value={{
				current: user,
				createUser,
				signInWithGoogle,
				loginUser,
				updateUserProfile,
				getUser,
				logoutUser,
				createPost,
				updatePost,
				deletePost,
				getPost,
				getPosts,
				uploadFiles,
				deleteFiles,
				previewImage,
			}}
		>
			{children}
		</services.Provider>
	);
}

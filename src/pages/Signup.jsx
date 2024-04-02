import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFirebase } from "../context/firebase";
import { ScaleLoader } from "react-spinners";
import { Bounce, toast } from "react-toastify";

function Signup() {
	//data state
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	//firebase services
	const firebase = useFirebase();

	//for error handling
	const [error, setError] = useState("");

	//loader
	const [loader, setLoader] = useState(false);

	//tosat notification
	const notify = (msg) =>
		toast.success(msg, {
			position: "top-center",
			autoClose: 4000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "light",
			transition: Bounce,
		});

	async function signupHandler() {
		setLoader(true);
		function checkPassword() {
			let check = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
			return check.test(password);
		}
		if (name === "" || email === "" || password === "") {
			setLoader(false);
			setError("Fill all details");
		} else if (!checkPassword()) {
			setLoader(false);
			console.log(checkPassword());
			setError(
				"Password Must follow these: \n A Upper Case, A Lower Case, A Numerical Value, At Least 8 length"
			);
		} else {
			setError("");
			try {
				setLoader(true);
				const res = await firebase.createUser(email, password, name);
				if (res === true) {
					notify("Account Created Successfully");
					setError("");
					setLoader(false);
				}
				setError(res);
				setLoader(false);
			} catch (error) {
				setError(error);
				setLoader(false);
			}
			setName("");
			setEmail("");
			setPassword("");
		}
	}

	if (loader) {
		return (
			<>
				<div className="min-h-screen flex justify-center items-center dark:bg-black">
					<ScaleLoader
						color={
							document.body.classList.contains("dark")
								? "white"
								: "black"
						}
						height={40}
						width={6}
						radius={4}
					/>
				</div>
			</>
		);
	}

	return (
		<>
			<div className="pt-20 min-h-screen dark:bg-black">
				<div className="w-full sm:w-1/2 xl:w-1/4 mx-auto p-2 sm:p-5 rounded-xl">
					<h3 className="text-center text-3xl my-2 dark:text-white">
						Sign up
					</h3>
					{error && (
						<p className="text-center text-red-600">{error}</p>
					)}
					<input
						type="text"
						className="w-full border py-2 px-3 rounded-full my-3 dark:bg-black dark:border-slate-600 dark:placeholder-white dark:text-white"
						placeholder="Enter Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>

					<input
						type="email"
						className="w-full border py-2 px-3 rounded-full my-3 dark:bg-black dark:border-slate-600 dark:placeholder-white dark:text-white"
						placeholder="Enter Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<input
						type="password"
						className="w-full border py-2 px-3 rounded-full my-3 dark:bg-black dark:border-slate-600 dark:placeholder-white dark:text-white"
						placeholder="Set Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						onKeyUp={(e) =>
							e.key === "Enter" ? signupHandler() : ""
						}
					/>

					<button
						className="bg-black dark:bg-white text-white dark:text-black hover:scale-105 transition-all ease-in-out duration-300 px-5 py-2 rounded-full w-full text-lg mt-3"
						onClick={signupHandler}
					>
						Signup
					</button>
					<small className="text-xs text-slate-500 pl-3">
						Already have an Account?{" "}
						<span className="text-sky-600 underline text-xs cursor-pointer">
							<Link to={"/login"}>Login</Link>
						</span>
					</small>
				</div>
			</div>
		</>
	);
}

export default Signup;

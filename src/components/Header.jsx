import React, { useEffect, useState } from "react";
import { MdSunny } from "react-icons/md";
import { IoMoonSharp } from "react-icons/io5";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useFirebase } from "../context/firebase";
import { Bounce, toast } from "react-toastify";

function Header() {
	const firebase = useFirebase();
	const user = firebase.current;

	const navigate = useNavigate();

	//state for menu/profile toggle
	const [menuToggle, setMenuToggle] = useState(false);

	const [userAvatar, setUserAvatar] = useState(null);
	//function for handling state of menu toggle
	function handleMenuToggle() {
		menuToggle === true ? setMenuToggle(false) : setMenuToggle(true);
	}

	const [dark, setDark] = useState(false);

	function darkModeHandler() {
		setDark(!dark);
		document.body.classList.toggle("dark");
	}

	//function that sign out the user
	async function signoutUser() {
		const res = await firebase.logoutUser();
		if (res) {
			notify("Logout Succesfully");
			navigate("/login");
		} else {
			alert("Something Went Wrong");
		}
	}

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

	useEffect(() => {
		async function init() {
			try {
				const res = await firebase.getUser(user.uid);
				res.forEach(async (doc) => {
					const imageRes = await firebase.previewImage(
						doc.data().avatarURL
					);
					setUserAvatar(imageRes);
				});
			} catch (error) {
				console.log("No avatar");
				setUserAvatar(null);
			}
		}
		init();
	}, [firebase]);

	return (
		<>
			<div className="px-2 dark:bg-black">
				<div className="flex justify-between items-center py-5 max-w-4xl mx-auto">
					<Link to="/">
						<div className="mr-20 flex items-center hover:scale-105 transition-all ease-in-out duration-100">
							<div className="w-4 h-7 bg-black dark:bg-white rounded-r-full mr-2"></div>
							<div className="font-light text-lg dark:text-white">
								BlogSphere
							</div>
						</div>
					</Link>
					<div className="hidden md:flex text-slate-500">
						<NavLink
							to={"/"}
							className={({ isActive }) => {
								isActive ? "active" : "";
							}}
							style={({ isActive }) => {
								return {
									color: document.body.classList.contains(
										"dark"
									)
										? isActive
											? "White"
											: ""
										: isActive
										? "black"
										: "",
								};
							}}
						>
							<p className="mr-5">Home</p>
						</NavLink>
						<NavLink
							to={"all-post"}
							className={({ isActive }) => {
								isActive ? "active" : "";
							}}
							style={({ isActive }) => {
								return {
									color: document.body.classList.contains(
										"dark"
									)
										? isActive
											? "White"
											: ""
										: isActive
										? "black"
										: "",
								};
							}}
						>
							<p className="mr-5">Blog</p>
						</NavLink>
					</div>

					<div className="flex items-center">
						<div
							onClick={darkModeHandler}
							className="mr-5 cursor-pointer"
						>
							{dark ? (
								<MdSunny size={20} className="text-white" />
							) : (
								<IoMoonSharp size={18} className="" />
							)}
						</div>
						<div
							className="w-9 h-9 rounded-full relative cursor-pointer"
							onClick={handleMenuToggle}
						>
							{userAvatar ? (
								<img
									src={userAvatar}
									className="w-full h-full rounded-full"
								/>
							) : (
								<img
									src="https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/no-profile-picture-icon.png"
									className="w-full h-full rounded-full"
								/>
							)}

							<div
								className={`${
									menuToggle ? "block" : "hidden"
								} w-40 absolute z-10 top-10 right-0 bg-white shadow-lg rounded-xl overflow-hidden`}
							>
								{user ? (
									<div>
										<Link
											to={`/profile/${firebase.current.uid}`}
										>
											<div className="border-b-2 px-5 py-2 hover:bg-slate-100">
												Profile
											</div>
										</Link>
										<Link to={"/new-post"}>
											<div className="border-b-2 px-5 py-2 hover:bg-slate-100">
												Create Post
											</div>
										</Link>
										<Link to={"/"}>
											<div className="block md:hidden border-b-2 px-5 py-2 hover:bg-slate-100">
												Home
											</div>
										</Link>
										<Link to={"/all-post"}>
											<div className="block md:hidden border-b-2 px-5 py-2 hover:bg-slate-100">
												Blog
											</div>
										</Link>

										<div
											onClick={signoutUser}
											className="px-5 py-2 hover:bg-slate-100 text-red-600"
										>
											Logout
										</div>
									</div>
								) : (
									<div>
										<Link to={"/"}>
											<div className="block md:hidden border-b-2 px-5 py-2 hover:bg-slate-100">
												Home
											</div>
										</Link>
										<Link to={"/login"}>
											<div className="border-b-2 px-5 py-2 hover:bg-slate-100">
												Login
											</div>
										</Link>
										<Link to={"/sign-up"}>
											<div className="border-b-2 px-5 py-2 hover:bg-slate-100">
												Signup
											</div>
										</Link>
										{/* <Link to="/login">
											<button className="border border-slate-500 px-3 py-1 rounded-full w-full">
												Login
											</button>
										</Link>
										<Link to="/sign-up">
											<button className="bg-black text-white px-3 py-1 mt-2 w-full rounded-full">
												Signup
											</button>
										</Link> */}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Header;

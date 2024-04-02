import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
//pages
import Signup from "./pages/Signup";
import ViewPost from "./pages/ViewPost";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import AllPost from "./pages/AllPost";
import NewPost from "./pages/NewPost";
import AuthLayout from "./AuthLayout";
import Profile from "./pages/Profile";
import EditPost from "./pages/EditPost";
import Search from "./pages/Search";

function App() {
	const [loader, setLoader] = useState(true);

	useEffect(() => {
		const fetchWebsite = () => {
			setTimeout(() => {
				setLoader(false);
			}, 3000);
		};
		fetchWebsite();
	}, []);

	return (
		<>
			{loader ? (
				<div className="min-h-screen flex justify-center items-center">
					<ScaleLoader
						color="black"
						height={40}
						width={6}
						radius={4}
					/>
				</div>
			) : (
				<>
					<Routes>
						<Route path="/" element={<Layout />}>
							<Route
								path=""
								element={
									<AuthLayout authentication={false}>
										<Home />
									</AuthLayout>
								}
							/>
							<Route
								path="login"
								element={
									<AuthLayout authentication={false}>
										<Login />
									</AuthLayout>
								}
							/>

							<Route
								path="sign-up"
								element={
									<AuthLayout authentication={false}>
										<Signup />
									</AuthLayout>
								}
							/>
							<Route
								path="all-post"
								element={
									<AuthLayout authentication>
										<AllPost />
									</AuthLayout>
								}
							/>
							<Route
								path="profile/:paramsUserId"
								element={
									<AuthLayout authentication>
										<Profile />
									</AuthLayout>
								}
							/>
							<Route
								path="new-post"
								element={
									<AuthLayout authentication>
										<NewPost />
									</AuthLayout>
								}
							/>
							<Route
								path="edit-post/:postId"
								element={
									<AuthLayout authentication>
										<EditPost />
									</AuthLayout>
								}
							/>

							<Route
								path="post/:id"
								element={
									<AuthLayout authentication>
										<ViewPost />
									</AuthLayout>
								}
							/>

							<Route
								path="search/:searchQuery"
								element={
									<AuthLayout authentication>
										<Search />
									</AuthLayout>
								}
							/>
						</Route>
					</Routes>
				</>
			)}
		</>
	);
}

export default App;

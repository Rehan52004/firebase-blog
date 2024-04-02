import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { ScaleLoader } from "react-spinners";
import { useFirebase } from "../context/firebase";
import { Link, useParams } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

function Profile() {
	const { paramsUserId } = useParams();

	const firebase = useFirebase();
	const [posts, setPosts] = useState([]);

	const [avatar, setAvatar] = useState("");
	const [profileName, setProfileName] = useState("");

	const [imageUrl, setImageUrl] = useState("");

	const [name, setName] = useState("");

	//loader for ux
	const [loader, setLoader] = useState(false);

	//modal
	const [show, setShow] = useState(false);

	function handleShow() {
		show === true ? setShow(false) : setShow(true);
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

	async function updateUserAvatarAndName() {
		setLoader(true);
		setShow(false);
		const userProfile = await firebase.getUser(paramsUserId);
		let userDocId = "";

		userProfile.forEach(async (doc) => {
			if (avatar) {
				const deleteRes = await firebase.deleteFiles(
					doc.data().avatarURL
				);
			}
			userDocId = doc._key.path.segments[6];
		});

		try {
			let fileRes = "";
			if (avatar) {
				fileRes = await firebase.uploadFiles(
					`userAvatar/${avatar}`,
					avatar
				);
			}
			let fullPath = fileRes?.metadata?.fullPath;
			const res = await firebase.updateUserProfile(
				fullPath,
				name,
				userDocId
			);
			notify("Profile Updated Succesfully, Please Refresh the Page");
			setLoader(false);
		} catch (error) {
			setLoader(false);
			console.log(error);
		}
	}

	useEffect(() => {
		setImageUrl("");
		setProfileName("");

		// loadding all the post that is created by params user
		setLoader(true);
		async function getYourPosts() {
			const querySnapshot = await firebase.getPosts(paramsUserId);
			let dbPosts = [];
			querySnapshot?.forEach((doc) => {
				dbPosts.push({
					...doc.data(),
					postId: doc._key.path.segments[6],
				});
			});
			const userProfile = await firebase.getUser(paramsUserId);
			userProfile.forEach(async (doc) => {
				console.log(doc.data());
				setProfileName(doc.data().name);
				const imgUrl = await firebase.previewImage(
					doc.data().avatarURL
				);
				setImageUrl(imgUrl);
			});
			setPosts(dbPosts);
			setLoader(false);
		}
		getYourPosts();
	}, [paramsUserId]);

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
			<div className="dark:bg-black">
				<div className="max-w-3xl mx-auto">
					<div className="flex items-center md:items-start mb-5 md:py-10 border-b-2 dark:border-slate-600 py-5 px-5">
						<div className="w-24 md:w-40 h-24 md:h-40 rounded-full overflow-hidden">
							<img
								src={imageUrl}
								alt=""
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="md:ml-5 p-5">
							<h2 className="text-2xl md:text-5xl dark:text-white">
								{profileName ? profileName : "Unknown"}
							</h2>
							<p className="text-xs md:text-lg text-slate-500">
								Total Post: {posts.length}
							</p>
							{firebase?.current?.uid === paramsUserId && (
								<button
									onClick={handleShow}
									className="text-xs md:text-base rounded-full bg-black dark:bg-white dark:text-black dark:border text-white px-3 py-0.5 transition-all ease-in-out duration-300 hover:scale-105"
								>
									Edit
								</button>
							)}
						</div>
					</div>
					<>
						{posts.length === 0 ? (
							<>
								<div className="my-20 text-center">
									<p className="text-2xl mb-5">
										You don't have any post right now
									</p>
									<button className="rounded-full bg-black text-white px-5 py-2 transition-all ease-in-out duration-300 hover:scale-105">
										<Link to={"/new-post"}>
											Create your first post
										</Link>
									</button>
								</div>
							</>
						) : (
							<>
								<div className="grid md:grid-cols-2 gap-5 px-5">
									{posts?.map((post, i) => (
										<PostCard
											key={i}
											img={post.imgURL}
											title={post.title}
											description={post.description}
											userId={post.userId}
											link={post.postId}
											tag={post.tag}
										/>
									))}
								</div>
							</>
						)}
					</>
				</div>
			</div>

			{/* modal code start */}
			<div className={`${show ? "block" : "hidden"}`}>
				<div
					className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center`}
				>
					<div className="w-[90%] md:w-[50%] xl:w-[25%] h-30 px-5 pt-5 bg-white rounded-3xl">
						<div>
							<p>Profile Image</p>
							<input
								type="file"
								placeholder="Choose Image"
								className="mb-4 px-4 py-1.5 w-full border rounded-full"
								style={{ outlineOffset: "0px" }}
								onChange={(e) => setAvatar(e.target.files[0])}
							/>
							<input
								type="text"
								className="w-full border py-2 px-3 rounded-full"
								placeholder="New Name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className="text-end">
							<button
								onClick={handleShow}
								className="rounded-full text-black border-2 my-5 px-5 py-2 transition-all ease-in-out duration-300 hover:scale-110 mr-2"
							>
								Cancel
							</button>
							<button
								onClick={updateUserAvatarAndName}
								className="rounded-full bg-black text-white my-5 px-5 py-2 transition-all ease-in-out duration-300 hover:scale-110 hover:bg-slate-800"
							>
								Update
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* modal code end */}
		</>
	);
}

export default Profile;

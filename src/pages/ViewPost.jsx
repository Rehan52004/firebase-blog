import React, { useEffect, useState } from "react";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFirebase } from "../context/firebase";
import parse from "html-react-parser";
import { ScaleLoader } from "react-spinners";
import { Bounce, toast } from "react-toastify";

function ViewPost() {
	//getting post id
	const { id } = useParams();

	const firebase = useFirebase();
	const navigate = useNavigate();

	const [post, setPost] = useState({});

	const [imageUrl, setImageUrl] = useState("");

	const [loader, setLoader] = useState(false);

	const [user, setUser] = useState({});
	const [userAvatar, setUserAvatar] = useState("");

	const [show, setShow] = useState(false);

	function handleShow() {
		show === true ? setShow(false) : setShow(true);
	}

	async function deleteThePost() {
		setShow(false);
		setLoader(true);
		try {
			const postRes = await firebase.deletePost(id);
			const fileRes = await firebase.deleteFiles(post.imgURL);
			notifySuccess("Post Deleted");
			console.log("Post deleted and image deleted");
		} catch (error) {
			console.log(error);
		} finally {
			setLoader(false);
			navigate(`/profile/${firebase.current.uid}`);
		}
	}

	//tosat notification
	const toastStyle = {
		position: "top-center",
		autoClose: 4000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
		transition: Bounce,
	};
	const notifySuccess = (msg) => toast.success(msg, toastStyle);
	const notifyError = (msg) => toast.success(msg, toastStyle);

	useEffect(() => {
		async function getPostDetails() {
			setLoader(true);
			try {
				const dbPost = await firebase.getPost(id);
				setPost(dbPost);
				const imgUrl = await firebase.previewImage(dbPost.imgURL);
				setImageUrl(imgUrl);
				const user = await firebase.getUser(dbPost.userId);
				if (user)
					user.forEach(async (doc) => {
						setUser(doc.data());
						const uAvatar = await firebase.previewImage(
							doc.data().avatarURL
						);
						setUserAvatar(uAvatar);
					});
			} catch (error) {
				setImageUrl(
					"https://ghost.involve.app/content/images/2022/06/engineers_update-3.png"
				);
				console.log(error);
			}
			setLoader(false);
		}
		getPostDetails();
	}, []);

	//showing loader to user while deleting the post
	if (loader) {
		return (
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
		);
	}

	return (
		<>
			<div className="dark:bg-black">
				<div className="max-w-3xl mx-auto min-h-screen">
					{/* Delete post confirmation Modal Code Start */}
					{
						<div className={`${show ? "block" : "hidden"}`}>
							<div
								className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center`}
							>
								<div className="w-[90%] sm:w-[50%] lg:w-[25%] h-30 px-5 pt-5 bg-white rounded-3xl">
									<p className="text-lg md:text-xl">
										Are you sure to delete the post?
									</p>
									<div className="text-end">
										<button
											onClick={handleShow}
											className="rounded-full text-black border-2 my-5 px-5 py-2 transition-all ease-in-out duration-300 hover:scale-110 mr-2"
										>
											Cancel
										</button>
										<button
											onClick={deleteThePost}
											className="rounded-full bg-black text-white my-5 px-5 py-2 transition-all ease-in-out duration-300 hover:scale-110 hover:bg-slate-800"
										>
											Confirm
										</button>
									</div>
								</div>
							</div>
						</div>
					}
					{/* modal code end */}

					<div className="px-3 sm:px-8">
						<div className="w-fit py-10">
							<Link to={"/all-post"}>
								<div className="w-10 h-10 hover:bg-slate-200 dark:hover:text-black flex justify-center items-center  rounded-full transition-all ease-in-out duration-300 hover:scale-110  dark:text-white">
									<HiOutlineArrowLeft
										size={23}
										className="font-semibold"
									/>
								</div>
							</Link>
						</div>
						<p className="text-xs uppercase text-slate-500 mb-2">
							{post.tag}
						</p>
						<h1 className="text-3xl lg:text-5xl font-bold dark:text-white">
							{post.title}
						</h1>
						<p className="text-slate-500 lg:text-lg mt-6 lg:mt-10 mb-5 font-normal">
							{post.description}
						</p>
						<div className="flex justify-between items-center">
							<div className="flex text-slate-500 items-center text-xs">
								<div>
									{post?.strDate &&
										post?.strDate?.slice(4, 16)}
								</div>
								<div className="mx-1">.</div>
								<Link
									to={`/profile/${user?.userId}`}
									className="flex items-center justify-end"
								>
									<div>
										{user?.name ? user?.name : "Unknown"}
									</div>
								</Link>
							</div>
						</div>
					</div>
					<div className="w-full h-[200px] sm:h-[350px] my-8">
						<img
							src={imageUrl}
							alt=""
							className="w-full h-full object-cover md:rounded-[2.5rem]"
						/>
					</div>
					<div className="px-3 sm:px-8">
						<div className="text-wrap dark:text-white">
							{parse(`${post.content}`)}
						</div>
						<div className="flex justify-end mt-5 sm:mt-10">
							<div>
								{firebase?.current?.uid === post.userId && (
									<div className="flex items-center">
										<Link to={`/edit-post/${id}`}>
											<button className="rounded-full border mr-3 px-5 py-1 transition-all ease-in-out duration-300 hover:scale-110 dark:bg-white dark:text-black">
												Edit
											</button>
										</Link>
										<button
											onClick={handleShow}
											className="rounded-full bg-red-500 text-white px-5 py-1 transition-all ease-in-out duration-300 hover:scale-110 hover:bg-red-400"
										>
											Delete
										</button>
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

export default ViewPost;

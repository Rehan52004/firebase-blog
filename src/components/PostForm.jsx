import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { plugins, toolbars } from "../constants/tinymceData";
import { useNavigate, useParams } from "react-router-dom";
import { useFirebase } from "../context/firebase";
import { ScaleLoader } from "react-spinners";
import { Bounce, toast } from "react-toastify";

function PostForm({ post }) {
	const { postId } = useParams();

	//tinymce values
	const [value, setValue] = useState("");
	const [text, setText] = useState("");

	//data title, description
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");

	//handling image
	const [imageFile, setImageFile] = useState(null);

	//handling error
	const [error, setError] = useState("");

	//handling loader while fething firebase function
	const [loader, setloader] = useState(false);

	const firebase = useFirebase();
	const navigate = useNavigate();

	//custom function provided by tinymce
	const onEditorInputChange = (newValue, editor) => {
		setValue(newValue);
		setText(editor.getContent({ format: "text" }));
	};

	//function for creating post
	async function submitPost() {
		setloader(true);
		if (post) {
			try {
				let fullPath = "";
				if (
					!String(imageFile).includes(
						"https://firebasestorage.googleapis.com/v0/b/blog-post-e2ce6.appspot.com"
					)
				) {
					console.log("image delete called");
					const deleteFileRes = await firebase.deleteFiles(
						post.imgURL
					);
					console.log("Old Image Deleted", deleteFileRes);
					const res = await firebase.uploadFiles(
						`images/${imageFile}`,
						imageFile
					);
					fullPath = res?.metadata?.fullPath;
				}
				const postRes = await firebase.updatePost(
					postId,
					value,
					description,
					String(fullPath),
					title,
					category
				);
				notify("Post Updated Successfully");
				console.log("Post updates without image", postRes);
			} catch (error) {
				console.log("Create post: ", error);
			} finally {
				setTitle("");
				setDescription("");
				setImageFile(null);
				setloader(false);
				navigate("/");
			}
		} else {
			if (imageFile && title && description) {
				try {
					const res = await firebase.uploadFiles(
						`images/${imageFile}`,
						imageFile
					);
					const fullPath = res?.metadata?.fullPath;
					if (fullPath) {
						const post = await firebase.createPost(
							title,
							description,
							value,
							String(fullPath), //adding image to post
							firebase.current.uid, //adding user to post
							category
						);
						notify("Post Created Succesfully");
					} else {
						console.log("Metadata fullPath is undefined");
					}
				} catch (error) {
					setError("Post not created please refresh the page");
				} finally {
					setTitle("");
					setDescription("");
					setImageFile(null);
					setloader(false);
					navigate("/all-post");
				}
			} else {
				console.log(category);
				setloader(false);
				setError("Please Fill All Details and Select Any photo");
			}
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
			if (post) {
				setTitle(post.title);
				setDescription(post.description);
				setValue(post.content);
				setCategory(post.category);
				const imgRes = await firebase.previewImage(post.imgURL);
				console.log(imgRes);
				setImageFile(imgRes);
				console.log(post.imgURL);
			}
		}
		init();
	}, [post]);

	if (loader) {
		return (
			<>
				<div className="min-h-screen flex justify-center items-center dark:bg-black">
					<div>
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
						<p className="text-sm">Wait its take time ...</p>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<div className="min-h-screen w-full dark:bg-black">
				<div className="px-3 max-w-4xl mx-auto py-10">
					{error && (
						<p className="text-center text-red-600 text-lg mb-5">
							{error}
						</p>
					)}
					<div className="grid md:grid-cols-2 gap-x-5 content-center">
						<div>
							<input
								type="text"
								className="w-full border py-2 px-3 rounded-full my-3 dark:bg-black dark:border-slate-600 dark:placeholder-white dark:text-white"
								placeholder="Title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
							<br />
							<textarea
								className="w-full border rounded-xl p-3 mb-1 dark:bg-black dark:border-slate-600 dark:placeholder-white dark:text-white"
								rows={6}
								placeholder="Enter some short description about blog that show what about your blog"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							></textarea>
							<br />
							<select
								name=""
								id=""
								className="w-full px-3 py-2 border rounded-full mb-3 text-slate-400 dark:bg-black dark:border-slate-600 dark:placeholder-white dark:text-white"
								onChange={(e) => setCategory(e.target.value)}
							>
								<option
									disabled
									selected
									defaultValue="technology"
								>
									Choose Category
								</option>
								<option value="technology">Technology</option>
								<option value="general">General</option>
								<option value="science">Science</option>
								<option value="programming">Programming</option>
								<option value="lifestyle">Lifestyle</option>
								<option value="fitness">Fitness</option>
								<option value="relationship">
									Relationship
								</option>
								<option value="food">Food & Cooking</option>
								<option value="travel">Travel</option>
							</select>
						</div>
						<div className="">
							<input
								type="file"
								className="mt-1 mb-3 md:mb-0 md:mt-3 md:ml-2 px-4 py-1.5 w-full border rounded-full dark:bg-black dark:border-slate-600 dark:text-white"
								onChange={(e) =>
									setImageFile(e.target.files[0])
								}
							/>
							<div className="h-[200px] w-auto p-2 md:p-5">
								{imageFile ? (
									String(imageFile).includes(
										"https://firebasestorage.googleapis.com/v0/b/blog-post-e2ce6.appspot.com"
									) ? (
										<img
											src={imageFile}
											alt=""
											className="pb-5 mt-3 md:pl-5 h-full w-auto mx-auto"
										/>
									) : (
										<img
											src={URL.createObjectURL(imageFile)}
											alt=""
											className="pb-5 mt-3 md:pl-5 h-full w-auto mx-auto"
										/>
									)
								) : (
									<div className="pt-20 pl-10 mx-auto h-40 dark:text-white">
										Selected Image Show Here
									</div>
								)}
							</div>
						</div>
					</div>
					<Editor
						apiKey="5nuhcp7zw5hf8mx46q4m62x7fqz0zevq60jzygzerlmhgxac"
						onEditorChange={(newValue, editor) =>
							onEditorInputChange(newValue, editor)
						}
						onInit={(evt, editor) =>
							setText(editor.getContent({ format: "text" }))
						}
						value={value}
						initialValue={
							value ? value : "Write your thoughts here..."
						}
						init={{
							plugins: plugins,
							toolbar: toolbars,
							skin: document.body.classList.contains("dark")
								? "oxide-dark"
								: "oxide",
							content_css: document.body.classList.contains(
								"dark"
							)
								? "dark"
								: "light",
						}}
					/>
					<button
						onClick={submitPost}
						className="rounded-full bg-black dark:bg-white dark:border dark:text-black text-white my-5 px-5 py-2 transition-all ease-in-out duration-300 hover:scale-105 hover:bg-slate-900"
					>
						{post ? "Update" : "Add Post"}
					</button>
				</div>
			</div>
		</>
	);
}

export default PostForm;

import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { useFirebase } from "../context/firebase";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";

function AllPost() {
	//custom hook that provide all context function
	const firebase = useFirebase();

	//state that have all post
	const [posts, setPosts] = useState([]);

	//loader for ux
	const [loader, setLoader] = useState(false);

	async function getAllPosts() {
		const querySnapshot = await firebase.getPosts();
		let dbPosts = [];

		/*
            we push all post data along with post id in dbPost array and after setPost to db post
        */
		querySnapshot.forEach((doc) => {
			dbPosts.push({
				...doc.data(),
				postId: doc._key.path.segments[6],
			});
		});
		setPosts(dbPosts);
		setLoader(false);
	}

	useEffect(() => {
		setLoader(true);
		getAllPosts();
	}, []);

	//showing loader while loading the posts
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
						className="text-black dark:text-white"
					/>
				</div>
			</>
		);
	}

	//if there is no post in the feed then show this message
	if (posts.length === 0) {
		return (
			<>
				<div className="my-20 text-center">
					<p className="text-2xl mb-5">There is no post to read</p>
					<button className="rounded-full bg-black text-white px-5 py-2 transition-all ease-in-out duration-300 hover:scale-105">
						<Link to={"/new-post"}>Create your first post</Link>
					</button>
				</div>
			</>
		);
	}

	return (
		<>
			<div className="dark:bg-black">
				<div className="px-3 max-w-4xl mx-auto py-20">
					<div className="mb-16 dark:text-white">
						<h1 className="text-5xl font-semibold">Blog</h1>
						<p className="text-xl mt-5">All Trending Blogs</p>
					</div>
					<div>
						<div className="grid md:grid-cols-2 gap-10">
							{posts?.map((post, i) => (
								<PostCard
									key={i}
									img={post.imgURL}
									title={post.title}
									tag={post.tag}
									description={post.description}
									userId={post.userId}
									link={post.postId}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default AllPost;

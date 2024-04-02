import React, { useState } from "react";
import PostCard from "../components/PostCard";
import { useFirebase } from "../context/firebase";
import { ScaleLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";

function Search() {
	const { searchQuery } = useParams();
	const navigate = useNavigate();

	//custom hook that provide all context function
	const firebase = useFirebase();

	//state that have all post
	const [posts, setPosts] = useState([]);

	const [searchTerm, setSearchTerm] = useState("");

	//loader for ux
	const [loader, setLoader] = useState(false);

	async function getPostBySearch(e) {
		setPosts(await getAllPosts());
		if (e?.key === "Enter") {
			setLoader(true);
			const newPost = posts.filter(
				(post) =>
					String(post?.title)
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					String(post?.tag)
						.toLowerCase()
						.includes(searchTerm.toLowerCase())
			);
			setPosts(newPost);
			console.log(newPost);
		}
		setLoader(false);
	}

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
		return dbPosts;
	}

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
					/>
				</div>
			</>
		);
	}

	return (
		<>
			<div className="px-3 lg:px-40">
				<div className="px-2 sm:px-10">
					<div title="Search by tag/topics">
						<input
							type="text"
							placeholder="Search for Post"
							className="w-full px-4 py-2 bg-slate-100 rounded-full my-5 block md:hidden"
							value={searchTerm}
							onKeyDown={getPostBySearch}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
				{posts?.length !== 0 ? (
					<>
						<h1 className="text-center text-4xl font-semibold mb-5">
							Read Blogs
						</h1>
						<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-10">
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
					</>
				) : (
					<div className="my-20 text-center">
						<p>No Post find with search {`" ${searchTerm} "`}</p>
					</div>
				)}
			</div>
		</>
	);
}

export default Search;

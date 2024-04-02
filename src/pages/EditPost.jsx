import React, { useEffect, useState } from "react";
import PostForm from "../components/PostForm";
import { useParams } from "react-router-dom";
import { useFirebase } from "../context/firebase";

function EditPost() {
	const { postId } = useParams();
	const firebase = useFirebase();

	const [post, setPost] = useState(null);

	useEffect(() => {
		async function getPostDetails() {
			const postRes = await firebase.getPost(postId);
			setPost(postRes);
			console.log(post);
		}
		getPostDetails();
	}, []);
	return (
		<>
			<PostForm post={post} />
		</>
	);
}

export default EditPost;

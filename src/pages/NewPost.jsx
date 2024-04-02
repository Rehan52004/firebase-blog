import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { plugins, toolbars } from "../constants/tinymceData";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../context/firebase";
import { ScaleLoader } from "react-spinners";
import PostForm from "../components/PostForm";

function NewPost() {
	return (
		<>
			<PostForm />
		</>
	);
}

export default NewPost;

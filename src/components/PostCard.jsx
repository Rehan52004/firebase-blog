import React, { useEffect, useState } from "react";

//react icons
import { HiArrowLongRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useFirebase } from "../context/firebase";

function PostCard(props) {
	let { img, title, description, link, tag } = props;
	const firebase = useFirebase();

	const [previewImg, setPreviewImg] = useState("");

	useEffect(() => {
		async function getImage() {
			try {
				const imgUrl = await firebase.previewImage(img);
				setPreviewImg(imgUrl);
			} catch (error) {
				setPreviewImg(
					"https://ghost.involve.app/content/images/2022/06/engineers_update-3.png"
				);
				console.log(error);
			}
		}
		getImage();
	}, []);

	return (
		<>
			<Link to={`/post/${link}`}>
				<div className="transition-all ease-in-out duration-150 hover:scale-95">
					<div className="w-full h-48 md:h-56">
						<img
							src={previewImg}
							alt=""
							className="w-full h-full object-cover rounded-3xl"
						/>
					</div>
					<div className="mt-5 px-3 dark:text-white">
						<p className="text-sm uppercase">{tag}</p>
						<h3 className="text-2xl font-semibold">{title}</h3>
						<p className="text-sm text-slate-600">
							{description.length < 210
								? description
								: description.slice(0, 210) + "..."}
						</p>
					</div>
				</div>
			</Link>
			{/* <Link
				to={`/post/${link}`}
				className="flex justify-between mb-5 border-b-2 py-5 w-full"
			>
				<div>
					<div className="pt-1 px-3">
						<h3 className="text-2xl font-semibold">{title}</h3>
						<p className="text-md text-slate-600">
							{description.length < 210
								? description
								: description.slice(0, 210) + "..."}
						</p>
					</div>
				</div>
				<div className="w-[250px] h-[150px]">
					<img
						src={previewImg}
						alt=""
						className="w-full h-full object-cover rounded-2xl"
						style={{ aspectRatio: "4/3" }}
					/>
				</div>
			</Link> */}
		</>
	);
}

export default PostCard;

import React from "react";
import leftImage from "../assets/left-side-image.svg";
import { Link } from "react-router-dom";
import smileIcon from "../assets/face_smiling@2x.webp";
import bigSmile from "../assets/big-smile.webp";
import { useFirebase } from "../context/firebase";
import travelCat from "../assets/travel-cat.avif";
import fitnessCat from "../assets/fitness-cat.avif";
import foodCat from "../assets/food-cat.avif";
import lifestyleCat from "../assets/lifestyle-cat.avif";
import programmingCat from "../assets/programming-cat.avif";
import relationCat from "../assets/relation-cat.avif";
import scienceCat from "../assets/science-cat.avif";
import techCat from "../assets/tech-cat.avif";

function Home() {
	const firebase = useFirebase();
	return (
		<>
			<div className="px-3 min-h-screen dark:bg-black">
				<div className="mx-auto max-w-4xl">
					<div className="py-10 sm:py-20 md:py-36">
						<div className="hidden lg:block absolute top-40 animate-updown animate-infinite animate-duration-[3000ms]">
							<img
								src={smileIcon}
								alt=""
								width="70px"
								className="rotate-12"
							/>
						</div>
						<div className="text-5xl sm:text-5xl md:text-6xl sm:text-center font-bold dark:text-white leading-tight">
							Start Your Blogging Adventure Here
						</div>
						<div className="sm:text-center md:text-xl text-slate-600 mt-5">
							Discover, Engage, Inspire and write stories in form
							of blog that inspire others
						</div>
						<div className="sm:text-center my-5">
							{firebase.current ? (
								<Link to="/new-post">
									<button className="border border-slate-700 dark:text-white px-3 sm:px-5 py-2 rounded-full hover:scale-105 ease-in-out duration-300">
										Create Post Now
									</button>
								</Link>
							) : (
								<Link to="/sign-up">
									<button className="border border-slate-700 dark:text-white px-3 sm:px-5 py-2 rounded-full hover:scale-105 ease-in-out duration-300">
										Create Account Now
									</button>
								</Link>
							)}
						</div>
						<div className="hidden lg:block absolute right-80 bottom-60 animate-wiggle animate-infinite animate-duration-[3000ms]">
							<img
								src={bigSmile}
								alt=""
								width="70px"
								className="rotate-12"
							/>
						</div>
					</div>
					<div className="md:py-20">
						<div className="bg-black w-full h-fit shadow-[9px_7px_100px_-30px_rgba(25,20,199,1)] rounded-3xl text-white sm:text-2xl md:text-3xl font-light md:leading-relaxed p-5 sm:p-10 dark:bg-white dark:text-black">
							"Empowering students with practical solutions, our
							blog fosters interactive engagement and provides
							insightful content on academic success, mental
							health, and personal growth. We prioritize empathy,
							authenticity, and collaboration, creating a
							supportive community where students can thrive and
							overcome daily life challenges with confidence and
							resilience."
						</div>
					</div>
					<div>
						<h2 className="text-4xl md:text-5xl md:text-center font-semibold dark:text-white my-10 md:my-20">
							Category
						</h2>
						<div>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-5 py-10">
								{categories.map((category, i) => (
									<div
										className="relative group cursor-pointer"
										key={i}
									>
										<img
											src={category.img}
											alt=""
											className="w-full h-full rounded-3xl"
										/>
										<p className="absolute w-full h-full rounded-3xl top-0 text-opacity-0 hover:text-opacity-95 text-white text-center pt-14 group-hover:bg-slate-800 group-hover:bg-opacity-50">
											{category.imgTitle}
										</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Home;

const categories = [
	{ img: fitnessCat, imgTitle: "Fitness" },
	{ img: foodCat, imgTitle: "Food & Cooking" },
	{ img: lifestyleCat, imgTitle: "Lifestyle" },
	{ img: programmingCat, imgTitle: "Programming" },
	{ img: relationCat, imgTitle: "Relationship" },
	{ img: scienceCat, imgTitle: "Science" },
	{ img: techCat, imgTitle: "Technology" },
	{ img: travelCat, imgTitle: "Travel" },
];

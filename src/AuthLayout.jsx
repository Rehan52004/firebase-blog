import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useFirebase } from "./context/firebase";

function AuthLayout({ children, authentication = true }) {
	const user = useFirebase().current;
	const navigate = useNavigate();

	useEffect(() => {
		if (authentication) {
			if (!user) {
				navigate("/login");
			}
		} else if (!authentication) {
			if (user) {
				navigate("/");
			}
		}
	}, [user, navigate]);

	return <>{children}</>;
}

export default AuthLayout;

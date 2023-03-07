import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import { LoginPage } from "./pages/LoginPage/LoginPageContainer";
import { BoardPage } from "./pages/BoardPage/BoardPageContainer";

export const getRoutes = (isAuthenticated: boolean): JSX.Element => {
	let routes = (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="*" element={<Navigate to="/login" />} />
		</Routes>
	);

	if (isAuthenticated) {
		routes = (
			<Routes>
				<Route path="/" element={<BoardPage />} />
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		);

	}

	return routes;
}
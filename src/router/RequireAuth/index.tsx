import React from "react";
import {Navigate, useLocation} from "react-router-dom";

type Props = {
    isAuthenticated: boolean;
    children: JSX.Element;
};

const RequireAuth = ({children, isAuthenticated}: Props): JSX.Element => {
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" state={{from: location}}/>;
    }

    return children;
};

export default RequireAuth;

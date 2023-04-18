import React, { lazy, Suspense } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { useStyles } from "./styled";
import { Box, CircularProgress, Container } from "@mui/material";

import RequireAuth from "./RequireAuth";
import { useAppSelector } from "../hooks/redux";
import Header from "../components/Header";

const AuthPage = lazy(() => import("../pages/Auth"));

const SubjectsListPage = lazy(() => import("../pages/Subjects"));
const ClassGroupTablePage = lazy(() => import("../pages/ClassGroupTable"));
const StudyPlanSettingsPage = lazy(() => import("../pages/StudyPlanSettings"));
const GroupsPage = lazy(() => import("../pages/Groups"));

const AppRouter = (): JSX.Element => {
  const classes = useStyles();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const accessExists = !!localStorage.getItem("access");

  return (
    <Suspense
      fallback={
        <Container
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
          }}
        >
          <CircularProgress />
        </Container>
      }
    >
      <Routes>
        <Route
          path="/"
          element={
            <>
              {accessExists && <Header />}
              <Box className={classes.main}>
                <Outlet />
              </Box>
            </>
          }
        >
          <Route
            path="/*"
            element={
              <RequireAuth isAuthenticated={accessExists}>
                <Routes>
                  <Route path={"/subjects"} element={<SubjectsListPage />} />
                  <Route path={"/groups"} element={<GroupsPage />} />
                  <Route
                    path={"/subjects/:subjectId/study-plan"}
                    element={<StudyPlanSettingsPage />}
                  />
                  <Route
                    path={"class/:classId"}
                    element={<ClassGroupTablePage />}
                  />
                </Routes>
              </RequireAuth>
            }
          />
          <Route path="*" element={<h1>404</h1>} />
        </Route>

        <Route path="auth/login" element={<AuthPage />} />
        {/*<Route path="auth/register" element={<RegisterPage />} />*/}
      </Routes>
    </Suspense>
  );
};

export default AppRouter;

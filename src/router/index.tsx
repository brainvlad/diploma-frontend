import React, { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { useStyles } from "./styled";
import { Box, CircularProgress, Container } from "@mui/material";

import RequireAuth from "./RequireAuth";
import { useAppSelector } from "../hooks/redux";
import Header from "../components/Header";
import { getAuthUserData } from "../http/auth";

const AuthPage = lazy(() => import("../pages/Auth"));
const RegistrationPage = lazy(() => import("../pages/Registration"));
const ConfirmEmailPage = lazy(() => import("../pages/ConfirmEmail"));

const SubjectsListPage = lazy(() => import("../pages/Subjects"));
const ClassGroupTablePage = lazy(() => import("../pages/ClassGroupTable"));
const StudyPlanSettingsPage = lazy(() => import("../pages/StudyPlanSettings"));
const GroupsPage = lazy(() => import("../pages/Groups"));
const GroupsSettingsPage = lazy(() => import("../pages/Groups/GroupSettings"));
const ViewStatisticsPage = lazy(() => import("../pages/ViewStatistics"));

const SharedClassTable = lazy(() => import("../pages/Shared/ClassTable"));

const AppRouter = (): JSX.Element => {
  const classes = useStyles();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const accessExists = !!localStorage.getItem("access");

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getAuthUserData().then((res) => setUser(res.data));
  }, [isAuthenticated]);

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
              {accessExists && <Header userName={user?.firstName || "N"} />}
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
                  <Route
                    path={"/groups/*"}
                    element={
                      <Routes>
                        <Route index element={<GroupsPage />} />
                        <Route
                          path={":groupId"}
                          element={<GroupsSettingsPage />}
                        />
                      </Routes>
                    }
                  />
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
          {/*<Route*/}
          {/*  path="shared/*"*/}
          {/*  element={*/}
          {/*    <Box className={classes.main}>*/}
          {/*      <Outlet />*/}
          {/*    </Box>*/}
          {/*  }*/}
          {/*>*/}
          {/*  <Routes>*/}
          {/*    <Route*/}
          {/*      path={"/class-table/:classId"}*/}
          {/*      element={<SharedClassTable />}*/}
          {/*    />*/}
          {/*    <Route*/}
          {/*      path={"group-statistics/:id"}*/}
          {/*      element={<ViewStatisticsPage />}*/}
          {/*    />*/}
          {/*  </Routes>*/}
          {/*</Route>*/}
        </Route>

        <Route path="auth/login" element={<AuthPage />} />
        <Route
          path="auth/confirm-email/:token"
          element={<ConfirmEmailPage />}
        />
        <Route
          path={"shared/class-table/:classId"}
          element={<SharedClassTable />}
        />
        <Route
          path={"shred/group-statistics/:id"}
          element={<ViewStatisticsPage />}
        />
        <Route path="auth/register" element={<RegistrationPage />} />
      </Routes>
      <Routes>
        <Route path={"group-statistics/:id"} element={<ViewStatisticsPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;

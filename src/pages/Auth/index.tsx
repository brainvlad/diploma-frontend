import React, { useLayoutEffect, useState } from "react";
import {
  Paper,
  Stack,
  Container,
  Alert,
  Link,
  Typography,
} from "@mui/material";
import FormInputText from "../../components/FormInputText";
import ButtonSubmit from "../../components/ButtonSubmit";
import { useStyles } from "./styled";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import * as AuthTypes from "../../types/auth";
import { loginAction } from "../../store/reducers/Auth/ActionCreators";
import Logo from "../../components/Logo";
import { useNavigate } from "react-router-dom";
import { useAsyncFn } from "react-use";
import { login } from "../../http/auth";
import { AxiosError, isAxiosError } from "axios";

const Auth: React.FC = () => {
  const classes = useStyles();
  const [error, setError] = useState("");
  const { handleSubmit, control } = useForm<AuthTypes.Request.Login>();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [authState, run] = useAsyncFn(async (data: AuthTypes.Request.Login) => {
    try {
      const res = await login(data);

      dispatch(loginAction(res.data));
      if (res.status >= 200 && res.status < 400) {
        if (res.data.type === "ADMIN") {
          navigate("/admin-panel");
        }
      }
      return res.data;
    } catch (e) {
      if (isAxiosError(e)) {
        const serverError = e as AxiosError;
        console.log(serverError);
        setError(
          (Array.isArray((serverError as any)?.response?.data?.data?.message)
            ? (serverError as any)?.response?.data?.data?.message[0]
            : (serverError as any)?.response?.data?.data?.message) ||
            "Что-то пошло не так. Попробуйте позже, вероятно ошибка на сервере, мы скоро это починим"
        );
        throw serverError;
      }
      throw e;
    }
  });

  useLayoutEffect(() => {
    if (isAuthenticated) {
      navigate("/groups");
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Container>
      <Stack
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "200px",
        }}
        spacing={5}
      >
        <Paper className={classes.root}>
          <div style={{ margin: 50 }}>
            <Logo size={"large"} />
          </div>
          <Stack spacing={3}>
            {authState.error && !authState.loading && (
              <Alert severity="error">{error}</Alert>
            )}
            <FormInputText label={"E-Mail"} name={"email"} control={control} />
            <FormInputText
              label={"Пароль"}
              name={"password"}
              type={"password"}
              control={control}
            />
            <Link href={"/auth/register"}>
              <Typography variant="body1">{"Регистрация"}</Typography>
            </Link>
            <ButtonSubmit label={"Войти"} onClick={handleSubmit(run)} />
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default Auth;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAsyncFn } from "react-use";
import { confirmEmail } from "../../http/auth";
import { AxiosError, isAxiosError } from "axios";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import Logo from "../../components/Logo";

const ConfirmEmail = () => {
  const { token } = useParams();
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [state, run] = useAsyncFn(async (t: string) => {
    try {
      const res = await confirmEmail(t);

      return res.data;
    } catch (e) {
      if (isAxiosError(e)) {
        if (isAxiosError(e)) {
          const serverError = e as AxiosError;
          setError(
            (serverError as any)?.response?.data?.data?.message ||
              "Что-то пошло не так. Попробуйте позже, вероятно ошибка на сервере, мы скоро это починим"
          );
        }
        throw e;
      }
    }
  });

  useEffect(() => {
    if (token) {
      run(token);
    }
  }, [token]);

  return (
    <Container sx={{ marginTop: "200px", width: "450px" }}>
      <Stack alignItems={"center"} spacing={4}>
        <Box sx={{ padding: "0 100px" }}>
          <Logo size={"large"} />
        </Box>
        <Box sx={{ marginTop: "250px" }}>
          {state.loading ? (
            <CircularProgress />
          ) : !state.error ? (
            <Alert severity={"success"}>
              Поздравляем, Вы подтвердили свою электронную почту и можете
              пользоваться всеми возможностями нашего сервиса!
            </Alert>
          ) : null}

          {/*<Alert severity={"success"}>*/}
          {/*  Поздравляем, Вы подтвердили свою электронную почту и можете*/}
          {/*  пользоваться всеми возможностями нашего сервиса!*/}
          {/*</Alert>*/}
        </Box>
        <Box>
          <Link href={"/auth/login"}>
            <Typography variant="body1">{"Войти в личный кабинет"}</Typography>
          </Link>
        </Box>
      </Stack>
    </Container>
  );
};

export default ConfirmEmail;

import React, { useState } from "react";
import {
  Alert,
  Container,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Logo from "../../components/Logo";
import FormInputText from "../../components/FormInputText";
import ButtonSubmit from "../../components/ButtonSubmit";
import { useStyles } from "./styled";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { register } from "../../http/auth";
import { AxiosError, isAxiosError } from "axios";
import { toast } from "react-hot-toast";

const Registration = () => {
  const classes = useStyles();
  const [error, setError] = useState("");

  const { control, handleSubmit } = useForm();
  const [state, run] = useAsyncFn(async (data) => {
    try {
      const res = await register(data);

      if (res.status > 200 && res.status < 400) {
        const resData = res.data;
        toast.success(
          `${resData.middleName} ${resData.lastName}! Регистрация прошла успешно, на почту ${resData.email} была отправлена ссылка для подтверждения.`,
          { duration: 6000 }
        );
      }

      return res.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const serverError = error as AxiosError;
        setError(
          (serverError as any)?.response?.data?.data?.message ||
            "Что-то пошло не так. Попробуйте позже, вероятно ошибка на сервере, мы скоро это починим"
        );
      }
      throw error;
    }
  });

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
          <div
            style={{
              margin: 50,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Logo size={"large"} />
            <Typography variant={"h5"} sx={{ marginTop: 3 }}>
              Регистрация
            </Typography>
          </div>
          <Stack spacing={3}>
            {state.error && !state.loading && (
              <Alert severity="error">{error}</Alert>
            )}
            <FormInputText
              label={"Фамилия"}
              name={"firstName"}
              control={control}
            />
            <FormInputText
              label={"Имя"}
              name={"middleName"}
              control={control}
            />
            <FormInputText
              label={"Отчество"}
              name={"lastName"}
              control={control}
            />
            <FormInputText label={"E-Mail"} name={"email"} control={control} />
            <FormInputText
              label={"Пароль"}
              name={"password"}
              type={"password"}
              control={control}
            />
            <Link href={"/auth/login"}>
              <Typography variant="body1">
                {"Войти в личный кабинет"}
              </Typography>
            </Link>
            <ButtonSubmit
              label={"Зарегистрироваться"}
              onClick={handleSubmit(run)}
            />
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default Registration;

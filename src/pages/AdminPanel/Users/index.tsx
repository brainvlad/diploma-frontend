import React, { useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import { deactivate, getAllUsers, removeUser } from "../../../http/users";
import {
  Box,
  CircularProgress,
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Stack,
  IconButton,
  Button,
} from "@mui/material";
import { Cancel, Check } from "@mui/icons-material";
import ConfirmationDialog from "../../../components/ConfirmationDialog";

const Users = () => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [state, run] = useAsyncFn(async () => {
    const res = await getAllUsers();

    return res.data;
  });

  const [deactivateState, deactivateRun] = useAsyncFn(async (id) => {
    const res = await deactivate(id);
    run();

    return res.data;
  });

  const [removeState, removeRun] = useAsyncFn(async (id) => {
    const res = await removeUser(id);
    run();

    return res.data;
  });

  useEffect(() => {
    run();
  }, [run]);

  if (state.loading) {
    return (
      <Container>
        <Box sx={{ position: "absolute", top: "50%", left: "50%" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!state.loading && !state.error) {
    return (
      <Container>
        <ConfirmationDialog
          handleClose={() => setDeleteOpen(!deleteOpen)}
          handleAgree={() => removeRun(userId)}
          open={deleteOpen}
          content={`Вы действительно хотите безвозвратно удалить пользователя из системы?`}
          title={"Удалить пользователя"}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ФИО</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Активен</TableCell>
                <TableCell>Создан</TableCell>
                <TableCell>Действие</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.value?.map((u: any) => (
                <TableRow>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>
                    {u.firstName} {u.middleName} {u.lastName}
                  </TableCell>
                  <TableCell>
                    <Typography color={!u.verifiedAt ? "red" : "green"}>
                      {u.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {u.isActive ? (
                      <Check color={"success"} />
                    ) : (
                      <Cancel color={"error"} />
                    )}
                  </TableCell>
                  <TableCell>{u.createdAt}</TableCell>
                  <TableCell>
                    <Stack direction={"row"} spacing={1}>
                      <Button
                        color={u.isActive ? "error" : "primary"}
                        size={"small"}
                        onClick={() => deactivateRun(u.id)}
                      >
                        {u.isActive ? "Деактивировать" : "Активировать"}
                      </Button>
                      <Button
                        color={"error"}
                        size={"small"}
                        variant={"contained"}
                        onClick={() => {
                          setUserId(u.id);
                          setDeleteOpen(!deleteOpen);
                        }}
                      >
                        Удалить
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );
  }

  return null;
};

export default Users;

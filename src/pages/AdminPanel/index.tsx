import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthUserData } from "../../http/auth";
import { useAsyncFn } from "react-use";
import { OpenInNew as OpenInNewIcon } from "@mui/icons-material";
import {
  Accordion,
  AccordionSummary,
  Container,
  Divider,
  Stack,
  AccordionDetails,
  CircularProgress,
  TableContainer,
  TableBody,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  IconButton,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { getAllFaculties } from "../../http/faculty";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [facultiesExpanded, setFacultiesExpanded] = useState(false);

  const [state, run] = useAsyncFn(async () => {
    try {
      const res = await getAuthUserData();

      // console.log({ admin: res.data });

      if (res.data.type !== "ADMIN" && res.status >= 200 && res.status < 400) {
        navigate("/groups");
      }
      if (!(res.status >= 200 && res.status < 400)) {
        navigate("/auth/login");
      }

      return res.data;
    } catch (e) {
      throw e;
    }
  });

  const [faculties, getFaculties] = useAsyncFn(async () => {
    const res = await getAllFaculties();
    return res.data;
  });

  React.useEffect(() => {
    run();
  }, [run]);

  React.useEffect(() => {
    if (facultiesExpanded) {
      getFaculties();
    }
  }, [facultiesExpanded]);

  return (
    <Container>
      <Stack spacing={2.5}>
        <Stack spacing={1}>
          <Typography variant={"h6"}>Панель Администратора</Typography>
          <Divider />
        </Stack>

        <Stack>
          <Accordion onChange={() => setFacultiesExpanded(!facultiesExpanded)}>
            <AccordionSummary>
              <Typography variant={"h6"}>Факультеты</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {faculties.loading ? (
                <CircularProgress />
              ) : !faculties.error ? (
                <TableContainer>
                  <Table component={Paper}>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell>Сокращение</TableCell>
                        <TableCell>Изменить</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {faculties.value?.list?.length > 0
                        ? faculties.value?.list?.map((f: any) => (
                            <TableRow>
                              <TableCell>{f.id}</TableCell>
                              <TableCell>{f.name}</TableCell>
                              <TableCell>{f.shortName}</TableCell>
                              <TableCell>
                                <IconButton color={"primary"}>
                                  <OpenInNewIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        : null}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : null}
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Stack>
    </Container>
  );
};

export default AdminPanel;

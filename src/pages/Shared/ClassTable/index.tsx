import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAsyncFn } from "react-use";
import { getSharedGradesTableByClass } from "../../../http/classes";
import {
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import Container from "@mui/material/Container";
import CellWithGrade from "./components/CellWithGrade";
import { AxiosError, isAxiosError } from "axios";
import { toast } from "react-hot-toast";

const ClassTable = () => {
  const { classId } = useParams();
  const [errorMessage, setErrorMessage] = useState();

  const [state, run] = useAsyncFn(async (cId) => {
    try {
      const res = await getSharedGradesTableByClass(cId);

      return res.data as any;
    } catch (err) {
      if (isAxiosError(err)) {
        const serverErr = err as AxiosError;

        setErrorMessage((serverErr?.response?.data as any) || null);
      }
      throw err;
    }
  });

  useEffect(() => {
    if (classId) {
      run(classId).then((res) => console.log({ res }));

      console.log({ state });
    }
  }, [classId]);

  if (state.loading) {
    <Container
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
      }}
    >
      <CircularProgress />
    </Container>;
  }

  if (!state.error && !state.loading)
    return (
      <Container sx={{ paddingTop: 3 }}>
        <TableContainer>
          <Table component={(props) => <Paper {...props} elevation={3} />}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    width: "270px",
                    position: "sticky",
                    backgroundColor: "#ffffff",
                  }}
                >
                  Студент
                </TableCell>
                {state.value?.plan?.length > 0
                  ? state.value?.plan
                      ?.sort((a: any, b: any) => a.order - b.order)
                      .map((item: any) => (
                        <Tooltip title={item.topic}>
                          <TableCell sx={{ width: "50px" }}>
                            {item.order}
                          </TableCell>
                        </Tooltip>
                      ))
                  : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {state.value?.table && state.value?.table?.length
                ? state.value?.table?.map((row: any) => (
                    <TableRow>
                      <TableCell
                        sx={{
                          position: "sticky",
                          left: 0,
                          minWidth: "270px",
                          background: "#fff",
                        }}
                      >
                        {row.studentName}
                      </TableCell>
                      {row.grade && state.value?.plan?.length
                        ? state.value?.plan?.map((p: any) => {
                            return (
                              <CellWithGrade
                                grade={row.grade[p.id] || null}
                                criterias={p.criteria}
                              />
                            );
                          })
                        : null}
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    );

  if (errorMessage) {
    return (
      <Container sx={{ paddingTop: 5 }}>
        <Alert severity={"error"}>
          {((errorMessage as any)?.data as any)?.message ||
            "Что-то пошло не так, свяжитесь с администратором"}
        </Alert>
      </Container>
    );
  }

  return <h1></h1>;
};

export default ClassTable;

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAsyncFn } from "react-use";
import { getStatisticsViewById } from "../../http/statistics";
import {
  Container,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Stack,
  Typography,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from "@mui/material";
import Box from "@mui/material/Box";

const ViewStatistics = () => {
  const { id } = useParams();

  const [state, run] = useAsyncFn(async (id: string) => {
    const res = await getStatisticsViewById(id);

    return res.data;
  });

  useEffect(() => {
    if (id) {
      run(id);
    }
  }, [id]);

  if (!state.loading && !state.error)
    return (
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Stack spacing={2}>
              <Typography variant={"h5"}>Статистика по группе</Typography>
              <Divider />

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>№</TableCell>
                      <TableCell>Студент</TableCell>
                      <TableCell>Оценка</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state.value?.studentGrades?.length > 0
                      ? state.value?.studentGrades?.map(
                          (item: any, index: number) => {
                            return (
                              <TableRow>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.grade}</TableCell>
                              </TableRow>
                            );
                          }
                        )
                      : null}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack spacing={2}>
              <Typography variant={"h5"}>Список тем</Typography>
              <Divider />

              <Box>
                {state.value?.topics?.length > 0
                  ? state.value?.topics?.map((t: any) => {
                      return (
                        <Accordion>
                          <AccordionSummary>
                            <Typography>
                              №{t.order} - {t.topic}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>{t.decription}</Typography>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })
                  : null}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    );

  if (state.loading) {
    return (
      <Container
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return <h1>no data</h1>;
};

export default ViewStatistics;

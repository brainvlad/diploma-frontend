import React, { useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import { getAdminGroups } from "../../../http/groups";
import {
  Box,
  CircularProgress,
  Container,
  TableContainer,
  Table,
  TableHead,
  Accordion,
  AccordionSummary,
  Typography,
  Paper,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import * as _ from "lodash";
import AccordionDetails from "@mui/material/AccordionDetails";
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const GroupsList = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<number>(0);
  const [state, run] = useAsyncFn(async () => {
    const res = await getAdminGroups();
    setGroups(res.data.list);
    return res.data;
  });

  const navigate = useNavigate();

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
        {groups.length > 0
          ? Object.keys(_.groupBy(groups, "course")).map((key, index) => (
              <Accordion
                expanded={index === expanded}
                onChange={() => setExpanded(index)}
              >
                <AccordionSummary>
                  <Typography>{key} курс</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table size={"small"}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Имя</TableCell>
                          <TableCell>Факультет</TableCell>
                          <TableCell>Курс</TableCell>
                          <TableCell>Группа</TableCell>
                          <TableCell>Подгруппа</TableCell>
                          <TableCell>Создал</TableCell>
                          <TableCell>Доступ</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {_.groupBy(groups, "course")[key].map((g) => (
                          <TableRow
                            sx={{
                              "&:hover": {
                                backgroundColor: "#ececec",
                                cursor: "pointer",
                              },
                            }}
                            onClick={() => navigate(`/groups/${g.id}`)}
                          >
                            <TableCell>{g.name}</TableCell>
                            <TableCell>{g.facultyShortName || "-"}</TableCell>
                            <TableCell>{g.course}</TableCell>
                            <TableCell>{g.group}</TableCell>
                            <TableCell>{g.subGroup}</TableCell>
                            <TableCell>{g.createdName}</TableCell>
                            <TableCell>
                              {g.isShared ? (
                                <CheckCircleIcon color={"success"} />
                              ) : (
                                <CancelIcon color={"error"} />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))
          : null}
      </Container>
    );
  }

  return <h1>No data</h1>;
};
export default GroupsList;

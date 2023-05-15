import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { getGradesTableByClass } from "../../http/classes";
import CellWithGrade from "./components/CellWithGrade";
import Dialog from "../../components/Dialog";
import CreateStatisticsForm from "./components/CreateStatisticsForm";

const ClassGroupTable = () => {
  const { classId } = useParams();
  const [subjectName, setSubjectName] = useState<string>("");
  const [groupName, setGroupName] = useState<string>("");
  const [table, setTable] = useState<Array<any>>([]);
  const [plan, setPlan] = useState<Array<any>>([]);
  const [statistics, setStatistics] = useState(false);

  useEffect(() => {
    if (classId) {
      getGradesTableByClass(classId).then((res) => {
        setGroupName(res.data.groupName);
        setSubjectName(res.data.subjectName);
        setTable(res.data.table);
        setPlan(
          res.data.plan.sort(
            (a: { order: number }, b: { order: number }) => a.order - b.order
          )
        );
      });
    }
  }, [classId]);

  return (
    <Container>
      <Stack spacing={3}>
        <Paper sx={{ padding: 1 }}>
          <Stack spacing={1}>
            <Typography variant={"h5"}>{subjectName}</Typography>
            <Typography variant={"caption"}>Группа: {groupName}</Typography>
          </Stack>
        </Paper>

        <Stack direction={"row"} justifyContent={"space-between"}>
          <Button
            variant={"contained"}
            onClick={() => setStatistics(!statistics)}
          >
            Посмотреть статистику
          </Button>
          <Dialog
            open={statistics}
            handleClose={() => setStatistics(!statistics)}
            title={"Посмотреть статистику"}
            contentText={""}
            handleSubmit={() => setStatistics(!statistics)}
            showAction={false}
          >
            <CreateStatisticsForm
              studyPlan={plan.map((p) => ({
                id: p.id,
                topic: p.topic,
                order: p.order,
              }))}
              classId={classId!}
            />
          </Dialog>
        </Stack>
        <TableContainer component={Paper}>
          <Table size={"small"}>
            <TableHead>
              <TableRow>
                <TableCell>Студент</TableCell>
                {plan && plan.length
                  ? plan
                      .sort((a, b) => a.order - b.order)
                      .map((item) => (
                        <Tooltip title={item.topic}>
                          <TableCell>{item.order}</TableCell>
                        </Tooltip>
                      ))
                  : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {table && table.length
                ? table.map((row) => (
                    <TableRow>
                      <TableCell>{row.studentName}</TableCell>
                      {row.grade && plan?.length
                        ? plan.map((p) => (
                            <CellWithGrade
                              grade={row.grade[p.id] || null}
                              studentId={row.studentId}
                              planItemId={p.id}
                              criterias={p.criteria}
                            />
                          ))
                        : null}
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
};

export default ClassGroupTable;

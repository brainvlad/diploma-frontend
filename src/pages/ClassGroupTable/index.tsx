import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import {
  Paper,
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

const ClassGroupTable = () => {
  const { classId } = useParams();
  const [table, setTable] = useState<Array<any>>([]);
  const [plan, setPlan] = useState<Array<any>>([]);

  useEffect(() => {
    if (classId) {
      getGradesTableByClass(classId).then((res) => {
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
                            grade={row.grade[p.id]?.value || 0}
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
    </Container>
  );
};

export default ClassGroupTable;

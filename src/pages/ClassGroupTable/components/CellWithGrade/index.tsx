import React, { useState } from "react";
import { Box, TableCell, Tooltip, Typography } from "@mui/material";
import { CheckCircleOutline as DoneIcon } from "@mui/icons-material";
import { blueGrey, lightGreen } from "@mui/material/colors";
import CriteriaSettingsForm from "../CriteriaForm";
import Dialog from "../../../../components/Dialog";

type Props = {
  grade: any;
  topic: string;
  studentId: string;
  planItemId: string;
  criterias: any[];
  studentName: string;
  setGradeCallBack: () => void;
};

const CellWithGrade = ({
  grade,
  studentId,
  planItemId,
  criterias,
  topic,
  studentName,
  setGradeCallBack,
}: Props) => {
  const [openForm, setOpenForm] = useState(false);

  const criteriaTable: Record<string, number> = Object.fromEntries(
    criterias.map((c) => [c.id, (c.coefficient * 100) / 5])
  );
  const sumCoefficients = Object.values(criteriaTable).reduce(
    (a, b) => a + b,
    0
  );
  const gradesTable: Record<string, number> =
    grade !== null
      ? {
          ...Object.fromEntries(
            Object.keys(grade).map((key) => {
              return [grade[key].criteria.id, grade[key].value];
            })
          ),
          ...Object.fromEntries(
            Object.keys(grade).map((key) => {
              return ["done", grade[key].done];
            })
          ),
          ...Object.fromEntries(
            Object.keys(grade).map((key) => {
              return ["comment", grade[key].comment];
            })
          ),
        }
      : {};

  const calculatedGrade = (function () {
    let t = 0;
    Object.keys(gradesTable)
      .filter((key) => !["done", "comment"].includes(key))
      .forEach((key) => {
        t += (criteriaTable[key] * gradesTable[key]) / sumCoefficients;
      });
    return t;
  })();

  return (
    <>
      <TableCell
        sx={{
          "&:hover": {
            backgroundColor: blueGrey[50],
            cursor: criterias.length > 0 ? "pointer" : "not-allowed",
          },
          border: "1px solid #cccccc",
          backgroundColor: criterias.length > 0 ? "#fff" : blueGrey[50],
          ...(gradesTable.done ? { backgroundColor: lightGreen[100] } : {}),
          minWidth: "40px",
        }}
        onDoubleClick={() => {
          if (!openForm && criterias.length > 0) {
            setOpenForm(!openForm);
          } else {
            return;
          }
        }}
        // aria-disabled={openForm}
      >
        <Tooltip
          title={criterias.length > 0 ? null : "Не заданы критерии оценки"}
        >
          <Typography
            color={
              calculatedGrade > 40 && calculatedGrade > 0
                ? "#185319"
                : calculatedGrade === 0
                ? "none"
                : "red"
            }
          >
            {grade === null ? (
              0
            ) : criterias.filter((c) => c.name != "NO_NAME").length > 0 ? (
              calculatedGrade.toFixed(2)
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Tooltip title={"Сдано (без оценки)"}>
                  <DoneIcon color={"success"} />
                </Tooltip>
              </Box>
            )}
          </Typography>
        </Tooltip>
        <Dialog
          contentText={""}
          open={openForm}
          handleClose={() => setOpenForm(!openForm)}
          handleSubmit={() => setOpenForm(!openForm)}
          showAction={false}
          title={"Оценка"}
        >
          <CriteriaSettingsForm
            criteria={criterias}
            studentId={studentId}
            planItemId={planItemId}
            gradeTable={gradesTable}
            totalGradeStarted={grade === null ? 0 : +calculatedGrade.toFixed(2)}
            topic={topic}
            studentName={studentName}
            callback={() => {
              setGradeCallBack();
              setOpenForm(!openForm);
            }}
          />
        </Dialog>
      </TableCell>
    </>
  );
};

export default CellWithGrade;

import React, { useState } from "react";
import { TableCell, Tooltip, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import CriteriaSettingsForm from "../CriteriaForm";
import Dialog from "../../../../components/Dialog";

type Props = {
  grade: any;
  studentId: string;
  planItemId: string;
  criterias: any[];
};

const CellWithGrade = ({ grade, studentId, planItemId, criterias }: Props) => {
  const [openForm, setOpenForm] = useState(false);

  const criteriaTable: Record<string, number> = Object.fromEntries(
    criterias.map((c) => [c.id, c.coefficient * 100 / 5])
  );
  const sumCoefficients = Object.values(criteriaTable).reduce(
    (a, b) => a + b,
    0
  );
  const gradesTable: Record<string, number> =
    grade !== null
      ? Object.fromEntries(
          Object.keys(grade).map((key) => [
            grade[key].criteria.id,
            grade[key].value,
          ])
        )
      : {};

  console.log({ criteriaTable, gradesTable, sumCoefficients });

  const calculatedGrade = (function () {
    let t = 0;
    Object.keys(gradesTable).forEach((key) => {
      t += (criteriaTable[key] * gradesTable[key]) / sumCoefficients;
    });
    console.log({ t });
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
        }}
        onDoubleClick={() => {
          console.log({ criterias, grade });
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
          <Typography>{grade === null ? 0 : calculatedGrade}</Typography>
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
          />
        </Dialog>
      </TableCell>
    </>
  );
};

export default CellWithGrade;

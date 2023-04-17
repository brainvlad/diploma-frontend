import React from "react";
import { TableCell } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

type Props = {
  grade: any;
  studentId: string;
  planItemId: string;
  criterias: any[];
};

const CellWithGrade = ({ grade, studentId, planItemId, criterias }: Props) => {
  return (
    <TableCell
      sx={{
        "&:hover": {
          backgroundColor: blueGrey[50],
          cursor: "pointer",
        },
        border: "1px solid #cccccc",
      }}
      onClick={() =>
        console.log({
          grade,
          studentId,
          planItemId,
          criterias,
        })
      }
    >
      {grade}
    </TableCell>
  );
};

export default CellWithGrade;

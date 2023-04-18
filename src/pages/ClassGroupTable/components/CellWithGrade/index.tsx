import React, { useState } from "react";
import { TableCell, Typography } from "@mui/material";
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

  return (
    <>
      <TableCell
        sx={{
          "&:hover": {
            backgroundColor: blueGrey[50],
            cursor: "pointer",
          },
          border: "1px solid #cccccc",
        }}
        onDoubleClick={() => {
          if (!openForm) {
            setOpenForm(!openForm);
          } else {
            return;
          }
        }}
        // aria-disabled={openForm}
      >
        <Typography>{grade}</Typography>
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

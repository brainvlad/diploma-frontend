import React, { useState } from "react";
import { TableCell } from "@mui/material";
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

  const UpdateForm = () => (
    <CriteriaSettingsForm
      criteria={criterias}
      studentId={studentId}
      planItemId={planItemId}
    />
  );

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
        onClick={() => setOpenForm(true)}
      >
        {grade}

        <Dialog
          contentText={""}
          open={openForm}
          handleClose={() => setOpenForm(false)}
          handleSubmit={() => setOpenForm(false)}
          showAction={false}
          title={"Оценка"}
        >
          <UpdateForm />
        </Dialog>
      </TableCell>
    </>
  );
};

export default CellWithGrade;

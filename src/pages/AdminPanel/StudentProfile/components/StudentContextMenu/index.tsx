import React, { useEffect } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import ConfirmationDialog from "../../../../../components/ConfirmationDialog";
import { useAsyncFn } from "react-use";
import { deleteStudent, getStudentById } from "../../../../../http/students";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

type Props = {
  studentId: string;
};

const StudentContextMenu = ({ studentId }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setDeleteOpen(!deleteOpen);
  };

  const navigate = useNavigate();

  const [fetchStudentState, fetchStudent] = useAsyncFn(async (sId: string) => {
    const res = await getStudentById(sId);
    return res.data;
  });

  const [deleteStudentState, deleteStudentRun] = useAsyncFn(
    async (sId: string) => {
      const res = await deleteStudent(sId);

      if (res.status >= 200 && res.status < 400) {
        navigate(-1);
        toast.success(`Студент был удален успешно из базы`);
      }

      return res.data;
    }
  );

  useEffect(() => {
    if (deleteOpen) {
      fetchStudent(studentId);
    }
  }, [deleteOpen, fetchStudent]);

  if (!fetchStudentState.loading && !fetchStudentState.error)
    return (
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          НАСТРОЙКИ
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleClose}>
            <DeleteIcon color={"error"} />
            Удалить
          </MenuItem>
        </Menu>
        <ConfirmationDialog
          handleClose={() => setDeleteOpen(!deleteOpen)}
          handleAgree={() => {
            deleteStudentRun(studentId);
          }}
          open={deleteOpen}
          content={`Вы удалите студента <<${fetchStudentState.value?.firstName} ${fetchStudentState.value?.middleName} ${fetchStudentState.value?.lastName}>> и все данные о его оценках также будут удалены`}
          title={"Удаление студента"}
        />
      </div>
    );

  return null;
};

export default StudentContextMenu;

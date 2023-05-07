import React, { useEffect, useState } from "react";
import {
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Typography,
  Button,
  TextareaAutosize,
  Checkbox,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { setStudentGrade } from "../../../../http/classes";
import { useAsyncFn } from "react-use";

type Props = {
  criteria: Array<any>;
  totalGradeStarted: number;
  studentId: string;
  planItemId: string;
  gradeTable: any;
};

const CriteriaSettingsForm = ({
  criteria,
  studentId,
  gradeTable,
  totalGradeStarted,
}: Props) => {
  const [totalGrade, setTotalGrade] = useState(totalGradeStarted);
  const [criteriaTable, setCriteriaTable] = useState<Record<string, number>>(
    {}
  );
  const [inputCriteria, setInputCriteria] = useState<Record<string, number>>({
    ...Object.fromEntries(
      Object.keys(gradeTable)
        .filter((key) => !["done", "comment"].includes(key))
        .map((key) => [key, gradeTable[key]])
    ),
  });

  const { register, setValue, handleSubmit } = useForm();

  const sendRequestForSetStudentGrade = async (data: any) => {
    const grades: any[] = [];
    Object.keys(data).map((key) => {
      if (!["comment", "done"].includes(key)) {
        grades.push(
          Object.fromEntries([
            ["criteriaEvalutationId", key],
            ["studentId", studentId],
            ["value", data[key]],
          ])
        );
      }
    });
    await setStudentGrade({ grades, done: data.done, comment: data.comment });
  };

  useEffect(() => {
    if (criteria.length > 0) {
      const table: any[] = [];
      criteria.forEach((c) => {
        table.push([c.id, (c.coefficient * 100) / 5]);
      });

      setCriteriaTable(Object.fromEntries(table));

      criteria.forEach((c) => {
        register(c.id, { value: 0 || gradeTable[c.id] });
      });

      register("comment", { value: gradeTable.comment });
      register("done", { value: gradeTable.done });
    }
  }, []);

  return (
    <div>
      <Stack spacing={2} width={500}>
        {criteria.map((c) => (
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography>{c.name}</Typography>

            <TextField
              type={"number"}
              label={"Процент выполнения"}
              inputProps={{ max: 100, min: 0 }}
              size={"small"}
              defaultValue={(function () {
                if (gradeTable[c.id] > 0) {
                  return gradeTable[c.id];
                } else {
                  return 0;
                }
              })()}
              onChange={(e) => {
                if (+e.target.value > 100) {
                  e.target.value = String(100);
                }

                const inputTable: Record<string, number> = {
                  ...inputCriteria,
                  [c.id]: gradeTable[c.id] || +e.target.value,
                };
                setInputCriteria(inputTable);

                const sum = Object.values(criteriaTable).reduce(
                  (a, b) => a + b,
                  0
                );

                let t = 0;
                Object.keys(criteriaTable).forEach((key) => {
                  t = t + (criteriaTable[key] * (inputTable[key] || 0)) / sum;
                });
                setTotalGrade(t);
                t = 0;
                setValue(c.id, +e.target.value);
              }}
            />
          </Stack>
        ))}
        <TextField
          multiline
          label={"Комментарий"}
          fullWidth
          rows={4}
          onChange={(e) => setValue("comment", e.target.value || "")}
          defaultValue={gradeTable.comment || ""}
        />
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) => setValue("done", e.target.checked)}
              defaultChecked={gradeTable.done || false}
            />
          }
          label="Сдано"
        />
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant={"h6"}>Итоговая оценка:</Typography>
          <Typography variant={"h5"} color={totalGrade < 40 ? "red" : "green"}>
            {totalGrade.toFixed(2)}
          </Typography>
        </Stack>
        <Button
          variant={"outlined"}
          onClick={handleSubmit(sendRequestForSetStudentGrade)}
        >
          Сохранить
        </Button>
      </Stack>
    </div>
  );
};

export default CriteriaSettingsForm;

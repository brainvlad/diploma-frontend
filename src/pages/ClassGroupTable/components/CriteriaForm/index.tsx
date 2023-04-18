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
} from "@mui/material";
import { useForm } from "react-hook-form";
import { setStudentGrade } from "../../../../http/classes";

type Props = {
  criteria: Array<any>;
  studentId: string;
  planItemId: string;
};

const CriteriaSettingsForm = ({ criteria, studentId }: Props) => {
  const [totalGrade, setTotalGrade] = useState(0);
  const [criteriaTable, setCriteriaTable] = useState<Record<string, number>>(
    {}
  );
  const [inputCriteria, setInputCriteria] = useState<Record<string, number>>(
    {}
  );

  const { register, setValue, handleSubmit } = useForm();

  const sendRequestForSetStudentGrade = async (data: any) => {
    const grades: any[] = [];
    Object.keys(data).map((key) => {
      if (key !== "comment") {
        grades.push(
          Object.fromEntries([
            ["criteriaEvalutationId", key],
            ["studentId", studentId],
            ["value", data[key]],
          ])
        );
      }
    });
    await setStudentGrade({ grades });
  };

  useEffect(() => {
    if (criteria.length > 0) {
      const table: any[] = [];
      criteria.forEach((c) => {
        table.push([c.id, (c.coefficient * 100) / 5]);
      });

      setCriteriaTable(Object.fromEntries(table));

      criteria.forEach((c) => {
        register(c.id);
      });
      register("comment");
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
              defaultValue={0}
              onChange={(e) => {
                const inputTable: Record<string, number> = {
                  ...inputCriteria,
                  [c.id]: +e.target.value,
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
        />
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant={"h6"}>Итоговая оценка:</Typography>
          <Typography variant={"h5"} color={totalGrade < 40 ? "red" : "green"}>
            {totalGrade}
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

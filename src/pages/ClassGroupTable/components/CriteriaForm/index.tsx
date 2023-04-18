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

type Props = {
  criteria: Array<any>;
  studentId: string;
  planItemId: string;
};

const CriteriaSettingsForm = ({ criteria }: Props) => {
  const [totalGrade, setTotalGrade] = useState(0);
  const [criteriaTable, setCriteriaTable] = useState<Record<string, number>>(
    {}
  );
  const [inputCriteria, setInputCriteria] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    if (criteria.length > 0) {
      const table: any[] = [];
      criteria.forEach((c) => {
        table.push([c.id, (c.coefficient * 100) / 5]);
      });

      setCriteriaTable(Object.fromEntries(table));
    }
  }, []);

  const { register, handleSubmit, setValue } = useForm();

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
              }}
            />
          </Stack>
        ))}
        <TextField multiline label={"Комментарий"} fullWidth rows={4} />
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
        <Button variant={"outlined"}>Сохранить</Button>
      </Stack>
    </div>
  );
};

export default CriteriaSettingsForm;

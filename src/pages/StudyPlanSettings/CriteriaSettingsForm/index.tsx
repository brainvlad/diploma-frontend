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
} from "@mui/material";
import { createNewCriteria, getPlanDataById } from "../../../http/study-plan";
import { useForm } from "react-hook-form";

type Props = {
  planItemId: string;
  open: boolean;
};

const CriteriaSettingsForm = ({ planItemId, open }: Props) => {
  const [planItem, setPlanItem] = useState<Record<any, any>>({});

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      criteria1: {
        name: planItem?.CriteriaEvaluation?.[0]?.name || "",
        coefficient: planItem?.CriteriaEvaluation?.[0]?.coefficient || 1,
      },
      criteria2: {
        name: planItem?.CriteriaEvaluation?.[1]?.name || "",
        coefficient: planItem?.CriteriaEvaluation?.[1]?.coefficient || 1,
      },
      criteria3: {
        name: planItem?.CriteriaEvaluation?.[2]?.name || "",
        coefficient: planItem?.CriteriaEvaluation?.[2]?.coefficient || 1,
      },
    },
  });

  const sendNewCriteriaInfo = (
    data: { [s: string]: unknown } | ArrayLike<unknown>
  ) => {
    createNewCriteria({
      studyPlanItemId: planItemId,
      criteria: Object.values(data),
    });
  };

  useEffect(() => {
    if (open && planItemId) {
      getPlanDataById(planItemId).then((res) => setPlanItem(res.data.planItem));
    }

    register("criteria1.name");
    register("criteria1.coefficient");
    register("criteria2.name");
    register("criteria2.coefficient");
    register("criteria3.name");
    register("criteria3.coefficient");
  }, [planItemId]);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item>
          <Typography variant={"h5"}>{planItem?.topic || ""}</Typography>
          <Typography>{planItem?.description || ""}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Stack direction={"row"} alignItems={"center"} spacing={4}>
            <TextField
              label={"Название"}
              onChange={(e) => setValue("criteria1.name", e.target.value)}
              defaultValue={
                planItem?.CriteriaEvaluation?.length > 0
                  ? planItem?.CriteriaEvaluation?.[0].name
                  : null
              }
            />

            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Весовой коэффициент
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={
                  planItem?.CriteriaEvaluation?.length > 0
                    ? planItem?.CriteriaEvaluation?.[0].coefficient
                    : 1
                }
                onChange={(e) =>
                  setValue("criteria1.coefficient", +e.target.value)
                }
                name="radio-buttons-group"
                row
              >
                <FormControlLabel value="1" control={<Radio />} label="1" />
                <FormControlLabel value="2" control={<Radio />} label="2" />
                <FormControlLabel value="3" control={<Radio />} label="3" />
                <FormControlLabel value="4" control={<Radio />} label="4" />
                <FormControlLabel value="5" control={<Radio />} label="5" />
              </RadioGroup>
            </FormControl>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction={"row"} alignItems={"center"} spacing={4}>
            <TextField
              label={"Название"}
              onChange={(e) => setValue("criteria2.name", e.target.value)}
              defaultValue={
                planItem?.CriteriaEvaluation?.length > 1
                  ? planItem?.CriteriaEvaluation?.[1].name
                  : ""
              }
            />

            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Весовой коэффициент
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                onChange={(e) =>
                  setValue("criteria2.coefficient", +e.target.value)
                }
                defaultValue={
                  planItem?.CriteriaEvaluation?.length > 1
                    ? planItem?.CriteriaEvaluation?.[1].coefficient
                    : 1
                }
                name="radio-buttons-group"
                row
              >
                <FormControlLabel value="1" control={<Radio />} label="1" />
                <FormControlLabel value="2" control={<Radio />} label="2" />
                <FormControlLabel value="3" control={<Radio />} label="3" />
                <FormControlLabel value="4" control={<Radio />} label="4" />
                <FormControlLabel value="5" control={<Radio />} label="5" />
              </RadioGroup>
            </FormControl>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction={"row"} alignItems={"center"} spacing={4}>
            <TextField
              label={"Название"}
              onChange={(e) => setValue("criteria3.name", e.target.value)}
              defaultValue={
                planItem?.CriteriaEvaluation?.length > 1
                  ? planItem?.CriteriaEvaluation?.[2].name
                  : ""
              }
            />

            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Весовой коэффициент
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                onChange={(e) =>
                  setValue("criteria3.coefficient", +e.target.value)
                }
                defaultValue={
                  planItem?.CriteriaEvaluation?.length > 1
                    ? planItem?.CriteriaEvaluation?.[2].coefficient
                    : 1
                }
                name="radio-buttons-group"
                row
              >
                <FormControlLabel value="1" control={<Radio />} label="1" />
                <FormControlLabel value="2" control={<Radio />} label="2" />
                <FormControlLabel value="3" control={<Radio />} label="3" />
                <FormControlLabel value="4" control={<Radio />} label="4" />
                <FormControlLabel value="5" control={<Radio />} label="5" />
              </RadioGroup>
            </FormControl>
          </Stack>
        </Grid>
        <Grid item>
          <Button
            variant={"contained"}
            onClick={handleSubmit(sendNewCriteriaInfo)}
          >
            Сохранить
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default CriteriaSettingsForm;
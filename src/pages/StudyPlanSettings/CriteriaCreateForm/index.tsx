import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Stack,
  TextField,
  Radio,
  RadioGroup,
  CircularProgress,
  Container,
  Button,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { useAsyncFn } from "react-use";
import {
  addNewItemStudyPlan,
  createNewCriteria,
  getPlanDataById,
} from "../../../http/study-plan";

type Props = {
  planItemId: string | null;
  open: boolean;
  callback: () => void;
  subjectId?: string;
};

const CriteriaCreateForm = ({
  planItemId,
  open,
  callback,
  subjectId,
}: Props) => {
  const isDesktop = useMediaQuery("(min-width:600px)");
  const [topicName, setTopicName] = useState("");
  const [order, setOrder] = useState(1);

  const [description, setDescription] = useState<string | null>(null);

  const [criterias, setCriterias] = useState<any>([
    { name: "", coefficient: 1 },
    { name: "", coefficient: 1 },
    { name: "", coefficient: 1 },
  ]);

  const [state, run] = useAsyncFn(async (piId) => {
    const res = await getPlanDataById(piId);

    const data = {
      items: [0, 1, 2].map((i) => {
        if (res.data.planItem.CriteriaEvaluation[i]) {
          return res.data.planItem.CriteriaEvaluation[i];
        } else {
          return { name: "", coefficient: 1 };
        }
      }),
      topic: res.data.planItem.topic,
      order: res.data.planItem.order,
      description: res.data.planItem.description,
      id: res.data.planItem.id,
    };

    setCriterias(data.items);
    setTopicName(data.topic);
    setOrder(data.order);
    setDescription(res.data.planItem.description);

    return data;
  });

  useEffect(() => {
    if (planItemId && open) {
      run(planItemId);
    }
  }, [planItemId]);

  if (state.loading) {
    return (
      <Container
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  const sendNewData = async () => {
    await createNewCriteria({
      criteria: criterias.filter((c: any) => !!c.name),
      studyPlanItemId: planItemId,
      topic: topicName,
      order: order,
      description,
    });
    run(planItemId);
    callback();
  };

  const createNewItemData = async () => {
    console.log({ description });
    if (subjectId) {
      await addNewItemStudyPlan({
        subjectId,
        topic: topicName,
        order,
        description: description || "",
      }).then((res) => {
        createNewCriteria({
          criteria: criterias.filter((c: any) => !!c.name),
          studyPlanItemId: res.data.id,
          topic: topicName,
          description,
          order: order,
        });
        run(planItemId);
        callback();
      });
    }
  };

  if (!state.loading && !state.error) {
    return (
      <Stack spacing={1} sx={{ marginTop: 3 }}>
        <Grid container spacing={1} sx={{ marginTop: 2, marginBottom: 2 }}>
          <Grid item xs={9}>
            <TextField
              label={"Название"}
              fullWidth
              defaultValue={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              size={"small"}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label={"Номер"}
              inputProps={{
                type: "number",
                min: order + 1,
              }}
              onChange={(e) => setOrder(+e.target.value)}
              size={"small"}
              fullWidth={isDesktop}
              defaultValue={order}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={"Описание темы"}
              size={"small"}
              multiline
              fullWidth
              rows={3}
              defaultValue={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
        </Grid>
        {[0, 1, 2].map((i) => (
          <Stack direction={isDesktop ? "row" : "column"} spacing={2}>
            <TextField
              label={"Название"}
              defaultValue={
                state.value?.items[i]?.name !== "NO_NAME"
                  ? state.value?.items[i]?.name
                  : ""
              }
              onChange={(e) => {
                setCriterias(
                  criterias.map((c: any, index: number) => {
                    if (index === i) {
                      return { ...c, name: e.target.value };
                    }
                    return c;
                  })
                );
              }}
              size={"medium"}
              variant={"standard"}
            />

            <FormControl size={isDesktop ? "medium" : "small"}>
              <FormLabel id="rate">Коэффициент</FormLabel>
              <RadioGroup
                row
                aria-labelledby="rate"
                defaultValue={
                  state.value?.items[i]?.name !== "NO_NAME"
                    ? state.value?.items[i]?.coefficient
                    : 1
                }
                onChange={(e) => {
                  setCriterias(
                    criterias.map((c: any, index: number) => {
                      if (index === i) {
                        return { ...c, coefficient: +e.target.value || 1 };
                      }
                      return c;
                    })
                  );
                }}
              >
                <FormControlLabel value={1} control={<Radio />} label="1" />
                <FormControlLabel value={2} control={<Radio />} label="2" />
                <FormControlLabel value={3} control={<Radio />} label="3" />
                <FormControlLabel value={4} control={<Radio />} label="4" />
                <FormControlLabel value={5} control={<Radio />} label="5" />
              </RadioGroup>
            </FormControl>
          </Stack>
        ))}
        <Button
          variant={"contained"}
          onClick={subjectId && !planItemId ? createNewItemData : sendNewData}
        >
          Сохранить
        </Button>
      </Stack>
    );
  }

  return <h1>not data</h1>;
};

export default CriteriaCreateForm;

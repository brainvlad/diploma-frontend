import React from 'react';
import { TableCell, Tooltip, Typography } from '@mui/material';
import { blueGrey, lightGreen } from '@mui/material/colors';

type Props = {
  grade: any;
  criterias: any;
};

const CellWithGrade = ({ grade, criterias }: Props) => {
  const criteriaTable: Record<string, number> = Object.fromEntries(
    criterias.map((c: any) => [c.id, (c.coefficient * 100) / 5]),
  );
  const sumCoefficients = Object.values(criteriaTable).reduce(
    (a, b) => a + b,
    0,
  );
  const gradesTable: Record<string, number> =
    grade !== null
      ? {
        ...Object.fromEntries(
          Object.keys(grade).map((key) => {
            return [grade[key].criteria.id, grade[key].value];
          }),
        ),
        ...Object.fromEntries(
          Object.keys(grade).map((key) => {
            return ['done', grade[key].done];
          }),
        ),
        ...Object.fromEntries(
          Object.keys(grade).map((key) => {
            return ['comment', grade[key].comment];
          }),
        ),
      }
      : {};

  const calculatedGrade = (function () {
    let t = 0;
    Object.keys(gradesTable)
      .filter((key) => !['done', 'comment'].includes(key))
      .forEach((key) => {
        t += (criteriaTable[key] * gradesTable[key]) / sumCoefficients;
      });
    return t;
  })();

  return (
    <>
      <TableCell
        sx={{
          border: '1px solid #cccccc',
          backgroundColor: criterias.length > 0 ? '#fff' : blueGrey[50],
          ...(gradesTable.done ? { backgroundColor: lightGreen[100] } : {}),
          minWidth: '40px',
        }}
        // aria-disabled={openForm}
      >
        <Tooltip
          title={criterias.length > 0 ? null : 'Не заданы критерии оценки'}
        >
          <Typography
            color={
              calculatedGrade > 40 && calculatedGrade > 0
                ? 'green'
                : calculatedGrade === 0
                  ? 'none'
                  : 'red'
            }
          >
            {grade === null ? 0 : calculatedGrade.toFixed(2)}
          </Typography>
        </Tooltip>
      </TableCell>
    </>
  );
};

export default CellWithGrade;

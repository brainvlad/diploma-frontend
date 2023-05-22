import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: 0,
      // backgroundColor: "rgba(255,255,255,0.9)",
    },
    main: {
      padding: theme.spacing(3),
      // backgroundColor: "rgba(255,255,255,0.9)",
    },
  }),
);

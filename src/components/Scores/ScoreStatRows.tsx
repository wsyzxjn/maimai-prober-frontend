import { Image, NumberFormatter, Progress, Stack, Text } from "@mantine/core";
import classes from "./StatisticsSection.module.css";

interface ScoreStatRow {
  count: number;
  icon: string;
  iconHeight?: number;
  id: string;
}

interface ScoreStatRowsProps {
  defaultIconHeight: number;
  rows: ScoreStatRow[];
  total: number;
}

const percent = (count: number, total: number) => (total === 0 ? 0 : (count / total) * 100);

export const ScoreStatRows = ({ defaultIconHeight, rows, total }: ScoreStatRowsProps) => {
  return (
    <Stack gap={6} className={classes.detailGroup}>
      {rows.map((row) => (
        <div key={row.id} className={classes.statRow}>
          <Image
            className={classes.statIcon}
            src={row.icon}
            h={row.iconHeight ?? defaultIconHeight}
            w="auto"
          />
          <Progress
            className={classes.statProgress}
            value={percent(row.count, total)}
            radius="xl"
            size="sm"
          />
          <Text fz="lg" className={classes.statValue}>
            <NumberFormatter value={row.count} thousandSeparator />
            <Text span c="dimmed" fz="md">
              {" "}
              / <NumberFormatter value={total} thousandSeparator />
            </Text>
          </Text>
        </div>
      ))}
    </Stack>
  );
};

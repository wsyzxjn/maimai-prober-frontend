import { Box, Card, Flex, Grid, Spoiler, Text } from "@mantine/core";
import { useMemo } from "react";
import classes from "../StatisticsSection.module.css";
import { ScoreStatRows } from "../ScoreStatRows";
import { useMediaQuery } from "@mantine/hooks";
import { MaimaiScoreProps } from "@/types/score";

const rate = [
  { id: "sssp", min: 100.5, max: Infinity },
  { id: "sss", min: 100, max: 100.5 },
  { id: "ssp", min: 99.5, max: 100 },
  { id: "ss", min: 99, max: 99.5 },
  { id: "sp", min: 98, max: 99 },
  { id: "s", min: 97, max: 98 },
  { id: "aaa", min: 94, max: 97 },
  { id: "aa", min: 90, max: 94 },
  { id: "a", min: 80, max: 90 },
];

const fc = ["app", "ap", "fcp", "fc"];
const fs = ["fsdp", "fsd", "fsp", "fs"];

const addCumulativeCount = (counts: number[], startIndex: number) => {
  for (let index = startIndex; index < counts.length; index++) {
    counts[index]++;
  }
};

const RateStatistics = ({ rows, total }: { rows: number[]; total: number }) => {
  return (
    <ScoreStatRows
      defaultIconHeight={30}
      rows={rate.map((r, index) => ({
        count: rows[index],
        icon: `/assets/maimai/music_rank/${r.id}.webp`,
        id: r.id,
      }))}
      total={total}
    />
  );
};

const FullComboStatistics = ({ rows, total }: { rows: number[]; total: number }) => {
  return (
    <ScoreStatRows
      defaultIconHeight={30}
      rows={fc.map((r, index) => ({
        count: rows[index],
        icon: `/assets/maimai/music_icon/${r}.webp`,
        id: r,
      }))}
      total={total}
    />
  );
};

const FullSyncStatistics = ({ rows, total }: { rows: number[]; total: number }) => {
  return (
    <ScoreStatRows
      defaultIconHeight={30}
      rows={fs.map((r, index) => ({
        count: rows[index],
        icon: `/assets/maimai/music_icon/${r}.webp`,
        id: r,
      }))}
      total={total}
    />
  );
};

const useStatistics = (scores: MaimaiScoreProps[]) => {
  return useMemo(() => {
    const cumulativeRateCounts = Array(rate.length).fill(0) as number[];
    const cumulativeFcCounts = Array(fc.length).fill(0) as number[];
    const cumulativeFsCounts = Array(fs.length).fill(0) as number[];

    for (const score of scores) {
      for (let index = 0; index < rate.length; index++) {
        if (score.achievements >= rate[index].min) {
          cumulativeRateCounts[index]++;
        }
      }

      const fcIndex = fc.indexOf(score.fc);
      if (fcIndex !== -1) {
        addCumulativeCount(cumulativeFcCounts, fcIndex);
      }

      const fsIndex = fs.indexOf(score.fs);
      if (fsIndex !== -1) {
        addCumulativeCount(cumulativeFsCounts, fsIndex);
      }
    }

    return {
      rateCounts: cumulativeRateCounts,
      fcCounts: cumulativeFcCounts,
      fsCounts: cumulativeFsCounts,
    };
  }, [scores]);
};

export const MaimaiStatisticsSection = ({ scores }: { scores: MaimaiScoreProps[] }) => {
  const extraSmall = useMediaQuery("(max-width: 28rem)");
  const statistics = useStatistics(scores);

  return (
    <Card withBorder radius="md">
      <Spoiler maxHeight={110} showLabel="显示详细分布..." hideLabel="隐藏详细分布">
        <Grid gap="xl">
          <Grid.Col span={extraSmall ? 12 : 6}>
            <Text size="lg" fw={700} mb="xs">
              达成率
            </Text>
            <RateStatistics rows={statistics.rateCounts} total={scores.length} />
          </Grid.Col>
          <Grid.Col span={extraSmall ? 12 : 6}>
            <Flex className={classes.fullComboSyncSection} gap="md">
              <Box w="100%">
                <Text size="lg" fw={700} mb="xs">
                  连击
                </Text>
                <FullComboStatistics rows={statistics.fcCounts} total={scores.length} />
              </Box>
              <Box w="100%">
                <Text size="lg" fw={700} mb="xs">
                  同步
                </Text>
                <FullSyncStatistics rows={statistics.fsCounts} total={scores.length} />
              </Box>
            </Flex>
          </Grid.Col>
        </Grid>
      </Spoiler>
    </Card>
  );
};

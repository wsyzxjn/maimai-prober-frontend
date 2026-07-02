import { Card, Grid, Spoiler, Text } from "@mantine/core";
import { useMemo } from "react";
import { ScoreStatRows } from "../ScoreStatRows";
import { useMediaQuery } from "@mantine/hooks";
import { ChunithmScoreProps } from "@/types/score";

const rate = [
  { id: "sssp", min: 1009000, max: Infinity },
  { id: "sss", min: 1007500, max: 1009000 },
  { id: "ssp", min: 1005000, max: 1007500 },
  { id: "ss", min: 1000000, max: 1005000 },
  { id: "sp", min: 990000, max: 1000000 },
  { id: "s", min: 975000, max: 990000 },
  { id: "aaa", min: 950000, max: 975000 },
  { id: "aa", min: 925000, max: 950000 },
  { id: "a", min: 900000, max: 925000 },
];

const fullCombo = ["alljusticecritical", "alljustice", "fullcombo"];

const addCumulativeCount = (counts: number[], startIndex: number) => {
  for (let index = startIndex; index < counts.length; index++) {
    counts[index]++;
  }
};

const RateStatistics = ({ rows, total }: { rows: number[]; total: number }) => {
  return (
    <ScoreStatRows
      defaultIconHeight={18}
      rows={rate.map((r, index) => ({
        count: rows[index],
        icon: `/assets/chunithm/music_rank/${r.id}_s.webp`,
        id: r.id,
      }))}
      total={total}
    />
  );
};

const FullComboStatistics = ({ rows, total }: { rows: number[]; total: number }) => {
  return (
    <ScoreStatRows
      defaultIconHeight={18}
      rows={fullCombo.map((r, index) => ({
        count: rows[index],
        icon: `/assets/chunithm/music_icon/${r}_s.webp`,
        id: r,
      }))}
      total={total}
    />
  );
};

const useStatistics = (scores: ChunithmScoreProps[]) => {
  return useMemo(() => {
    const cumulativeRateCounts = Array(rate.length).fill(0) as number[];
    const cumulativeFullComboCounts = Array(fullCombo.length).fill(0) as number[];

    for (const score of scores) {
      for (let index = 0; index < rate.length; index++) {
        if (score.score >= rate[index].min) {
          cumulativeRateCounts[index]++;
        }
      }

      const fullComboIndex = fullCombo.indexOf(score.full_combo);
      if (fullComboIndex !== -1) {
        addCumulativeCount(cumulativeFullComboCounts, fullComboIndex);
      }
    }

    return {
      rateCounts: cumulativeRateCounts,
      fullComboCounts: cumulativeFullComboCounts,
    };
  }, [scores]);
};

export const ChunithmStatisticsSection = ({ scores }: { scores: ChunithmScoreProps[] }) => {
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
            <Text size="lg" fw={700} mb="xs">
              连击
            </Text>
            <FullComboStatistics rows={statistics.fullComboCounts} total={scores.length} />
          </Grid.Col>
        </Grid>
      </Spoiler>
    </Card>
  );
};

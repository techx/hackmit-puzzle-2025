import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Group,
  Stack,
  Text,
  Anchor,
  Table,
} from "@mantine/core";
import { getURLFromPuzzleLeaderboard } from "../puzzles";
import { useMediaQuery } from "@mantine/hooks";

const Leaderboard = ({
  username,
  user_id,
}: {
  username: string;
  user_id: string;
}) => {
  const [leaderboardData, setLeaderboardData] = useState({
    puzzle_metadatas: [],
    leaderboard: [],
    personal_user_score: null,
  });

  const [loading, setLoading] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 1200px)");

  useEffect(() => {
    fetch("/api/puzzle/leaderboard")
      .then((response) => response.json())
      .then((data) => {
        setLeaderboardData(data);
        setLoading(false);
      });
  }, []);

  type leaderboardDataType = {
    username: string;
    scores: {
      name: string;
      earliest_correct_time: number | null;
      score: number | null;
    }[];
    total_score: number | null;
    time_penalty: number | null;
    rank?: number;
  };

  type fullLeaderboardDataType = {
    leaderboard: leaderboardDataType[];
    puzzle_metadatas: {
      abbrv: string;
      url: string;
      name: string;
      value: number;
    }[];
    personal_user_score: leaderboardDataType | null;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const typedLeaderboardData = leaderboardData as fullLeaderboardDataType;
  const typedLeaderboard =
    typedLeaderboardData.leaderboard as leaderboardDataType[];

  const scoreColumnWidth = "80px";
  const penaltyColumnWidth = "100px";
  const puzzleColumnWidth = "100px";

  const mapEltToRow = (
    element: leaderboardDataType,
    idx: number,
    isPersonal: boolean = false
  ) => {
    return (
      <Table.Tr
        key={idx}
        style={{
          backgroundColor: element.username === username ? "#FFFFBF" : "white",
          borderTop: isPersonal ? "2px solid black" : "",
          borderBottom: isPersonal ? "2px solid black" : "",
        }}
      >
        <Table.Td>
          <Group>
            <Group>
              <Text
                fz={20}
                style={{
                  fontFamily: "NYT-Header-Condensed",
                }}
              >
                {isPersonal ? element.rank : idx + 1}
              </Text>
            </Group>
            <Text
              fz={20}
              pb="6px"
              style={{
                fontFamily: "NYT-500",
              }}
            >
              {element.username}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td w={scoreColumnWidth}>
          <Group justify="center">
            <Text fz={20}>{element.total_score}</Text>
          </Group>
        </Table.Td>
        <Table.Td w={penaltyColumnWidth}>
          <Group justify="center">
            <Text fz={16} c="gray">
              {element.time_penalty}
            </Text>
          </Group>
        </Table.Td>

        {Object.values(element.scores).map((score, idx) => (
          <Table.Td key={idx} w={puzzleColumnWidth}>
            <Group justify="center">
              <Text fz={20}>{score.score}</Text>
            </Group>
          </Table.Td>
        ))}
      </Table.Tr>
    );
  };

  const trows = typedLeaderboard.map((element, idx) =>
    mapEltToRow(element, idx)
  );

  if (typedLeaderboardData.personal_user_score) {
    trows.unshift(
      mapEltToRow(typedLeaderboardData.personal_user_score, -1, true)
    );
  }

  return (
    <Container w="100%" maw="100vw" mih="100vh" p="0" pb="xl" mt="0">
      <Group justify="center" mt="xl" w="100%">
        <Stack justify="left" w="80%" gap="md">
          <Group w="100%" justify="center">
            <Title order={1} pb="md">
              Conditions
            </Title>
          </Group>
          <Title order={3}>
            The top ~50 eligible puzzle solvers are automatically admitted to
            HackMIT. To be eligible for this, we ask that you still submit an
            application, and that you also enter the email that you used to
            apply for HackMIT in your profile card on the{" "}
            <Anchor href="/" fz="22px">
              front page
            </Anchor>
            .
          </Title>
        </Stack>
        <Stack
          justify="center"
          align={isSmallScreen ? "flex-start" : "center"}
          w="calc(max(80%,1200px))"
          gap="0"
          mt="20px"
          style={{
            overflowX: "auto",
          }}
        >
          <Group w="calc(max(100%,1200px))" justify="center">
            <Title order={1} pb="md">
              Leaderboard
            </Title>
          </Group>
          {!loading && (
            <>
              <Table
                highlightOnHover
                withTableBorder
                withColumnBorders
                w="calc(max(100%,1200px))"
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th></Table.Th>
                    <Table.Th>
                      <Group justify="center">
                        <Text fz={20}>Score</Text>
                      </Group>
                    </Table.Th>
                    <Table.Th>
                      <Group justify="center" c="gray">
                        <Text fz={20}>*</Text>
                      </Group>
                    </Table.Th>
                    {typedLeaderboardData.puzzle_metadatas.map(
                      (puzzle, idx) => (
                        <Table.Th key={idx}>
                          <Group justify="center">
                            <Stack justify="center" align="center" gap="0">
                              <Anchor
                                href={
                                  user_id === undefined
                                    ? null
                                    : getURLFromPuzzleLeaderboard(
                                        puzzle.url,
                                        user_id
                                      )
                                }
                                c="blue"
                              >
                                <Text fz={20}>{puzzle.abbrv}</Text>
                              </Anchor>
                              <Text fz={16} c="gray">
                                {puzzle.value}
                              </Text>
                            </Stack>
                          </Group>
                        </Table.Th>
                      )
                    )}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{trows}</Table.Tbody>
              </Table>
            </>
          )}
        </Stack>
      </Group>
    </Container>
  );
};

export default Leaderboard;

import { Puzzle } from "../puzzles";
import { Container, Text, Button, Stack } from "@mantine/core";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, TextInput } from "@mantine/core";
import { getURLFromPuzzle } from "../puzzles";
import { useMediaQuery } from "@mantine/hooks";

const GameCard = ({
  puzzle,
  loggedIn,
  user_id,
}: {
  puzzle: Puzzle;
  loggedIn: boolean;
  user_id: string;
}) => {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const [opened, { open, close }] = useDisclosure(false);
  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [correctMessage, setCorrectMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    setSubmitting(true);
    fetch("/api/puzzle/submit", {
      method: "POST",
      body: JSON.stringify({
        puzzle_name: puzzle.name,
        user_id,
        submission: response,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.solved) {
          setCorrectMessage(data.message);
          setErrorMessage("");
        } else {
          setErrorMessage(data.message);
          setCorrectMessage("");
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Submit Answer" centered>
        <TextInput
          label="Response"
          value={response}
          color="black"
          onChange={(e) => {
            setResponse(e.target.value);
            setCorrectMessage("");
            setErrorMessage("");
          }}
        />
        {correctMessage && (
          <Text c="green" my="sm">
            {correctMessage}
          </Text>
        )}
        {errorMessage && (
          <Text c="red" my="sm">
            {errorMessage}
          </Text>
        )}
        <Button
          fullWidth
          radius="xl"
          variant="outline"
          color="black"
          mt="md"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </Modal>
      <Container
        h="200px"
        style={{
          border: "1px solid #DCDCDC",
          borderBottom: "none",
          borderRadius: "12px 12px 0px 0px",
          backgroundColor: puzzle.color,
          opacity: loggedIn ? 1 : 0.3,
        }}
      >
        <Stack justify="center" align="center" h="100%" mt="md">
          {puzzle.largeIcon}
          <Text
            fz={22}
            ta="center"
            mt="sm"
            mb="sm"
            style={{
              fontFamily: "NYT-Header-Condensed",
              lineHeight: "1",
            }}
          >
            {puzzle.name}
          </Text>
        </Stack>
      </Container>
      <Container
        h="auto"
        style={{
          border: "1px solid #DCDCDC",
          borderTop: "none",
          borderRadius: "0px 0px 12px 12px",
        }}
      >
        <Stack justify="center" align="center" gap="12px" py="md" px="xs">
          <Text
            ta="center"
            c="gray"
            pb="sm"
            mih={isSmallScreen ? "90px" : "50px"}
            style={{
              fontFamily: "NYT-500",
              lineHeight: "1.2",
            }}
          >
            {puzzle.description}
          </Text>
          <Button
            fullWidth
            radius="xl"
            variant="outline"
            color="black"
            disabled={!loggedIn}
            onClick={() => {
              window.location.href = getURLFromPuzzle(puzzle, user_id);
            }}
          >
            Play
          </Button>
          {loggedIn && (
            <Button
              fullWidth
              radius="xl"
              variant="outline"
              color="black"
              onClick={open}
            >
              Submit
            </Button>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default GameCard;

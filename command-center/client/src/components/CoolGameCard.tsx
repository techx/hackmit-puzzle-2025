import { Puzzle } from "../puzzles";
import { useState } from "react";
import { Modal, TextInput, Button, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { getURLFromPuzzle } from "../puzzles";

export default function CoolGameCard({
  puzzle,
  loggedIn,
  user_id,
}: {
  puzzle: Puzzle;
  loggedIn: boolean;
  user_id: string;
}) {
  const [popupOpened, { open: openPopup, close: closePopup }] = useDisclosure(false);
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
      <Modal
        opened={popupOpened}
        onClose={closePopup}
        title={puzzle.name}
        centered
        overlayProps={{ blur: 3 }}
      >
        <Text className="text-sm text-gray-600 mb-3">{puzzle.description}</Text>

        <div className="flex flex-col gap-3">
          <Button
            fullWidth
            radius="xl"
            variant="outline"
            color="black"
            onClick={() =>
              window.location.href = getURLFromPuzzle(puzzle, user_id)
            }
            disabled={!loggedIn}
          >
            Play
          </Button>

          {loggedIn && (
            <>
              <TextInput
                label="Your Answer"
                value={response}
                onChange={(e) => {
                  setResponse(e.target.value);
                  setCorrectMessage("");
                  setErrorMessage("");
                }}
              />
              {correctMessage && <Text c="green">{correctMessage}</Text>}
              {errorMessage && <Text c="red">{errorMessage}</Text>}
              <Button
                fullWidth
                radius="xl"
                variant="outline"
                color="black"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </>
          )}

          {!loggedIn && (
            <Text size="sm" c="dimmed">
              Log in to submit answers.
            </Text>
          )}
        </div>
      </Modal>

      <li className="flex gap-2 items-center h-fit">
      <div className="w-20 h-12 border border-accent rounded-lg overflow-hidden bg-white flex items-center justify-center">

      <div
        className={`${
          puzzle.name === "Jailbreak" ? "translate-x-0.5 translate-y-2.5" : "translate-x-0.4 translate-y-1.25"
        }`}
      >
        {puzzle.largeIcon}
      </div>

      </div>


        <div className="flex flex-col">
          <button
            onClick={openPopup}
            className="font-semibold text-accent text-left hover:underline"
          >
            {puzzle.name}
          </button>
          <p className="text-base leading-tight text-white">
            {puzzle.description}
          </p>
        </div>
      </li>
    </>
  );
}

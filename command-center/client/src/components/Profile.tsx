import { useState, useEffect } from "react";
import {
  Container,
  Button,
  Stack,
  Text,
  Image,
  Group,
  SimpleGrid,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Modal, TextInput } from "@mantine/core";
import CoolGameCard from "../components/CoolGameCard";

const ProfileCard = ({
  loggedIn,
  username,
  user_id,
  hackEmail,
}: {
  loggedIn: boolean;
  username: string;
  user_id: string;
  hackEmail: string;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [response, setResponse] = useState(hackEmail);
  const [submitting, setSubmitting] = useState(false);
  const [correctMessage, setCorrectMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [solvedPuzzles, setSolvedPuzzles] = useState([]);

  useEffect(() => {
    setCorrectMessage("");
    setErrorMessage("");
  }, [opened]);

  useEffect(() => {
    fetch("/api/puzzle/email")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setResponse(data.email);
        }
      });
  }, []);

  useEffect(() => {
    fetch("/api/puzzle/solved")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSolvedPuzzles(data.solved_puzzles);
        }
      });
  }, []);

  const handleSubmit = () => {
    setSubmitting(true);
    fetch("/api/puzzle/email", {
      method: "POST",
      body: JSON.stringify({
        user_id,
        email: response,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
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
      <Modal opened={opened} onClose={close} title="Profile" centered>
        <TextInput
          label="HackMIT Email"
          value={response}
          color="black"
          onChange={(e) => {
            setResponse(e.target.value);
            setCorrectMessage("");
            setErrorMessage("");
          }}
        />
        {correctMessage && (
          <Text c="green" my="sm" size="sm">
            {correctMessage}
          </Text>
        )}
        {errorMessage && (
          <Text c="red" my="sm" size="sm">
            {errorMessage}
          </Text>
        )}

        <Text c="gray" mt="sm" size="sm">
          Please enter the email that you used for your application if you're
          interested in being considered for automatic admission to HackMIT.
        </Text>

        <Button
          fullWidth
          radius="xl"
          variant="outline"
          color="black"
          mt="lg"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save"}
        </Button>
      </Modal>

      <Stack spacing="xl">
        <Group justify="flex-start" align="center">
          <Image
            src={`https://github.com/${username}.png`}
            alt="pfp"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
          <Stack align="flex-start" gap="xs">
            <Text fz={24} fw={700} style={{ color: "white" }}>
              {username}
            </Text>
            {loggedIn && (
              <Button radius="xl" variant="outline" color="white" onClick={open}>
                Edit
              </Button>
            )}
          </Stack>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {solvedPuzzles.length > 0 ? (
            solvedPuzzles.map((puzzle) => (
              <CoolGameCard
                key={puzzle.name}
                puzzle={puzzle}
                loggedIn={loggedIn}
                user_id={user_id}
              />
            ))
          ) : (
            <Text c="white">No puzzles solved yet.</Text>
          )}
        </SimpleGrid>
      </Stack>
    </>
  );
};

const Profile = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [user_id, setUserId] = useState("");
  const [hackEmail, setHackEmail] = useState("");

  useEffect(() => {
    fetch("/api/auth/whoami").then((res) => {
      res.json().then((body) => {
        setLoggedIn(body["loggedIn"]);
        setUsername(body["user"]);
        setUserId(body["user_id"]);
        setHackEmail(body["hack_email"]);
      });
    });
  }, []);

  return (
    <Container maw="100vw" p="40px" style={{ background: "#0f172a" }}>
      <ProfileCard
        loggedIn={loggedIn}
        username={username}
        user_id={user_id}
        hackEmail={hackEmail}
      />
    </Container>
  );
};

export default Profile;

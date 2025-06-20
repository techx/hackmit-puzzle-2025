import { useState, useEffect } from "react";
import { Container, Button, Stack, Text, Image } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Modal, TextInput } from "@mantine/core";

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
      <Container
        h="180px"
        maw="400px"
        style={{
          borderRadius: "12px 12px 0px 0px",
          background: "white",
          opacity: loggedIn ? 1 : 0.3,
        }}
      >
        <Stack justify="center" align="center" h="100%">
          <Image
            src="/spelling-bee-card-icon.svg"
            alt="pfp"
            style={{ width: "120px", height: "120px" }}
          />
          <Text
            fz={22}
            ta="center"
            style={{
              fontFamily: "NYT-Header-Condensed",
              lineHeight: "1",
            }}
          >
            {"Profile"}
          </Text>
        </Stack>
      </Container>
      <Container
        h="auto"
        maw="400px"
        style={{
          background: "white",
          borderRadius: "0px 0px 12px 12px",
          opacity: loggedIn ? 1 : 0.3,
        }}
      >
        <Stack justify="center" align="center" gap="12px" pb="md" px="xs">
          <Text
            ta="center"
            c="black"
            pb="sm"
            style={{
              fontFamily: "NYT-500",
              lineHeight: "1.2",
            }}
          >
            {username !== undefined
              ? "You are logged in as " + username
              : "You are not logged in."}
          </Text>
          {loggedIn && (
            <Button
              fullWidth
              radius="xl"
              variant="outline"
              color="black"
              onClick={open}
            >
              Edit
            </Button>
          )}
        </Stack>
      </Container>
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
    <Container maw="100vw" p="40px" style={{ background: "#4d88f9" }}>
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

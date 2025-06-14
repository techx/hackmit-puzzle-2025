import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

type Recipe = { lemons?: number; sugar?: number; ice?: number; price?: number };
type ValidationErrors = {
  lemons?: string;
  sugar?: string;
  ice?: string;
  price?: string;
};
type StandValidationErrors = {
  name?: string;
};
type Stand = { index: number; name: string; recipe: Recipe };

function isDefined<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null;
}

const PROMPT = "enter command: ";

type ConnectionState = "OPENING" | "OPEN" | "CLOSED";

const App = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("OPENING");
  const [stands, setStands] = useState<Stand[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createName, setCreateName] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<number, ValidationErrors>>({});
  const [standErrors, setStandErrors] = useState<
    Record<number, StandValidationErrors>
  >({});
  const [createNameError, setCreateNameError] = useState<string>("");
  const simBufferRef = useRef<string>("");
  const awaitingSimRef = useRef(false);
  const [output, setOutput] = useState("");

  const connectWebSocket = useCallback(() => {
    setConnectionState("OPENING");

    const socket = new WebSocket(
      `${location.protocol === "https:" ? "wss" : "ws"}://127.0.0.1:4300`,
    );
    wsRef.current = socket;
    socket.binaryType = "arraybuffer";

    socket.onopen = () => {
      setConnectionState("OPEN");
      // reset state
      setStands([]);
      setShowModal(false);
      setShowCreateForm(false);
      setCreateName("");
      setEditing(null);
      setErrors({});
      setStandErrors({});
      setCreateNameError("");
      simBufferRef.current = "";
      awaitingSimRef.current = false;
      setOutput("");
    };

    socket.onclose = () => {
      // if the server closed mid-simulation flush what we have so far
      if (awaitingSimRef.current && simBufferRef.current) {
        setOutput(simBufferRef.current.trim());
        setShowModal(true);
      }
      // existing reconnection logic …
      setTimeout(
        () =>
          setConnectionState((state) => {
            if (state === "OPEN") {
              connectWebSocket();
              return "OPENING";
            }
            return state;
          }),
        10,
      );
    };

    socket.onerror = () => {
      // same defensive flush – you may prefer to surface an explicit error UI
      if (awaitingSimRef.current && simBufferRef.current) {
        setOutput(simBufferRef.current.trim());
        setShowModal(true);
      }
      setConnectionState("CLOSED");
    };

    socket.onmessage = (event) => {
      let text: string;
      if (typeof event.data === "string") {
        text = event.data;
      } else {
        try {
          text = new TextDecoder().decode(event.data);
        } catch {
          return;
        }
      }

      text.split("\n").forEach((line) => {
        if (!line) return;

        if (line === PROMPT) {
          if (awaitingSimRef.current) {
            // simulation output just ended, flush buffer to UI
            awaitingSimRef.current = false;
            const flushed = simBufferRef.current.trim();
            simBufferRef.current = "";
            if (flushed) {
              setOutput(flushed);
              setShowModal(true);
            }
          }
          return; // don't treat prompt as output
        }

        if (awaitingSimRef.current) {
          simBufferRef.current += line + "\n";
        } else {
          setOutput((prev) => prev + line + "\n"); // one-shot result from non-simulate command
          setShowModal(true);
        }
      });
    };

    return () => socket.close();
  }, []);

  useEffect(() => {
    const cleanup = connectWebSocket();
    return cleanup;
  }, [connectWebSocket]);

  const send = (cmd: string) => {
    if (connectionState === "OPEN") {
      if (cmd.startsWith("simulate")) {
        awaitingSimRef.current = true; // begin accumulation
        simBufferRef.current = ""; // reset buffer
      }
      wsRef.current!.send(cmd + "\n");
    }
  };

  const allocateIndex = () => {
    const used = new Set(stands.map((s) => s.index));
    for (let i = 0; i < 16; i++) {
      if (!used.has(i)) return i;
    }
    return -1;
  };

  const validateStandName = (name: string): string | null => {
    if (!name.trim()) {
      return "Stand name cannot be empty";
    }
    const encoded = encodeURIComponent(name);
    if (encoded.length > 1024) {
      return "Stand name too long (encoded length exceeds 1024 characters)";
    }
    return null;
  };

  const createStand = (name: string) => {
    const nameError = validateStandName(name);
    if (nameError) {
      setCreateNameError(nameError);
      return;
    }

    const index = allocateIndex();
    if (index === -1) return;

    const encodedName = encodeURIComponent(name);
    send(`stand_create ${index} ${encodedName.length} ${encodedName}`);
    setStands((prev) => [...prev, { index, name: encodedName, recipe: {} }]);
    setCreateName("");
    setCreateNameError("");
    setShowCreateForm(false);
  };

  const renameStand = (index: number, name: string) => {
    const nameError = validateStandName(name);
    if (nameError) {
      setStandErrors((prev) => ({ ...prev, [index]: { name: nameError } }));
      return;
    }

    const encodedName = encodeURIComponent(name);
    send(`stand_rename ${index} ${encodedName}`);
    setStands((prev) =>
      prev.map((s) => (s.index === index ? { ...s, name: encodedName } : s)),
    );
    setStandErrors((prev) => ({ ...prev, [index]: {} }));
    setEditing(null);
  };

  const deleteStand = (index: number) => {
    send(`stand_delete ${index}`);
    setStands((prev) => prev.filter((s) => s.index !== index));
  };

  const validateRecipe = (recipe: Recipe): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    (["lemons", "sugar", "ice"] as const).forEach((key) => {
      if (!(isDefined(recipe[key]) && recipe[key] >= 0 && recipe[key] <= 100)) {
        newErrors[key] = `${key} must be 0-100`;
      }
    });
    if (
      !(isDefined(recipe.price) && recipe.price >= 0.1 && recipe.price <= 5.0)
    ) {
      newErrors.price = "Price must be between $0.10 and $5.00";
    }
    return newErrors;
  };

  const setRecipe = (index: number, recipe: Recipe) => {
    const validationErrors = validateRecipe(recipe);
    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, [index]: validationErrors }));
      return;
    }
    setErrors((prev) => ({ ...prev, [index]: {} }));
    const { lemons, sugar, ice, price } = recipe;
    send(`set_recipe ${index} ${lemons} ${sugar} ${ice} ${price!.toFixed(2)}`);
    setStands((prev) =>
      prev.map((s) => (s.index === index ? { ...s, recipe } : s)),
    );
  };

  const simulate = (index: number) => {
    send(`simulate ${index}`);
  };

  const duplicateStand = (
    sourceIndex: number,
    sourceName: string,
    sourceRecipe: Recipe,
  ) => {
    const newIndex = allocateIndex();
    if (newIndex === -1) return;

    // Decode the source name, add " Copy", then encode the new name
    const decodedSourceName = decodeURIComponent(sourceName);
    const newName = `${decodedSourceName} Copy`;
    const nameError = validateStandName(newName);
    if (nameError) {
      // Could show an error here, but for now just silently fail
      return;
    }

    const encodedNewName = encodeURIComponent(newName);
    send(`stand_create ${newIndex} ${encodedNewName.length} ${encodedNewName}`);
    send(`copy_recipe ${sourceIndex} ${newIndex}`);

    setStands((prev) => [
      ...prev,
      { index: newIndex, name: encodedNewName, recipe: sourceRecipe },
    ]);
  };

  return (
    <div className="space-y-6 p-6" aria-disabled={connectionState != "OPEN"}>
      <h1 className="text-2xl font-bold">Lemonade Stand Simulator</h1>
      {connectionState == "OPENING" && (
        <p className="text-blue-500">Connecting to server...</p>
      )}
      {connectionState == "CLOSED" && (
        <div className="text-red-500">
          <p>Failed to connect to server</p>
          <button
            className="mt-2 rounded bg-blue-600 px-3 py-1 text-white"
            onClick={connectWebSocket}
          >
            Retry Connection
          </button>
        </div>
      )}

      {showCreateForm ? (
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (createName) createStand(createName);
          }}
        >
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Stand name"
              value={createName}
              onChange={(e) => {
                setCreateName(e.target.value);
                setCreateNameError("");
              }}
              className="border p-2"
            />
            {createNameError && (
              <p className="mt-1 text-sm text-red-500">{createNameError}</p>
            )}
          </div>
          <button
            className="rounded bg-green-600 px-3 py-1 text-white"
            type="submit"
          >
            Create
          </button>
          <button
            className="text-gray-500"
            type="button"
            onClick={() => {
              setShowCreateForm(false);
              setCreateNameError("");
            }}
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          className="btn rounded bg-blue-600 p-2 text-white disabled:opacity-50"
          onClick={() => setShowCreateForm(true)}
          disabled={connectionState != "OPEN" || stands.length >= 16}
        >
          + Add Stand
        </button>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stands.map(({ index, name, recipe }) => (
          <div key={index} className="rounded-xl border p-4 opacity-100 shadow">
            {editing === index ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const newName = (
                    (e.target as HTMLFormElement).namedItem(
                      `rename-${index}`,
                    ) as HTMLInputElement
                  ).value;
                  renameStand(index, newName);
                }}
              >
                <input
                  name={`rename-${index}`}
                  type="text"
                  defaultValue={decodeURIComponent(name)}
                  className="input mt-2 block w-full border p-1"
                />
                {standErrors[index]?.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {standErrors[index].name}
                  </p>
                )}
                <div className="mt-1 flex gap-2">
                  <button
                    type="submit"
                    className="rounded bg-blue-500 px-2 py-1 text-white"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="text-gray-500"
                    onClick={() => {
                      setEditing(null);
                      setStandErrors((prev) => ({ ...prev, [index]: {} }));
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {decodeURIComponent(name)}
                </h2>
                <button
                  onClick={() => setEditing(index)}
                  className="text-blue-600"
                >
                  ✏️
                </button>
              </div>
            )}

            <div className="mt-2">
              <label className="block font-medium">Recipe:</label>
              {(["lemons", "sugar", "ice", "price"] as const).map((key) => (
                <div key={key} className="mb-1">
                  <input
                    type="number"
                    placeholder={key}
                    step={key === "price" ? "0.01" : "1"}
                    className="input w-full border p-1"
                    defaultValue={recipe[key]}
                    onChange={(e) => {
                      setStands((prev) =>
                        prev.map((s) =>
                          s.index === index
                            ? {
                                ...s,
                                recipe: {
                                  ...s.recipe,
                                  [key]:
                                    key === "price"
                                      ? parseFloat(e.target.value)
                                      : +e.target.value,
                                },
                              }
                            : s,
                        ),
                      );
                    }}
                  />
                  {errors[index]?.[key] && (
                    <p className="text-sm text-red-500">{errors[index][key]}</p>
                  )}
                </div>
              ))}
              <button
                className="btn rounded bg-blue-500 p-1 px-3 text-white"
                onClick={() => setRecipe(index, recipe)}
              >
                Save
              </button>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                className="btn rounded bg-green-500 p-1 px-3 text-white"
                onClick={() => simulate(index)}
              >
                Simulate
              </button>
              <button
                className="btn rounded bg-blue-400 p-1 px-3 text-white"
                onClick={() => duplicateStand(index, name, recipe)}
                disabled={
                  stands.length >= 16 ||
                  validateStandName(decodeURIComponent(name) + " Copy") != null
                }
                title="Duplicate stand"
              >
                📋
              </button>
              <button
                className="btn rounded bg-red-500 p-1 px-3 text-white"
                onClick={() => deleteStand(index)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-lg font-bold">Simulation Output</h2>
            <pre className="mb-4 max-h-96 overflow-y-auto text-sm whitespace-pre-wrap">
              {output}
            </pre>
            <button
              className="btn rounded bg-gray-800 px-4 py-2 text-white"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

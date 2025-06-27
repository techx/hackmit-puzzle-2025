import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { CopyStyleButton } from "./CopyButton";

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
  const [editValue, setEditValue] = useState<string | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Record<number, Recipe>>({});

  const DEBUGGING = true; // don't got access to server LOL

  const connectWebSocket = useCallback(() => {
    setConnectionState("OPENING");

    // const host = "127.0.0.1:4300";
    const host = location.host + "/ws/";
    const socket = new WebSocket(
      `${location.protocol === "https:" ? "wss" : "ws"}://${host}`,
    );
    wsRef.current = socket;
    socket.binaryType = "arraybuffer";

    socket.onopen = () => {
      setConnectionState("OPEN");
      // reset state
      setStands([]);
      setShowCreateForm(false);
      setCreateName("");
      setEditing(null);
      setErrors({});
      setStandErrors({});
      setCreateNameError("");
      simBufferRef.current = "";
      awaitingSimRef.current = false;
      // don't reset these so user has time to read the error if any
      // setShowModal(false);
      // setOutput("");
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
    if (DEBUGGING) {
      setConnectionState("OPEN");
      return;
    }
    const cleanup = connectWebSocket();
    return cleanup;
  }, [connectWebSocket]);

  // const send = (cmd: string) => {
  //   if (connectionState === "OPEN") {
  //     if (cmd.startsWith("simulate")) {
  //       awaitingSimRef.current = true; // begin accumulation
  //       simBufferRef.current = ""; // reset buffer
  //     }
  //     wsRef.current!.send(cmd + "\n");
  //   }
  // };
  let send: (cmd: string) => void;
  if (DEBUGGING) {
    // intercept, delete later
    send = (cmd: string) => {
      console.log("[DEBUG] Intercepted:", cmd);

      if (cmd.startsWith("simulate")) {
        const index = cmd.split(" ")[1];
        const fakeOutput = [
          `Simulating stand ${index}...`,
          `Customers served: ${Math.floor(Math.random() * 50 + 20)}`,
          `Revenue: $${(Math.random() * 100 + 20).toFixed(2)}`,
          `Expenses: $${(Math.random() * 30 + 10).toFixed(2)}`,
          `Profit: $${(Math.random() * 70 + 5).toFixed(2)}`,
        ].join("\n");

        setTimeout(() => {
          setOutput(fakeOutput);
          setShowModal(true);
        }, 300);
      } else {
        setOutput((prev) => prev + `> ${cmd}\n`);
      }
    };
  } else {
    send = (cmd: string) => {
      if (connectionState === "OPEN") {
        if (cmd.startsWith("simulate")) {
          awaitingSimRef.current = true;
          simBufferRef.current = "";
        }
        wsRef.current!.send(cmd + "\n");
      }
    };
  }

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
      newErrors.price = "Must be between $0.10 and $5.00";
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
    setSavedRecipes((prev) => ({ ...prev, [index]: recipe }));

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

    const decodedName = decodeURIComponent(sourceName);
    const baseName = decodedName;

    const existingNames = new Set(
      stands.map((s) => decodeURIComponent(s.name)),
    );
    let suffix = 1;
    let candidateName = `${baseName} (${suffix})`;

    while (existingNames.has(candidateName)) {
      suffix++;
      candidateName = `${baseName} (${suffix})`;
    }

    const encodedNewName = encodeURIComponent(candidateName);
    send(`stand_create ${newIndex} ${encodedNewName.length} ${encodedNewName}`);
    send(`copy_recipe ${sourceIndex} ${newIndex}`);

    setStands((prev) => [
      ...prev,
      { index: newIndex, name: encodedNewName, recipe: sourceRecipe },
    ]);
  };

  // if recipes are same
  const isRecipeEqual = (a: Recipe | undefined, b: Recipe | undefined) => {
    if (!a || !b) return false;
    return (
      a.lemons === b.lemons &&
      a.sugar === b.sugar &&
      a.ice === b.ice &&
      a.price === b.price
    );
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-gradient-to-b from-yellow-100 via-sky-100 to-green-50"
      aria-disabled={connectionState != "OPEN"}
    >
      <div className={showModal ? "dimmed" : ""} style={{ flexGrow: 1 }}>
        <div className="relative mx-auto w-full max-w-2xl">
          <img
            src="/images/wooden-title.png"
            alt="Title Background"
            className="h-auto w-full object-contain"
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ marginTop: "-0.75rem" }}
          >
            <h1 className="title w-[100%] text-center text-[clamp(1.5rem,3.5vw,6rem)] leading-tight text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.7)]">
              Lemonade Stand Simulator
            </h1>
          </div>
        </div>

        {connectionState == "OPENING" && (
          <div className="mx-auto flex max-w-sm items-center justify-center gap-2 rounded-lg border-2 border-yellow-300 bg-yellow-50 p-3 text-center shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-citrus-icon"
            >
              <path d="M21.66 17.67a1.08 1.08 0 0 1-.04 1.6A12 12 0 0 1 4.73 2.38a1.1 1.1 0 0 1 1.61-.04z" />
              <path d="M19.65 15.66A8 8 0 0 1 8.35 4.34" />
              <path d="m14 10-5.5 5.5" />
              <path d="M14 17.85V10H6.15" />
            </svg>
            <p className="font-bold text-yellow-700">Connecting to server...</p>
          </div>
        )}

        {connectionState == "CLOSED" && (
          <div className="mx-auto max-w-sm rounded-lg border-2 border-red-300 bg-red-50 p-4 text-center shadow-lg">
            <p className="mb-3 text-lg font-bold text-red-600">
              Failed to connect to server
            </p>
            <button
              className="cursor-pointer rounded-lg bg-red-500 px-4 py-2 font-bold text-white shadow transition-transform hover:scale-105 hover:bg-red-600"
              onClick={connectWebSocket}
            >
              Retry Connection
            </button>
          </div>
        )}

        {showCreateForm ? (
          <form
            className="mx-auto mt-[-1rem] flex max-w-lg animate-[fadeIn_0.3s_ease-out] flex-col items-center gap-4 rounded-xl border-4 border-yellow-400 bg-yellow-50 p-6 shadow-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              if (createName) createStand(createName);
            }}
          >
            <input
              type="text"
              placeholder="Your stand's name"
              value={createName}
              onChange={(e) => {
                setCreateName(e.target.value);
                setCreateNameError("");
              }}
              className="w-full rounded-lg border-2 border-yellow-300 bg-white p-4 text-xl shadow-inner focus:border-yellow-500 focus:ring-4 focus:ring-yellow-300"
            />
            {createNameError && (
              <p className="text-sm font-semibold text-red-500">
                {createNameError}
              </p>
            )}
            <div className="flex gap-3">
              <button
                className="cursor-pointer rounded-lg bg-yellow-400 px-6 py-3 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-yellow-500"
                type="submit"
              >
                Create
              </button>
              <button
                className="cursor-pointer rounded-lg border border-gray-300 bg-white px-6 py-3 text-lg text-gray-600 shadow hover:bg-gray-100"
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setCreateNameError("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-[-0.5rem] mb-8 flex justify-center">
            <button
              className="cursor-pointer rounded-lg bg-yellow-400 px-6 py-3 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-yellow-500 disabled:opacity-50"
              onClick={() => setShowCreateForm(true)}
              disabled={connectionState !== "OPEN" || stands.length >= 16}
            >
              Add Stand
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stands.map(({ index, name, recipe }) => {
            const savedRecipe = savedRecipes[index];
            const isDirty = !isRecipeEqual(recipe, savedRecipe);
            return (
              <div className="relative p-4">
                <button
                  onClick={() => deleteStand(index)}
                  className="absolute top-2 right-2 z-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border bg-white hover:bg-red-300"
                  title="Delete Stand"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-x-icon lucide-x"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
                <div
                  key={index}
                  className="card border p-4 text-2xl opacity-100 shadow"
                >
                  {editing === index ? (
                    <input
                      autoFocus
                      name={`rename-${index}`}
                      type="text"
                      value={editValue ?? decodeURIComponent(name)}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => {
                        // Save on blur
                        if (editValue !== null) renameStand(index, editValue);
                        setEditing(null);
                        setEditValue(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (editValue !== null) renameStand(index, editValue);
                          setEditing(null);
                          setEditValue(null);
                        }
                        if (e.key === "Escape") {
                          setEditing(null);
                          setEditValue(null);
                          setStandErrors((prev) => ({ ...prev, [index]: {} }));
                        }
                      }}
                      className="input mt-2 block w-full border p-1"
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <h2
                        className="w-full cursor-pointer rounded border border-transparent px-1 text-2xl font-bold transition hover:border-gray-400 hover:bg-gray-50"
                        onClick={() => {
                          setEditing(index);
                          setEditValue(decodeURIComponent(name));
                        }}
                        title="rename title"
                      >
                        {decodeURIComponent(name)}
                      </h2>
                    </div>
                  )}

                  <div className="mt-2">
                    <label className="mb-1 block text-center text-lg font-semibold underline">
                      Recipe
                    </label>
                    <div className="flex w-full gap-6">
                      <div className="border-grey-300 relative h-48 w-[40%] min-w-[120px] shrink-0 overflow-hidden border-r-2 border-b-2 border-l-2 bg-white shadow-inner">
                        {(() => {
                          const l = recipe.lemons ?? 0;
                          const s = recipe.sugar ?? 0;
                          const i = recipe.ice ?? 0;
                          const total = l + s + i || 1;

                          const icePct = (i / total) * 100;
                          const sugarPct = (s / total) * 100;
                          const lemonPct = (l / total) * 100;

                          let currentBottom = 0;

                          return (
                            <>
                              {l + s + i === 0 ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-xs text-gray-400">
                                  empty
                                </div>
                              ) : (
                                (() => {
                                  let currentBottom = 0;

                                  const layers = [
                                    {
                                      height: sugarPct,
                                      color: "#ffffff", // sugar
                                    },
                                    {
                                      height: lemonPct,
                                      color: "#ffe066", // lemon
                                    },
                                    {
                                      height: icePct,
                                      color: "#d0f0ff", // ice
                                    },
                                  ];

                                  return layers.map(({ height, color }, i) => {
                                    const style = {
                                      bottom: `${currentBottom}%`,
                                      height: `${height}%`,
                                      backgroundColor: color,
                                    };
                                    currentBottom += height;

                                    return (
                                      <div
                                        key={i}
                                        className="absolute left-0 w-full transition-all duration-300"
                                        style={style}
                                      />
                                    );
                                  });
                                })()
                              )}
                            </>
                          );
                        })()}
                      </div>

                      <div className="flex w-full flex-col gap-3 text-sm">
                        {(["ice", "lemons", "sugar", "price"] as const).map(
                          (key) => {
                            const isPrice = key === "price";
                            const error = errors[index]?.[key];
                            const labelMap: Record<string, string> = {
                              lemons: "Lemons",
                              sugar: "Sugar",
                              ice: "Ice",
                              price: "Price ($)",
                            };

                            return (
                              <div key={key}>
                                <div className="flex items-center gap-3">
                                  <label
                                    htmlFor={`${key}-${index}`}
                                    className="w-24 font-medium text-black"
                                  >
                                    {labelMap[key]}
                                  </label>
                                  <input
                                    id={`${key}-${index}`}
                                    type="number"
                                    step={isPrice ? "0.01" : "1"}
                                    placeholder={key}
                                    value={recipe[key] ?? ""}
                                    className={`w-full max-w-[100px] rounded border p-2 ${error ? "border-red-500 text-red-600" : "border-gray-200"}`}
                                    onChange={(e) => {
                                      const raw = e.target.value;
                                      setStands((prev) =>
                                        prev.map((s) =>
                                          s.index === index
                                            ? {
                                                ...s,
                                                recipe: {
                                                  ...s.recipe,
                                                  [key]:
                                                    raw === ""
                                                      ? undefined
                                                      : isPrice
                                                        ? parseFloat(raw)
                                                        : parseInt(raw),
                                                },
                                              }
                                            : s,
                                        ),
                                      );
                                    }}
                                    onBlur={(e) => {
                                      const raw = e.target.value;
                                      if (raw === "") {
                                        setStands((prev) =>
                                          prev.map((s) =>
                                            s.index === index
                                              ? {
                                                  ...s,
                                                  recipe: {
                                                    ...s.recipe,
                                                    [key]: 0,
                                                  },
                                                }
                                              : s,
                                          ),
                                        );
                                      }
                                    }}
                                  />
                                </div>
                                <div className="pl-19 text-xs text-red-500">
                                  {isPrice && error}
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-3">
                    <div className="flex justify-center">
                      <button
                        className={`cursor-pointer rounded px-4 py-2 text-white transition ${
                          isDirty
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                        onClick={() => {
                          if (isDirty) {
                            setRecipe(index, recipe, true);
                          } else {
                            simulate(index);
                          }
                        }}
                      >
                        {isDirty ? "Save" : "Simulate"}
                      </button>
                    </div>

                    <div className="flex justify-end">
                      <CopyStyleButton
                        onClick={() => duplicateStand(index, name, recipe)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ flexGrow: 1 }}
        >
          <div className="relative z-10 flex h-[50%] w-[30%] max-w-2xl flex-col rounded-lg border-4 border-yellow-400 bg-yellow-50 p-6 shadow-2xl">
            <h2 className="mb-2 text-center text-2xl font-bold text-yellow-700">
              Simulation Results
            </h2>
            <pre className="flex-1 overflow-y-auto rounded bg-white p-4 whitespace-pre-wrap shadow-inner">
              {output}
            </pre>
            <div className="mt-4 flex justify-center">
              <button
                className="cursor-pointer rounded-lg bg-yellow-400 px-6 py-3 font-bold text-white shadow transition-transform hover:scale-105 hover:bg-yellow-500"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={showModal ? "dimmed" : ""}>
        <div className="relative w-full">
          <img
            src="/images/grass.png"
            alt="Grass"
            className="w-full object-cover"
            style={{ display: "block" }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;

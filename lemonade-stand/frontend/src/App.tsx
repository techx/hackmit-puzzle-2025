import { useEffect, useState } from "react";
import "./App.css";

type Recipe = { lemons?: number; sugar?: number; ice?: number; price?: number };
type ValidationErrors = {
  lemons?: string;
  sugar?: string;
  ice?: string;
  price?: string;
};
type Stand = { index: number; name: string; recipe: Recipe };

function isDefined<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null;
}

const App = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [stands, setStands] = useState<Stand[]>([]);
  const [output, setOutput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createName, setCreateName] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<number, ValidationErrors>>({});

  // const outputRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(
      `${location.protocol === "https:" ? "wss" : "ws"}://127.0.0.1:4300`,
    );
    socket.binaryType = "arraybuffer";

    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);

    socket.onmessage = (event) => {
      let text;
      try {
        text = new TextDecoder().decode(event.data);
      } catch (e) {
        void e;
        return;
      }
      setOutput(text);
      setShowModal(true);
    };

    setWs(socket);
    return () => socket.close();
  }, []);

  const send = (cmd: string) => {
    if (connected && ws && ws.readyState === WebSocket.OPEN) {
      ws.send(cmd + "\n");
    }
  };

  const allocateIndex = () => {
    const used = new Set(stands.map((s) => s.index));
    for (let i = 0; i < 16; i++) {
      if (!used.has(i)) return i;
    }
    return -1;
  };

  const createStand = (name: string) => {
    const index = allocateIndex();
    if (index === -1) return;
    send(`stand_create ${index} ${name.length} ${name}`);
    setStands((prev) => [...prev, { index, name, recipe: {} }]);
    setCreateName("");
    setShowCreateForm(false);
  };

  const renameStand = (index: number, name: string) => {
    send(`stand_rename ${index} ${name}`);
    setStands((prev) =>
      prev.map((s) => (s.index === index ? { ...s, name } : s)),
    );
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

  return (
    <div className="space-y-6 p-6" aria-disabled={!connected}>
      <h1 className="text-2xl font-bold">Lemonade Stand Simulator</h1>
      {!connected && <p className="text-red-500">Disconnected from server</p>}

      {showCreateForm ? (
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (createName) createStand(createName);
          }}
        >
          <input
            type="text"
            placeholder="Stand name"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            className="border p-2"
          />
          <button
            className="rounded bg-green-600 px-3 py-1 text-white"
            type="submit"
          >
            Create
          </button>
          <button
            className="text-gray-500"
            type="button"
            onClick={() => setShowCreateForm(false)}
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          className="btn rounded bg-blue-600 p-2 text-white disabled:opacity-50"
          onClick={() => setShowCreateForm(true)}
          disabled={!connected || stands.length >= 16}
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
                  defaultValue={name}
                  className="input mt-2 block w-full border p-1"
                />
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
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{name}</h2>
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
                Set
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

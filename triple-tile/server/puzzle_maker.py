import random
import json
import uuid
import math

COPIES_PER_ICON = 6

# three sizes, from top-of-stack (largest) to bottom (smallest)
SIZE_VARIATIONS = [72, 56, 49]

SCENE_RANGES = [(2, 6), (1, 6), (1, 7), (0, 7), (0, 8)]
OFFSETS      = [0, 25, -25, 50, -50]
ICON_TYPES   = [f"icons{i}" for i in range(10)]


def random_position_data(offset_pool, range_pair):
    """Return a random (row, col, offset) triple in your grid."""
    offset = random.choice(offset_pool)
    row    = random.randint(range_pair[0], range_pair[1])
    col    = random.randint(range_pair[0], range_pair[1])
    return row, col, offset


def generate_scene(level=1):
    range_pair   = SCENE_RANGES[min(4, level - 1)]
    offset_pool  = OFFSETS[: 1 + level]
    icon_pool    = ICON_TYPES[: 2 * level]

    # expand every 5 levels
    cmp_level = level
    while cmp_level > 5:
        extra = min(10, 2 * (cmp_level - 5))
        icon_pool += ICON_TYPES[:extra]
        cmp_level -= 5

    # first pass: collect raw row/col/offset for each tile
    raw = []
    for icon in icon_pool:
        for _ in range(COPIES_PER_ICON):
            row, col, off = random_position_data(offset_pool, range_pair)
            raw.append({
                "id":       str(uuid.uuid4())[:6],
                "iconName": icon,
                "row":      row,
                "col":      col,
                "offset":   off
            })

    total = len(raw)
    slice_size = math.ceil(total / len(SIZE_VARIATIONS))

    # second pass: assign cellSize by which “slice” of the stack you’re in
    scene = []
    for idx, entry in enumerate(raw):
        # pick 0,1,2 based on idx
        group = min(idx // slice_size, len(SIZE_VARIATIONS) - 1)
        cell_size = SIZE_VARIATIONS[group]

        x = entry["col"] * cell_size + entry["offset"]
        y = entry["row"] * cell_size + entry["offset"]

        scene.append({
            "id":       entry["id"],
            "x":        x,
            "y":        y,
            "status":   0,
            "isCover":  False,
            "iconName": entry["iconName"],
            "cellSize": cell_size
        })

    return scene


if __name__ == "__main__":
    level = 20
    scene = generate_scene(level)
    with open("scene.json", "w") as f:
        json.dump(scene, f, indent=2)
    print(f"Generated scene.json for level {level}, total tiles = {len(scene)}")
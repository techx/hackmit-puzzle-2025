import random
import json
import uuid

COPIES_PER_ICON = 6

# We keep the same 8×8 virtual grid ranges and percent offsets
SCENE_RANGES = [(2, 6), (1, 6), (1, 7), (0, 7), (0, 8)]
OFFSETS      = [0, 25, -25, 50, -50]  # now interpreted as percent
ICON_TYPES   = [f"icons{i}" for i in range(10)]


def random_position_data(offset_pool, range_pair):
    """Return a random (row, column, offset%) triple in your grid."""
    offset = random.choice(offset_pool)
    row    = random.randint(range_pair[0], range_pair[1])
    col    = random.randint(range_pair[0], range_pair[1])
    return row, col, offset


def generate_scene(level=1):
    # pick grid-range and offset-pool exactly as React makeScene does
    range_pair_1  = (0, 8)
    range_pair_2 = (1, 7)
    range_pair_3 = (2, 6)
    range_pair_4 = (3, 6)
    offset_pool = OFFSETS[: 1 + level]
    icon_pool   = ICON_TYPES[: 2 * level]

    # expand every 5 levels
    cmp_level = level
    while cmp_level > 5:
        extra = min(10, 2 * (cmp_level - 5))
        icon_pool += ICON_TYPES[:extra]
        cmp_level -= 5

    # place each icon 6× with random row/col/offset
    raw = []
    for icon in icon_pool:
        for _ in range(COPIES_PER_ICON):
            if len(raw) < 64:
                row, col, off = random_position_data(offset_pool, range_pair_1)
            elif 64 <= len(raw) < 128:
                row, col, off = random_position_data(offset_pool, range_pair_2)
            elif 128 <= len(raw) < 192:
                row, col, off = random_position_data(offset_pool, range_pair_3)
            else:
                row, col, off = random_position_data(offset_pool, range_pair_4)
            raw.append({
                "id":       str(uuid.uuid4())[:6],
                "iconName": icon,
                "row":      row,
                "col":      col,
                "offset":   off,
            })

    # now convert to percent‐based x/y matching React's column*100 + offset
    scene = []
    for entry in raw:
        x_pct = entry["col"] * 100 + entry["offset"]
        y_pct = entry["row"] * 100 + entry["offset"]
        scene.append({
            "id":       entry["id"],
            "x":        x_pct,
            "y":        y_pct,
            "status":   0,
            "isCover":  False,
            "iconName": entry["iconName"],
        })

    return scene


if __name__ == "__main__":
    level = 20
    scene = generate_scene(level)
    with open("scene.json", "w") as f:
        json.dump(scene, f, indent=2)
    print(f"Generated scene.json for level {level}, total tiles = {len(scene)}")

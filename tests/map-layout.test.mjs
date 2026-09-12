import test from "node:test";
import assert from "node:assert/strict";
import {
  boundsOf,
  fitCamera,
  zoomAt,
  layoutSide,
  edgePath,
} from "../src/components/map/layout.mjs";
const near = (actual, expected) =>
  assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);
test("zoom keeps the world point under the cursor, including zoom limit clamping", () => {
  const camera = { x: 130, y: -240, k: 0.8 },
    point = { x: 640, y: 360 };
  for (const factor of [0.5, 1.4, 50, 0.0001]) {
    const result = zoomAt(camera, point, factor);
    near((point.x - camera.x) / camera.k, (point.x - result.x) / result.k);
    near((point.y - camera.y) / camera.k, (point.y - result.y) / result.k);
    assert.ok(result.k >= 0.18 && result.k <= 2.4);
  }
});
test("fitted graph stays inside usable canvas and centers negative coordinates correctly", () => {
  const nodes = [
    { x: -400, y: -230, w: 180, h: 50 },
    { x: 480, y: 240, w: 220, h: 90 },
    { x: 0, y: 0, w: 180, h: 104 },
  ];
  const b = boundsOf(nodes),
    camera = fitCamera(b, 1120, 670, 45);
  for (const n of nodes) {
    assert.ok((n.x - n.w / 2) * camera.k + camera.x >= 45 - 1e-8);
    assert.ok((n.x + n.w / 2) * camera.k + camera.x <= 1075 + 1e-8);
    assert.ok((n.y - n.h / 2) * camera.k + camera.y >= 45 - 1e-8);
    assert.ok((n.y + n.h / 2) * camera.k + camera.y <= 625 + 1e-8);
  }
  near((b.x + b.width / 2) * camera.k + camera.x, 560);
});
test("branch groups never collide as case counts and collapsed state change", () => {
  for (let a = 0; a < 8; a++)
    for (let b = 0; b < 8; b++)
      for (let c = 0; c < 8; c++) {
        const rows = layoutSide(["a", "b", "c"], { a, b, c });
        for (let i = 1; i < rows.length; i++)
          assert.ok(
            rows[i].y - rows[i].height / 2 >
              rows[i - 1].y + rows[i - 1].height / 2,
          );
        near(rows[0].y - rows[0].height / 2, -(rows[2].y + rows[2].height / 2));
      }
});
test("horizontal edges terminate on the correct side of each node", () => {
  const a = { x: 0, y: 0, w: 100, h: 80 };
  assert.match(
    edgePath(a, { x: 300, y: 50, w: 100, h: 80 }),
    /^M 50 0 .* 250 50$/,
  );
  assert.match(
    edgePath(a, { x: -300, y: 50, w: 100, h: 80 }),
    /^M -50 0 .* -250 50$/,
  );
  assert.match(
    edgePath(a, { x: 0, y: 200, w: 100, h: 80 }, true),
    /^M 0 40 .* 0 160$/,
  );
});

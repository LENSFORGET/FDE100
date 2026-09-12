import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject, PointerEvent as ReactPointerEvent } from "react";
import { clamp, zoomAt } from "./layout.mjs";
import type { Camera } from "./layout.mjs";
type Point = { x: number; y: number };
export function useCamera(surface: RefObject<HTMLDivElement | null>) {
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, k: 1 });
  const live = useRef(camera);
  const [animated, setAnimated] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [size, setSize] = useState({ width: 1200, height: 700 });
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<{
    camera: Camera;
    point: Point;
    distance: number;
  } | null>(null);
  const move = useCallback((next: Camera, smooth = false) => {
    live.current = next;
    setAnimated(smooth);
    setCamera(next);
  }, []);
  const zoom = useCallback(
    (factor: number, point?: Point) => {
      const el = surface.current;
      if (!el) return;
      move(
        zoomAt(
          live.current,
          point || { x: el.clientWidth / 2, y: el.clientHeight / 2 },
          factor,
        ),
      );
    },
    [move, surface],
  );
  useEffect(() => {
    const el = surface.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [surface]);
  useEffect(() => {
    const el = surface.current;
    if (!el) return;
    const wheel = (event: WheelEvent) => {
      if ((event.target as Element).closest("[data-map-ui]")) return;
      event.preventDefault();
      const rect = el.getBoundingClientRect();
      if (event.shiftKey) {
        move({
          ...live.current,
          x: live.current.x - event.deltaY,
          y: live.current.y - event.deltaX,
        });
      } else {
        zoom(Math.exp(-event.deltaY * (event.ctrlKey ? 0.009 : 0.0018)), {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [move, zoom, surface]);
  function point(event: ReactPointerEvent): Point {
    const rect = surface.current!.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }
  function startGesture() {
    const points = [...pointers.current.values()];
    if (points.length === 1)
      gesture.current = { camera: live.current, point: points[0], distance: 0 };
    else if (points.length >= 2) {
      gesture.current = {
        camera: live.current,
        point: {
          x: (points[0].x + points[1].x) / 2,
          y: (points[0].y + points[1].y) / 2,
        },
        distance: Math.hypot(
          points[0].x - points[1].x,
          points[0].y - points[1].y,
        ),
      };
    }
  }
  function pointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (
      event.button !== 0 ||
      (event.target as Element).closest("button,a,input,[data-map-ui]")
    )
      return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, point(event));
    startGesture();
  }
  function pointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId) || !gesture.current) return;
    pointers.current.set(event.pointerId, point(event));
    const ps = [...pointers.current.values()],
      g = gesture.current;
    if (ps.length >= 2) {
      const center = { x: (ps[0].x + ps[1].x) / 2, y: (ps[0].y + ps[1].y) / 2 },
        distance = Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y);
      const k = clamp(
        (g.camera.k * distance) / Math.max(g.distance, 1),
        0.18,
        2.4,
      );
      move({
        k,
        x: center.x - ((g.point.x - g.camera.x) / g.camera.k) * k,
        y: center.y - ((g.point.y - g.camera.y) / g.camera.k) * k,
      });
      setDragging(true);
    } else {
      const dx = ps[0].x - g.point.x,
        dy = ps[0].y - g.point.y;
      if (Math.hypot(dx, dy) > 3) {
        move({ ...g.camera, x: g.camera.x + dx, y: g.camera.y + dy });
        setDragging(true);
      }
    }
  }
  function pointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size) startGesture();
    else {
      gesture.current = null;
      setDragging(false);
    }
  }
  return {
    camera,
    live,
    size,
    move,
    zoom,
    animated,
    dragging,
    handlers: {
      onPointerDown: pointerDown,
      onPointerMove: pointerMove,
      onPointerUp: pointerUp,
      onPointerCancel: pointerUp,
    },
  };
}

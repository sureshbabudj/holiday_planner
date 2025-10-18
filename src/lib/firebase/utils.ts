/* eslint-disable @typescript-eslint/no-explicit-any */
import { Timestamp } from "firebase/firestore";
import { z } from "zod";

/* ---------- narrow Timestamp type ---------- */
const isClientTimestamp = (v: unknown): v is Timestamp =>
  v instanceof Timestamp;
const isAdminTimestamp = (v: unknown): v is Timestamp =>
  v?.constructor?.name === "Timestamp";

/* ---------- generic converter ---------- */
type Schema = z.ZodObject<any, any>;
type Infer<S extends Schema> = z.infer<S> & { id: string };

function convertTimestamps(
  data: Record<string, unknown>,
  schema: Schema
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key in schema.shape) {
    const val = data[key];
    if (
      key.endsWith("At") &&
      schema.shape[key] instanceof z.ZodString &&
      (isClientTimestamp(val) || isAdminTimestamp(val))
    ) {
      out[key] = (val as any).toDate().toISOString();
    } else {
      out[key] = val;
    }
  }
  return out;
}

export function snapToTyped<S extends Schema>(
  snap: { id: string; data: () => Record<string, unknown> }, // minimal common shape
  schema: S
): Infer<S> {
  const raw = snap.data();
  const cleaned = convertTimestamps(raw, schema);
  return { id: snap.id, ...schema.parse(cleaned) };
}

export function snapsToTyped<S extends Schema>(
  snaps: { id: string; data: () => Record<string, unknown> }[],
  schema: S
): Infer<S>[] {
  return snaps.map((s) => snapToTyped(s, schema));
}

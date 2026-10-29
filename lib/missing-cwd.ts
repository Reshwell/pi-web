// Client-safe: a session's or fresh composer's folder that no longer exists
// (the project was moved or renamed, #1422). Routes add `reason: "cwd-missing"`
// and the folder to their error body, so the composer names the folder instead
// of showing the refusal as a model error.

export const CWD_MISSING_REASON = "cwd-missing";

/** The English `error` text routes answer with; the page shows a translated one. */
export function cwdMissingMessage(cwd: string): string {
  return `Directory does not exist: ${cwd}`;
}

/** Thrown on the server where a prompt is refused before it reaches the model. */
export class CwdMissingError extends Error {
  readonly reason = CWD_MISSING_REASON;
  constructor(readonly cwd: string) {
    super(cwdMissingMessage(cwd));
    this.name = "CwdMissingError";
  }
}

/** The error body fields a route answers a missing folder with. */
export function cwdMissingBody(cwd: string): { error: string; reason: typeof CWD_MISSING_REASON; cwd: string } {
  return { error: cwdMissingMessage(cwd), reason: CWD_MISSING_REASON, cwd };
}

/** The missing folder an error body names, else null. */
export function missingCwdFromBody(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const { reason, cwd } = body as { reason?: unknown; cwd?: unknown };
  return reason === CWD_MISSING_REASON && typeof cwd === "string" && cwd ? cwd : null;
}

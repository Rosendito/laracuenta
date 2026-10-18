// localStorage for the study pages: progress and the reader's own answers. Storage can
// be missing or blocked (private windows), so every access is guarded and the pages
// work without it.

const prefix = "laracuenta:learning:";

export function readStore(key: string): string | null {
  try {
    return localStorage.getItem(prefix + key);
  } catch {
    return null;
  }
}

export function writeStore(key: string, value: string) {
  try {
    localStorage.setItem(prefix + key, value);
  } catch {
    // progress is a convenience; losing it is fine
  }
}

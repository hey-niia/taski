import { Command } from "@tauri-apps/plugin-shell";

/**
 * Asks the on-device Apple Intelligence model (via the icon-suggester Swift
 * sidecar) for a single emoji representing a routine name. Never throws —
 * any failure (older macOS, Apple Intelligence disabled, sidecar missing)
 * just means no suggestion, since this is a cosmetic nicety, not core
 * functionality the app depends on.
 */
export async function suggestRoutineIcon(name: string): Promise<string | null> {
  try {
    const command = Command.sidecar("binaries/icon-suggester", [name]);
    const output = await command.execute();
    if (output.code !== 0) return null;
    const emoji = output.stdout.trim();
    return emoji || null;
  } catch {
    return null;
  }
}

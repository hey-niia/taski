import Foundation
import FoundationModels

// Reads a routine/task name from argv[1] and prints a single suggested emoji
// to stdout. Always prints something and exits 0 — this is a "nice to have"
// UI touch, so any failure (Apple Intelligence disabled, model unavailable,
// no output) falls back to a neutral default rather than surfacing an error
// to the person using the app.
let fallbackEmoji = "🗒️"

@main
struct IconSuggester {
    static func main() async {
        let name = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "Routine"

        guard SystemLanguageModel.default.isAvailable else {
            print(fallbackEmoji)
            return
        }

        do {
            let session = LanguageModelSession(instructions: """
                You choose exactly one emoji that best represents a short routine \
                or task name in a to-do app. Reply with ONLY that single emoji \
                character — no words, no quotes, no explanation, nothing else.
                """)
            let response = try await session.respond(to: name)
            let emoji = response.content.trimmingCharacters(in: .whitespacesAndNewlines)
            print(emoji.isEmpty ? fallbackEmoji : emoji)
        } catch {
            print(fallbackEmoji)
        }
    }
}

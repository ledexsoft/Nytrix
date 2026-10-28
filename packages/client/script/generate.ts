import { NodeFileSystem } from "@effect/platform-node"
import { compile, emitEffectImported, emitEffectShape, emitPromise, write } from "@nytrix/httpapi-codegen"
import { ClientApi, effectOmitEndpoints, groupNames, promiseOmitEndpoints } from "@nytrix/protocol/client"
import { Agent } from "@nytrix/schema/agent"
import { Command } from "@nytrix/schema/command"
import { Config } from "@nytrix/schema/config"
import { Credential } from "@nytrix/schema/credential"
import { Event } from "@nytrix/schema/event"
import { EventLog } from "@nytrix/schema/event-log"
import { FileDiff } from "@nytrix/schema/file-diff"
import { FileSystem } from "@nytrix/schema/filesystem"
import { Form } from "@nytrix/schema/form"
import { Generate } from "@nytrix/schema/generate"
import { Instruction } from "@nytrix/schema/instruction"
import { InstructionEntry } from "@nytrix/schema/instruction-entry"
import { Integration } from "@nytrix/schema/integration"
import { Location } from "@nytrix/schema/location"
import { Mcp } from "@nytrix/schema/mcp"
import { Model } from "@nytrix/schema/model"
import { Money } from "@nytrix/schema/money"
import { Permission } from "@nytrix/schema/permission"
import { PermissionSaved } from "@nytrix/schema/permission-saved"
import { Plugin } from "@nytrix/schema/plugin"
import { Project } from "@nytrix/schema/project"
import { Worktree } from "@nytrix/schema/worktree"
import { AgentAttachment, FileAttachment, Prompt, PromptMention } from "@nytrix/schema/prompt"
import { PromptInput } from "@nytrix/schema/prompt-input"
import { Provider } from "@nytrix/schema/provider"
import { Pty } from "@nytrix/schema/pty"
import { PtyTicket } from "@nytrix/schema/pty-ticket"
import { Question } from "@nytrix/schema/question"
import { Reference } from "@nytrix/schema/reference"
import { AbsolutePath, RelativePath } from "@nytrix/schema/schema"
import { Session } from "@nytrix/schema/session"
import { SessionMessage } from "@nytrix/schema/session-message"
import { SessionInbox } from "@nytrix/schema/session-inbox"
import { Shell } from "@nytrix/schema/shell"
import { Skill } from "@nytrix/schema/skill"
import { Snapshot } from "@nytrix/schema/snapshot"
import { UsageLimits } from "@nytrix/schema/usage-limits"
import { Vcs } from "@nytrix/schema/vcs"
import { WebSearch } from "@nytrix/schema/websearch"
import { Workspace } from "@nytrix/schema/workspace"
import { Effect, Schema } from "effect"
import { fileURLToPath } from "url"

const promiseContract = compile(ClientApi, { groupNames, omitEndpoints: promiseOmitEndpoints })
const effectContract = compile(ClientApi, { groupNames, omitEndpoints: effectOmitEndpoints })
const effectTypeReferences = [
  ...namespaceTypes("Agent", "@nytrix/schema/agent", Agent),
  ...namespaceTypes("Command", "@nytrix/schema/command", Command),
  ...namespaceTypes("Config", "@nytrix/schema/config", Config),
  ...namespaceTypes("Credential", "@nytrix/schema/credential", Credential),
  ...namespaceTypes("Event", "@nytrix/schema/event", Event),
  ...namespaceTypes("EventLog", "@nytrix/schema/event-log", EventLog),
  ...namespaceTypes("FileDiff", "@nytrix/schema/file-diff", FileDiff),
  ...namespaceTypes("FileSystem", "@nytrix/schema/filesystem", FileSystem),
  ...namespaceTypes("Form", "@nytrix/schema/form", Form),
  ...namespaceTypes("Generate", "@nytrix/schema/generate", Generate),
  ...namespaceTypes("Instruction", "@nytrix/schema/instruction", Instruction),
  ...namespaceTypes("InstructionEntry", "@nytrix/schema/instruction-entry", InstructionEntry),
  ...namespaceTypes("Integration", "@nytrix/schema/integration", Integration),
  typeReference("Location.PublicRef", "@nytrix/schema/location", Location.PublicRef),
  typeReference("Location.PublicInfo", "@nytrix/schema/location", Location.PublicInfo),
  ...namespaceTypes("Mcp", "@nytrix/schema/mcp", Mcp),
  ...namespaceTypes("Model", "@nytrix/schema/model", Model),
  ...namespaceTypes("Money", "@nytrix/schema/money", Money),
  ...namespaceTypes("Permission", "@nytrix/schema/permission", Permission),
  ...namespaceTypes("PermissionSaved", "@nytrix/schema/permission-saved", PermissionSaved),
  ...namespaceTypes("Plugin", "@nytrix/schema/plugin", Plugin),
  ...namespaceTypes("Project", "@nytrix/schema/project", Project),
  ...namespaceTypes("Worktree", "@nytrix/schema/worktree", Worktree),
  ...namespaceTypes("PromptInput", "@nytrix/schema/prompt-input", PromptInput),
  ...namespaceTypes("Provider", "@nytrix/schema/provider", Provider),
  ...namespaceTypes("Pty", "@nytrix/schema/pty", Pty),
  ...namespaceTypes("PtyTicket", "@nytrix/schema/pty-ticket", PtyTicket),
  ...namespaceTypes("Question", "@nytrix/schema/question", Question),
  ...namespaceTypes("Reference", "@nytrix/schema/reference", Reference),
  ...namespaceTypes("Session", "@nytrix/schema/session", Session),
  ...namespaceTypes("SessionMessage", "@nytrix/schema/session-message", SessionMessage),
  ...namespaceTypes("SessionInbox", "@nytrix/schema/session-inbox", SessionInbox),
  ...namespaceTypes("Shell", "@nytrix/schema/shell", Shell),
  ...namespaceTypes("Skill", "@nytrix/schema/skill", Skill),
  ...namespaceTypes("Snapshot", "@nytrix/schema/snapshot", Snapshot),
  ...namespaceTypes("UsageLimits", "@nytrix/schema/usage-limits", UsageLimits),
  ...namespaceTypes("Vcs", "@nytrix/schema/vcs", Vcs),
  ...namespaceTypes("WebSearch", "@nytrix/schema/websearch", WebSearch),
  ...namespaceTypes("Workspace", "@nytrix/schema/workspace", Workspace),
  typeReference("Prompt", "@nytrix/schema/prompt", Prompt),
  typeReference("PromptMention", "@nytrix/schema/prompt", PromptMention),
  typeReference("FileAttachment", "@nytrix/schema/prompt", FileAttachment),
  typeReference("AgentAttachment", "@nytrix/schema/prompt", AgentAttachment),
  typeReference("AbsolutePath", "@nytrix/schema/schema", AbsolutePath),
  typeReference("RelativePath", "@nytrix/schema/schema", RelativePath),
]

await Effect.runPromise(
  Effect.all(
    [
      write(
        emitPromise(promiseContract, {
          mutableOutputs: true,
        }),
        fileURLToPath(new URL("../src/promise/generated", import.meta.url)),
      ),
      write(
        emitEffectImported(effectContract, {
          module: "../../contract",
          api: "ClientApi",
          shapeModule: "../api/api.js",
        }),
        fileURLToPath(new URL("../src/effect/generated", import.meta.url)),
      ),
      write(
        emitEffectShape(effectContract, {
          typeReferences: effectTypeReferences,
          outputTypes: {
            "event.subscribe": {
              name: "OpenCodeEvent",
              import: 'import type { OpenCodeEvent } from "@nytrix/protocol/groups/event"',
            },
          },
        }),
        fileURLToPath(new URL("../src/effect/api", import.meta.url)),
      ),
    ],
    { concurrency: 3, discard: true },
  ).pipe(Effect.provide(NodeFileSystem.layer)),
)

function namespaceTypes(namespace: string, module: string, values: object) {
  return Object.entries(values).flatMap(([name, schema]) =>
    Schema.isSchema(schema) ? [typeReference(`${namespace}.${name}`, module, schema)] : [],
  )
}

function typeReference(name: string, module: string, schema: Schema.Top) {
  return {
    schema,
    name,
    import: `import type { ${name.split(".")[0]} } from ${JSON.stringify(module)}`,
  }
}

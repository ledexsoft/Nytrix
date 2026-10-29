// TODO: Keep additional network capabilities inside Schema and Protocol as the client grows; /effect must never import
// Core or Server. Preserve these datatype exports so internal model reorganizations do not require caller migrations.
import type { Effect } from "effect"
import type { Nytrix } from "./client.js"

export * from "./generated/index"
export { Nytrix } from "./client.js"
export type {
  AgentApi,
  AppApi,
  CommandApi,
  ConfigApi,
  EventApi,
  IntegrationApi,
  ModelApi,
  PluginApi,
  ProviderApi,
  ReferenceApi,
  RpcApi,
  RpcClient,
  WebSearchApi,
  SessionApi,
  SkillApi,
} from "./api.js"
export { Agent } from "@nytrix/schema/agent"
export { Command } from "@nytrix/schema/command"
export { Config } from "@nytrix/schema/config"
export { Credential } from "@nytrix/schema/credential"
export { Event } from "@nytrix/schema/event"
export { EventLog } from "@nytrix/schema/event-log"
export { FileSystem } from "@nytrix/schema/filesystem"
export { Form } from "@nytrix/schema/form"
export { Integration } from "@nytrix/schema/integration"
export { Location } from "@nytrix/schema/location"
export { Model } from "@nytrix/schema/model"
export { Permission } from "@nytrix/schema/permission"
export { PermissionSaved } from "@nytrix/schema/permission-saved"
export { Project } from "@nytrix/schema/project"
export { Worktree } from "@nytrix/schema/worktree"
export { Vcs } from "@nytrix/schema/vcs"
export { Provider } from "@nytrix/schema/provider"
export { Pty } from "@nytrix/schema/pty"
export { Question } from "@nytrix/schema/question"
export { Reference } from "@nytrix/schema/reference"
export { WebSearch } from "@nytrix/schema/websearch"
export { AbsolutePath, RelativePath } from "@nytrix/schema/schema"
export { Session } from "@nytrix/schema/session"
export { SessionInbox } from "@nytrix/schema/session-inbox"
export { SessionMessage } from "@nytrix/schema/session-message"
export { Skill } from "@nytrix/schema/skill"
export { Prompt } from "@nytrix/schema/prompt"
export { PromptInput } from "@nytrix/schema/prompt-input"
export type { NytrixEvent } from "@nytrix/protocol/groups/event"
export type NytrixClient = Effect.Success<ReturnType<typeof Nytrix.make>>

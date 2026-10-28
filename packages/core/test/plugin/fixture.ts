import { Agent } from "@nytrix/core/agent"
import { AISDK } from "@nytrix/core/aisdk"
import { Command } from "@nytrix/core/command"
import { Config } from "@nytrix/core/config"
import { Credential } from "@nytrix/core/credential"
import { Database } from "@nytrix/core/database/database"
import { FileAccess } from "@nytrix/core/file-access"
import { LayerNodePlatform } from "@nytrix/util/effect/app-node-platform"
import { AppProcess } from "@nytrix/util/process"
import { LayerNode } from "@nytrix/util/effect/layer-node"
import { Bus } from "@nytrix/core/bus"
import { FileSystem } from "@nytrix/core/filesystem"
import { FSUtil } from "@nytrix/util/fs-util"
import { Form } from "@nytrix/core/form"
import { Generate } from "@nytrix/core/generate"
import { Integration } from "@nytrix/core/integration"
import { KV } from "@nytrix/core/kv"
import { Location } from "@nytrix/core/location"
import { Mcp } from "@nytrix/core/mcp/index"
import { Model } from "@nytrix/core/model"
import { Npm } from "@nytrix/util/npm"
import { Plugin } from "@nytrix/core/plugin"
import { PluginHooks } from "@nytrix/core/plugin/hooks"
import { Provider } from "@nytrix/core/provider"
import { Session } from "@nytrix/core/session"
import { InstructionEntry } from "@nytrix/core/session/instruction-entry"
import { PersistentPty } from "@nytrix/core/persistent-pty"
import { LocationServiceMap } from "@nytrix/core/location-service-map"
import { AppNodeBuilder } from "@nytrix/core/effect/app-node-builder"
import { Permission } from "@nytrix/core/permission"
import { Reference } from "@nytrix/core/reference"
import { Rpc } from "@nytrix/core/rpc"
import { Skill } from "@nytrix/core/skill"
import { SkillDiscovery } from "@nytrix/core/skill/discovery"
import { Watcher } from "@nytrix/core/filesystem/watcher"
import { Tool } from "@nytrix/core/tool"
import { Vcs } from "@nytrix/core/vcs"
import { WebSearch } from "@nytrix/core/websearch"
import { Worktree } from "@nytrix/core/worktree"
import { WorktreeStrategies } from "@nytrix/core/worktree/strategies"
import { Effect, Layer } from "effect"
import { tempLocationLayer } from "../fixture/location"
import { emptyMcpLayer } from "../fixture/mcp"

const npmLayer = Layer.succeed(
  Npm.Service,
  Npm.Service.of({
    add: (name) => Effect.succeed({ directory: "", name }),
    resolve: (name) => Effect.succeed({ directory: "", name }),
    check: () => Effect.succeed(false),
    update: (name) => Effect.succeed({ directory: "", name }),
    which: () => Effect.undefined,
  }),
)

const generateLayer = Layer.succeed(
  Generate.Service,
  Generate.Service.of({
    text: () => Effect.succeed(""),
    image: () => Effect.die("unused"),
    decisions: () => Effect.die("unused"),
  }),
)

const configLayer = Config.testLayer()

const permissionLayer = Layer.succeed(
  Permission.Service,
  Permission.Service.of({
    close: Effect.void,
    ask: (input) => Effect.succeed({ id: input.id ?? Permission.ID.create(), effect: "ask" }),
    assert: () => Effect.void,
    assertNotDenied: () => Effect.void,
    reply: () => Effect.void,
    get: () => Effect.succeed(undefined),
    forSession: () => Effect.succeed([]),
    list: () => Effect.succeed([]),
  }),
)

export const makePluginTestLayer = (permission = permissionLayer) =>
  AppNodeBuilder.build(
    LayerNode.group([
      AppProcess.node,
      FileSystem.node,
      FSUtil.node,
      Location.node,
      Npm.node,
      Credential.node,
      Config.node,
      Database.node,
      FileAccess.node,
      Bus.node,
      Form.node,
      Generate.node,
      LayerNodePlatform.httpClient,
      Plugin.node,
      Agent.node,
      AISDK.node,
      Provider.node,
      Model.node,
      Command.node,
      Integration.node,
      KV.node,
      Mcp.node,
      Session.node,
      InstructionEntry.node,
      PersistentPty.node,
      LocationServiceMap.node,
      Permission.node,
      PluginHooks.node,
      Reference.node,
      Rpc.node,
      Skill.node,
      SkillDiscovery.node,
      Tool.node,
      Vcs.node,
      Watcher.node,
      WebSearch.node,
      Worktree.node,
      WorktreeStrategies.node,
    ]),
    [
      Location.node.replace(tempLocationLayer),
      Npm.node.replace(npmLayer),
      Config.node.replace(configLayer),
      Mcp.node.replace(emptyMcpLayer),
      Generate.node.replace(generateLayer),
      Permission.node.replace(permission),
    ],
  ).pipe(Layer.provideMerge(configLayer))

export const PluginTestLayer = makePluginTestLayer()

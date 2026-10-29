export * as NytrixWorkerd from "./workerd"

import { Layer } from "effect"
import type { Config, Scope } from "effect"
import { WorkerdProfile } from "../internal/workerd"
import { Nytrix } from "./nytrix"

export type Configuration = WorkerdProfile.Configuration

export interface CreateOptions<R = never> extends WorkerdProfile.Options {
  readonly log?: Nytrix.CreateOptions["log"]
  readonly plugins?: Nytrix.CreateOptions["plugins"]
  readonly workspaceProviders?: Nytrix.CreateOptions["workspaceProviders"]
  readonly instances?: Nytrix.CreateOptions<R>["instances"]
}

export const create = <R = never>({ log, plugins, workspaceProviders, instances, ...options }: CreateOptions<R>) => {
  const profile = WorkerdProfile.make(options)
  return Nytrix.create(
    { ...profile.options, log, plugins, workspaceProviders, instances },
    { overrides: profile.replacements },
  )
}

export const layer = <R = never>(
  options: CreateOptions<R>,
): Layer.Layer<Nytrix.Service, Config.ConfigError | Error, Exclude<R, Scope.Scope>> =>
  Layer.effect(Nytrix.Service, create(options))

export type Interface = Nytrix.Interface
export type Requirements = Scope.Scope

import { expect, test } from "bun:test"
import { Env } from "../src/env"

test("session environment omits server credentials", () => {
  const previousPassword = process.env.NYTRIX_PASSWORD
  const previousLegacyPassword = process.env.NYTRIX_SERVER_PASSWORD
  const previousValue = process.env.NYTRIX_SESSION_ENV_TEST
  process.env.NYTRIX_PASSWORD = "password"
  process.env.NYTRIX_SERVER_PASSWORD = "legacy"
  process.env.NYTRIX_SESSION_ENV_TEST = "included"

  const environment = Env.session()

  if (previousPassword === undefined) delete process.env.NYTRIX_PASSWORD
  else process.env.NYTRIX_PASSWORD = previousPassword
  if (previousLegacyPassword === undefined) delete process.env.NYTRIX_SERVER_PASSWORD
  else process.env.NYTRIX_SERVER_PASSWORD = previousLegacyPassword
  if (previousValue === undefined) delete process.env.NYTRIX_SESSION_ENV_TEST
  else process.env.NYTRIX_SESSION_ENV_TEST = previousValue

  expect(environment.NYTRIX_PASSWORD).toBeUndefined()
  expect(environment.NYTRIX_SERVER_PASSWORD).toBeUndefined()
  expect(environment.NYTRIX_SESSION_ENV_TEST).toBe("included")
})

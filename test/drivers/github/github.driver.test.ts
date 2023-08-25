import { test } from 'vitest';
import { GithubDriver } from "../../../src/drivers/github/github.driver";
import GithubDriverData from "./github.driver.data";


test('toUniverseTreeNode function should match the expected output', async () => {
  const treeRootSample: GithubDriver.TreeRoot = GithubDriverData;

  const resultOriginal = GithubDriver.toUniverseTreeNode(treeRootSample, "sampleOwner", "sampleRepo");

});


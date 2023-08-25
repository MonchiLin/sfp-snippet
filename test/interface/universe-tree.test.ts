import { test } from 'vitest';
import UniverseTreeData from "./universe-tree.data";
import { UniverseTreeNode } from "../../src/interface/universe-tree";

test('test link', async () => {
  console.log(UniverseTreeNode.link(UniverseTreeData.checkedNodes, UniverseTreeData.rootNode))
});

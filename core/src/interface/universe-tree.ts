import { DataNode } from "ant-design-vue/es/vc-tree/interface";

export interface UniverseTreeNode {
  /** Name of file */
  name: string,
  /** Path(Web) of file */
  url: string,
  /** Path(from repository root) of file */
  path: string,
  type: "file" | "directory",
  content?: UniverseTreeNodeContent,
  children: UniverseTreeNode[],
}

export interface UniverseTreeNodeContent {
  raw: string,
}

export namespace UniverseTreeNode {
  export const toAntTree = (node: UniverseTreeNode): DataNode => {
    return {
      title: node.name,
      key: node.path,
      children: node.children.map(i => toAntTree(i)),
    }
  }
}


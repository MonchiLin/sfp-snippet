import { DataNode } from "ant-design-vue/es/vc-tree/interface";

export interface UniverseTreeNode {
  /** Name of file */
  name: string,
  /**
   * Path(from repository root) of file
   * @example tsconfig.json
   * @example public/icons/icon48.png
   */
  path: string,
  type: "file" | "directory",
  content?: UniverseTreeNodeContent,
  children: UniverseTreeNode[],
}

export interface UniverseTreeNodeContent {
  raw: string,
  text: string,
  url: string,
  originalText: string,
}

export interface Repo {
  name: string;
  owner: string;
  url: string;
  defaultBranch: string;
}

export namespace UniverseTreeNode {
  /**
   * 判断节点是否可以选择
   * 如果是目录 -> 可以选择
   * 如果是文本文件(.ts .hs .kt .md 之类的文件) -> 可以选择
   * 如果是其他文件 -> 不可以选择
   * @param node
   */
  const checkable = (node: UniverseTreeNode) => {
    if (node.type === "directory") {
      return true;
    }
    const ext = node.name.split(".").pop();
    return true;
  }

  export const toAntTree = (node: UniverseTreeNode): DataNode => {
    return {
      title: node.name,
      key: node.path,
      children: node.children.map(i => toAntTree(i)),
      checkable: checkable(node),
      universeTreeNode: node,
    }
  }

  /**
   * 接受节点列表和根节点对象
   * 节点列表是扁平化的，需要将其根据 根节点对象 转换为树形结构, 并且节点列表的节点都是 type === "file"
   * 传入根节点的原因有两个
   * 1. 用于获取 directory 节点
   * 2. 合并所有节点到一个对象
   *
   * @param checkedNodes
   * @param rootNode
   */
  export const link = (checkedNodes: UniverseTreeNode[], rootNode: UniverseTreeNode): UniverseTreeNode => {
    // 先移除掉原始的 children
    checkedNodes = checkedNodes.map(i => ({
      ...i,
      children: []
    }));

    // 根据根节点对象构建输出节点
    const outputNode: UniverseTreeNode = {
      ...rootNode,
      children: [],
    };

    // 将每一个节点插入到正确的位置
    for (const node of checkedNodes) {
      // 根据路径切分来确定每一层
      const parts = node.path.split('/');
      let currentLevel: UniverseTreeNode[] = outputNode.children;

      for (let i = 0; i < parts.length - 1; i++) {
        // 查找当前层是否有匹配的目录
        let directoryNode = currentLevel.find(child => child.name === parts[i] && child.type === "directory");

        // 如果没有，基于 rootNode 创建一个
        if (!directoryNode) {
          directoryNode = {
            name: parts[i],
            path: parts.slice(0, i + 1).join('/'),
            type: "directory",
            children: [],
          };
          currentLevel.push(directoryNode);
        }

        // 进入到下一层
        currentLevel = directoryNode.children;
      }

      // 插入当前节点到最终的位置
      currentLevel.push(node);
    }

    return outputNode;
  };

  /**
   * 将树状结构转换为文本, 如果遇到 children 则递归转换 children
   *
   * -------------
   * # node.path
   * -------------
   * node.content.text
   *
   *
   * @param node
   * @param deep - 深度, 根据深度缩进
   */
  export const plain = (node: UniverseTreeNode, deep = 0): string => {
    let output = "";
    if (node.type === "directory") {
      if (node.path !== "/") {
        output += "#".repeat(deep) + ` Folder: ${node.path}---------------\n`;
      }
      output += node.children.map(i => plain(i, deep + 1)).join("\n");
    } else {
      output += "File: " + node.path + "\n";
      output += node.content!.text;
    }

    return output;
  }

  /**
   * Convert a UniverseTreeNode into a readable tree string.
   * @param node - The root node of the UniverseTree.
   * @param indent - Current level of indentation.
   * @param lastChild - Whether the current node is the last child of its parent.
   * @returns A formatted tree string.
   */
  export function toHierarchical(node: UniverseTreeNode, indent: string = "", lastChild: boolean = true): string {
    // Determine the current node's prefix
    const prefix = lastChild ? '└── ' : '├── ';

    // Concatenate the current node's name to the result
    let result = indent + prefix + node.name + "\n";

    // Recursively format children if it's a directory
    if (node.type === "directory" && node.children) {
      const childIndent = indent + (lastChild ? '  ' : '│ ');
      for (let i = 0; i < node.children.length; i++) {
        result += toHierarchical(node.children[i], childIndent, i === node.children.length - 1);
      }
    }

    return result;
  }
}

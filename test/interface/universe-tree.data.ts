// 示例测试数据
import { UniverseTreeNode } from "../../src/interface/universe-tree";

const rootNode: UniverseTreeNode = {
  name: "root",
  path: "",
  type: "directory",
  children: [
    {
      name: "src",
      path: "src",
      type: "directory",
      children: [
        {
          name: "main.ts",
          path: "src/main.ts",
          type: "file",
          content: {
            raw: "console.log('Hello, World!');",
            text: "console.log('Hello, World!');",
            url: "https://example.com/main.ts",
            originalText: "console.log('Hello, World!');",
          },
          children: [],
        },
      ],
    },
    {
      name: "public",
      path: "public",
      type: "directory",
      children: [
        {
          name: "index.html",
          path: "public/index.html",
          type: "file",
          content: {
            raw: "<html><head></head><body></body></html>",
            text: "<html><head></head><body></body></html>",
            url: "https://example.com/index.html",
            originalText: "<html><head></head><body></body></html>",
          },
          children: [],
        },
      ],
    },
  ],
};

const checkedNodes: UniverseTreeNode[] = [
  {
    name: "main.ts",
    path: "src/main.ts",
    type: "file",
    content: {
      raw: "console.log('Hello, World!');",
      text: "console.log('Hello, World!');",
      url: "https://example.com/main.ts",
      originalText: "console.log('Hello, World!');",
    },
    children: [],
  },
  {
    name: "index.html",
    path: "public/index.html",
    type: "file",
    content: {
      raw: "<html><head></head><body></body></html>",
      text: "<html><head></head><body></body></html>",
      url: "https://example.com/index.html",
      originalText: "<html><head></head><body></body></html>",
    },
    children: [],
  },
];


export default {
  rootNode,
  checkedNodes,
}
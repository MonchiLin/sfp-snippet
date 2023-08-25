import axios, { AxiosPromise } from "axios";
import { Constants } from "../../constants";
import { UniverseTreeNode, UniverseTreeNodeContent } from "../../interface/universe-tree";
import { b64DecodeUnicode } from "../../unclassfied/bs64";

export namespace GithubDriver {
  const baseURL = 'https://api.github.com';

  const service = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${Constants.githubPersonalAccessTokens}`
    }
  })

  export interface TreeRoot {
    sha: string
    url: string
    tree: Tree[]
    truncated: boolean
  }

  export interface Tree {
    /**
     * @example
     * packages/compiler-core/src/transforms/transformElement.ts
     * packages/compiler-core/src/xx.ts
     * .eslintrc.cjs
     */
    path: string
    mode: string
    type: string
    sha: string
    size?: number
    url: string
  }

  export function toUniverseTreeNode(treeRoot: TreeRoot, owner: string, repo: string): UniverseTreeNode {
    const repoURL = `https://github.com/${owner}/${repo}`
    const path = '/'

    function addNode(tree: UniverseTreeNode, pathParts: string[], node: Tree) {
      if (pathParts.length === 1) {
        tree.type = "directory"
        tree.children.push({
          type: "file",
          name: pathParts[0],
          children: [],
          path: node.path
        });
      } else {
        let subTree = tree.children.find(child => child.name === pathParts[0]);
        if (!subTree) {
          subTree = {
            name: pathParts[0],
            children: [],
            path: node.path,
            type: "directory",
          };
          tree.children.push(subTree);
        }
        addNode(subTree, pathParts.slice(1), node);
      }
    }

    const universeTree: UniverseTreeNode = {
      name: owner + '/' + repo,
      children: [],
      path: path,
      type: "directory",
    };

    treeRoot.tree.forEach(node => {
      const pathParts = node.path.split('/');
      addNode(universeTree, pathParts, node);
    });
    return universeTree;
  }

  export const tree = (owner: string, repo: string, branch: string): AxiosPromise<UniverseTreeNode> => {
    const url = `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
    return service.get<TreeRoot>(url)
      .then(res => {
        return {
          ...res,
          data: toUniverseTreeNode(res.data, owner, repo)
        }
      })
  }

  export interface ContentRoot {
    name: string
    path: string
    sha: string
    size: number
    url: string
    html_url: string
    git_url: string
    download_url: string
    type: string
    content: string
    encoding: string
    _links: Links
  }

  export interface Links {
    self: string
    git: string
    html: string
  }

  export const content = (owner: string, repo: string, path: string): AxiosPromise<UniverseTreeNodeContent> => {
    const url = `/repos/${owner}/${repo}/contents/${path}`
    return service.get<ContentRoot>(url)
      .then(res => {
        let text = "";
        try {
          text = b64DecodeUnicode(res.data.content)
        } catch (e) {

        }

        return {
          ...res,
          data: {
            raw: res.data.content,
            text: text,
            url: res.data.html_url,
            originalText: text,
          }
        }
      })
  }
}

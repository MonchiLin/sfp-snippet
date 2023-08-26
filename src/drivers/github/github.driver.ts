import axios, {AxiosPromise} from "axios";
import {Constants} from "../../constants";
import {Repo, UniverseTreeNode, UniverseTreeNodeContent} from "../../interface/universe-tree";
import {b64DecodeUnicode} from "../../unclassfied/bs64";

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

  export interface RepoRoot {
    id: number
    node_id: string
    name: string
    full_name: string
    private: boolean
    owner: Owner
    html_url: string
    description?: string
    fork: boolean
    url: string
    forks_url: string
    keys_url: string
    collaborators_url: string
    teams_url: string
    hooks_url: string
    issue_events_url: string
    events_url: string
    assignees_url: string
    branches_url: string
    tags_url: string
    blobs_url: string
    git_tags_url: string
    git_refs_url: string
    trees_url: string
    statuses_url: string
    languages_url: string
    stargazers_url: string
    contributors_url: string
    subscribers_url: string
    subscription_url: string
    commits_url: string
    git_commits_url: string
    comments_url: string
    issue_comment_url: string
    contents_url: string
    compare_url: string
    merges_url: string
    archive_url: string
    downloads_url: string
    issues_url: string
    pulls_url: string
    milestones_url: string
    notifications_url: string
    labels_url: string
    releases_url: string
    deployments_url: string
    created_at: string
    updated_at: string
    pushed_at: string
    git_url: string
    ssh_url: string
    clone_url: string
    svn_url: string
    homepage: any
    size: number
    stargazers_count: number
    watchers_count: number
    language?: string
    has_issues: boolean
    has_projects: boolean
    has_downloads: boolean
    has_wiki: boolean
    has_pages: boolean
    has_discussions: boolean
    forks_count: number
    mirror_url: any
    archived: boolean
    disabled: boolean
    open_issues_count: number
    license?: License
    allow_forking: boolean
    is_template: boolean
    web_commit_signoff_required: boolean
    topics: any[]
    visibility: string
    forks: number
    open_issues: number
    watchers: number
    default_branch: string
    permissions: Permissions
  }

  export interface Owner {
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: boolean
  }

  export interface License {
    key: string
    name: string
    spdx_id: string
    url: string
    node_id: string
  }

  export interface Permissions {
    admin: boolean
    maintain: boolean
    push: boolean
    triage: boolean
    pull: boolean
  }


  export const repos = (owner: string): AxiosPromise<Repo[]> => {
    const url = `/users/${owner}/repos`
    return service.get<RepoRoot[]>(url)
      .then(res => {
        return {
          ...res,
          data: res.data.map((repo) => {
            return {
              name: repo.name,
              url: repo.html_url,
              owner: repo.owner.login,
              defaultBranch: repo.default_branch,
            } as Repo
          })
        }
      })
  }
}

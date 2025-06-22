type FileNode = {
  name: string;
  type: 'file';
  content: string;
};

type FolderNode = {
  name: string;
  type: 'folder';
  children: Array<FileNode | FolderNode>;
};

// Merge helper
function mergeTrees(treeA: FolderNode[], treeB: FolderNode[]): FolderNode[] {
  const map = new Map<string, FileNode | FolderNode>();

  function addNode(path: string[], node: FileNode | FolderNode) {
    const key = path.join('/');

    if (node.type === 'file') {
      // Always override file from B if same path exists
      map.set(key, node);
    } else {
      // If folder already exists, merge children
      const existing = map.get(key);
      if (existing && existing.type === 'folder') {
        const mergedChildren = mergeTrees(
          existing.children as FolderNode[],
          node.children as FolderNode[]
        );
        map.set(key, { ...existing, children: mergedChildren });
      } else {
        map.set(key, { ...node });
      }
    }
  }

  function traverseAndAdd(base: FolderNode[], path: string[] = []) {
    for (const node of base) {
      const currentPath = [...path, node.name];
      addNode(currentPath, node);

      if (node.type === 'folder') {
        traverseAndAdd(node.children as FolderNode[], currentPath);
      }
    }
  }

  traverseAndAdd(treeA);
  traverseAndAdd(treeB); // B overrides A on conflict

  // Convert the flat map back to nested tree
  const buildTree = (): FolderNode[] => {
    const rootMap: Record<string, FolderNode> = {};
    const roots: FolderNode[] = [];

    for (const [key, node] of map) {
      const pathParts = key.split('/');
      if (node.type === 'file') {
        insertFile(roots, pathParts, node);
      } else {
        insertFolder(roots, pathParts);
      }
    }

    return roots;
  };

  function insertFolder(tree: FolderNode[], path: string[]) {
    let current = tree;
    for (const part of path) {
      let folder = current.find((n) => n.name === part && n.type === 'folder') as FolderNode;
      if (!folder) {
        folder = { name: part, type: 'folder', children: [] };
        current.push(folder);
      }
      current = folder.children as FolderNode[];
    }
  }

  function insertFile(tree: FolderNode[], path: string[], file: FileNode) {
    const folderPath = path.slice(0, -1);
    const fileName = path[path.length - 1];

    let current = tree;
    for (const part of folderPath) {
      let folder = current.find((n) => n.name === part && n.type === 'folder') as FolderNode;
      if (!folder) {
        folder = { name: part, type: 'folder', children: [] };
        current.push(folder);
      }
      current = folder.children as FolderNode[];
    }

    current.push({ ...file, name: fileName });
  }

  return buildTree();
}

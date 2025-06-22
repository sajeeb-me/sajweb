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

export function parser(input: string): FolderNode[] {
  const result: FolderNode[] = [];
  const srcFolder: FolderNode = {
    name: 'src',
    type: 'folder',
    children: [],
  };

  const fileRegex = /<boltAction[^>]*filePath="([^"]+)"[^>]*>\s*([\s\S]*?)<\/boltAction>/g;

  let match: RegExpExecArray | null;
  while ((match = fileRegex.exec(input)) !== null) {
    const filePath = match[1]; // e.g., src/components/TodoItem.tsx
    const content = match[2].trim();

    const pathParts = filePath.split('/');
    let currentFolder = srcFolder;

    for (let i = 1; i < pathParts.length; i++) {
      const part = pathParts[i];
      const isFile = i === pathParts.length - 1;

      if (isFile) {
        const fileNode: FileNode = {
          name: part,
          type: 'file',
          content,
        };
        currentFolder.children.push(fileNode);
      } else {
        let nextFolder = currentFolder.children.find(
          (child): child is FolderNode => child.type === 'folder' && child.name === part
        );

        if (!nextFolder) {
          nextFolder = {
            name: part,
            type: 'folder',
            children: [],
          };
          currentFolder.children.push(nextFolder);
        }

        currentFolder = nextFolder;
      }
    }
  }

  result.push(srcFolder);
  return result;
}

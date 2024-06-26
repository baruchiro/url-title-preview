import * as vscode from 'vscode';

const hoverContentCache: Map<string, vscode.MarkdownString> = new Map();

export const getOrCreate = async (key: string, createItem: () => Promise<vscode.MarkdownString>) => {
  if (hoverContentCache.has(key)) {
    return hoverContentCache.get(key)!;
  }

  const value = await createItem();
  hoverContentCache.set(key, value);
  return value;
};

export const clear = () => {
  hoverContentCache.clear();
};

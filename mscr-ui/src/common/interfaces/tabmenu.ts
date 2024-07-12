export enum ContentTab {
  Metadata = 0,
  Editor,
  History,
}

export const MscrTabs = {
  'metadata-and-files-tab': ContentTab.Metadata,
  'content-and-editor-tab': ContentTab.Editor,
  'history-tab': ContentTab.History,
} as const;

export type TabText = keyof typeof MscrTabs;

export type TabIndex = (typeof MscrTabs)[TabText];

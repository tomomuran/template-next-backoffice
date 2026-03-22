export const DEFAULT_UNSAVED_CHANGES_MESSAGE = "未保存の変更があります。ページを離れると入力内容が失われます。";

export function shouldWarnAboutUnsavedChanges(isDirty: boolean, isPending: boolean) {
  return isDirty && !isPending;
}

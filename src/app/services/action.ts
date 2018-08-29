export interface NoSelectionAction { type: 'noselect' }
export interface SelectAction<T> { item: T, type: 'select' }
export interface EditAction<T> { item: T, type: 'edit' }
export interface RemoveAction<T> { item: T, type: 'remove' }

export type ActionWithItem<T> = SelectAction<T>
                              | EditAction<T>
                              | RemoveAction<T>;

export type Action<T> = NoSelectionAction
                      | ActionWithItem<T>;

export function createNoSelection(): NoSelectionAction {
  return { type: 'noselect' };
}

export function createSelectAction<T>(item: T): SelectAction<T> {
  return { item, type: 'select' };
}

export function createEditAction<T>(item: T): EditAction<T> {
  return { item, type: 'edit' };
}

export function createRemoveAction<T>(item: T): RemoveAction<T> {
  return { item, type: 'remove' };
}

export function isSelect<T>(action: Action<T>): action is SelectAction<T> {
  return action.type === 'select';
}

export function isEdit<T>(action: Action<T>): action is EditAction<T> {
  return action.type === 'edit';
}

export function isRemove<T>(action: Action<T>): action is RemoveAction<T> {
  return action.type === 'remove';
}

export function extractItem<T>(action: ActionWithItem<T>) {
  return action.item;
}

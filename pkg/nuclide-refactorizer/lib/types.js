/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 * @format
 */

/*
 * This file houses types that are internal to this package. Types that are part of its public
 * interface are exported from main.js
 */

import type {
  AvailableRefactoring,
  FreeformRefactoring,
  RefactorRequest,
  RefactorProvider,
} from '..';

export type Store = {
  // Returns unsubscribe function
  subscribe(fn: () => mixed): () => void,
  dispatch(action: RefactorAction): void,
  getState(): RefactorState,
};

export type RefactorUIFactory = (store: Store) => IDisposable;

export type RefactorUI = 'generic' | 'simple-rename' | 'rename';

// State

export type ClosedState = {|
  type: 'closed',
|};

export type OpenState = {|
  type: 'open',
  ui: RefactorUI,
  phase: Phase,
|};

export type RefactorState = ClosedState | OpenState;

export type GetRefactoringsPhase = {|
  type: 'get-refactorings',
|};

export type PickPhase = {|
  type: 'pick',
  provider: RefactorProvider,
  originalPoint: atom$Point,
  editor: atom$TextEditor,
  availableRefactorings: Array<AvailableRefactoring>,
|};

export type RenamePhase = {|
  type: 'rename',
  provider: RefactorProvider,
  editor: atom$TextEditor,
  originalPoint: atom$Point,
  symbolAtPoint: {
    text: string,
    range: atom$Range,
  },
|};

export type FreeformPhase = {|
  type: 'freeform',
  provider: RefactorProvider,
  editor: atom$TextEditor,
  originalPoint: atom$Point,
  refactoring: FreeformRefactoring,
|};

export type ExecutePhase = {|
  type: 'execute',
|};

export type Phase =
  | GetRefactoringsPhase
  | PickPhase
  | RenamePhase
  | FreeformPhase
  | ExecutePhase;

export type RefactoringPhase = RenamePhase | FreeformPhase;

// Actions

export type OpenAction = {|
  type: 'open',
  ui: RefactorUI,
|};

export type GotRefactoringsAction = {|
  type: 'got-refactorings',
  payload: {
    originalPoint: atom$Point,
    editor: atom$TextEditor,
    provider: RefactorProvider,
    availableRefactorings: Array<AvailableRefactoring>,
  },
|};

export type ErrorSource = 'get-refactorings' | 'execute';

export type ErrorAction = {|
  type: 'error',
  payload: {
    source: ErrorSource,
    error: Error,
  },
|};

export type CloseAction = {|
  type: 'close',
|};

export type PickedRefactorAction = {|
  type: 'picked-refactor',
  payload: {
    refactoring: AvailableRefactoring,
  },
|};

export type ExecuteAction = {|
  type: 'execute',
  payload: {
    provider: RefactorProvider,
    refactoring: RefactorRequest,
  },
|};

export type RefactorAction =
  | OpenAction
  | CloseAction
  | PickedRefactorAction
  | GotRefactoringsAction
  | ErrorAction
  | ExecuteAction;

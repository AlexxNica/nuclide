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

import {Observable} from 'rxjs';
import * as Actions from './Actions';
import invariant from 'invariant';
import {arrayCompact} from 'nuclide-commons/collection';
import {
  getDeviceInfoProviders,
  getDeviceProcessesProviders,
  getDeviceTaskProviders,
} from '../providers';
import {DeviceTask} from '../DeviceTask';
import {createCache} from '../Cache';

import type {ActionsObservable} from '../../../commons-node/redux-observable';
import type {Action, Store, AppState, ProcessKiller} from '../types';

export function setDeviceEpic(
  actions: ActionsObservable<Action>,
  store: Store,
): Observable<Action> {
  return actions.ofType(Actions.SET_DEVICE).switchMap(action => {
    invariant(action.type === Actions.SET_DEVICE);
    const state = store.getState();
    return Observable.merge(
      Observable.fromPromise(getInfoTables(state)).switchMap(infoTables =>
        Observable.of(Actions.setInfoTables(infoTables)),
      ),
      Observable.fromPromise(getProcessKiller(state)).switchMap(processKiller =>
        Observable.of(Actions.setProcesKiller(processKiller)),
      ),
      Observable.fromPromise(getDeviceTasks(state)).switchMap(deviceTasks =>
        Observable.of(Actions.setDeviceTasks(deviceTasks)),
      ),
    );
  });
}

async function getInfoTables(
  state: AppState,
): Promise<Map<string, Map<string, string>>> {
  const device = state.device;
  if (device == null) {
    return new Map();
  }
  const sortedProviders = Array.from(getDeviceInfoProviders())
    .filter(provider => provider.getType() === state.deviceType)
    .sort((a, b) => {
      const pa = a.getPriority === undefined ? -1 : a.getPriority();
      const pb = b.getPriority === undefined ? -1 : b.getPriority();
      return pb - pa;
    });
  const infoTables = await Promise.all(
    sortedProviders.map(async provider => {
      try {
        if (!await provider.isSupported(state.host)) {
          return null;
        }
        return [
          provider.getTitle(),
          await provider.fetch(state.host, device.name),
        ];
      } catch (e) {
        return null;
      }
    }),
  );
  return new Map(arrayCompact(infoTables));
}

async function getProcessKiller(state: AppState): Promise<?ProcessKiller> {
  const device = state.device;
  if (device == null) {
    return null;
  }
  const providers = Array.from(getDeviceProcessesProviders()).filter(
    provider => provider.getType() === state.deviceType,
  );
  if (providers[0] != null) {
    return p => providers[0].killProcess(state.host, device.name, p);
  }
  return null;
}

// The actual device tasks are cached so that if a task is running when the store switches back and
// forth from the device associated with that task, the same running task is used
const deviceTaskCache = createCache();
async function getDeviceTasks(state: AppState): Promise<DeviceTask[]> {
  const device = state.device;
  if (device == null) {
    return [];
  }
  const actions = await Promise.all(
    Array.from(getDeviceTaskProviders())
      .filter(provider => provider.getType() === state.deviceType)
      .map(async provider => {
        try {
          if (!await provider.isSupported(state.host)) {
            return null;
          }
          return deviceTaskCache.getOrCreate(
            `${state.host}-${device.name}-${provider.getName()}`,
            () =>
              new DeviceTask(
                () => provider.getTask(state.host, device.name),
                provider.getName(),
              ),
          );
        } catch (e) {
          return null;
        }
      }),
  );
  return arrayCompact(actions).sort((a, b) =>
    a.getName().localeCompare(b.getName()),
  );
}

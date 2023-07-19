/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BackstagePlugin } from '@backstage/core-plugin-api';

// eslint-disable-next-line @backstage/no-undeclared-imports
import { modules, DetectedModule } from 'backstage-autodetected-plugins';

/**
 * @public
 */
export type DetectedPlugin = {
  name: string;
  plugin: BackstagePlugin;
  components: Record<string, any>;
};

/**
 * @public
 */
export function getAvailablePlugins(): DetectedPlugin[] {
  return modules
    .map(splitPluginFromComponents)
    .filter((m): m is DetectedPlugin => !!m.plugin);
}

function splitPluginFromComponents({ module, name }: DetectedModule) {
  return Object.entries(module).reduce(
    (acc, [k, v]) => {
      if (!isBackstagePlugin(v)) {
        acc.components[k] = v;
      } else {
        acc.plugin = v;
      }
      return acc;
    },
    { name, components: {} } as {
      name: string;
      plugin?: BackstagePlugin;
      components: Record<string, any>;
    },
  );
}

function isBackstagePlugin(obj: Record<string, any>): obj is BackstagePlugin {
  return (
    typeof obj.getId !== 'undefined' &&
    typeof obj.getApis !== 'undefined' &&
    typeof obj.getFeatureFlags !== 'undefined' &&
    typeof obj.provide !== 'undefined'
  );
}

import { KeyValuePair } from './data';

export interface Plugin {
  id: PluginID;
  name: PluginName;
  requiredKeys: KeyValuePair[];
}

export interface PluginKey {
  pluginId: PluginID;
  requiredKeys: KeyValuePair[];
}

export enum PluginID {
  GOOGLE_SEARCH = 'google-search',
  LOGIN= 'login',
  COUNT='count',
}

export enum PluginName {
  GOOGLE_SEARCH = 'Google Search',
  LOGIN = 'login',
  COUNT='count',
}

export const Plugins: Record<PluginID, Plugin> = {
  [PluginID.GOOGLE_SEARCH]: {
    id: PluginID.GOOGLE_SEARCH,
    name: PluginName.GOOGLE_SEARCH,
    requiredKeys: [
      {
        key: 'GOOGLE_API_KEY',
        value: '',
      },
      {
        key: 'GOOGLE_CSE_ID',
        value: '',
      },
    ],
  },  [PluginID.LOGIN]: {
    id: PluginID.LOGIN,
    name: PluginName.LOGIN,
    requiredKeys: [
    ],
  },  [PluginID.COUNT]: {
    id: PluginID.COUNT,
    name: PluginName.COUNT,
    requiredKeys: [
    ],
  },
};

export const PluginList = Object.values(Plugins);

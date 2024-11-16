import configLocal from '@/conf/appLocal';
import configDev from '@/conf/appDev';
import type { AppConfig } from '@/types/AppConfig';

/**
 * Load app configuration base on env value
 * @param {string} envModeValue env mode value
 * @returns {AppConfig} app config
 */
export const getEnvConfig = (envModeValue: string): AppConfig => {
  switch (envModeValue) {
    case 'local':
      return configLocal;
    case 'dev':
      return configDev;
    default:
      return configLocal;
  }
};

// La app de Keystatic con la configuración del panel; la monta src/cms/AdminPage.astro.
import { makePage } from '@keystatic/astro/ui';
import config from '../../keystatic.config';

export const Admin = makePage(config);

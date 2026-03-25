import { SettingsPage } from '../../features/settings/SettingsPage';
import { Layout } from '../../shared/layout/layout';

import { protectedPage } from './route-helpers';

export function settingsRoutes(layout: Layout) {
  return [
    {
      pathname: '/settings',
      element: () =>
        protectedPage(() => {
          layout.getHeader().setTitle('Настройки');
          return new SettingsPage().getElement();
        }),
    },
  ];
}

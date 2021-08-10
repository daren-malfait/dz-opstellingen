import CalendarIcon from 'part:@sanity/base/calendar-icon';
import { route } from 'part:@sanity/base/router';

import Calendar from './Calendar';

export default {
  title: 'Calendar',
  name: 'calendar',
  router: route('/:selectedDocumentId'),
  icon: CalendarIcon,
  component: Calendar,
};

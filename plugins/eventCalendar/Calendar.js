import { format, parse, startOfWeek, getDay, isPast } from 'date-fns';
import React, { useState } from 'react';
import { Calendar as CalendarUI, dateFnsLocalizer } from 'react-big-calendar';

import AgendaEvent from './AgendaEvent';
import styles from './Calendar.css';
import { nativeOptions } from './config';
import Event from './Event';
import EventDialog from './EventDialog';

import { useEvents } from './hooks';

import 'react-big-calendar/lib/css/react-big-calendar.css?raw';

const locales = {
  'nl-BE': require('date-fns/locale/nl-BE'),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => {
    return startOfWeek(new Date(), { weekStartsOn: 1 });
  },
  getDay,
  locales,
});

const components = {
  event: Event,
  agenda: {
    event: AgendaEvent,
  },
};

const Calendar = () => {
  const events = useEvents();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleOpenDialog = event => {
    setIsOpen(true);
    setSelectedEvent(event);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className={styles.container}>
      <CalendarUI
        components={components}
        className={styles.calendar}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleOpenDialog}
        eventPropGetter={({ end, start }) => {
          return {
            className: `
              ${styles.event}
              ${isPast(end || start) ? styles.past : styles.future}
            `,
          };
        }}
        {...nativeOptions}
      />
      {isOpen && (
        <EventDialog
          event={selectedEvent}
          isOpen={isOpen}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
};

export default Calendar;

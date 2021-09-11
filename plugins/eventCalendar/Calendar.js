import { format, parse, startOfWeek, getDay, isPast } from 'date-fns';
import React, { useState } from 'react';
import { Calendar as CalendarUI, dateFnsLocalizer } from 'react-big-calendar';
import Select from 'react-select';

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
  const [filter, setFilter] = React.useState(null);
  const events = useEvents();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = React.useMemo(() => {
    if (filter && filter.length > 0) {
      return events.filter(event =>
        filter.map(({ value }) => value).includes(event.team.name),
      );
    }

    return events;
  }, [filter, events]);

  const options = React.useMemo(() => {
    const unique = [...new Set(events.map(item => item.team.name))];

    return unique.map(team => ({ label: `DZ99 ${team}`, value: team }));
  }, [events]);

  const handleOpenDialog = event => {
    setIsOpen(true);
    setSelectedEvent(event);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setSelectedEvent(null);
  };

  function handleFilterChange(option) {
    setFilter(option);
  }

  return (
    <div className={styles.container}>
      <div className={styles.filter}>
        <Select
          isMulti
          options={options}
          placeholder="Filter teams..."
          onChange={handleFilterChange}
        />
      </div>
      <CalendarUI
        components={components}
        className={styles.calendar}
        localizer={localizer}
        events={filteredEvents}
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

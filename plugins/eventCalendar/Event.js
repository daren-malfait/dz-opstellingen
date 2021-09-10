import { format } from 'date-fns';
import React from 'react';

import config from './config';
import styles from './Event.css';

const Event = ({ event }) => {
  const title = React.useMemo(() => {
    const { away, opponent, team } = event;

    if (away) {
      return `${opponent} - DZ99 ${team.name}`;
    }

    return `DZ99 ${team.name} - ${opponent}`;
  }, [event]);

  return (
    <div className={styles.root} title={title}>
      <div className={styles.titleWrapper}>
        <h3 className={styles.title}>{title}</h3>
      </div>

      <time className={styles.time}>
        {format(event.start, config.timeFormat)}
      </time>
    </div>
  );
};

export default Event;

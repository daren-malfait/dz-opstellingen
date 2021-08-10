import { format } from 'date-fns';
import client from 'part:@sanity/base/client';
import React from 'react';

import config from './config';
import styles from './Event.css';

const Event = ({ event }) => {
  const [teamName, setTeamName] = React.useState('');

  React.useEffect(() => {
    async function getTeam() {
      const { team } = event;
      const result = await client.fetch(`*[_id == $id][0]`, {
        id: team._ref,
      });

      setTeamName(`DZ99 ${result.name}`);
    }

    getTeam();
  }, [event]);

  const title = React.useMemo(() => {
    const { away, opponent } = event;

    if (away) {
      return `${opponent} - ${teamName}`;
    }

    return `${teamName} - ${opponent}`;
  }, [event, teamName]);

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

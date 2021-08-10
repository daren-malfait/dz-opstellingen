import { format } from 'date-fns';

import client from 'part:@sanity/base/client';
import EditIcon from 'part:@sanity/base/edit-icon';
import Preview from 'part:@sanity/base/preview';
import schema from 'part:@sanity/base/schema';
import { getPublishedId } from 'part:@sanity/base/util/draft-utils';
import IntentButton from 'part:@sanity/components/buttons/intent';
import React from 'react';

import styles from './AgendaEvent.css';
import config from './config';

const AgendaEvent = ({ event }) => {
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

  const publishedId = getPublishedId(event._id || '');

  return (
    <div className={styles.root} title={title}>
      <div className={styles.inner}>
        <div className={styles.event}>
          <div className={styles.previewContainer}>
            <Preview
              value={event}
              type={schema.get(event._type)}
              layout="media"
            />
          </div>
          <div className={styles.details}>
            <h3 className={styles.label}>Title</h3>
            <div className={styles.value}>{title}</div>
            <h3 className={styles.label}>Scheduled for</h3>
            <time className={styles.value}>
              {format(event.start, config.dateFormat)} •{' '}
              {format(event.end, config.timeFormat)}
            </time>
          </div>
        </div>
        <div className={styles.actionsWrapper}>
          <IntentButton
            className={styles.intentButton}
            color="primary"
            icon={EditIcon}
            intent="edit"
            params={{ id: publishedId, type: event._type }}
          >
            Edit
          </IntentButton>
        </div>
      </div>
    </div>
  );
};

export default AgendaEvent;

import { format } from 'date-fns';
import client from 'part:@sanity/base/client';

import EditIcon from 'part:@sanity/base/edit-icon';
import { getPublishedId } from 'part:@sanity/base/util/draft-utils';
import ButtonGrid from 'part:@sanity/components/buttons/button-grid';
import Button from 'part:@sanity/components/buttons/default';
import IntentButton from 'part:@sanity/components/buttons/intent';
import Dialog from 'part:@sanity/components/dialogs/default';
import React from 'react';

import config from './config';
import styles from './EventDialog.css';

const EventDialog = ({ event, isOpen, onClose }) => {
  const { _id, _type, start } = event;

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

  const publishedId = getPublishedId(_id);

  return (
    <Dialog
      isOpen={isOpen}
      title={config.dialogTitle || title}
      onClose={onClose}
      onCloseClick={onClose}
      padding="none"
    >
      <div className={styles.root}>
        <div className={styles.inner}>
          <div className={styles.details}>
            <h3 className={styles.label}>Title</h3>
            <div className={styles.value}>{title}</div>
            <h3 className={styles.label}>Period</h3>
            <time className={styles.value}>
              {format(start, config.dateFormat)} -
              {` ${format(start, config.timeFormat)}`}
            </time>
          </div>
        </div>
        <div className={styles.actionsWrapper}>
          <ButtonGrid align="end">
            <IntentButton
              color="primary"
              icon={EditIcon}
              intent="edit"
              params={{ id: publishedId, type: _type }}
            >
              Edit
            </IntentButton>
            <Button kind="secondary" onClick={onClose}>
              Cancel
            </Button>
          </ButtonGrid>
        </div>
      </div>
    </Dialog>
  );
};

export default EventDialog;

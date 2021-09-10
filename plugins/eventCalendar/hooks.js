import { parseISO } from 'date-fns';

import client from 'part:@sanity/base/client';
import * as React from 'react';
import { useEffect, useState } from 'react';

const types = ['events'];

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const query = `*[_type == "events" && !(_id in path('drafts.**'))]{..., team->}`;
  const listenQuery =
    '*[_type == "events" && !(_id in path(\'drafts.**\'))]{..., team->}';

  const fetchWorkflowDocuments = React.useCallback(() => {
    client.fetch(query, { types: ['events'] }).then(handleReceiveEvents);
  }, [query]);

  const handleReceiveEvents = async documents => {
    const formatEvents = documents.map(event => ({
      ...event,
      start: parseISO(event.date),
      end: parseISO(event.date),
    }));

    setEvents(formatEvents);
  };

  useEffect(() => {
    fetchWorkflowDocuments();

    const subscription = client.observable
      .listen(listenQuery, { types })
      .subscribe(() => {
        setTimeout(() => {
          fetchWorkflowDocuments();
        }, 2500);
      });
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchWorkflowDocuments]);

  return events || undefined;
};

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Dropdown,
  navigation,
  NerdGraphQuery,
  ngql as gql,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableRowCell,
  Toast
} from 'nr1';
import { COLORS } from '../../constants/colors';
import { EVENTS_TIMES } from '../../constants/times';
import { EVENTS_TYPES } from '../../constants/types';
import { formatEventTime, formatHeaderTime } from '../../utils/times';

const EventsView = ({
  accountId,
  iDoc,
  selectedIDoc,
  eventsTimes,
  eventsTimeIndex,
  updateEventsTimeIndex
}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventTypes, setEventTypes] = useState(
    EVENTS_TYPES.reduce(
      (types, type) => ({
        ...types,
        [type.type]: { type: type.display, selected: true }
      }),
      {}
    )
  );

  useEffect(() => {
    if (!eventsTimes) return;
    const loadEvents = async () => {
      const [minTime, maxTime] = eventsTimes;
      const queryTime =
        maxTime > minTime
          ? `SINCE ${minTime} UNTIL ${maxTime}`
          : `SINCE ${minTime}`;
      const queryFilters = `WHERE instrumentation.provider = 'SAP' AND SYS_ID = '${iDoc.sysId}'`;
      const queryLimit = 'LIMIT MAX';
      const historyQuery = `SELECT * FROM NR_SAP_IDOC WHERE DOCNUM = '${iDoc.DOCNUM}' AND SYS_ID = '${iDoc.sysId}' ${queryTime} ${queryLimit}`;
      const transportsQuery = `SELECT * FROM NR_SAP_TRANSPORT ${queryFilters} ${queryTime} ${queryLimit}`;
      const logsQuery = `SELECT * FROM Log ${queryFilters} ${queryTime} ${queryLimit}`;
      const rfcDestinationsQuery = `SELECT * FROM NR_SAP_TRFC_STATUS ${queryTime} ${queryLimit}`;
      const tracesQuery = `SELECT * FROM DistributedTraceSummary WHERE FUNCTION_NAME = '${iDoc.processFunction ||
        ''}' ${queryTime} ${queryLimit}`;
      const query = gql`
        query IDocsQuery(
          $accounts: [Int!]!
          $historyQuery: Nrql!
          $rfcDestinationsQuery: Nrql!
          $tracesQuery: Nrql!
          $transportsQuery: Nrql!
          $logsQuery: Nrql!
        ) {
          actor {
            history: nrql(accounts: $accounts, query: $historyQuery) {
              results
            }
            rfcDestinations: nrql(
              accounts: $accounts
              query: $rfcDestinationsQuery
            ) {
              results
            }
            traces: nrql(accounts: $accounts, query: $tracesQuery) {
              results
            }
            transports: nrql(accounts: $accounts, query: $transportsQuery) {
              results
            }
            logs: nrql(accounts: $accounts, query: $logsQuery) {
              results
            }
          }
        }
      `;

      const variables = {
        accounts: [accountId],
        historyQuery,
        rfcDestinationsQuery,
        tracesQuery,
        transportsQuery,
        logsQuery
      };

      setLoading(true);
      const {
        loading,
        data: { actor: res } = {},
        error
      } = await NerdGraphQuery.query({ query, variables });
      setLoading(loading);
      if (error) return;
      const evts = Object.keys(res).reduce((evts, evt) => {
        if (evt === '__typename') return evts;
        (res[evt].results || []).forEach(e => {
          const event = {
            ...e,
            eventType: evt,
            eventColor:
              COLORS[evt === 'history' ? e.STATUS_LIGHT : evt.toUpperCase()]
          };
          if (evt === 'history')
            event.eventDescription = `${e.STATUS} ${e.STATUS_DESCRIPTION}. Message: ${e.STATUS_TEXT}`;
          if (evt === 'logs') event.eventDescription = e.message;
          if (evt === 'transports')
            event.eventDescription = `Transport: ${e.TRANSPORT} by ${e.OWNER} imported.  Return Code: ${e.RETURN_CODE}`;
          if (evt === 'rfcDestinations')
            event.eventDescription = `RFC Function: ${e.FUNCTION_NAME} returns status: ${e.RFC_STATUS} with message: ${e.RFC_MESSAGE}`;
          if (evt === 'traces')
            event.eventDescription = `Trace span of ${e.FUNCTION_NAME} at  ${e.DESTINATION} for ${e.DURATION} seconds. Called by ${e.PROGRAM_NAME} at line ${e.PROGRAM_LINE}`; // ${e['trace.id']}
          if (!evts.length) {
            evts.push(event);
          } else {
            let sortIdx = 0;
            while (
              sortIdx < evts.length &&
              event.timestamp < evts[sortIdx].timestamp
            )
              sortIdx += 1;
            evts.splice(sortIdx, 0, event);
          }
        });
        return evts;
      }, []);
      setEvents(evts);
    };

    if (!loading) loadEvents();
  }, [accountId, iDoc, selectedIDoc, eventsTimes, eventsTimeIndex]);

  const toggleType = type =>
    setEventTypes({
      ...eventTypes,
      [type]: {
        type: eventTypes[type].type,
        selected: !eventTypes[type].selected
      }
    });

  const filteredEvents = events.filter(
    evt => eventTypes[evt.eventType].selected
  );

  const selectedEventsCount = () => {
    const types = Object.keys(eventTypes);
    let selTypes = types.filter(type => eventTypes[type].selected).length;
    if (types.length === selTypes) return 'All event types';
    return `${selTypes} event type${--selTypes ? 's' : ''}`;
  };

  const tableActions = [
    {
      label: 'Show details',
      onClick: (_, { item }) => {
        if (item.eventType === 'logs')
          return navigation.openStackedNerdlet({
            id: 'logger.log-tailer',
            urlState: {
              accountId,
              query: `instrumentation.provider:SAP`,
              detailedLogId: item.messageId,
              eventType: ['Log'],
              timestamp: item.timestamp
            }
          });
        if ('SAPGUI_URL' in item) return window.open(item.SAPGUI_URL, '_blank');
        Toast.showToast({
          title: 'No details available',
          description: 'Details for the event are not available currently'
        });
      }
    }
  ];

  return (
    <div className="events-view">
      <Card>
        <CardHeader
          title="Events"
          subtitle={
            eventsTimes && eventsTimes.length === 2
              ? `${formatHeaderTime(eventsTimes[0])} - ${formatHeaderTime(
                  eventsTimes[1]
                )}`
              : ''
          }
        >
          <Dropdown
            title={`${selectedEventsCount()} within ${
              EVENTS_TIMES[eventsTimeIndex].display
            }`}
          >
            <div className="events-filters">
              <div className="time-filters">
                {EVENTS_TIMES.map((time, i) => (
                  <Checkbox
                    key={i}
                    onChange={() => updateEventsTimeIndex(i)}
                    label={time.display}
                    checked={i === eventsTimeIndex}
                  />
                ))}
              </div>
              <div className="events-filters-divider" />
              <div className="type-filters">
                {Object.keys(eventTypes).map((type, i) => (
                  <Checkbox
                    key={i}
                    onChange={() => toggleType(type)}
                    label={eventTypes[type].type}
                    checked={eventTypes[type].selected}
                  />
                ))}
              </div>
            </div>
          </Dropdown>
        </CardHeader>
        <CardBody>
          <Table items={filteredEvents}>
            <TableHeader>
              <TableHeaderCell value={({ item }) => item.timestamp} width="15%">
                Timestamp
              </TableHeaderCell>
              <TableHeaderCell width="15%">Event Type</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
            </TableHeader>
            {({ item, index }) => (
              <TableRow key={index} actions={tableActions}>
                <TableRowCell
                  style={{ borderLeft: `5px solid ${item.eventColor}` }}
                >
                  {formatEventTime(item.timestamp)}
                </TableRowCell>
                <TableRowCell>{eventTypes[item.eventType].type}</TableRowCell>
                <TableRowCell>{item.eventDescription}</TableRowCell>
              </TableRow>
            )}
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

EventsView.propTypes = {
  accountId: PropTypes.number,
  iDoc: PropTypes.object,
  selectedIDoc: PropTypes.object,
  eventsTimes: PropTypes.array,
  eventsTimeIndex: PropTypes.number,
  updateEventsTimeIndex: PropTypes.func
};

export default EventsView;

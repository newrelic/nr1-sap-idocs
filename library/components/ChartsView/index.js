import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Card, CardBody, CardHeader, ChartGroup, LineChart } from 'nr1';

import { HISTORY_TIMES } from '../../constants/times';
import { COLORS } from '../../constants/colors';

const ChartsView = ({
  history,
  historyTimeIndex,
  rfcDestinations,
  traces,
  transports,
  logs,
  selectedIDoc,
  eventsTimes
}) => {
  const [historyTime, setHistoryTime] = useState('');
  const [rfcDestinationsChartData, setRfcDestinationsChartData] = useState();
  const [tracesChartData, setTracesChartData] = useState();
  const [transportsChartData, setTransportsChartData] = useState();
  const [logsChartData, setLogsChartData] = useState();

  useEffect(() => {
    const { display } = HISTORY_TIMES[historyTimeIndex];
    setHistoryTime(display);

    const historyEvents = selectedIDoc ? [selectedIDoc] : history;
    const historyEventsData = historyEvents.map(
      ({ timestamp, STATUS, STATUS_LIGHT }, i) => ({
        metadata: {
          id: `status${i}`,
          name: `IDOC in status ${STATUS}`,
          color: COLORS[STATUS_LIGHT],
          viz: 'event'
        },
        data: [{ x0: timestamp, x1: timestamp }]
      })
    );
    const eventsData = {
      metadata: {
        id: 'events-window',
        name: 'Events window',
        color: 'rgba(101, 117, 123, .25)',
        viz: 'event'
      },
      data:
        eventsTimes && eventsTimes.length === 2
          ? [{ x0: eventsTimes[0], x1: eventsTimes[1] }]
          : []
    };

    const chartMeta = {
      viz: 'main',
      units_data: {
        x: 'TIMESTAMP',
        y: 'COUNT'
      }
    };

    setRfcDestinationsChartData([
      {
        metadata: {
          id: 'rfcDestinations',
          name: 'RFC Destinations',
          color: COLORS.RFC_DESTINATIONS,
          ...chartMeta
        },
        data: rfcDestinations.map(dest => ({
          x: (dest.beginTimeSeconds + dest.endTimeSeconds) / 0.002,
          y: dest.count
        }))
      },
      eventsData,
      ...historyEventsData
    ]);

    setTracesChartData([
      {
        metadata: {
          id: 'traces',
          name: 'Traces',
          color: COLORS.TRACES,
          ...chartMeta
        },
        data: traces.map(trace => ({
          x: (trace.beginTimeSeconds + trace.endTimeSeconds) / 0.002,
          y: trace.count
        }))
      },
      eventsData,
      ...historyEventsData
    ]);

    setTransportsChartData([
      {
        metadata: {
          id: 'transports',
          name: 'Transports',
          color: COLORS.TRANSPORTS,
          ...chartMeta
        },
        data: transports.map(transport => ({
          x: (transport.beginTimeSeconds + transport.endTimeSeconds) / 0.002,
          y: transport.count
        }))
      },
      eventsData,
      ...historyEventsData
    ]);

    setLogsChartData([
      {
        metadata: {
          id: 'logs',
          name: 'Logs',
          color: COLORS.LOGS,
          ...chartMeta
        },
        data: logs.map(log => ({
          x: (log.beginTimeSeconds + log.endTimeSeconds) / 0.002,
          y: log.count
        }))
      },
      eventsData,
      ...historyEventsData
    ]);
  }, [
    history,
    historyTimeIndex,
    rfcDestinations,
    traces,
    transports,
    logs,
    selectedIDoc,
    eventsTimes
  ]);

  return (
    <div className="charts-view">
      <ChartGroup>
        <Card>
          <CardHeader
            title="RFC Errors (IDOC specific)"
            subtitle={historyTime}
          />
          <CardBody>
            {rfcDestinationsChartData ? (
              <LineChart data={rfcDestinationsChartData} fullWidth />
            ) : null}
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Transaction Traces (IDOC specific)"
            subtitle={historyTime}
          />
          <CardBody>
            {tracesChartData ? (
              <LineChart data={tracesChartData} fullWidth />
            ) : null}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Transports (General)" subtitle={historyTime} />
          <CardBody>
            {transportsChartData ? (
              <LineChart data={transportsChartData} fullWidth />
            ) : null}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Log Entries (General)" subtitle={historyTime} />
          <CardBody>
            {logsChartData ? (
              <LineChart data={logsChartData} fullWidth />
            ) : null}
          </CardBody>
        </Card>
      </ChartGroup>
    </div>
  );
};

ChartsView.propTypes = {
  history: PropTypes.array,
  historyTimeIndex: PropTypes.number,
  rfcDestinations: PropTypes.array,
  traces: PropTypes.array,
  transports: PropTypes.array,
  logs: PropTypes.array,
  selectedIDoc: PropTypes.object,
  eventsTimes: PropTypes.array
};

export default ChartsView;

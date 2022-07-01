import React, { useState, useEffect, useContext } from 'react';

import { NerdGraphQuery, NerdletStateContext, ngql as gql } from 'nr1';
import CurrentView from '../../library/components/CurrentView';
import HistoryView from '../../library/components/HistoryView';
import ChartsView from '../../library/components/ChartsView';
import EventsView from '../../library/components/EventsView';
import { EVENTS_TIMES, HISTORY_TIMES } from '../../library/constants/times';
import { calculateTimeBlock } from '../../library/utils/times';

const DetailNerdlet = ({}) => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [rfcDestinations, setRfcDestinations] = useState([]);
  const [traces, setTraces] = useState([]);
  const [transports, setTransports] = useState([]);
  const [logs, setLogs] = useState([]);
  const [historyTimeIndex, setHistoryTimeIndex] = useState(0);
  const [selectedIDoc, setSelectedIDoc] = useState({});
  const [eventsTimes, setEventsTimes] = useState();
  const [eventsTimeIndex, setEventsTimeIndex] = useState(0);
  const {accountId, iDoc} = useContext(NerdletStateContext);

  useEffect(() => {
    const loadIDocs = async() => {
      const historyTime = HISTORY_TIMES[historyTimeIndex];
      const queryFilters = `WHERE instrumentation.provider = 'SAP' AND SYS_ID = '${iDoc.sysId}'`;
      const queryLimit = 'LIMIT MAX'
      const historyQuery = `SELECT * FROM NR_SAP_IDOC WHERE DOCNUM = '${iDoc.DOCNUM}' AND SYS_ID = '${iDoc.sysId}' ${queryLimit} ${historyTime.query}`;
      const transportsQuery = `SELECT count(*) FROM NR_SAP_TRANSPORT ${queryFilters} ${historyTime.query} TIMESERIES`;
      const logsQuery = `SELECT count(*) FROM Log ${queryFilters} ${historyTime.query} TIMESERIES`;
      const rfcDestinationsQuery = `SELECT count(*) FROM NR_SAP_TRFC_STATUS ${historyTime.query} TIMESERIES`;
      const tracesQuery = `SELECT count(*) FROM DistributedTraceSummary WHERE FUNCTION_NAME = '${iDoc.processFunction || ''}' ${historyTime.query} TIMESERIES`;
      const query = gql`query IDocsQuery($accounts: [Int!]!, $historyQuery: Nrql!, $rfcDestinationsQuery: Nrql!, $tracesQuery: Nrql!, $transportsQuery: Nrql!, $logsQuery: Nrql!) {
        actor {
          history: nrql(accounts: $accounts, query: $historyQuery) {
            results
          }
          rfcDestinations: nrql(accounts: $accounts, query: $rfcDestinationsQuery) {
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
      }`;

      const variables = {
        accounts: [accountId],
        historyQuery,
        rfcDestinationsQuery,
        tracesQuery,
        transportsQuery,
        logsQuery,
      };

      setLoading(true);
      const {loading: loadingResp, data: {actor: res} = {}, error} = await NerdGraphQuery.query({query, variables});
      console.log('detail data', res)
      console.log('detail error', error)
      setLoading(loadingResp);
      if (error || !res) return;
      
      const orderedHistory = [...res.history?.results].sort((a, b) => (+b.STATUS_SEQUENCE) - (+a.STATUS_SEQUENCE));console.log('orderedHistory', orderedHistory)
      if (orderedHistory.length) {
        setSelectedIDoc(orderedHistory[0]);
        const times = calculateTimeBlock(orderedHistory[0], EVENTS_TIMES[eventsTimeIndex]['medianMins']);
        setEventsTimes(times);
      }
      setHistory(orderedHistory);
      setRfcDestinations(res.rfcDestinations?.results || []);
      setTraces(res.traces?.results || []);
      setTransports(res.transports?.results || []);
      setLogs(res.logs?.results || []);
    }

    if (!loading) loadIDocs();

  }, [iDoc, accountId, historyTimeIndex]);

  const updateEventsTimeIndex = idx => {
    console.log('updateEventsTimeIndex', idx)
    const times = calculateTimeBlock(selectedIDoc, EVENTS_TIMES[idx]['medianMins']);
    setEventsTimes(times);
    setEventsTimeIndex(idx);
  }

  return (
    <div className="details">
      <div className="content">
        <div className="left-column">
          <div className="current-section">
            <CurrentView iDoc={iDoc} />
          </div>
          <div className="history-section">
            <HistoryView history={history} docnum={iDoc.DOCNUM} historyTimeIndex={historyTimeIndex} updateHistoryTime={setHistoryTimeIndex} updateSelectedIDoc={setSelectedIDoc} />
          </div>
        </div>
        <div className="right-column">
          <div className="charts-section">
            <ChartsView history={history} historyTimeIndex={historyTimeIndex} rfcDestinations={rfcDestinations} traces={traces} transports={transports} logs={logs} selectedIDoc={selectedIDoc} eventsTimes={eventsTimes} />
          </div>
          <div className="table-section">
            <EventsView accountId={accountId} iDoc={iDoc} selectedIDoc={selectedIDoc} eventsTimes={eventsTimes} eventsTimeIndex={eventsTimeIndex} updateEventsTimeIndex={updateEventsTimeIndex} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailNerdlet;

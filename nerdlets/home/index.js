import React, { useState, useEffect, useContext } from 'react';

import { AutoSizer, EmptyState, navigation, NerdGraphQuery, ngql as gql, usePlatformState, NerdletStateContext } from 'nr1';
import FilterBar from '../../library/components/FilterBar';
import IDocsList from '../../library/components/IDocsList';
import GraphView from '../../library/components/GraphView';

const HomeNerdlet = ({}) => {
  const {entityGuid} = useContext(NerdletStateContext);
  const [loading, setLoading] = useState(false);
  const [iDocs, setIDocs] = useState([]);
  const [direction, setDirection] = useState('OUTBOUND');
  const [filters, setFilters] = useState({});
  const [messageType, setMessageType] = useState();
  const [messageTypes, setMessageTypes] = useState([]);
  const [sysId, setSysId] = useState();
  const [sysIds, setSysIds] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [{accountId, timeRange}] = usePlatformState();
  
  useEffect(() => {
    if (loading || accountId === 'cross-account') return;
    const query = gql`query IDocsQuery($accounts: [Int!]!, $nrqlQuery: Nrql!) {
      actor {
        nrql(accounts: $accounts, query: $nrqlQuery) {
          results
        }
      }
    }`;
    const variables = { accounts: [accountId] };
    const queryTime = timeRange.duration 
      ? `SINCE ${Date.now() - timeRange.duration}` 
      : `SINCE ${timeRange.begin_time} UNTIL ${timeRange.end_time}`;
    const directionFilter = `WHERE DIRECTION = '${direction}'`;
    
    const maxQueryTime = 'SINCE 30 days ago';

    const loadEntityProps = async () => {
      const propsToLoad = 'latest(MESSAGE_TYPE) AS msgType, latest(SYS_ID) AS sId';
      variables.nrqlQuery = `SELECT ${propsToLoad} FROM NR_SAP_IDOC WHERE entity.guid = '${entityGuid}' ${maxQueryTime}`;
      setLoading(true);
      const {data: {actor: {nrql: {results: [{msgType, sId}]}}}, error} = await NerdGraphQuery.query({query, variables});
      if (error || !msgType || !sId) {
        setLoading(false);
        return;
      }
      setMessageType(msgType);
      setSysId(sId);
      
      loadFilterLists(msgType, sId);
    }

    const loadFilterLists = async (msgType, sId) => {
      const filterLists = 'uniques(MESSAGE_TYPE) AS uniqMsgTypes, uniques(STATUS) AS uniqStatuses, uniques(SYS_ID) AS uniqSysIds';
      variables.nrqlQuery = `SELECT ${filterLists} FROM NR_SAP_IDOC ${directionFilter} ${queryTime} LIMIT MAX`;
      setLoading(true);
      const {data: {actor: {nrql: {results: [{uniqMsgTypes, uniqStatuses, uniqSysIds}]}}}, error} = await NerdGraphQuery.query({query, variables});
      if (error || !uniqMsgTypes || !uniqStatuses) {
        setLoading(false);
        return;
      }
      setMessageTypes(uniqMsgTypes);
      setSysIds(uniqSysIds);
      setStatuses(uniqStatuses);

      loadIDocs(msgType, sId);
    }

    const loadIDocs = async (msgType, sId) => {
      const queryFilter = `${directionFilter} AND MESSAGE_TYPE = '${msgType}' AND SYS_ID = '${sId}'`;
      const fields = [
        'PRN', 'PRN_DESC', 'MESSAGE_TYPE', 'MESSAGE_TYPE_DESCRIPTION', 'PROCESS_FUNCTION',
        'STATUS', 'STATUS_DESCRIPTION', 'STATUS_GROUP', 'STATUS_LIGHT', 'STATUS_TEXT', 'SYS_ID'];
      const queryFields = fields.reduce((acc, cur) => 
        acc + `latest(${cur}) AS ${cur.toLowerCase().replace(/(_[a-z])/g, m => m.toUpperCase().replace('_', ''))}, `, '') 
        + `latest(${direction === 'OUTBOUND' ? 'RECEIVER' : 'SENDER'}_PORT) AS port, `
        + `latest(${direction === 'OUTBOUND' ? 'RECEIVER' : 'SENDER'}_PORT_RFCDEST) AS rfcDestination`;// 'DOCNUM', 

      variables.nrqlQuery = `SELECT ${queryFields} FROM NR_SAP_IDOC FACET DOCNUM ${queryFilter} ${queryTime} LIMIT MAX`;
      setLoading(true);
      const {loading: loadingResp, data, error} = await NerdGraphQuery.query({query, variables});
      console.log('data', data)
      console.log('error', error)
      setLoading(loadingResp);
      if (error || !data) return;
      setIDocs(data.actor?.nrql?.results || []);
    }

    if (!messageType || !sysId) {
      loadEntityProps();
    } else {
      loadFilterLists(messageType, sysId);
    }

  }, [accountId, timeRange, direction, messageType, sysId]);

  const filteredIDocs = Object.keys(filters).reduce((acc, cur) => {
    if (filters[cur] !== '') acc = acc.filter(elm => (new RegExp(filters[cur], 'i')).test(elm[cur]));
    return acc;
  }, iDocs);

  const updateFilters = (name, value) => setFilters({...filters, [name]: value});

  const selectHandler = iDoc => navigation.openStackedNerdlet({ 
    id: 'detail',
    urlState: { accountId, iDoc, timestamp: iDoc.timestamp } 
  });

  if (accountId === 'cross-account') return <EmptyState
    fullHeight
    fullWidth
    type={EmptyState.TYPE.ERROR}
    iconType={EmptyState.ICON_TYPE.INTERFACE__STATE__CRITICAL}
    title="No account selected!"
    description="Please choose an account to get started."
  />

  return (
    <div className="container">
      <div className="main-content">
        <div className="viz-section">
          <AutoSizer>
            {({ width, height }) => (
              <GraphView height={height} width={width} direction={direction} iDocs={filteredIDocs} />
            )}
          </AutoSizer>
          <FilterBar setDirection={setDirection} messageType={messageType} messageTypes={messageTypes} updateMessageType={setMessageType} sysId={sysId} sysIds={sysIds} updateSysId={setSysId} statuses={statuses} updateFilters={updateFilters} />
        </div>
        <div className="table-section">
          {filteredIDocs && filteredIDocs.length
            ? <IDocsList iDocs={filteredIDocs} selectHandler={selectHandler} />
            : <EmptyState
                title="No IDOCs to display"
                description="Try changing the filters or the time period."
              />
          }
        </div>
      </div>
    </div>
  );
}

export default HomeNerdlet;

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { BlockText, Dropdown, DropdownItem, HeadingText } from 'nr1';
import Arrow from './arrow';

import { HISTORY_TIMES } from '../../constants/times';
import { formatHeaderTime } from '../../utils/times';

const HistoryView = ({
  history,
  docnum,
  historyTimeIndex,
  updateHistoryTime,
  updateSelectedIDoc
}) => {
  const [selectedIDocIndex, setSelectedIDocIndex] = useState();
  const historyTime = HISTORY_TIMES[historyTimeIndex];

  const idocClickHandler = idx => {
    if (selectedIDocIndex !== idx) {
      setSelectedIDocIndex(idx);
      updateSelectedIDoc(history[idx]);
    } else {
      setSelectedIDocIndex();
      updateSelectedIDoc(history[0]);
    }
  };

  const isMuted = idx => selectedIDocIndex >= 0 && selectedIDocIndex !== idx;

  return (
    <div className="history-view">
      <HeadingText type={HeadingText.TYPE.HEADING_4}>
        IDOC {docnum || ''} Status History
      </HeadingText>
      <Dropdown title={historyTime.display}>
        {HISTORY_TIMES.map((period, i) => (
          <DropdownItem key={i} onClick={() => updateHistoryTime(i)}>
            {period.display}
          </DropdownItem>
        ))}
      </Dropdown>

      <div className="history-table">
        {history.map((evt, i) => (
          <React.Fragment key={i}>
            <div
              className={`status ${(evt.STATUS_LIGHT || '').toLowerCase()} ${
                isMuted(i) ? 'muted' : ''
              }`}
              onClick={() => idocClickHandler(i)}
            >
              {evt.STATUS}
            </div>
            <div
              className={`description ${isMuted(i) ? 'muted' : ''}`}
              onClick={() => idocClickHandler(i)}
            >
              <BlockText>{evt.STATUS_DESCRIPTION}</BlockText>
              <BlockText className="timestamp">
                {formatHeaderTime(evt.timestamp)}
              </BlockText>
            </div>
            {i < history.length - 1 ? <Arrow /> : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

HistoryView.propTypes = {
  history: PropTypes.array,
  docnum: PropTypes.string,
  historyTimeIndex: PropTypes.number,
  updateHistoryTime: PropTypes.func,
  updateSelectedIDoc: PropTypes.func
};

export default HistoryView;

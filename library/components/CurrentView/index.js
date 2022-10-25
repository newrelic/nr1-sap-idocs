import React from 'react';
import PropTypes from 'prop-types';

import { BlockText } from 'nr1';

const CurrentView = ({ iDoc }) => {
  return (
    <div className={`current-view ${(iDoc.statusLight || '').toLowerCase()}`}>
      <BlockText type={BlockText.TYPE.PARAGRAPH}>
        <strong>DOCNUM:</strong> {iDoc.DOCNUM}
      </BlockText>
      <BlockText type={BlockText.TYPE.PARAGRAPH}>
        <strong>Current Status:</strong> {iDoc.status}
      </BlockText>
      <BlockText type={BlockText.TYPE.PARAGRAPH}>
        <strong>Partner:</strong> {iDoc.prn}
      </BlockText>
      <BlockText type={BlockText.TYPE.PARAGRAPH}>
        <strong>Port:</strong> {iDoc.port}
      </BlockText>
      <BlockText type={BlockText.TYPE.PARAGRAPH}>
        <strong>RFC Destination:</strong> {iDoc.rfcDestination}
      </BlockText>
    </div>
  );
};

CurrentView.propTypes = {
  iDoc: PropTypes.object
};

export default CurrentView;

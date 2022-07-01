import React from 'react';
import PropTypes from 'prop-types';

import { Table, TableHeader, TableHeaderCell, TableRow, TableRowCell, Tooltip } from 'nr1';

const IDocsList = ({ iDocs, selectHandler }) => {

  // if (!items || !Array.isArray(items) || !items.length) return null;

  return (
    <div className="table-view">
      <Table
        selectionType={Table.SELECTION_TYPE.SINGLE}
        items={iDocs}
        // selected={({ index }) => console.log('selected', index)}
        onSelect={(_, {item}) => selectHandler(item)}
        multivalue
      >
        <TableHeader>
          <TableHeaderCell value={({ item }) => item.DOCNUM}>
            DOCNUM
          </TableHeaderCell>
          <TableHeaderCell value={({ item }) => item.prn}>
            Partner
          </TableHeaderCell>
          <TableHeaderCell value={({ item }) => item.port}>
            Port
          </TableHeaderCell>
          <TableHeaderCell value={({ item }) => item.status}>
            Status
          </TableHeaderCell>
          <TableHeaderCell value={({ item }) => item.messageType}>
            Message
          </TableHeaderCell>
        </TableHeader>

        {({ item }) => (
          <TableRow>
            <TableRowCell>{item.DOCNUM}</TableRowCell>
            <TableRowCell additionalValue={item.prnDesc || '-'}>{item.prn}</TableRowCell>
            <TableRowCell additionalValue={item.rfcDestination || '-'}>{item.port}</TableRowCell>
            <TableRowCell additionalValue={item.statusDescription || '-'}>{item.status}</TableRowCell>
            <TableRowCell additionalValue={item.messageTypeDescription || '-'}>{item.messageType}</TableRowCell>
          </TableRow>
        )}
      </Table>
    </div>
  );
}

{/* 
            <TableRowCell><Tooltip text={item.prnDesc || '-'}>{item.prn}</Tooltip></TableRowCell>
            <TableRowCell><Tooltip text={item.rfcDestination || '-'}>{item.port}</Tooltip></TableRowCell>
            <TableRowCell><Tooltip text={item.statusDescription || '-'}>{item.status}</Tooltip></TableRowCell>
            <TableRowCell><Tooltip text={item.messageTypeDescription || '-'}>{item.messageType}</Tooltip></TableRowCell>
 */}

IDocsList.propTypes = {
  iDocs: PropTypes.array,
  selectHandler: PropTypes.func,
};

export default IDocsList;

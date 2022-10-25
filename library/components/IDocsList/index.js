import React from 'react';
import PropTypes from 'prop-types';

import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableRowCell
} from 'nr1';

const IDocsList = ({ iDocs, selectHandler }) => {
  return (
    <div className="table-view">
      <Table
        selectionType={Table.SELECTION_TYPE.SINGLE}
        items={iDocs}
        onSelect={(_, { item }) => selectHandler(item)}
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
            <TableRowCell additionalValue={item.prnDesc || '-'}>
              {item.prn}
            </TableRowCell>
            <TableRowCell additionalValue={item.rfcDestination || '-'}>
              {item.port}
            </TableRowCell>
            <TableRowCell additionalValue={item.statusDescription || '-'}>
              {item.status}
            </TableRowCell>
            <TableRowCell additionalValue={item.messageTypeDescription || '-'}>
              {item.messageType}
            </TableRowCell>
          </TableRow>
        )}
      </Table>
    </div>
  );
};

IDocsList.propTypes = {
  iDocs: PropTypes.array,
  selectHandler: PropTypes.func
};

export default IDocsList;

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Dropdown,
  DropdownItem,
  SegmentedControl,
  SegmentedControlItem,
  Switch,
  TextField
} from 'nr1';

const FilterBar = ({
  setDirection,
  messageType,
  messageTypes,
  updateMessageType,
  sysId,
  sysIds,
  updateSysId,
  statuses,
  updateFilters
}) => {
  const [values, setValues] = useState({
    msgType: '',
    sysId: '',
    DOCNUM: '',
    prn: '',
    port: '',
    status: '',
    rfcDestination: ''
  });
  const [allFilters, setAllFilters] = useState(false);

  const changeHandler = (evt, name) => {
    const {
      target: { value }
    } = evt;
    setValues({ ...values, [name]: value });
    updateFilters(name, value);
  };

  const changeStatus = st => {
    const status = st === '(clear)' ? '' : st;
    setValues({ ...values, status });
    updateFilters('status', status);
  };

  const statusList = ['(clear)', ...statuses];

  const showAllFilters = () => setAllFilters(!allFilters);

  return (
    <div className="filters">
      <SegmentedControl onChange={(_, value) => setDirection(value)}>
        <SegmentedControlItem value="OUTBOUND" label="Outbound" />
        <SegmentedControlItem value="INBOUND" label="Inbound" />
      </SegmentedControl>
      <Dropdown
        label="Filter by Message Type"
        title={values.msgType || messageType}
        items={messageTypes}
      >
        {({ item, index }) => (
          <DropdownItem key={index} onClick={() => updateMessageType(item)}>
            {item}
          </DropdownItem>
        )}
      </Dropdown>
      <Dropdown
        label="Filter by System"
        title={values.sysId || sysId}
        items={sysIds}
      >
        {({ item, index }) => (
          <DropdownItem key={index} onClick={() => updateSysId(item)}>
            {item}
          </DropdownItem>
        )}
      </Dropdown>
      <TextField
        label="Filter by IDoc Number"
        placeholder=""
        value={values.DOCNUM}
        onChange={evt => changeHandler(evt, 'DOCNUM')}
      />
      <TextField
        label="Filter by Partner"
        placeholder=""
        value={values.prn}
        onChange={evt => changeHandler(evt, 'prn')}
      />
      <TextField
        label="Filter by Port"
        placeholder=""
        value={values.port}
        onChange={evt => changeHandler(evt, 'port')}
      />

      <Dropdown
        label="Filter by Status Code"
        title={values.status}
        items={statusList}
      >
        {({ item, index }) => (
          <DropdownItem key={index} onClick={() => changeStatus(item)}>
            {item}
          </DropdownItem>
        )}
      </Dropdown>
      <Switch
        checked={allFilters}
        label="Additional filters"
        info="show additional filter options"
        onChange={showAllFilters}
      />

      {allFilters ? (
        <>
          <TextField label="Filter by Transaction/ Program" placeholder="" />
          <TextField
            label="Filter by RFC Destination"
            placeholder=""
            value={values.rfcDestination}
            onChange={evt => changeHandler(evt, 'rfcDestination')}
          />
          <TextField label="Search Error Message" placeholder="" />
        </>
      ) : null}
    </div>
  );
};

FilterBar.propTypes = {
  setDirection: PropTypes.func,
  messageType: PropTypes.string,
  messageTypes: PropTypes.array,
  updateMessageType: PropTypes.func,
  sysId: PropTypes.string,
  sysIds: PropTypes.array,
  updateSysId: PropTypes.func,
  statuses: PropTypes.array,
  updateFilters: PropTypes.func
};

export default FilterBar;

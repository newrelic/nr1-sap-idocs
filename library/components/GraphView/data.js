const data = {
  OUTBOUND: {
    viewBox: '0 0 898 479',
    nodes: [
      {
        name: '42',
        disp: 'IDoc was created by test transaction',
        color: 'yellow',
        x: 0,
        y: 53
      },
      {
        name: '37',
        disp: 'Error when adding IDoc',
        color: 'green',
        x: 28,
        y: 424
      },
      { name: '01', disp: 'IDoc created', color: 'yellow', x: 57, y: 101 },
      { name: '29', disp: 'Error in ALE service', color: 'red', x: 77, y: 381 },
      {
        name: '30',
        disp: 'IDoc ready for dispatch (ALE service)',
        color: 'yellow',
        x: 140,
        y: 101
      },
      {
        name: '02',
        disp: 'Error passing data to port',
        color: 'red',
        x: 155,
        y: 354
      },
      {
        name: '03',
        disp: 'Data passed to port OK',
        color: 'green',
        x: 222,
        y: 101
      },
      {
        name: '20',
        disp: 'Error triggering EDI subsystem',
        color: 'red',
        x: 227,
        y: 322
      },
      { name: '32', disp: 'IDoc was edited', color: 'green', x: 287, y: 170 },
      {
        name: '33',
        disp: 'Original of an IDoc which was edited',
        color: 'green',
        x: 289,
        y: 260
      },
      {
        name: '18',
        disp: 'Triggering EDI subsystem OK',
        color: 'green',
        x: 338,
        y: 101
      },
      {
        name: '39',
        disp: 'IDoc is in the target system (ALE service)',
        color: 'red',
        x: 341,
        y: 227
      },
      {
        name: '24',
        disp: 'Control information of EDI subsystem OK',
        color: 'green',
        x: 434,
        y: 101
      },
      {
        name: '41',
        disp: 'Application document created in target system',
        color: 'green',
        x: 421,
        y: 227
      },
      { name: '06', disp: 'Translation OK', color: 'green', x: 519, y: 95 },
      { name: '12', disp: 'Dispatch OK', color: 'green', x: 502, y: 227 },
      {
        name: '40',
        disp: 'Application document not created in target system',
        color: 'red',
        x: 489,
        y: 332
      },
      {
        name: '04',
        disp: 'Error within control information of EDI subsystem',
        color: 'red',
        x: 615,
        y: 0
      },
      { name: '08', disp: 'Syntax check OK', color: 'green', x: 620, y: 123 },
      {
        name: '10',
        disp: 'Interchange handling OK',
        color: 'green',
        x: 582,
        y: 190
      },
      {
        name: '22',
        disp: 'Dispatch OK, acknowledgment still due',
        color: 'green',
        x: 586,
        y: 285
      },
      {
        name: '04',
        disp: 'Error within control information of EDI subsystem',
        color: 'red',
        x: 755,
        y: 60
      },
      {
        name: '09',
        disp: 'Error during interchange handling',
        color: 'red',
        x: 718,
        y: 163
      },
      {
        name: '11',
        disp: 'Error during dispatch',
        color: 'red',
        x: 661,
        y: 233
      },
      {
        name: '14',
        disp: 'Interchange acknowledgment positive',
        color: 'green',
        x: 667,
        y: 313
      },
      {
        name: '16',
        disp: 'Functional acknowledgment positive',
        color: 'green',
        x: 758,
        y: 358
      },
      {
        name: '15',
        disp: 'Interchange acknowledgment negative',
        color: 'red',
        x: 820,
        y: 273
      },
      {
        name: '17',
        disp: 'Functional acknowledgment negative',
        color: 'red',
        x: 843,
        y: 332
      },
      {
        name: '31',
        disp: 'Error - no further processing',
        color: 'green',
        x: 811,
        y: 424
      }
    ]
  },
  INBOUND: {
    viewBox: '0 0 808 400',
    nodes: [
      {
        name: '74',
        disp: 'IDoc was created by test transaction',
        color: 'yellow',
        x: 0,
        y: 0
      },
      { name: '50', disp: 'IDoc added', color: 'yellow', x: 58, y: 54 },
      {
        name: '56',
        disp: 'IDoc with errors added',
        color: 'red',
        x: 46,
        y: 345
      },
      {
        name: '64',
        disp: 'IDoc ready to be passed to application',
        color: 'yellow',
        x: 231,
        y: 54
      },
      {
        name: '61',
        disp: 'Processing despite syntax error (inbound)',
        color: 'yellow',
        x: 165,
        y: 117
      },
      {
        name: '60',
        disp: 'Error during syntax check of IDoc (inbound)',
        color: 'red',
        x: 144,
        y: 208
      },
      {
        name: '65',
        disp: 'Error in ALE service',
        color: 'red',
        x: 120,
        y: 286
      },
      {
        name: '62',
        disp: 'IDoc passed to application',
        color: 'yellow',
        x: 403,
        y: 54
      },
      {
        name: '66',
        disp: 'IDoc is waiting for predecessor IDoc (serialization)',
        color: 'yellow',
        x: 331,
        y: 115
      },
      {
        name: '63',
        disp: 'Error passing IDoc to application',
        color: 'red',
        x: 297,
        y: 200
      },
      {
        name: '52',
        disp: 'Application document not fully posted',
        color: 'yellow',
        x: 529,
        y: 111
      },
      {
        name: '54',
        disp: 'Error during formal application check',
        color: 'red',
        x: 475,
        y: 199
      },
      {
        name: '53',
        disp: 'Application document posted',
        color: 'green',
        x: 704,
        y: 54
      },
      {
        name: '51',
        disp: 'Application document not posted',
        color: 'red',
        x: 591,
        y: 199
      },
      {
        name: '68',
        disp: 'Error - no further processing',
        color: 'green',
        x: 753,
        y: 345
      }
    ]
  }
};

export default data;

// 05 Error During Translation
// 07 Error during syntax check
// 13 Retransmission OK
// 19 Data passed to port for test
// 21 Error passing data for test
// 23 Error during retransmission
// 25 Processing despite syntax error (outbound)
// 26 Error during syntax check of IDoc (outbound)
// 27 Error in dispatch level (ALE service)
// 28 IDoc sent to ALE distribution unit retroactively
// 34 Error in control record of IDoc
// 35 IDoc reloaded from archive
// 36 Electronic signature not performed (timeout)
// 38 IDoc archived

// 55 Formal application check OK
// 57 Test IDoc: Error during application check
// 58 IDoc copy from R/2 connection
// 59 Not used
// 67 Not used
// 69 IDoc was edited
// 70 Original of an IDoc which was edited
// 71 IDoc reloaded from archive
// 72 Not used
// 73 IDoc archived
// 75 IDoc is in inbound queue

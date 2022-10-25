import React from 'react';
import PropTypes from 'prop-types';

import data from './data';
import OutboundLinks from './outbound-links';
import InboundLinks from './inbound-links';

const GraphView = ({ height, width, direction, iDocs }) => {
  const { nodes, viewBox } = data[direction];

  const colors = {
    yellow: '#FCCC0A',
    green: '#00933C',
    red: '#EE352E'
  };

  const fillColor = color => (color === 'yellow' ? 'black' : 'white');

  const countX = count => 25 - (String(count).length - 1) * 4;

  const statusCounts = iDocs.reduce(
    (acc, cur) => ({ ...acc, [cur.status]: (acc[cur.status] || 0) + 1 }),
    {}
  );

  /* eslint-disable no-nested-ternary */
  const links =
    direction === 'OUTBOUND' ? (
      <OutboundLinks />
    ) : direction === 'INBOUND' ? (
      <InboundLinks />
    ) : null;
  /* eslint-enable no-nested-ternary */

  return (
    <div className="statuses" style={{ width, height }}>
      <svg height="100%" viewBox={viewBox}>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g>
            <g id="nodes">
              {nodes.map((node, i) => (
                <g key={i} transform={`translate(${node.x}, ${node.y})`}>
                  <title>{node.disp}</title>
                  <circle
                    fill={colors[node.color]}
                    cx="27.5"
                    cy="27.5"
                    r="27.5"
                  />
                  <text
                    fontFamily="sans-serif"
                    fontSize="24"
                    fontWeight="bold"
                    fill={fillColor(node.color)}
                    letterSpacing="0.5"
                  >
                    <tspan x="13" y="36">
                      {node.name}
                    </tspan>
                  </text>
                  {node.name in statusCounts ? (
                    <text
                      fontFamily="sans-serif"
                      fontSize="12"
                      fontWeight="normal"
                      fill={fillColor(node.color)}
                      letterSpacing="0.25"
                    >
                      <tspan x={countX(statusCounts[node.name])} y="47">
                        {statusCounts[node.name]}
                      </tspan>
                    </text>
                  ) : null}
                </g>
              ))}
            </g>
            {links}
          </g>
        </g>
      </svg>
    </div>
  );
};

GraphView.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  direction: PropTypes.string,
  iDocs: PropTypes.array
};

export default GraphView;

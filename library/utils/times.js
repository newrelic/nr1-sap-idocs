export const formatEventTime = timestamp =>
  new Intl.DateTimeFormat('default', {
    // month: 'numeric', day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }).format(timestamp);

export const formatHeaderTime = timestamp =>
  Intl.DateTimeFormat('default', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }).format(new Date(timestamp));

export const calculateTimeBlock = (idoc, mins) => {
  const { timestamp: iDocTime = Date.now() } = idoc;
  const diffMilliseconds = mins * 60000;
  return [iDocTime - diffMilliseconds, iDocTime + diffMilliseconds];
};

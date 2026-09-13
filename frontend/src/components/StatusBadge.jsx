const MAP = {
  upcoming: { label: 'Upcoming', cls: 'badge badge-upcoming' },
  live: { label: 'Live', cls: 'badge badge-live' },
  completed: { label: 'Completed', cls: 'badge badge-completed' },
  'no-event': { label: 'No Event', cls: 'badge badge-none' }
};

export default function StatusBadge({ status }) {
  const info = MAP[status] || MAP.upcoming;
  return <span className={info.cls}>{info.label}</span>;
}

import dayjs from 'dayjs';

export const formatDate = (value) => dayjs(value).format('MMM D, YYYY');
export const formatDateTime = (value) => dayjs(value).format('MMM D, YYYY h:mm A');
export const startOfWeek = (value = dayjs()) => dayjs(value).startOf('week');

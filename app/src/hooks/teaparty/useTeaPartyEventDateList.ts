import useSWR from 'swr';
import { api } from '../../library/api';

const fetcher = (key: string) => api.get(key);

const useTeaPartyEventDateList = () => {
  const { data, error } = useSWR('teaparty/event_dates', fetcher);

  return {
    eventDateList: data?.data?.map((eventDate: string) => {
      const date = new Date(eventDate);
      return (
        date.getFullYear() +
        '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + date.getDate()).slice(-2)
      );
    }),
    isLoading: !error && !data,
    isError: error,
  };
};

export default useTeaPartyEventDateList;

import useSWR from 'swr';
import { api } from '../../library/api';

const fetcher = (key: string) => api.get(key);
const useTeaParty = (eventDate?: string) => {
  const { data, error } = useSWR(
    eventDate ? `teaparty?eventDate=${eventDate}` : null,
    fetcher
  );

  return {
    teaParty: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useTeaParty;

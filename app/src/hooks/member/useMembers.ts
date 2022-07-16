import useSWR from 'swr';
import { api } from '../../library/api';
import { Member } from './useMemberDivide';

const fetcher = (key: string) => api.get(key);

const useMembers = () => {
  const { data, error } = useSWR('members', fetcher);
  return {
    members: data?.data,
    isLoading: !error && !data,
    isError: error,
    memberIdMap: data?.data
      ? Object.fromEntries(
          data.data.map((member: Member) => [member.memberId, member])
        )
      : [],
  };
};

export default useMembers;

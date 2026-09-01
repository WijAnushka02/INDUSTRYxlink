import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useOpportunities = (page: number, limit: number = 10) => {
  return useQuery({
    queryKey: ['opportunities', page],
    queryFn: async () => {
      const response = await axios.get(`/api/v1/opportunities?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
};

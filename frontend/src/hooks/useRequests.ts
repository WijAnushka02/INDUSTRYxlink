import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useRequests = (page: number, limit: number = 10) => {
  return useQuery({
    queryKey: ['requests', page],
    queryFn: async () => {
      const response = await axios.get(`/api/v1/requests?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (opportunityId: string) => {
      await axios.post('/api/v1/requests', {
        opportunityId,
        requestedDate: new Date().toISOString(),
        studentCount: 30, // Default MVP value
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    }
  });
};

export const useUpdateRequestStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await axios.put(`/api/v1/requests/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    }
  });
};

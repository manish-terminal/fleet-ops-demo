import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complianceService } from '@/services/complianceService';
import { queryKeys } from '@/utils/queryKeys';
import type { LicenceStatus } from '@/types/compliance';

export function useComplianceRecords(params: { status?: LicenceStatus; vehicleId?: string } = {}) {
  return useQuery({
    queryKey: queryKeys.compliance.list(params),
    queryFn: () => complianceService.getAll(params),
  });
}

export function useRenewDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => complianceService.renew(id),
    onSuccess: () => {
      // Invalidate all compliance queries to refresh expiry calculations
      queryClient.invalidateQueries({ queryKey: queryKeys.compliance.all });
    },
  });
}

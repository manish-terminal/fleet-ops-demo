import React from 'react';
import { PageWrapper } from '@/layouts/PageWrapper';
import { useComplianceRecords, useRenewDocument } from '@/hooks/useCompliance';
import { ComplianceTable } from '@/features/compliance/components/ComplianceTable';
import { RenewalAlert } from '@/features/compliance/components/RenewalAlert';
import { useToast } from '@/hooks/useToast';
import { FileBadge, ShieldAlert, Award } from 'lucide-react';

export function CompliancePage() {
  const { data: recordsResponse, isLoading } = useComplianceRecords();
  const { mutateAsync: renewDoc, isPending: isRenewing } = useRenewDocument();
  const { success, error } = useToast();

  const records = recordsResponse?.data || [];

  const handleRenew = async (id: string) => {
    try {
      const response = await renewDoc(id);
      success(
        'Document Renewed',
        `Successfully updated validity of ${response.data.documentNumber} for 1 year.`
      );
    } catch (err: any) {
      error('Renewal Failed', err.message || 'Something went wrong');
    }
  };

  return (
    <PageWrapper
      title="Compliance & Licencing"
      description="Track national permits, roadworthy certificates, and insurance policies across the fleet."
    >
      <div className="space-y-8">
        
        {/* Compliance statistics cards banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-5 rounded-xl text-left border-slate-800/80 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Overall Compliance</p>
              <h3 className="text-xl font-extrabold text-slate-100">
                {records.length > 0
                  ? Math.round(
                      (records.filter((r) => r.status === 'valid').length / records.length) * 100
                    )
                  : 100}
                %
              </h3>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-xl text-left border-slate-800/80 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileBadge className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Expiring Documents</p>
              <h3 className="text-xl font-extrabold text-slate-100">
                {records.filter((r) => r.status === 'expiring').length}
              </h3>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-xl text-left border-slate-800/80 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Expired Documents</p>
              <h3 className="text-xl font-extrabold text-slate-100">
                {records.filter((r) => r.status === 'expired').length}
              </h3>
            </div>
          </div>
        </div>

        {/* Top Section: Expiring soon alerts */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider text-left">
            Urgent Renewals Needed
          </h2>
          <RenewalAlert
            records={records}
            onRenew={handleRenew}
            isRenewing={isRenewing}
          />
        </div>

        {/* Bottom Section: Full audit registry table */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileBadge className="h-5 w-5 text-brand-400" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Document Audit Registry
            </h2>
          </div>
          <ComplianceTable
            records={records}
            isLoading={isLoading}
            onRenew={handleRenew}
            isRenewing={isRenewing}
          />
        </div>

      </div>
    </PageWrapper>
  );
}
export default CompliancePage;

import React from 'react';
import type { ComplianceRecord } from '@/types/compliance';
import { AlertCircle, CalendarRange } from 'lucide-react';
import { differenceInDays } from 'date-fns';

interface RenewalAlertProps {
  records: ComplianceRecord[];
  onRenew?: (id: string) => void;
  isRenewing?: boolean;
}

export function RenewalAlert({ records, onRenew, isRenewing }: RenewalAlertProps) {
  const urgentRecords = records.filter(r => r.status === 'expired' || r.status === 'expiring');

  if (urgentRecords.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-300">
        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
          <CalendarRange className="h-5 w-5" />
        </div>
        <div className="text-left text-xs">
          <p className="font-bold">All Documents Compliant</p>
          <p className="text-emerald-400/80 mt-0.5">All fleet vehicle licences, permits, and policies are fully up to date.</p>
        </div>
      </div>
    );
  }

  const expiredCount = urgentRecords.filter(r => r.status === 'expired').length;
  const expiringCount = urgentRecords.filter(r => r.status === 'expiring').length;

  return (
    <div className="space-y-4">
      {/* Overview stats panel */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-300">
        <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="text-left text-xs">
          <p className="font-bold">Action Required: Compliance Alert</p>
          <p className="text-red-400/80 mt-0.5">
            There are <strong className="text-red-200">{expiredCount} expired</strong> and <strong className="text-red-200">{expiringCount} expiring</strong> documentation files requiring renewal.
          </p>
        </div>
      </div>

      {/* Grid of cards for quick renewal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {urgentRecords.map((record) => {
          const isExpired = record.status === 'expired';
          const days = differenceInDays(new Date(record.expiresAt), new Date());
          
          let docLabel = record.documentType.replace('_', ' ');
          docLabel = docLabel.charAt(0).toUpperCase() + docLabel.slice(1);

          return (
            <div
              key={record.id}
              className={`glass-panel p-4 rounded-xl border flex flex-col justify-between gap-4 ${
                isExpired ? 'border-red-500/20 bg-red-950/5' : 'border-amber-500/20 bg-amber-950/5'
              }`}
            >
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    isExpired ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {docLabel}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{record.documentNumber}</span>
                </div>
                
                <h4 className="text-sm font-bold text-slate-200">{record.vehiclePlate}</h4>
                
                <p className="text-xs text-slate-400">
                  {isExpired 
                    ? `Expired ${Math.abs(days)} days ago` 
                    : `Expires in ${days} days (${new Date(record.expiresAt).toLocaleDateString()})`}
                </p>
              </div>

              {onRenew && (
                <button
                  onClick={() => onRenew(record.id)}
                  disabled={isRenewing}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold border transition-all duration-200 disabled:opacity-50 select-none ${
                    isExpired
                      ? 'bg-red-600/10 border-red-500/30 text-red-400 hover:bg-red-600/20'
                      : 'bg-amber-600/10 border-amber-500/30 text-amber-400 hover:bg-amber-600/20'
                  }`}
                >
                  Renew Document (Vahan Portal Sync)
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default RenewalAlert;

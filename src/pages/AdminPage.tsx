import React from 'react';
import { PageWrapper } from '@/layouts/PageWrapper';

export function AdminPage() {
  return (
    <PageWrapper title="Admin Panel" description="Manage user access, roles, and global settings.">
      <div className="glass-panel rounded-xl p-8 text-center text-slate-400">
        Admin Controls Module coming in Phase 5 (Admin restricted)
      </div>
    </PageWrapper>
  );
}
export default AdminPage;

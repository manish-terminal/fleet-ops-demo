import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { router } from './router';
import { useToastStore } from './hooks/useToast';
import { AlertCircle, CheckCircle2, Info, X, AlertTriangle } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            1000 * 30,      // 30s before background refetch
      gcTime:               1000 * 60 * 10, // 10 min garbage collect
      retry:                2,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  const { toasts, removeToast } = useToastStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-800 border-t-brand-500" />
              <p className="text-slate-400 text-xs font-mono">Initializing System...</p>
            </div>
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
      
      <ReactQueryDevtools initialIsOpen={false} />

      {/* Global Toast Stack */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex gap-3 p-4 rounded-xl border bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden"
          >
            {/* Color accent bars */}
            <div
              className={`absolute top-0 bottom-0 left-0 w-1 ${
                t.type === 'success'
                  ? 'bg-emerald-500'
                  : t.type === 'error'
                  ? 'bg-red-500'
                  : t.type === 'warning'
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
            />
            
            {t.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />}
            {t.type === 'error' && <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />}
            {t.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />}

            <div className="flex-1 space-y-1 pr-4">
              <h4 className="text-sm font-bold text-slate-100">{t.title}</h4>
              {t.message && <p className="text-xs text-slate-400 leading-relaxed">{t.message}</p>}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 self-start"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </QueryClientProvider>
  );
}
export default App;

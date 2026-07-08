"use client";
import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/react-query";

let queryClient: QueryClient | null = null;

function getQueryClient() {
  if (!queryClient) {
    const config = {
      defaultOptions: {
        queries: {
          gcTime: 30_000,
          retry: 3,
          refetchOnReconnect: true,
        },
      },
    } satisfies QueryClientConfig;
    queryClient = new QueryClient(config);
  }

  return queryClient;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}

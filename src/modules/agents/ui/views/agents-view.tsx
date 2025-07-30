"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../components/data-tables";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";


export const AgentsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return <div className="flex flex-1 px-4 pb-4 md:px-8 flex-col gap-y-4">
    <DataTable data={data} columns={columns}/>
    {data.length === 0 && (
      <EmptyState
        title="Create your first agent"
        description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call."
      />
    )}
  </div>;
};

export const AgentsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agents"
      description="Please wait while we load your agents."
    />
  );
};

export const AgentsViewError = () => {
  return (
    <ErrorState
      title="Error loading Agents"
      description="Something went wrong, try again!"
    />
  );
};
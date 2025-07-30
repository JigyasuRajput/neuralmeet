import { createTRPCRouter } from '../init';

import { agentsRouter } from '@/modules/agents/server/procedures';

export const appRouter = createTRPCRouter({
    agents: agentsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
import { meetingsRouter } from '@/modules/meetings/server/procedures';
import { agentsRouter } from '@/modules/agents/server/procedures';

import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
    agents: agentsRouter,
    meetings: meetingsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
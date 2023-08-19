// import { createServer } from 'http';
// import express from 'express';
// import { makeExecutableSchema } from '@graphql-tools/schema';
// import { useServer } from 'graphql-ws/lib/use/ws';
import { syncDatabase } from './loader/mysql';

// const getDynamicContext = async (
//     ctx: Context<Record<string, unknown> | undefined, Extra & Partial<Record<PropertyKey, never>>>,
//     msg: SubscribeMessage,
//     args: ExecutionArgs
// ) => {
//     if (ctx.connectionParams?.authentication) {
//         // TODO
//         console.log('msg: ', msg);
//         console.log('args: ', args);
//         return { currentUser: { id: 1 } };
//     }
//     return { currentUser: null };
// };

async function startServer() {
    console.log('go to sync data');
    await Promise.all([syncDatabase()]);
    // const appSrv = express();
    // const schema = makeExecutableSchema({ typeDefs, resolvers });
    // const httpServer = createServer(appSrv);
    //
    // const serverCleanup = useServer(
    //     {
    //         schema,
    //         context: async (ctx, msg, args) => {
    //             console.log('msg: ');
    //             return getDynamicContext(ctx, msg, args);
    //         },
    //         onConnect: async () => {
    //             console.log('A client connected!');
    //         },
    //         onDisconnect() {
    //             console.log('Disconnected!');
    //         },
    //     },
    //     wsServer
    // );

    // const server = new ApolloServer<SsmContext>({
    //     typeDefs,
    //     resolvers,
    //     csrfPrevention: true,
    //     plugins: [
    //         ApolloServerPluginDrainHttpServer({ httpServer }),
    //         {
    //             async serverWillStart() {
    //                 return {
    //                     async drainServer() {
    //                         await serverCleanup.dispose();
    //                     },
    //                 };
    //             },
    //         },
    //     ],
    // });
    // if (process.env.NODE_ENV === 'development') {
    //     server.addPlugin(
    //         ApolloServerPluginLandingPageGraphQLPlayground({
    //             title: 'SSM-API in development',
    //             settings: {
    //                 'general.betaUpdates': false,
    //                 'editor.theme': 'dark',
    //                 'editor.cursorShape': 'line',
    //                 'editor.reuseHeaders': true,
    //                 'tracing.hideTracingResponse': true,
    //                 'queryPlan.hideQueryPlanResponse': true,
    //                 'editor.fontSize': 14,
    //                 'editor.fontFamily': '"Source Code Pro", "Consolas", "Inconsolata", "Droid Sans Mono", "Monaco", monospace',
    //                 'request.credentials': 'omit',
    //                 'schema.polling.enable': false,
    //             },
    //             tabs: await queryExample(),
    //             subscriptionEndpoint: `ws://${appConfig.host}:${appConfig.port}/subscriptions`,
    //         })
    //     );
    // }
    // await server.start();
    // // This middleware should be added before calling `applyMiddleware`.
    // appSrv.use(graphqlUploadExpress());
    // // TODO: Handle CORS later
    // appSrv.use(cors());
    // appSrv.use(
    //     '/graphql',
    //     bodyParser.json(),
    //     expressMiddleware(server, {
    //         context,
    //     })
    // );
    // await new Promise<void>((resolve) => {
    //     httpServer.listen({ port: appConfig.port, hostname: appConfig.host }, resolve);
    //     console.log(`🚀 Server ready at http://${appConfig.host}:${appConfig.port}/graphql`);
    //     console.log(`🚀 Subscription endpoint ready at ws://${appConfig.host}:${appConfig.port}/subscriptions`);
    // });
}

startServer().catch((error) => {
    console.error('Unable start server: ', error);
});

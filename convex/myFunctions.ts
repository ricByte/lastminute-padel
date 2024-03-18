import {v} from "convex/values";
import {action, mutation, query} from "./_generated/server";
import {api} from "./_generated/api";
import {queryWithAuth} from "@convex-dev/convex-lucia-auth";
import {Id} from "./_generated/dataModel";
import {Either} from "../lib/Either";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

export type PersistedGroup = {
    _id: Id<"groups">;
    _creationTime: number;
    name: string
    teams: { name: string; members: string[]; id?: string }[];
}

export type PersistedGame = {
    _id: Id<"games">;
    _creationTime: number;
    pointsTeam1?: number | undefined;
    pointsTeam2?: number | undefined;
    winner?: string | undefined;
    endDate: string;
    startDate: string;
    team1: string;
    team2: string;
}
export type PersistedPhase = {
    _id: Id<"phase">;
    _creationTime: number;
    day: string;
    label: string;
    slug: string;
}
export type UpdateGameError = {
    reason: string
}
export const gamesForDay = query({
    args: {
        date: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        if(args.date) {
            console.log(`games for today: ${args.date}`)
            const today = new Date(args.date);
            console.log(`today is: ${today.toISOString()}`)
            today.setHours(0, 0, 0, 0)
            console.log(`today at night: ${today.toISOString()}`)
            const tomorrow = new Date(today.getTime());
            tomorrow.setDate(today.getDate() + 1)
            console.log(`tomorrow at night: ${tomorrow.toISOString()}`)
            const promise = await ctx.db
                .query("games")
                .filter((q) =>
                    q.and(
                            q.gte(q.field("startDate"), today.toISOString()),
                            q.lte(q.field("endDate"), tomorrow.toISOString())
                    )
                )
                .order("asc")
                .collect();
            console.log(promise)
            return promise;
        } else {
            console.log(`date for today is empty`)
            const promise = await ctx.db
                .query("games")
                .order("asc")
                .collect();
            console.log(promise)
            return promise;
        }
    },
});

export const getGroups = query({
    args: {},
    handler: async (ctx) => {
        const promise = await ctx.db
            .query("groups")
            .order("asc")
            .collect();
        console.log(promise)
        return promise;
    },
});

export const getPhases = query({
    args: {
        slug: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        let query = ctx.db
            .query("phase")
            .order("asc");

        if(args.slug) {
            query = query.filter(q => q.eq(q.field("slug"), args.slug))
        }
        
        const promise = await query
            .collect();
        console.log(promise)
        return promise;
    },
});
export const getGameFor = query({
    args: {
        team: v.string()
    },
    handler: async (ctx, args) => {
        console.log('team', args)
        const promise = await ctx.db
            .query("games")
            .order("asc")
            .filter((q) => q.or(
                q.eq(q.field("team1"), args.team),
                q.eq(q.field("team2"), args.team)
            ))
            .collect();
        console.log(promise)
        return promise;
    },
});

export const getGameForTeam = action({
    // Validators for arguments.
    args: {
        team: v.string()
    },

    // Action implementation.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    handler: async (ctx, args) => {
        //// Use the browser-like `fetch` API to send HTTP requests.
        //// See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
        // const response = await ctx.fetch("https://api.thirdpartyservice.com");
        // const data = await response.json();

        //// Query data by running Convex queries.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore


        try {
            console.log(`Retrieving groups for`, args);
            const data: PersistedGame[] = await ctx.runQuery(api.myFunctions.getGameFor, args);
            console.log(data);
            return data
        } catch (e) {
            console.log(e)
        }

    },
});

export const getGameForPhase = action({
    // Validators for arguments.
    args: {
        slug: v.string()
    },

    // Action implementation.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    handler: async (ctx, args) => {
        //// Use the browser-like `fetch` API to send HTTP requests.
        //// See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
        // const response = await ctx.fetch("https://api.thirdpartyservice.com");
        // const data = await response.json();

        //// Query data by running Convex queries.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore


        let persistedPhases: PersistedPhase[];
        try {
            console.log(`Retrieving groups for`, args);
            persistedPhases = await ctx.runQuery(api.myFunctions.getPhases, args);
            console.log(persistedPhases);
            const result:{
                _creationTime: number;
                _id: Id<"phase">;
                label: string;
                day: string;
                slug: string,
                games?: PersistedGame[]
            }[] = await Promise.all(persistedPhases.map(async (value) => {
                console.log(`Retrieving games for ${Date.parse(value.day)}`, args);
                const games: PersistedGame[]|null = await ctx.runAction(api.myFunctions.retrieveGames, {date: Date.parse(value.day)});
                console.log("games:",games)
                return {
                    ...value,
                    ...(games && { games: games })
                }
            }));

            return result;
        } catch (e) {
            console.error(e)
        }

    },
});
export const getGame = query({
    args: {id: v.id("games")},
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const addWinner = mutation({
    args: {
        id: v.id("games"),
        winner: v.optional(v.string()),
        pointsTeam1: v.optional(v.number()),
        pointsTeam2: v.optional(v.number())
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            winner: args.winner,
            pointsTeam1: args.pointsTeam1,
            pointsTeam2: args.pointsTeam2
        });
    },
});

export const updateGame = action({
    args: {
        id: v.id("games"),
        winner: v.optional(v.string()),
        pointsTeam1: v.optional(v.number()),
        pointsTeam2: v.optional(v.number())
    },

    // Action implementation.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    handler: async (ctx, args): Promise<Either<UpdateGameError, PersistedGame>> => {

        try {
            console.log(`Retrieving for id: ${args.id}`);
            const data: PersistedGame | null = await ctx.runQuery(api.myFunctions.getGame, {
                id: args.id
            });
            if (data !== null) {
                await ctx.runMutation(api.myFunctions.addWinner, {
                    id: args.id,
                    winner: args.winner,
                    pointsTeam1: args.pointsTeam1,
                    pointsTeam2: args.pointsTeam2
                })
                const a: PersistedGame | null = await ctx.runQuery(api.myFunctions.getGame, {
                    id: args.id
                });
                if (a != null) return Either.right<UpdateGameError, PersistedGame>(a);
                return Either.left<UpdateGameError, PersistedGame>({reason: 'Error after updating'})
            }
            return Either.left<UpdateGameError, PersistedGame>({reason: 'Not found'})
        } catch (e) {
            console.log(e)
            return Either.left<UpdateGameError, PersistedGame>({reason: "Unexpected error during update game"})
        }

    },
});
export const retrieveGames = action({
    // Validators for arguments.
    args: {
        date: v.optional(v.any()),
    },

    // Action implementation.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    handler: async (ctx, args) => {
        //// Use the browser-like `fetch` API to send HTTP requests.
        //// See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
        // const response = await ctx.fetch("https://api.thirdpartyservice.com");
        // const data = await response.json();

        //// Query data by running Convex queries.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore


        try {
            console.log(`Retrieving for date: ${args.date}`);
            const data: PersistedGame[] = await ctx.runQuery(api.myFunctions.gamesForDay, args);
            console.log(data);
            return data
        } catch (e) {
            console.log(e)
        }

    },
});

export const retrieveGroups = action({
    // Validators for arguments.
    args: {},

    // Action implementation.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    handler: async (ctx, args) => {
        //// Use the browser-like `fetch` API to send HTTP requests.
        //// See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
        // const response = await ctx.fetch("https://api.thirdpartyservice.com");
        // const data = await response.json();

        //// Query data by running Convex queries.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore


        try {
            console.log(`Retrieving groups`);
            const data: PersistedGroup[] = await ctx.runQuery(api.myFunctions.getGroups);
            console.log(data);
            return data
        } catch (e) {
            console.log(e)
        }

    },
});

// You can write data to the database via a mutation:
export const addNumber = mutation({
    // Validators for arguments.
    args: {
        value: v.number(),
    },

    // Mutation implementation.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    handler: async (ctx, args) => {
        //// Insert or modify documents in the database here.
        //// Mutations can also read from the database like queries.
        //// See https://docs.convex.dev/database/writing-data.

        const id = await ctx.db.insert("numbers", {value: args.value});

        console.log("Added new document with id:", id);
        // Optionally, return a value from your mutation.
        // return id;
    },
});

export const listNumbers = queryWithAuth({
    // Validators for arguments.
    args: {
        count: v.number(),
    },

    // Query implementation.
    handler: async (ctx, args) => {
        //// Read the database as many times as you need here.
        //// See https://docs.convex.dev/database/reading-data.
        const numbers = await ctx.db
            .query("numbers")
            // Ordered by _creationTime, return most recent
            .order("asc")
            .take(args.count);
        return {
            viewer: ctx.session?.user.email,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            numbers: numbers.toReversed().map((number) => number.value),
        };
    },
});

export const addGames = mutation({
    // Validators for arguments.
    args: {
        endDate: v.string(),
        startDate: v.string(),
        team1: v.string(),
        team2: v.string(),
        pointsTeam1: v.optional(v.number()),
        pointsTeam2: v.optional(v.number()),
        winner: v.optional(v.string())
    },

    // Action implementation.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    handler: async (ctx, args) => {
        //// Use the browser-like `fetch` API to send HTTP requests.
        //// See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
        // const response = await ctx.fetch("https://api.thirdpartyservice.com");
        // const data = await response.json();

        //// Query data by running Convex queries.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const id = await ctx.db.insert("games", {
            endDate: args.endDate,
            startDate: args.startDate,
            team1: args.team1,
            team2: args.team2,
            pointsTeam1: args.pointsTeam1,
            pointsTeam2: args.pointsTeam2,
            winner: args.winner
        });
        console.log("Added new document with id:", id);

    },
});

// You can fetch data from and send data to third-party APIs via an action:
export const myAction = action({
    // Validators for arguments.
    args: {
        first: v.number(),
        second: v.string(),
    },

    // Action implementation.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    handler: async (ctx, args) => {
        //// Use the browser-like `fetch` API to send HTTP requests.
        //// See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
        // const response = await ctx.fetch("https://api.thirdpartyservice.com");
        // const data = await response.json();

        //// Query data by running Convex queries.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const data = await ctx.runQuery(api.myFunctions.listNumbers, {
            count: 10,
            sessionId: null,
        });
        console.log(data);

        //// Write data by running Convex mutations.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        await ctx.runMutation(api.myFunctions.addNumber, {
            value: args.first,
        });
    },
});

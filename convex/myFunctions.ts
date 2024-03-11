import {v} from "convex/values";
import {action, mutation, query} from "./_generated/server";
import {api} from "./_generated/api";
import {queryWithAuth} from "@convex-dev/convex-lucia-auth";
import {Id} from "./_generated/dataModel";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.
type Left<T> = { tag: "left", value: T };
type Right<T> = { tag: "right", value: T };
type Either<L, R> = Left<L> | Right<R>;


export type PersistedGroup = {
    _id: Id<"groups">;
    _creationTime: number;
    name: string
    teams: { name: string; members: string[]; }[];
}
export const gamesForDay = query({
    args: {
        date: v.any(),
    },
    handler: async (ctx, args) => {
        console.log(`games for today: ${args.date}`)
        const today = new Date(args.date);
        console.log(`today is: ${today.toISOString()}`)
        today.setHours(0)
        today.setTime(0)
        const tomorrow = new Date(today.getTime());
        tomorrow.setDate(today.getDate() + 1)
        const promise = await ctx.db
            .query("games")
            // .filter((q) => q.lte(q.field("startDate"), today.toISOString()) && q.gte(q.field("endDate"), tomorrow.toISOString()))
            .order("asc")
            .collect();
        console.log(promise)
        return promise;
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

type UpdateGameError = {
    reason: string
}
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
                if (a != null) return {tag: "right", value: a};
                return {tag: "left", value: {reason: 'Error after updating'}}
            }
            return {tag: "left", value: {reason: 'Not found'}}
        } catch (e) {
            console.log(e)
            return {tag: "left", value: {reason: "Unexpected error during update game"}}
        }

    },
});

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
export const retrieveGames = action({
    // Validators for arguments.
    args: {
        date: v.number()
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
            const data: PersistedGame[] = await ctx.runQuery(api.myFunctions.gamesForDay, {
                date: args.date
            });
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

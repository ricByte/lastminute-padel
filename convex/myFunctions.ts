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

export type PersistedRanking = {
    _id: Id<"ranking">
    _creationTime: number
    teamName: string
    ranking?: number
    points: number
    games: number
    wonGames: number
    lostGames: number
    gamesTotalPoints: number
}
export type RankingGroup = {
    teams: { name: string; members: string[]; id?: string }[];
    name: string;
    ranking: ({
        teamName: string
        ranking?: number
        points: number
        games: number
        wonGames: number
        lostGames: number
        gamesTotalPoints: number
    })[];
}
export type PersistedRankingGroup = {
    _creationTime: number;
    _id: Id<"rankingGroups">
} & RankingGroup;
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
export const getRanking = query({
    args: {},
    handler: async (ctx, args) => {
            const rankingList = await ctx.db
                .query("ranking")
                .collect();
            return rankingList.toSorted((a,b)=>((a.ranking||0)-(b.ranking||0)))
    },
});

export const getRankingAction = action({
    // Validators for arguments.
    args: {},

    handler: async (ctx, args) => {
        try {
            const data: PersistedRanking[] = await ctx.runQuery(api.myFunctions.getRanking);
            return data
        } catch (e) {
            console.log(e)
        }
    },
});

export const getRankingForGroups = query({
    args: {},
    handler: async (ctx, args) => {
        return (await ctx.db
                .query("rankingGroups")
                .collect())
    },
});

export const getRankingForGroupsAction = action({
    // Validators for arguments.
    args: {},

    handler: async (ctx, args) => {
        try {
            const data: PersistedRankingGroup[] = await ctx.runQuery(api.myFunctions.getRankingForGroups);
            return data
        } catch (e) {
            console.log(e)
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

export const getPhasesAction = action({
    // Validators for arguments.
    args: {
        slug:v.optional(v.string())
    },

    handler: async (ctx, args) => {
        try {
            console.log(`Retrieving phases action for`, args);
            const data: PersistedPhase[] = await ctx.runQuery(api.myFunctions.getPhases, args);
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

function calculatePoints(pointsTeam2: number, pointsTeam1: number) {
    if((pointsTeam2 >= 9)||(pointsTeam1 >= 9)) {
        console.log("3")
        return 3
    }
    console.log("2")
    return 2;
}

function setGame(teamName: string, game: {
    teamName: string;
    ranking?: number;
    points: number;
    games: number;
    wonGames: number;
    lostGames: number;
    gamesTotalPoints: number
} | undefined) {
    console.log("setGame game", game)
    const newVar = {
        teamName: teamName,
        points: (game?.points || 0),
        games: (game?.games || 0),
        wonGames: (game?.wonGames || 0),
        lostGames: (game?.lostGames || 0),
        gamesTotalPoints: (game?.gamesTotalPoints || 0)
    };

    console.log("setGame", newVar)
    return newVar;
}

export const doRanking = action({
    args: {},


    handler: async (ctx, args) => {


        try {
            console.log(`Retrieving groups for`, args);
            const allGames: PersistedGame[]|null = await ctx.runAction(api.myFunctions.retrieveGames, {});
            const results: Map<string, {
                teamName: string,
                ranking?: number,
                points: number,
                games: number,
                wonGames: number,
                lostGames: number,
                gamesTotalPoints: number,
            }> = new Map();
            allGames?.forEach((game) => {
                console.log('Starting logic for game', game)
                if (game.winner) {
                    let loser = {
                        name: game.team1,
                        points: game.pointsTeam1
                    };
                    let winner = {
                        name: game.team2,
                        points: game.pointsTeam2
                    }
                    if (game.winner === game.team1) {
                        winner = {...loser}
                        loser = {
                            name: game.team2,
                            points: game.pointsTeam2
                        }
                    }
                    console.log("winner",winner)
                    console.log("loser",loser)
                    const winnerSaved = results.get(winner.name);
                    const loserSaved = results.get(loser.name);
                    console.log(`winnerSaved:${JSON.stringify(winnerSaved)}`)
                    console.log(`loserSaved:${JSON.stringify(loserSaved)}`)
                    console.log("assignment")
                    const value = {
                        teamName: winner.name,
                        points: (winnerSaved?.points || 0) + calculatePoints(game.pointsTeam2!, game.pointsTeam1!),
                        games: (winnerSaved?.games || 0) + 1,
                        wonGames: (winnerSaved?.wonGames || 0) + 1,
                        lostGames: (winnerSaved?.lostGames || 0),
                        gamesTotalPoints: (winnerSaved?.gamesTotalPoints || 0) + winner.points!
                    };
                    results.set(game.winner, value)
                    const value1 = {
                        teamName: loser.name,
                        points: (loserSaved?.points || 0),
                        games: (loserSaved?.games || 0) + 1,
                        wonGames: (loserSaved?.wonGames || 0),
                        lostGames: (loserSaved?.lostGames || 0) + 1,
                        gamesTotalPoints: (loserSaved?.gamesTotalPoints || 0) + loser.points!
                    };
                    results.set(loser.name, value1)

                    console.log(`winner persited(${game.winner}):${JSON.stringify(value)}`)
                    console.log(`loser persisted(${loser.name}):${JSON.stringify(value1)}`)
                } else {
                    const team1 = results.get(game.team1);
                    const team2  = results.get(game.team2);

                    const game1 = setGame(game.team1, team1);
                    const game2 = setGame(game.team2, team2);
                    console.log(`Set for ${game.team1}`, game1)
                    console.log(`Set for ${game.team2}`, game2)
                    results.set(game.team1, game1)
                    results.set(game.team2, game2)
                }
            });
            let sortedRanking: {
                teamName: string,
                ranking?: number,
                points: number,
                games: number,
                wonGames: number,
                lostGames: number,
                gamesTotalPoints: number,
            }[] = []
            results.forEach((value) => (sortedRanking.push({...value})))
            sortedRanking = sortedRanking.toSorted((c,d)=> {
                if(c.points > d.points) {
                    return -1
                }
                if(d.points < c.points) {
                    return 1
                }
                if(d.points == c.points) {
                    if(c.gamesTotalPoints > d.gamesTotalPoints) {
                        return -1
                    }
                    if(d.gamesTotalPoints < c.gamesTotalPoints) {
                        return 1
                    }
                }
                return 0
            })
            await ctx.runMutation(api.myFunctions.generateRanking, {
                ranking: sortedRanking
            })
            return sortedRanking
        } catch (e) {
            console.error(e)
        }

    },
});

export const doRankingForGroups = action({
    args: {},


    handler: async (ctx, args) => {


        try {
            console.log(`Retrieving ranking for`, args);
            const ranking: PersistedRanking[] = await ctx.runQuery(api.myFunctions.getRanking);
            const groups: PersistedGroup[] = await ctx.runQuery(api.myFunctions.getGroups);
            const result: RankingGroup[] = groups.map((g) => {
                return {
                    teams: g.teams,
                    name: g.name,
                    ranking: [
                        ...(g.teams
                            .map((team) => {
                                const persistedRanking = ranking.find((r) => r.teamName === team.name)!;
                                return {
                                    teamName: persistedRanking.teamName,
                                    ranking: persistedRanking.ranking,
                                    points: persistedRanking.points,
                                    games: persistedRanking.games,
                                    wonGames: persistedRanking.wonGames,
                                    lostGames: persistedRanking.lostGames,
                                    gamesTotalPoints: persistedRanking.gamesTotalPoints,
                                }
                            })
                            .toSorted((a, b) => (a?.ranking || 999) - (b?.ranking || 999)))
                    ]

                }
            });
            console.log("Rank generators", result)
            await ctx.runMutation(api.myFunctions.generateRankingGroups, {
                groups: result
            })
            return result
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


export const generateRanking = mutation({
    args: {
        ranking: v.array(v.object({
            teamName: v.string(),
            ranking : v.optional(v.number()),
            points: v.number(),
            games: v.number(),
            wonGames: v.number(),
            lostGames: v.number(),
            gamesTotalPoints: v.number(),
        }))
    },
    handler: async (ctx, args) => {
        for (const ranking of args.ranking) {
            const index = args.ranking.indexOf(ranking);
            await ctx.db.insert("ranking", {
                ...ranking,
                ranking: index + 1
            })
        }
    },
});


export const generateRankingGroups = mutation({
    args: {
        groups: v.array(v.object({
            teams: v.array(v.object({ name: v.string(), members: v.array(v.string()), id: v.optional(v.string()) })),
            name: v.string(),
            ranking: v.array(v.object({
                teamName: v.string(),
                ranking : v.optional(v.number()),
                points: v.number(),
                games: v.number(),
                wonGames: v.number(),
                lostGames: v.number(),
                gamesTotalPoints: v.number(),
            })),
        }))
    },
    handler: async (ctx, args) => {
            await Promise.all(args.groups.map(async (g) => {
                await ctx.db.insert("rankingGroups", g)
            }))
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

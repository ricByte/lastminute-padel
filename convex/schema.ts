import {defineSchema, defineTable} from "convex/server";
import {authTables} from "@convex-dev/convex-lucia-auth";
import {v} from "convex/values";

export default defineSchema(
  {
    ...authTables({
      user: {
        email: v.string(),
      },
      session: {},
    }),
    // This definition matches the example query and mutation code:
    numbers: defineTable({
      value: v.number(),
    }),
    games: defineTable({
      endDate: v.string(),
      startDate: v.string(),
      team1: v.string(),
      team2: v.string(),
      pointsTeam1: v.optional(v.number()),
      pointsTeam2: v.optional(v.number()),
      winner: v.optional(v.string())
    }),
    groups: defineTable({
        name: v.string(),
        teams: v.array(
            v.object({
                name:v.string(),
                members: v.array(v.string()),
                id: v.optional(v.string())
            })
        )
    }),
    phase: defineTable({
        day:v.string(),
        label:v.string(),
        slug: v.string()
    }),
    ranking:defineTable({
        teamName:v.string(),
        ranking: v.optional(v.number()),
        points: v.number(),
        games: v.number(),
        wonGames: v.number(),
        lostGames: v.number(),
        gamesTotalPoints: v.number()
    }),
      rankingGroups:defineTable({
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
    })
  },
  // If you ever get an error about schema mismatch
  // between your data and your schema, and you cannot
  // change the schema to match the current data in your database,
  // you can:
  //  1. Use the dashboard to delete tables or individual documents
  //     that are causing the error.
  //  2. Change this option to `false` and make changes to the data
  //     freely, ignoring the schema. Don't forget to change back to `true`!
  { schemaValidation: true }
);

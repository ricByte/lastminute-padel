import {v} from "convex/values";
import {action, mutation, query} from "./_generated/server";
import {api} from "./_generated/api";
import {queryWithAuth} from "@convex-dev/convex-lucia-auth";
import {google} from "googleapis";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query:
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
      .order("desc")
      .take(args.count);
    return {
      viewer: ctx.session?.user.email,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      numbers: numbers.toReversed().map((number) => number.value),
    };
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

    const id = await ctx.db.insert("numbers", { value: args.value });

    console.log("Added new document with id:", id);
    // Optionally, return a value from your mutation.
    // return id;
  },
});

export const readFromGoogle=
    action({
  handler: () => {
    // implementation goes here

    // optionally return a value
    return "success";
  },
});

export const doSomething = action({
  args: {},
  handler: async () => {
    try {
      const auth = new google.auth.GoogleAuth({

        scopes: ['https://www.googleapis.com/auth/documents.readonly'],
      });
      const docs = google.docs({version: 'v1', auth});

      // ID del documento di Google Docs
      const documentId = 'YOUR_DOCUMENT_ID';

      // Ottieni il contenuto del documento
      const response = await docs.documents.get({
        documentId,
      });

      // Invia il contenuto come risposta
      return response.data;
    } catch (e) {
      console.log("error")
      console.log(e)
    }
    return "KO"
  },
});

export const listImage = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.getUrl("kg2ep7bj928hxfa8vny6bwxe7d6mwjsx")
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

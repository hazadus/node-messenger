# Node Messenger

Real time messaging web app built using Node, Apollo and Next.js.

## Frameworks and libraries used

- Frontend
  - [Next.js](https://nextjs.org)
  - [NextAuth.js](https://next-auth.js.org): Authentication for Next.js
  - [Prisma](https://www.prisma.io/docs/getting-started/quickstart): Needed on the frontend by NextAuth.js.
  - [Chakra UI](https://chakra-ui.com/): Chakra UI is a simple, modular and accessible component library that gives you the building blocks you need to build your React applications.
  - [Apollo Client](https://www.apollographql.com/docs/react/get-started): Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL. Use it to fetch, cache, and modify application data, all while automatically updating your UI.
  - [react-hot-toast](https://www.npmjs.com/package/react-hot-toast): Smoking hot Notifications for React.
  - [react-icons](https://react-icons.github.io/react-icons/): Include popular icons in your React projects easily with react-icons, which utilizes ES6 imports that allows you to include only the icons that your project is using.
  - [date-fns](https://www.npmjs.com/package/date-fns): date-fns provides the most comprehensive, yet simple and consistent toolset for manipulating JavaScript dates in a browser & Node.js.
  - [bson](https://www.npmjs.com/package/bson): BSON is short for "Binary JSON," and is the binary-encoded serialization of JSON-like documents. Used to generate IDs for MongoDB documents.
- Backend
  - [typescript](https://www.npmjs.com/package/typescript): TypeScript is a language for application-scale JavaScript. TypeScript adds optional types to JavaScript that support tools for large-scale JavaScript applications for any browser, for any host, on any OS.
  - [ts-node](https://www.npmjs.com/package/ts-node): TypeScript execution and REPL for node.js, with source map and native ESM support.
  - [nodemon](https://www.npmjs.com/package/nodemon)
  - [Apollo Server v4](https://www.apollographql.com/docs/apollo-server/)
  - [@graphql-tools/schema](https://www.npmjs.com/package/@graphql-tools/schema)
  - [graphql-tag](https://www.npmjs.com/package/graphql-tag): Helpful utilities for parsing GraphQL queries.
  - [NextAuth.js](https://next-auth.js.org): Authentication for Next.js
  - [Prisma](https://www.prisma.io/docs/getting-started/quickstart)
  - [lodash.merge](https://www.npmjs.com/package/lodash.merge)
  - [dotenv](https://www.npmjs.com/package/dotenv): Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`.
- Tools
  - VSCode Extensions
    - GraphQL: Syntax Highlighting (by GraphQL Foundation)
    - GraphQL: Language Feature Support (by GraphQL Foundation)
  - [npm-check-updates](https://www.npmjs.com/package/npm-check-updates): Upgrades your package.json dependencies to the latest versions, ignoring specified versions.

## App Setup in Dev Environment

Run `npm install` in both `backend` and `frontend` directories to install the dependencies.

### Backend

Create `backend/.env` with the following environment variables:

```
CLIENT_ORIGIN=http://localhost:3000
DATABASE_URL="mongodb://localhost:30001/messenger?replicaSet=rs0&retryWrites=true&w=majority&directConnection=true"
```

Generate Prisma client: `npx prisma generate --schema=src/prisma/schema.prisma`.

Then `npm run dev` to run the app using `nodemon`.

### Frontend

Create `frontend/.env.local` with the following environment variables:

```
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=<Generate using `openssl rand -base64 32` command>
GOOGLE_CLIENT_ID=<Get it in the Google Cloud Console>
GOOGLE_CLIENT_SECRET=<Get it in the Google Cloud Console>
DATABASE_URL="mongodb://localhost:30001/messenger?replicaSet=rs0&retryWrites=true&w=majority&directConnection=true"
```

Generate Prisma Client:

```bash
# From app directory:
npx prisma generate --schema=./frontend/src/prisma/schema.prisma
```

Do `chmod +x ./frontend/docker/initiate_replica.sh`, then `docker compose up -d` to run our very own MongoDB Replica Set. Then `npm run dev` to run the app.

## Mongosh commands

To clear tables in MongoDB, use following commands in `mongosh`:

```
db.ConversationParticipant.deleteMany({})
db.Conversation.deleteMany({})
```

## References and Links

In this section all the references used while building this application are listed.

- [Shadee Merhi's Video Tutorial](https://www.youtube.com/watch?v=mj_Qe2jBYS4)
- [Google Cloud Console](https://console.cloud.google.com/)
- MongoDB:
  - [Docker Compose to create replication in MongoDB](https://stackoverflow.com/a/57293443/20197519)
  - [Error: MongoDB error Server selection timeout: No available servers](https://github.com/prisma/prisma/discussions/11929)
- Apollo Server:
  - [GraphQL Schema Basics](https://www.apollographql.com/docs/apollo-server/schema/schema)
    - [Example: the `Date` scalar](https://www.apollographql.com/docs/apollo-server/schema/custom-scalars/#:~:text=Example%3A%20The%20Date%20scalar)
  - [Resolvers](https://www.apollographql.com/docs/apollo-server/v3/data/resolvers)
- Apollo Client:
  - [Optimistic mutation results](https://www.apollographql.com/docs/react/performance/optimistic-ui/)

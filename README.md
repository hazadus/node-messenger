# Node Messenger 💬

Real time messaging web app built using Node, Apollo and Next.js.

Check out the current version deployed at http://messenger.hazadus.ru. Drop me a message there! 😀

Thanks to [Shadee Merhi](https://github.com/shadeemerhi) for his amazing [video tutorial](https://www.youtube.com/watch?v=mj_Qe2jBYS4), which was used as the base for this project.

## Additional Features

- 🐳 Docker Compose for easy deploy on Linux VDS.
- 🔭 Sentry and Umami installed for observability.
- 🛎️ Sound notifications on new messages.
- 👨‍💻 User image from Google account used as avatars.
- ⚙️ Some changes in app logic:
  - Only user who created the conversation can delete it.
- Lots of improvements in UI.
- ⚡️ More stuff to come, see Issues for upcoming features!

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
  - [use-sound](https://www.npmjs.com/package/use-sound): A React Hook for Sound Effects.
- Backend
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
  - [typescript](https://www.npmjs.com/package/typescript): TypeScript is a language for application-scale JavaScript. TypeScript adds optional types to JavaScript that support tools for large-scale JavaScript applications for any browser, for any host, on any OS.
  - [ts-node](https://www.npmjs.com/package/ts-node): TypeScript execution and REPL for node.js, with source map and native ESM support.
  - [nodemon](https://www.npmjs.com/package/nodemon) is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.
  - [npm-check-updates](https://www.npmjs.com/package/npm-check-updates): Upgrades your package.json dependencies to the latest versions, ignoring specified versions.

## App Setup in Dev Environment

Run `npm install` in both `backend` and `frontend` directories to install the dependencies.

### Backend

Create `backend/.env` with the following environment variables:

```
NEXTAUTH_URL="http://localhost:3000"
CLIENT_ORIGIN=http://localhost:3000
DATABASE_URL="mongodb://localhost:30001/messenger?replicaSet=rs0&retryWrites=true&w=majority&directConnection=true"
```

Generate Prisma client (from **backend** directory): `make prisma_generate`.

Then `npm run dev` to run the app using `nodemon`.

### Frontend

Create `frontend/.env.local` with the following environment variables:

```
NEXT_PUBLIC_BACKEND_HOST="localhost:4000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=<Generate using `openssl rand -base64 32` command>
GOOGLE_CLIENT_ID=<Get it in the Google Cloud Console>
GOOGLE_CLIENT_SECRET=<Get it in the Google Cloud Console>
DATABASE_URL="mongodb://localhost:30001/messenger?replicaSet=rs0&retryWrites=true&w=majority&directConnection=true"
```

Generate Prisma client (from **frontend** directory): `make prisma_generate`.

Do `chmod +x ./frontend/docker/initiate_replica.sh`, then `docker compose up -d` to run our very own MongoDB Replica Set. Then `npm run dev` to run the app.

## Running App on the Server

Add app domain to Authorized origins in [Google Cloud Console](https://console.cloud.google.com/) -> APIs & Services -> Credentials.

Create `frontend/.env` file with the following variables:

```
# Domain where app is deployed:
NEXT_PUBLIC_BACKEND_HOST="messenger.hazadus.ru:4000"
NEXTAUTH_URL="http://messenger.hazadus.ru"
NEXTAUTH_SECRET=<Generate using `openssl rand -base64 32` command>
GOOGLE_CLIENT_ID=<Get it in the Google Cloud Console>
GOOGLE_CLIENT_SECRET=<Get it in the Google Cloud Console>
DATABASE_URL="mongodb://mongodb1:27017/messenger?replicaSet=rs0&retryWrites=true&w=majority&directConnection=true"
```

Next.js will insert `NEXT_PUBLIC_BACKEND_HOST` value into `frontend/src/graphql/apollo-client.ts` during build time.

Note that we use `mongodb1:27017` for MongoDB – service name from Docker Compose and internal port number.

To configure backend, you should set `CLIENT_ORIGIN` environment variable in `docker-compose.yml`, e.g. `CLIENT_ORIGIN=http://messenger.hazadus.ru`.

Run `docker compose up -d` from the base app directory.

## References and Links

### Mongosh commands

To clear tables in MongoDB, use following commands in `mongosh`:

```
db.ConversationParticipant.deleteMany({})
db.Conversation.deleteMany({})
```

### Links

In this section all the references used while building this application are listed.

- [Shadee Merhi's Video Tutorial](https://www.youtube.com/watch?v=mj_Qe2jBYS4)
- [Google Cloud Console](https://console.cloud.google.com/): APIs & Services -> Credentials.
- MongoDB:
  - [Docker Compose to create replication in MongoDB](https://stackoverflow.com/a/57293443/20197519)
  - [Error: MongoDB error Server selection timeout: No available servers](https://github.com/prisma/prisma/discussions/11929)
- Apollo Server:
  - [GraphQL Schema Basics](https://www.apollographql.com/docs/apollo-server/schema/schema)
    - [Example: the `Date` scalar](https://www.apollographql.com/docs/apollo-server/schema/custom-scalars/#:~:text=Example%3A%20The%20Date%20scalar)
  - [Resolvers](https://www.apollographql.com/docs/apollo-server/v3/data/resolvers)
- Apollo Client:
  - [Optimistic mutation results](https://www.apollographql.com/docs/react/performance/optimistic-ui/)
- Next.js:
  - [Bundling Environment Variables for the Browser](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser)
  - [Using useEffect to run on the client only](https://nextjs.org/docs/messages/react-hydration-error#solution-1-using-useeffect-to-run-on-the-client-only)
  - [The Perils of Hydration](https://www.joshwcomeau.com/react/the-perils-of-rehydration/)
- React:
  - [Persisting React State in localStorage](https://www.joshwcomeau.com/react/persisting-react-state-in-localstorage/)
- Sounds:
  - [A React Hook for Sound Effects](https://www.joshwcomeau.com/react/announcing-use-sound-react-hook/)
  - [Come Here Notification](https://notificationsounds.com/notification-sounds/come-here-notification)

## Repo Activity

![Alt](https://repobeats.axiom.co/api/embed/21c79b52d6fde99a0e41724deef17b2a9d67570d.svg "Repobeats analytics image")

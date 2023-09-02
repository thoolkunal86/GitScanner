
const typeDefs = `

    input DeveloperToken {
        token: String!
    }

    type Repo {
        name: String!
        size: String!
        owner: String!
    }

    type RepoDetail {
        name: String!
        size: String!
        owner: String!
        numberOfFiles: Int
        content: String
        webhooks: Int!
        isPrivate: Boolean!
    }

    type Query {
        repos(token: String!): [Repo!]!
        allReposWithDetails(token: String!): [RepoDetail!]!
        repoDetails(owner: String!, name: String!, token: String!): RepoDetail!
    }
`;

module.exports = { typeDefs };


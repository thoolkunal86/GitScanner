const { getAllRepos, getRepoDetail, allReposWithDetails } = require('../helpers/github'); 

const resolvers = {
    Query: {
        repos(parent, args){
            return getAllRepos(args);
        },
        repoDetails(parent, args) {
            return getRepoDetail(args);
        },
        allReposWithDetails(parent, args) {
            return allReposWithDetails(args);
        }
    }
}

module.exports = { resolvers };

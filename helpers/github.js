const axios = require('axios');
require('dotenv').config();

/**
 * Get all repos from github with Details
 */
const allReposWithDetails = async (args) => {
  return getAllRepos(args).then((data) => {
    
    const ret = data.map((row) => {
      return getData(getDetailsQuery, {...args, ...row}).then((response) => {
        return processDetailApiData(
          response.data.data.repository,
          row.owner,
          row.name,
          args.token
        );
      });
    });    

    return ret;
  });
}

/**
 * Get all repos from github
 */
const getAllRepos = (args) => {
  return getData(getAllRepoQuery, args).then((row) => {
    return processApiData(row.data);
  });
}

/**
 * getData Get Api Data
 * 
 * @param { Function } func 
 * @param { Object } args
 *  
 * @returns Promise
 */
const getData = (func, args) => {
  return axios.post(process.env.GITHUB_GRAPH_URL, {query: func(args)}, {
    headers: getHeaders(args.token)
  });
}

/**
 * getRepoDetail Get Repo Detail
 * 
 * @param {} owner Owner of Repo
 * @param {} name  Name of Repo
 * @returns 
 */
const getRepoDetail = (args) => {
  return getData(getDetailsQuery, args).then((response) => {
    return processDetailApiData(
      response.data.data.repository,
      args.owner,
      args.name,
      args.token
    );
  });
}

/**
 * getHeaders Get Headers for github graphql call
 * 
 * @returns Object headers Headers 
 */
const getHeaders = (token) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token}`
    }

    return headers;
}

/**
 * getAllRepoQuery Get Repo Query
 * 
 * @returns data
 */
const getAllRepoQuery = () => {
    const data = `
    {
        viewer {
        repositories(first: 3) {
            totalCount
            nodes {
            nameWithOwner
            createdAt
            }
        }
        }
    }`;

    return data;
}

/**
 * processApiData Process Api Data
 * 
 * @returns retData Return proccessed data
 */
const processApiData = (data) => {
    const retData = [];
    
    data.data.viewer.repositories.nodes.map((row) => {
        retData.push({
            size: 0,
            name: row.nameWithOwner.split("/")[1],
            owner: row.nameWithOwner.split("/")[0]
        });
    });

    return retData;
}

const processDetailApiData = (data, owner, name, token) => {
  const fileD = getFileContent(data?.object?.entries, owner, name, token);  
  const retData = {
        size: 0,
        name: name,
        owner: owner,
        content: fileD ? fileD : "",
        isPrivate: data.isPrivate
    };
    
    return retData;
}

const getFileContent = (entries, owner, name, token) => {
  if (entries && entries.length > 0) {
    let files = [];

    files = entries.filter((row) => row.extension == process.env.FILE_EXTENSION);

    if (files.length > 0) {
      
      return getData(getContentQuery, {file: files[0], owner, name, token}).then((response) => {
        return response.data.data.repository.object.text;  
      });
    }
  }
}

const getContentQuery = (args) => {
  const data = `
  {
      repository(owner: "${args.owner}", name: "${args.name}") {
        object(expression: "HEAD:${args.file.name}") {
          ... on Blob {
            byteSize
            text
          }
        }
      }
  }`;

  return data;
}

const getDetailsQuery = (args) => {
    const data = `
    {
        repository(owner: "${args.owner}", name: "${args.name}") {
          object(expression: "HEAD:") {
            ... on Tree {
              entries {
                name
                type
                extension
              }
            }
          }
          isPrivate
        }
    }`;

    return data;
}

module.exports = { getAllRepos, getRepoDetail, allReposWithDetails } 
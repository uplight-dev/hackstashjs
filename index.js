import { GraphQLClient } from 'graphql-request'
import * as _ from "lodash";

const express = require('express')
const fetch = require('node-fetch')

const app = express()
const port = 3000
const API = 'https://api.github.com/graphql';

const q = `
  {
    viewer {
      repositories(first: 100, privacy: PRIVATE) {
        nodes {
          name,
          sshUrl,
          repositoryTopics(first:100) { 
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
    }
  }
`;

  app.use(express.static('html'));

  app.put('/api/add/:repo', (req, res) => {
    (async function() {

      var r = req.params['repo'];
      if (r === undefined) {
        res.send("required arg :repo not found!");
        return;
      }

      var body = `mutation { 
        createRepository(input:{name:"${r}", visibility:PRIVATE}) { 
          clientMutationId,
          repository {
            id,
            nameWithOwner
          }
        }
      }`;
      var data = await ql(body, req);

      if (data.createRepository === undefined) {
        res.send("Repository not created!" + JSON.stringify(data));
      }

      var repoId = data.createRepository.repository.id;
      body = `mutation {
        updateTopics(input: {repositoryId:"${repoId}", topicNames:["hackstack"]}) {
          clientMutationId
          repository {
            id
            nameWithOwner
          }
        }
      }`;

      ql(body, req).then(unused => {
        res.send(JSON.stringify(data));
      });
    }()).catch(error => res.send("Unexpected err: " + error));
  });

  app.get('/api/clone', (req, res) => {
    ql(q, req).then(data => {
      //data.viewer.repositories.nodes
      var r = '';
      var nodes = _.filter(data.viewer.repositories.nodes, n => n.repositoryTopics.nodes.length > 0);
      _.forEach(nodes, n => {
        r += `git clone ${n.sshUrl}\n`;
      })
      res.header('Content-Type','text/plain');
      res.send(r);
    });
  })

  app.get('/clone', (req, res) => {
    ql(q, req).then(data => {
      //data.viewer.repositories.nodes
      var r = '<body onload="var x = document.getElementById(\'txt\');x.focus();x.select();"><textarea id="txt" style="width:100%;height:100%">';
      var nodes = _.filter(data.viewer.repositories.nodes, n => n.repositoryTopics.nodes.length > 0);
      _.forEach(nodes, n => {
        r += `git clone ${n.sshUrl}\n`;
      })
      r += '</textarea></body>'
      res.header('Content-Type','text/html');
      res.send(r);
    });
  })

  async function ql(query, req) {
    const auth = {headers: {
      Authorization: `token ${req.header['authToken']}`
    }};
    const client = new GraphQLClient(API, auth);
    return client.request(query);
  }

  app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke! ' + err.stack)
  })
  
  app.listen(port, () => console.log(`Listening on port ${port}!`))
  
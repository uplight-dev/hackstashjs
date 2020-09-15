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

  app.get('/api/repos', (req, res) => {
    var r = [];
    eachRepo((n) => {
      r.push({name: n.name, url: n.sshUrl });
    }, req).then(() => {
      res.header('Content-Type','application/json');
      res.send(JSON.stringify(r));
    });
  });

  app.get('/api/clone', (req, res) => {
    var r = '';
    eachRepo((n) => {
      r += `git clone ${n.sshUrl}\n`;
    }, req).then(() => {
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

  function eachRepo(cb, req) {
    return ql(q, req).then(data => {
      //data.viewer.repositories.nodes
      console.log('repo: ' + JSON.stringify(data.viewer.repositories.nodes));
      // var nodes = _.filter(data.viewer.repositories.nodes, n => n.repositoryTopics.nodes.length > 0);
      //   _.forEach(nodes, n => {
      //     cb(n);
      //   })
      // });
      _.forEach(data.viewer.repositories.nodes, n => {
        cb(n);
      });
    });
  }

  async function ql(query, req) {
    const auth = {headers: {
      Authorization: `token ${req.query.authToken}`
    }};
    const client = new GraphQLClient(API, auth);
    console.log("Auth: "+ req.query.authToken)
    return client.request(query);
  }

  app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke! ' + err.stack)
  })
  
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
  
    const path = require('path');
    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
  
  }

  app.listen(port, () => console.log(`Listening on port ${port}!`))
  
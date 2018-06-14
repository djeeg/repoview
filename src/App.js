import React, { Component } from 'react';
//todo: need to get tooling working with non-code imports
//import logo from './logo.svg';
//import './App.css';
import {isBrowser} from "./kit/utils";
import {getIssues, getRepositories} from "./data/github";
import IssueItem from "./components/IssueItem";

class App extends Component {

    constructor(props, context) {
        super(props, context);

        this.onClickRepo = this.onClickRepo.bind(this);

        this.state = {repos: null}; //todo: maybe put this into redux
    }

    onClickRepo(i) {
        console.log("onClickRepo", i);
        var that = this;

        if(this.state.repos && this.state.repos[i.name] && this.state.repos[i.name].issues) {
            return; //do nothing, it has already been loaded
        }

        //mark current repo as loading
        //todo: better merge state with immutable/deep set
        const newrepos = Object.assign([], this.state.repos, {
            [i.name]: Object.assign(this.state.repos.filter(j => j.name == i.name)[0], {
                loadingissues: true,
            })
        });
        this.setState({repos: newrepos});

        setTimeout(async () => {
            try {
                var response = await getIssues("nodejs", i.name);
                if (response) {
                    console.log(response);
                    var issues = response.map((i) => {
                        //todo: maybe some error handling with JSON extraction as 3rd party API
                        return {
                            id: i.id,
                            title: i.title,
                        }
                    });

                    //todo: better merge state with immutable/deep set
                    const newrepos = Object.assign([], this.state.repos, {
                        [i.name]: Object.assign(this.state.repos.filter(j => j.name == i.name)[0], {
                            issues: issues,
                        })
                    });
                    this.setState({repos: newrepos});

                } else {
                    console.error("failed to receive issues");
                }
            } catch(err) {
                console.error(err);
            }

        }, 300); //todo: remove fake delay
    }

    componentDidMount() {
        if (isBrowser()) {
            setTimeout(async () => {
                try {
                    var response = await getRepositories("nodejs");
                    //todo: ideally call this from redux-thunk or redux-saga
                    if (response) {
                        //console.log(response);
                        var repos = response.map((i) => {
                            //todo: maybe some error handling with JSON extraction as 3rd party API
                            return {
                                name: i.name,
                                issues_url: i.issues_url,
                                loadingissues: false,
                                issues: null,
                            }
                        });
                        //todo: inject into redux, then use react-redux to connect()
                        this.setState({repos: repos});
                    } else {
                        console.error("failed to receive repos");
                    }
                } catch(err) {
                    console.error(err);
                }
            }, 500); //todo: remove fake delay
        }
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          <h1 className="App-title">repoview</h1>
        </header>
          <div>
              {
                  this.state.repos ? (
                      <ul key="repos">
                          {
                              this.state.repos.map(i => {
                                  //todo: could extract this into another component called <RepoItem>
                                  return (
                                      <li key={"repo-" + i.name} onClick={() => this.onClickRepo(i)}>
                                          {i.name}
                                          {
                                              i.issues ? (
                                                  <ul key={"issues-" + i.name}>
                                                      {
                                                          i.issues.map(j => {
                                                              return (
                                                                  <IssueItem key={"issue-" + j.id} title={j.title} />
                                                              );
                                                          })
                                                      }
                                                  </ul>
                                              ) : i.loadingissues ? (
                                                  <ul key={"issuesloading-" + i.name}>loading...</ul>
                                              ) : null
                                          }
                                      </li>
                                  );
                              })
                          }
                      </ul>
                  ) : (
                      <ul key="repos-loading">
                          <li>loading...</li>
                      </ul>
                  )
              }
          </div>
      </div>
    );
  }
}

export default App;

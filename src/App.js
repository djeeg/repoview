import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
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
                        return {
                            id: i.id,
                            title: i.title,
                        }
                    });

                    //todo: better merge state with immutable/deep set
                    const newrepos = Object.assign([], that.state.repos, {
                        [i.name]: Object.assign(that.state.repos.filter(j => j.name == i.name)[0], {
                            issues: issues,
                        })
                    });
                    that.setState({repos: newrepos});

                } else {
                    //todo: some error handling
                }
            } catch(err) {
                //todo: some error handling
            }

        }, 300);
    }

    componentDidMount() {
        if (isBrowser()) {
            setTimeout(async () => {
                try {
                    var response = await getRepositories("nodejs");
                    if (response) {
                        //console.log(response);
                        var repos = response.map((i) => {
                            return {
                                name: i.name,
                                issues_url: i.issues_url,
                                loadingissues: false,
                                issues: null,
                            }
                        });
                        this.setState({repos: repos});
                    } else {
                        //todo: some error handling
                    }
                } catch(err) {
                    //todo: some error handling
                }

            }, 1000);
        }
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">repoview</h1>
        </header>
          <div>
              {
                  this.state.repos ? (
                      <ul key="repos">
                          {
                              this.state.repos.map(i => {
                                  return (
                                      <li key={"repos-" + i.name} onClick={() => this.onClickRepo(i)}>
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

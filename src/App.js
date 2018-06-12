import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {isBrowser} from "./kit/utils";
import {getIssues, getRepositories} from "./data/github";

class App extends Component {

    constructor(props, context) {
        super(props, context);

        this.onClickRepo = this.onClickRepo.bind(this);

        this.state = {repos: null}; //todo: maybe put this into redux
    }

    onClickRepo(i) {
        if(this.state.repos[i.name]) {
            return; //do nothing, it has already been loaded
        }

        const newrepos = Object.assign([], this.state.repos, {
            [i.name]: Object.assign({}, this.state.repos[i.name], {
                loadingissues: true,
                issues: null,
            })
        });
        this.setState({repos: newrepos});

        setTimeout(async () => {
            try {
                var response = await getIssues("nodejs", i.name);
                if (response) {
                    console.log(response);
                    // var repos = response.map((i) => {
                    //     return {
                    //         name: i.name,
                    //         issues_url: i.issues_url,
                    //     }
                    // });
                    // this.setState({repos: repos});
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
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">

        </p>
          <div>
              {
                  this.state.repos ? (
                      <ul key="repos">
                          {
                              this.state.repos.map(i => {
                                  return (
                                      <li key={"repos-" + i.name} onClick={() => this.onClickRepo(i)}>
                                          {i.name}
                                          {JSON.stringify(i.name)}
                                          <ul>
                                              {
                                                  i.loadingissues ? (
                                                      <li>loading issues...</li>
                                                  ) : i.issues ? (
                                                      <li>{i.issues.length}</li>
                                                  ) : null
                                              }
                                          </ul>
                                      </li>
                                  );
                              })
                          }
                      </ul>
                  ) : (
                      <ul key="repos-loading">
                          <li>loading repos...</li>
                      </ul>
                  )
              }
          </div>
      </div>
    );
  }
}

export default App;

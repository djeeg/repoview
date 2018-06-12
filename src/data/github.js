import {safefetch} from "../kit/utils";

export function getRepositories(orgname) {
    var url = `https://api.github.com/orgs/${orgname}/repos`;
    return safefetch(url).then(json => {
        //todo: logging
        return json;
    });
}

export function getIssues(orgname, reponame, state = "open") {
    var url = `https://api.github.com/repos/${orgname}/${reponame}/issues?state=${state}`;
    return safefetch(url).then(json => {
        //todo: logging
        return json;
    });
}


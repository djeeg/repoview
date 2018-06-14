import { getRepositories, getIssues } from '../github';

const orgs = [
    {
        name: 'nodejs',
        repos: [
            {
                name: 'repo1',
                issues_url: 'https://repo1',
                issues: [
                    {
                        id: 1,
                        title: 'Issue 1',
                    },
                    {
                        id: 2,
                        title: 'Issue 2',
                    },
                ]
            },
            {
                name: 'repo2',
                issues_url: 'https://repo2',
            },
        ]
    }
];

describe('data github', () => {
    beforeEach(() => {
        fetch.resetMocks()
    });
    it('getRepositories fail connection', () => {
        fetch.mockReject(new Error('connection failed'));
        var result = getRepositories('nodejs').catch(err => {
            expect(err.message).toEqual('connection failed');
        });
        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0]).toEqual('https://api.github.com/orgs/nodejs/repos');
        return result;
    });
    it('getRepositories fail 500', () => {
        fetch.mockResponseOnce('Server Error', {status: 500});
        var result = getRepositories('nodejs').catch(err => {
            expect(err).toEqual('Server Error');
        });
        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0]).toEqual('https://api.github.com/orgs/nodejs/repos');
        return result;
    });
    it('getRepositories nodejs', () => {
        fetch.mockResponseOnce(JSON.stringify(orgs.find(i => i.name == "nodejs").repos));
        var result = getRepositories('nodejs').then(data => {
            expect(data.length).toEqual(2);
        });
        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0]).toEqual('https://api.github.com/orgs/nodejs/repos');
        return result;
    });
    it('getRepositories bad', () => {
        fetch.mockResponseOnce(JSON.stringify(null));
        var result = getRepositories('bad').then(data => {
            expect(data).toBeNull();
        });
        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0]).toEqual('https://api.github.com/orgs/bad/repos');
        return result;
    });
    it('getIssues nodejs repo1', () => {
        fetch.mockResponseOnce(JSON.stringify(orgs.find(i => i.name == "nodejs").repos.find(i => i.name == "repo1").issues));
        var result = getIssues('nodejs', 'repo1').then(data => {
            expect(data.length).toEqual(2);
        });
        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0]).toEqual('https://api.github.com/repos/nodejs/repo1/issues?state=open');
        return result;
    });
    it('getIssues nodejs bad', () => {
        fetch.mockResponseOnce(JSON.stringify(null));
        var result = getIssues('nodejs', 'bad').then(data => {
            expect(data).toBeNull();
        });
        expect(fetch.mock.calls.length).toEqual(1);
        expect(fetch.mock.calls[0][0]).toEqual('https://api.github.com/repos/nodejs/bad/issues?state=open');
        return result;
    });
});
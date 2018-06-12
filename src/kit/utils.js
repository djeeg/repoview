
export function isBrowser() {
    return typeof window !== "undefined";
}

export function safefetch(url, options) {
    var promise = fetch(url, options)
        .then(
            function (response) {
                if (200 <= response.status && response.status < 300) {
                    return response.json();
                } else {
                    console.error("fetch2 - response error");
                    return response.text().then(function (errtext) {
                        console.error("fetch2 - response errtext - " + errtext);
                        return Promise.reject(errtext);
                    });
                }
            },
            error => {
                console.error("fetch2 - connection error");
                return Promise.reject(error);
            }
        )
        .then(json => {
            return Promise.resolve(json);
        });

    //todo: handle client-side timeout with Promise.race

    return promise;
}
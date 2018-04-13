class Query {

    static _preparePostData(params) {

	    var esc = encodeURIComponent;
	    var query = Object.keys(params)
		    .map(k => esc(k) + '=' + esc(params[k]))
		    .join('&');

        return query;
    }

    static do(url, method, params = false, token = false) {
        const that = this;

        return new Promise((resolve, reject) => {
	        let options = {
		        method,
                headers: {},
		        mode: 'cors'
	        };

	        if (params && typeof params === 'object') {
	            options['body'] = that._preparePostData(params);
	            options['headers']['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            }

            if (token) {
	            options['headers']['Authorization'] = `Bearer ${token}`;
            }

	        fetch(`http://193.124.114.46:3001/${url}`, options)
		        .then(res => (res.ok) ? res.json() : res.text())
		        .then(data => {
			        if (typeof data === 'object') {
				        resolve({
                            status: 'success',
                            payload: data
                        });
			        } else {
				        reject({
                            status: 'error',
                            payload: data,
                        });
			        }
		        })
		        .catch(error => {
			        reject({
				        status: 'error',
				        payload: error
			        });
		        });
        });
    }

}

export default Query;
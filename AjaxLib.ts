export class Deferred {
    queue: Array<Function>;
    arg;
    running: boolean;
    resolved: boolean;
    constructor(func = null, arg = null) {
        this.queue = [];
        if (typeof func == "function") {
            this.arg = arg;
            this.queue.push(func);
        }
        this.running = false;
        this.resolved = false;
        return this;
    }

    then(func: Function, autoResolve: boolean = true) {
        this.queue.push(func);
        // .then will force it to run by default
        if (this.resolved || (!this.running && autoResolve)) {
            this.running = true;
            this.resolve();
        }
        return this;
    }

    resolve() {
        this.resolved = true;
        var obj = this;
        // Run async
        setTimeout(() => {
            obj.running = true;
            // if there is a queued function execute it
            if(obj.queue.length > 0)
                obj.arg = obj.queue.shift()(obj.arg);
            // if there are more queued functions, execute them
            if (obj.queue.length > 0) {
                obj.resolve();
            } else {
                // else, done
                obj.running = false;
            }
        });
        return this;
    }
}

export class DeferredAjax extends Deferred {
    request: XMLHttpRequest;
    constructor(request, data = null) {
        super();
        // set the request, set running to true since we will fire it right away.
        this.request = request;
        this.running = true;
        // allow access to "this" in sub functions
        var obj = this;
        // when the request is done, set the response as the args and run the queue
        this.request.addEventListener("load", () => {
            obj.arg = request.response;
            obj.resolve();
        });
        // start ajax call
        this.request.send(data);
    }

    // wrapper for .then for readability
    success(func) {
        this.then(func);
        return this;
    }

    // wrapper for adding an error callback if not passed in constructor
    fail(func) {
        this.request.addEventListener("error", func);
        return this;
    }
}

export function getJson(url: string, success: Function = null, fail: Function = null) {
    var xhr = new XMLHttpRequest();    
    xhr.open("GET", url);
    xhr.setRequestHeader("Accept", "application/json");
    var deferred = new DeferredAjax(xhr).success((response) => {
        return JSON.parse(response);
    }).fail(fail);
    if (success)
        deferred.then(success);
    return deferred;
} 

export function getQueryString(obj) {
    if (!obj)
        return "";
    var keys = Object.keys(obj);
    var arr = ['?'];
    keys.forEach((key, index) => {
        arr.push(key + "=");
        arr.push(obj[key]);
        if (index != (keys.length - 1))
            arr.push("&");
    });
    return arr.join('');
}

export function ajaxGet(url: string, data = null, success: Function = null, fail: Function = null) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url + getQueryString(data));
    var deferred = new DeferredAjax(xhr).success((response) => {
        return response;
    });
    if (fail) 
        deferred.fail(fail);
    if (success)
        deferred.success(success);
    return deferred;
} 


export function ajaxPost(url: string, data = null, success: Function = null, fail: Function = null) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var deferred = new DeferredAjax(xhr, JSON.stringify(data));
    if (fail)
        deferred.fail(fail);
    if (success)
        deferred.success(success);
    return deferred;
}


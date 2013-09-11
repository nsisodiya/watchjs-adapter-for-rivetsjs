var FlatKey = {
    set: function (Obj, keypath, value) {
        //console.log("set : " + keypath + " with " + value);
        var V = Obj;
        var keyArry = keypath.split(".");
        keyArry.filter(function (v, i, A) {
            return i !== A.length - 1;
        }).map(function (v) {
            if (V[v] === undefined) {
                V[v] = {};
            }
            return V = V[v];
        });
        V[keyArry.pop()] = value;
    },
    get: function (Obj, keypath) {
        var V = Obj;
        keypath.split(".").map(function (v) {
            if (V[v] === undefined) {
                return V = "";
            }
            return V = V[v];
        });
        return V;
    },
    findsubPath: function (str) {
        return str.split(".").filter(function (v, i, A) {
            return i !== A.length - 1;
        }).join(".");
    }

};

rivets.configure({
    adapter: {
        subscribe: function (obj, keypath, callback) {
            var subpath = FlatKey.findsubPath(keypath);
            //console.log("subscribed : " + keypath + " : subpath = " + subpath);
            if (subpath === "") {
                watch(obj, keypath, callback);
            } else {
                watch(FlatKey.get(obj, subpath), keypath.split(".").pop(), callback);
            }
        },
        unsubscribe: function (obj, keypath, callback) {
            //console.log("unsubscribed : " + keypath);
            var subpath = FlatKey.findsubPath(keypath);
            if (subpath === "") {
                unwatch(obj, subpath, callback);
            } else {
                unwatch(FlatKey.get(obj, subpath), keypath.split(".").pop(), callback);
            }
                
        },
        read: function (obj, keypath) {
            //console.log("read : " + keypath + " is " + FlatKey.get(obj, keypath));
            return FlatKey.get(obj, keypath);
        },
        publish: function (obj, keypath, value) {
            FlatKey.set(obj, keypath, value);
            //console.log("publish : " + keypath);
        }
    }
});

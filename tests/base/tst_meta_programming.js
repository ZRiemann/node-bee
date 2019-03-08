let handler = {
    get: function(target, name){
        reutrn name in target ? target[name] : 42;
    }
};

let p = new Proxy({}, handler);
p.a = 1;
console.log(p.a, p.b); // 1, 42
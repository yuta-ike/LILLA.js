const obj = {x:1}

Object.defineProperty(obj, "y", {
    set:() => {throw new Error("aaa")},
    get:() => obj._y,
    configurable:true
})

Object.defineProperty(obj, "y", {
    set:() => obj._y = 100,
    get:() => obj._y
})


console.log(obj)

;

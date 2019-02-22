class Subject{
    constructor(){
        this.observers = new Set()
    }
    subscribe(next, error = err => console.warn(err), complete = msg => console.log(msg)){
        const observer = Object.create({next, error, complete})
        this.observers.add(observer)
    }

    next(data){
        if(this.hasFinished) return;
        this.observers.forEach(observer => observer.next(data))
    }
    complete(msg){
        this.hasFinished = true
        this.observers.forEach(observer => observer.complete(msg))
    }
    error(err){
        this.hasFinished = true
        this.observers.forEach(observer => observer.error(err))
    }

    filter(process){
        const nextSubject = new Subject()
        this.subscribe(data => {
            if(process(data)) nextSubject.next(data)
        })
        return nextSubject
    }
    do(process){
        const nextSubject = new Subject
        this.subscribe(data => {
            process(data)
            nextSubject.next(data)
        })
        return nextSubject
    }
    map(mapFunc){
        const nextSubject = new Subject()
        this.subscribe(data => nextSubject.next(mapFunc(data)))
        return nextSubject
    }
    select(selFunc){ return this.map(selFunc) } //alias
    mapTo(value){this.map(() => value)}
    scan(scanFunc, seed){
        const nextSubject = new Subject()
        let acc = seed
        let index = 0
        this.subscribe(data => {
            const newValue = scanFunc(acc, data, index)
            nextSubject.next(newValue)
            acc = newValue
            index++
        })
        return nextSubject
    }
    skip(skipNum){
        const nextSuject = new Subject()
        let num = 0
        this.subscribe(data => {
            if(num >= skipNum){
                nextSubject.next(data)
            }
            num++
        })
        return nextSubject
    }
    take(takeNum){
        const nextSubject = new Subject()
        let num = 0
        this.subscribe(data => {
            if(num < takeNum){
                nextSubject.next(data)
            }else{
                nextSubject.complete()
            }
            num++
        })
        return nextSubject
    }
    distinctUntilChanged(init = Symbol()/*他のいかなる値とも違う値*/){
        const nextSubject = new Subject()
        let prevData = init
        this.subscribe(data => {
            if(prevData !== data){
                nextSubject.next(data)
                prevData = data
            }
        })
        return nextSubject
    }

    interval(time){
        const nextSubject = new Subject()
        let i = 0
        setInterval(() => {
            nextSubject.next(i)
            i++
        }, time)
        return nextSubject
    }

    combineLatest(combineFunc, ...observables){
        const nextSubject = new Subject()
        const valueMap = new Map()
        this.subscribe(data => {
            nextSubject.next(data)
        })
        observables.forEach(observer => observer.subscribe(data => {
            valueMap.set(observer, data)
            this.next(combineFunc(valueMap))
        }))

        return nextSubject
    }
}

class ReactiveProperty extends Subject{
    constructor(init){
        super()
        this._value = init
    }
    get value(){return this._value}
    set value(v){
        this._value = v
        this.next(v)
    }
}


// const subject1 = new Subject()
// const subject2 = new Subject()
// const subject3 = new Subject()
//
// const pattern1 = subject1.interval(1000).take(5)
//
// const pattern2 = subject2.interval(1500).take(5)
//
//
// subject3.combineLatest(map => map.get(pattern1) + " , " + map.get(pattern2), pattern1, pattern2)
//         .subscribe(x => console.log(x))





export {Subject, ReactiveProperty}

//
// const subject = new Subject()
// {
//     subject
//         .distinctUntilChanged()
//         .subscribe(x => console.log(`subscribe1: ${x}`))
// }
// {
//     subject.next(0)
//     subject.next(1)
//     subject.next(2)
//     subject.next(2)
//     subject.next(2)
//     subject.next(3)
//     subject.next(4)
//     subject.next(4)
//     subject.complete("")
//     subject.next(5)
// }

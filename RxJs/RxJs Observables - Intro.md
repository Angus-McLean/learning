# RxJs Observables - Intro
## **Overview **: 




## **Setting up Dev Environment**
1. Start a new folder / npm project. Install 'rxjs' package

```bash
npm init
npm i rxjs --save
```
2. Require RxJs into whatever js file

```bash
const Rx = require('rxjs');
const Observable = Rx.Observable;
```


## **Creating Observables**
### - From Scratch (Sync / Async)

```javascript
const Rx = require('rxjs');
const Observable = Rx.Observable;

// alternatively : let source = Rx.Observable.create(()=>{})
let source = new Rx.Observable((observer) => {
  console.log('creating observer');
  observer.next('Hello World!');
  observer.next('Next Value!');

  [1,2,3].forEach((a) => {
    observer.next(a)
  })

  setTimeout(function() {
    observer.next('Async Value 1!');
  }, 1000);

  setTimeout(function() {
    observer.next('Async Value 2!');
    observer.complete();
    observer.next('Value after complete!');
  }, 2000);
})

source.subscribe(
  (v) => { console.log('value', v); },
  (v) => { console.log('err', v); },
  (v) => { console.log('completed'); }
);

```
Output : 

```bash
creating observer
value Hello World!
value Next Value!
value 1
value 2
value 3
value Async Value 1!
value Async Value 2!
completed
```
### - From Scratch (Promise)

```javascript
let source = new Rx.Observable.fromPromise(Promise.resolve('Hello :)'))

source.subscribe(
  (v) => { console.log('value', v); },
  (v) => { console.log('err', v); },
  (v) => { console.log('completed'); }
);
```
Output : 

```javascript
value Hello :)
completed
```


## **Important Concepts**
### - Synchronicity of Returned Values
> Observables are able to deliver values either synchronously or asynchronously.


    This is analogous to a function that can "return" more than once, some can be returned synchronously and some can be returned asynchronously.


Example 1 : 

```javascript
// Analogous function with multiple returns
function foo() {
  console.log('Hello');
  return 42;
  return 100; // dead code. will never happen
}
console.log('before');
console.log(foo.call());
console.log('after');
```
Output 1 : 

```javascript
"before"
"Hello"
42
"after"
```
Example 2 : 

```javascript
// Observable Equivalent
var foo = Rx.Observable.create(function (observer) {
  console.log('Hello');
  observer.next(42);
  observer.next(100); // "return" another value
});

console.log('before');
foo.subscribe(function (x) {
  console.log(x);
});
console.log('after');
```
Output 2 : 

```javascript
"before"
"Hello"
42
100
"after"
```


Example 3 : 

```javascript
var source = Rx.Observable.create(function (observer) {
  console.log('creating');
  observer.next('Sync Value 1');
  observer.next('Sync Value 2');
  observer.next('Sync Value 3');

  setTimeout(() => {
    observer.next('Async Return Value');
    observer.complete();
  }, 0);
});

source.subscribe({
  next: x => console.log('val : ' + x),
  error: err => console.error('something wrong occurred: ' + err),
  complete: () => console.log('done'),
});

console.log('Callled synchronously with source.subscribe call');
```
Output :

```javascript
creating
val : Sync Value 1
val : Sync Value 2
val : Sync Value 3
Callled synchronously with source.subscribe call
val : Async Return Value
done
```


### - Completion / Errors
> No values are delivered after either observer.complete() or observer.error(err)

```javascript
var source = Rx.Observable.create(function (observer) {
  observer.next('Sync Value 1');
  setTimeout(() => {
    observer.next('Just before complete');
    observer.complete();
  }, 0);
  setTimeout(() => { observer.next('After completion..'); }, 10);
});
source.subscribe({
  next: x => console.log('Sub1 - val : ' + x),
  complete: () => console.log('Sub1 - done'),
});
```
Output : 

```javascript
Sub1 - val : Sync Value 1
Sub1 - val : Just before complete
Sub1 - done
```
### - Laziness
> Subscribing to an Observable is analogous to calling a Function.

```javascript

```
Output

```javascript

```
### - Multiple Subscribers
> Observables are lazily executed when new subscribers are connected.

```javascript
var source = Rx.Observable.create(function (observer) {
  console.log('creating');
  observer.next('Sync Value 1');
  observer.next('Sync Value 2');

  setTimeout(() => {
    observer.next('Async Return Value');
    observer.complete();
  }, 0);
});

console.log('Before Sub1');
source.subscribe({
  next: x => console.log('Sub1 - val : ' + x),
  complete: () => console.log('Sub1 - done'),
});
console.log('After Sub1 and Before Sub2');
source.subscribe({
  next: x => console.log('Sub2 - val : ' + x),
  complete: () => console.log('Sub2 - done'),
});
```
Output : 

```javascript
Before Sub1
creating
Sub1 - val : Sync Value 1
Sub1 - val : Sync Value 2
After Sub1 and Before Sub2
creating
Sub2 - val : Sync Value 1
Sub2 - val : Sync Value 2
Sub1 - val : Async Return Value
Sub1 - done
Sub2 - val : Async Return Value
Sub2 - done
```









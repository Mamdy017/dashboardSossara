# angular-count-to

A simple count-to directive that counts from a number to a number.

## Requirements

- Angular >= 4.0.0

## Installation

`npm install angular-count-to --save`

In your app.module.ts:

```
import { CountToModule } from 'angular-count-to';
@NgModule({
    ...
    imports: [CountToModule]
    ...
});
```

## Background

- The count-to code was re-written from [this AngularJS module](https://github.com/sparkalow/angular-count-to)

- The package build is from robisim74's [angular-library-starter](https://github.com/robisim74/angular-library-starter)

## Example

```
// Controller
count = {
    countTo: 100,
    from: 0,
    duration: 1
};

// Template
<span [CountTo]="count.countTo" [from]="count.from" [duration]="count.duration"></span>

// Write directly to the directive
<span CountTo="100" from="0" duration="10"></span>
```

| Value | Required | Defaults to
| ------ | ----------- | ---------- |
| CountTo | yes | N/a |
| from | no | 0 |
| duration | no | 4|

## TODOS

- Write test scripts

## License

MIT

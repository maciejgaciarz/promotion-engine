# promotion-engine
Promotion engine created as a part of recruitment task.
## How to launch?
In terminal
```
npm install
```
Then we can run tests with jest
```
npm run test
```
All tests should be green.
## Introduction
A wedding photography company asked us to implement a price calculator for their webpage.\
The goal of this task is to edit the attached code and implement the price calculation logic, so it meets the requirements described below.
## Functional Requirements
The price should be calculated after providing the list of services and selecting the calendar year.\
Price calculator should include the following years: 2020, 2021, 2022.\
The client probably would like to change that in the next years.
Services they provide to the clients are:
+ photography during the wedding,
+ video recording during the wedding,
+ wedding session,
+ extra Blu-ray package,
+ handling of the two-day event.

Note that “photography during the wedding” and “wedding session” are two separate services.\
Prices of services may be different every year. Each type of service has its own price.

All we know about the prices of the services is the following:
+ photography costs $1700 in 2020, $1800 in 2021 and $1900 in 2022,
+ video recording costs $1700 in 2020, $1800 in 2021 and $1900 in 2022,
+ package of photography + video costs less: $2200 in 2020, $2300 in 2021 and $2500 in 2022,
+ wedding session costs regularly $600, but in a package with photography during the wedding or with a video recording it costs $300,
+ wedding session is free if the client chooses Photography during the wedding in 2022,
+ extra Blu-ray package costs $300,
+ handling of the two-day event costs $400 extra.

Any discounts should never be applied twice - greater discount wins.\
It does not make sense to include the price of the Extra Blu-ray when the client did not choose a video recording.\
It does not make sense to include the price of handling two-day event when the client did not choose video recording or photography during the wedding.
## Instructions
Your task is to implement the following functions from index.ts file:
+ calculatePrice - should return basePrice and finalPrice pair. The final price includes all the discounts,
+ updateSelectedServices - should return the current selection state after select/deselect action.
We assume all data like prices and service type names are hard coded in code.\
Feel free to make any changes in the existing codebase.
## Expectations
When reviewing the solution, we care the most about the following:
+ all unit tests pass,
+ requirements met,
+ updateSelectedServices has the reducer-like style,
+ code is type-safe, readable, easy to reason about, maintainable and performant

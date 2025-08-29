## Technical Test

1. Section 1 - Add invoice with autocomplete for product input

+ Mandatory invoice data are date, customer name, salesperson name, notes
(optional), and multiple products sold. ✅
+ Autocomplete product suggestions as the user types. Each product suggestion should
include product name, product picture, stock, and the price of the product (product
data can be hard coded in JSON format) ✅
+ POST API called using fetch or axios to save the invoice to database. ✅
+ Form cannot be submitted when at least one of the input boxes are empty ✅
+ Show a warning message for invalid inputs (label or tooltip)• ✅
+ Upon successful submission, proper notification pop-up should be shown ✅

2. Section 2 - Invoice card

+ An invoice card with pagination to show invoices that have been published ✅
+ The invoice cards should show summary of the invoice above such as customer name,
salesperson name, total amount paid, and notes. ✅
+ The invoice data should be queried from backend using GET API using lazy loading
method ✅

3. Section 3 - Time-series graph

+ Show a graph to project revenue from invoices for daily, weekly, and monthly ✅
+ It should enable user to pan and zoom to specific period ✅
+ Auto scroll when new data is pushed ✅

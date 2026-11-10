# SQL: co robi to zapytanie?
> Zapytania w stylu bazy do recertyfikacji. Tabele: Employees (HR), Accounts (konta w systemach), AccessApprovals (zgody).

## What does this query return?
```sql
SELECT FullName, Department
FROM Employees
WHERE Office = 'Warsaw' AND Status = 'Active'
ORDER BY FullName;
```
---
The name and department of every active employee in the Warsaw office, sorted alphabetically by name.

`SELECT` picks the columns, `FROM` the table, `WHERE` filters the rows - both conditions must be true - and `ORDER BY` sorts the result.
PL: Schemat czytania na głos: z jakiej tabeli, które wiersze (WHERE), które kolumny (SELECT), jak posortowane lub pogrupowane.

## What does this query return?
```sql
SELECT e.FullName, a.SystemName, a.Username
FROM Employees e
INNER JOIN Accounts a ON a.EmployeeID = e.EmployeeID
WHERE a.IsActive = 1;
```
---
A list of active accounts with the name of the employee each one belongs to: who has an active account in which system.

`INNER JOIN` keeps only rows that match on both sides, so accounts with no employee and employees with no accounts are not shown. `e` and `a` are just short aliases for the tables.

## What is the difference between INNER JOIN and LEFT JOIN?
`INNER JOIN` returns only rows that have a match in both tables.

`LEFT JOIN` returns every row from the left table, and where there is no match on the right, the right-hand columns are NULL.

That is why LEFT JOIN is the tool for finding what is missing: rows on the left with nothing on the right.

## What is this query looking for?
```sql
SELECT a.SystemName, a.Username
FROM Accounts a
LEFT JOIN Employees e ON e.EmployeeID = a.EmployeeID
WHERE e.EmployeeID IS NULL;
```
---
Orphaned accounts: accounts that are not linked to any employee in the HR table.

The LEFT JOIN keeps all accounts, and the `WHERE ... IS NULL` keeps only those where no employee was found. These are the accounts nobody owns - a classic audit finding.

## What does this query find, and why does it matter?
```sql
SELECT e.FullName, e.TerminationDate, a.SystemName, a.Username
FROM Employees e
JOIN Accounts a ON a.EmployeeID = e.EmployeeID
WHERE e.TerminationDate < GETDATE()
  AND a.IsActive = 1
ORDER BY e.TerminationDate;
```
---
People who have already left the firm but still have an active account somewhere, oldest termination first.

It is an offboarding check: every row is access that should have been removed and was not.

## What does this query return?
```sql
SELECT EmployeeID, COUNT(*) AS ActiveAccounts
FROM Accounts
WHERE IsActive = 1 AND SystemName = 'Aderant'
GROUP BY EmployeeID
HAVING COUNT(*) > 1;
```
---
Employees who have more than one active ADERANT account - probable duplicates.

`WHERE` filters rows before grouping, `GROUP BY` makes one group per employee, `COUNT(*)` counts the rows in each group, and `HAVING` filters the groups after counting.
PL: WHERE filtruje wiersze PRZED grupowaniem, HAVING filtruje grupy PO grupowaniu. O to pytają najczęściej.

## What does this query return?
```sql
SELECT Username, SystemName, LastReviewDate
FROM Accounts
WHERE IsActive = 1
  AND (LastReviewDate IS NULL
       OR LastReviewDate < DATEADD(MONTH, -6, GETDATE()));
```
---
Active accounts that are overdue for recertification: never reviewed, or last reviewed more than six months ago.

`GETDATE()` is now, and `DATEADD(MONTH, -6, ...)` moves that six months back. The brackets matter: without them the AND and OR would combine differently.

## What does this statement do, and what could go wrong?
```sql
UPDATE Accounts
SET IsActive = 0
WHERE EmployeeID = 10482;
```
---
It marks all accounts of employee 10482 as inactive.

The danger is the WHERE clause: if it is missing or wrong, every row in the table is changed. Before running an UPDATE or DELETE, I run a SELECT with the same WHERE to see exactly which rows will be affected.

## How do you run a risky change safely in SQL Server?
```sql
BEGIN TRANSACTION;

UPDATE Accounts
SET IsActive = 0
WHERE EmployeeID = 10482;

-- check the number of rows affected, then:
ROLLBACK;   -- or COMMIT;
```
---
Inside a transaction. The change is not final until `COMMIT`; if the number of affected rows is not what I expected, `ROLLBACK` undoes it.

And on anything that matters: test on a non-production copy first, and make sure a backup exists.

## Why does this query return nothing, even though some accounts were never reviewed?
```sql
SELECT Username
FROM Accounts
WHERE LastReviewDate = NULL;
```
---
Because nothing is ever equal to NULL - NULL means "unknown", and a comparison with it is never true.

The correct test is `WHERE LastReviewDate IS NULL`.

## What does this query find?
```sql
SELECT a.Username, a.SystemName
FROM Accounts a
WHERE a.IsActive = 1
  AND NOT EXISTS (
      SELECT 1
      FROM AccessApprovals ap
      WHERE ap.AccountID = a.AccountID
  );
```
---
Active accounts that have no approval record at all - access that exists without documented approval.

For each account, the inner query looks for at least one matching row in the approvals table, and `NOT EXISTS` keeps the accounts where it finds none.

## What does this query add to the result?
```sql
SELECT Username,
       CASE
           WHEN LastReviewDate IS NULL THEN 'Never reviewed'
           WHEN LastReviewDate < DATEADD(MONTH, -6, GETDATE()) THEN 'Overdue'
           ELSE 'OK'
       END AS ReviewStatus
FROM Accounts;
```
---
A calculated column called ReviewStatus. `CASE` works like if / else-if / else: for each account it returns the first label whose condition is true.

Nothing is stored - the label exists only in the query result.

## What does this statement do?
```sql
INSERT INTO AccessApprovals (AccountID, ApprovedBy, ApprovedDate, TicketNo)
VALUES (5521, 'Office of Firm Counsel', GETDATE(), 'SR-104233');
```
---
It adds one new row to the approvals table: account 5521 was approved by the Office of Firm Counsel, now, under that ticket number.

This is the kind of record the recertification process relies on later.

## What is the difference between COUNT(*) and COUNT(column), and what does DISTINCT do?
`COUNT(*)` counts rows. `COUNT(column)` counts only the rows where that column is not NULL.

`DISTINCT` removes duplicates: `SELECT DISTINCT SystemName FROM Accounts` lists each system once, and `COUNT(DISTINCT EmployeeID)` counts people rather than accounts.

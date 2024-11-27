# database-demo
### https://database-demo.shephardluke.co.uk
A demonstration of databases in the browser window using the [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). Databases can be created, which hold object stores where records can be added. These databases are then kept in the browser's persistant storage so the databases can be saved between sessions. 

#### Pre-release version, everything is subject to change and bugs or crashes may occur.

## How to use
### Database Menu (Main Page)
When loading the webpage for the first time there will be no databases.

To create a database, at the bottom enter the name and press the 'Create Database' button and it should appear on the list.
Press 'Open Database' to go into the database, or 'Delete Database' to remove it.

### Database View
#### Object Stores
Once inside a database, all of its object stores and their records will be displayed. When opening a database for the first time, there will be no object stores. To create one use the setup UI to add and name indexes (using the 'Create Index' button to add more) and set them as keys if multiple are needed. After entering a name for the object store press the 'Create Object Store' button and it will be created.

To delete an object store, press the 'Delete Object Store' button under its name.

#### Records
Under each object store there will be a table showing all the records with the created indexes. To add a record, fill in the text boxes with the desired values and press the 'Create Record' button on the right.

To delete a record, press the 'Delete Record' button on the right of the record.

## Saving
Changes are updated as soon as they are made.

Closing the browser will still keep all of the databases with their object stores and records in persistant storage (IndexedDB).

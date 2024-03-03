# Notion Take Home Assignment - Nicole Lee

## Running the program

git clone xxxx
cd xxx
npm install
In your .env file, add the following variables: NOTION_KEY and NOTION_PAGE_ID
On parser.js, change csvFilePath (line 22) and databse name (line 226) based on needs and preferences
node parser.js

## How my program works

For the scope of this assignment, I took a simple approach to building my program. I made it entirely a server-side app by not having a GUI. Additionally, the path to the CSV is hardcoded as well as the title of the parent page and the database that is created. This was to focus more on the meat of the assignment. Expansion ideas are discussed in the following section!

1. Currently, the program starts by creating a database on a given parent page named CSV database + current date and time
2. The program reads the CSV file included in this file directotry line by line.
3. The program then processes the read lines by trimming whitespaces, uncapitalizing any capitalized letters, sorting rows, and removing duplicate rows.
4. Then, the program consolidates rows that share the same book title into one row and calculates average rating and the number of times the book was favorited
5. The program adds this entry to the database that was created in the beginning row by row in a ascending alphebtical order

## Exapnsion ideas

1. Allow for dynamic CSV file interaction by allowing users to input CSV file path on the terminal when running the program
2. Allow customized page title or database(table) name by allowing users to input this on the terminal
3. Create a GUI where users can upload their CSV file to and take titles and column names as inputs as well.

## short answers

- Was there anything you got stuck on, and if so what did you do to resolve it?
  There wasn't anything specific I got stuck on. However, I did spend a good half an hour getting used to the overall structure and playing around with some of the example code provided by Notion.

- Do you have any suggestions for improving the API documentation to make it clearer or easier to use?
  https://nodejs.org/api/readline.html

## Sources I relied on

I didn't rely too much on external sources as I kept the program simple and within my wheelhouse to honor the 2~3 hour time constraint. In real life, I would definitely put in far more hours and effort to create something more comprehensive, but I chose to be time efficient. Since this is a type of programs I've created many times, I didn't really need to look at external resources!

## Edge cases

Edge cases I considered can be found at the top of parser.js!

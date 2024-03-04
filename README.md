# Notion Take Home Assignment - Nicole Lee

## Running the program

##### Clone this repo locally
`git clone https://github.com/nicolelee1012/Notion-Take-Home.git`
##### Swith into this project
`cd Notion-Take-Home`
##### Install the dependencies
`npm install`
##### Customize (optional)
In your .env file, add the following variables: NOTION_KEY and NOTION_PAGE_ID <br>
On parser.js, change csvFilePath (line 22) and databse name (line 226) based on needs and preferences
##### Run
`node parser.js`



https://github.com/nicolelee1012/Notion-Take-Home/assets/79027045/7c9cf77c-b4ab-418e-a0c6-d9ac14bc1007


## How my program works

For the scope of this assignment, I took a simple approach to building my program. I made it entirely a server-side app by not having a GUI. Additionally, the path to the CSV is hardcoded as well as the title of the parent page and the database that is created. This was to focus more on the meat of the assignment. Expansion ideas are discussed in the following section!

1. Currently, the program starts by creating a database on a given parent page named CSV database + current date and time
2. The program reads the CSV file included in this file directotry line by line.
3. The program then processes the read lines by trimming whitespaces, uncapitalizing any capitalized letters, sorting rows, and removing duplicate rows.
4. Then, the program consolidates rows that share the same book title into one row and calculates average rating and the number of times the book was favorited
5. The program adds this entry to the database that was created in the beginning row by row in a ascending alphebtical order

For cases when the same person rated the same book twice, the spec stated to take the latest entry into consideration. However, since the entries were not organized in any certain order or contained the time of entry, there wasn't a way to distinguish which one was later. Therefore, I handled this case by take the one with the highest rating into consideration. 

## Exapnsion ideas

1. Allow for dynamic CSV file interaction by allowing users to input CSV file path on the terminal when running the program
2. Allow customized page title or database(table) name by allowing users to input this on the terminal
3. Create a GUI where users can upload their CSV file to and take titles and column names as inputs as well.

## Short answers

- Was there anything you got stuck on, and if so what did you do to resolve it? <br>
  There wasn't anything specific I got stuck on. However, I did spend a good half an hour getting used to the overall structure and playing around with some of the example code provided by Notion.

- Do you have any suggestions for improving the API documentation to make it clearer or easier to use? <br>
  The documentation was very helpful for the most part. The only things I wish were different are that I think the documentation could define the differences between pages, blocks, databases, properties more upfront and explicitly. And I wished that [this guide] (https://developers.notion.com/docs/create-a-notion-integration) goes through the rest of the section on the HTML as well - I think it will help users understand all facets of Notion API more hollistically in one sitting :)
  

## Sources I relied on

I didn't rely too much on external sources as I kept the program simple and within my wheelhouse to honor the 2~3 hour time constraint. In real life, I would definitely put in far more hours and effort to create something more comprehensive, but I chose to be time efficient. Since this is a type of programs I've created many times, I didn't really need to look at external resources!

## External libraries 
https://nodejs.org/api/readline.html

## Edge cases

Edge cases I considered can be found at the top of parser.js!

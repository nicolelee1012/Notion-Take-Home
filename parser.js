/**
 * Considered edge cases (not explicitly covered in the code)
 * 1. One of the columns in a row is empty (no book title, no person name, no rating)
 * 2. Rating is negative 
 * 3. Book title is minorly misspelled (below is a partial list of possible misspelling (not an exhaustive list))
 *  - 1~2 letters are wrong
 *  - There is an extra space in between words
 *  - There is no space between words where there should be 
 *  - Missing or extra punctuation 
 * 4. More than one person has the same first name and last inital and reviewed the same books
 * 5. Book title, name, and rating are in wrong places 
 * 6. Incorrect CSV formatting (empty column in the middle etc.)
 */


require('dotenv').config();
const { Client } = require('@notionhq/client');
const fs = require('fs');
const readline = require('readline');
const notion = new Client({ auth: process.env.NOTION_KEY });
const parentPageId = process.env.NOTION_PAGE_ID;
const csvFilePath = 'ratings.csv'; // Update this path

/**
 * 
 * @param {String} databaseName 
 * @returns 
 * creates a database on the given page -> database as booktitle, rating, and favorites columns 
 */
async function createDatabase(databaseName) {
    return await notion.databases.create({
        parent: { page_id: parentPageId },
        title: [
            {
                type: 'text',
                text: { content: databaseName },
            },
        ],
        properties: {
            BookTitle: {
                title: {},
              },
              Rating: {
                "type": "number",
                "number": {
                  "format": "number"
                }
              },
              Favorites: {
                "type": "number",
                "number": {
                  "format": "number"
                }
              },
        },
    });
}

/**
 * 
 * @param {String} databaseId 
 * @param {Array} item - {bookTitle (String), Rating (integer), Favorites (integer)}
 */
async function addItemToDatabase(databaseId, item) {
    await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
            BookTitle: {
                title: [
                    {
                        text: { content: item[0] },
                    },
                ],
            },
            Rating: {
                "type": "number",
                "number": item[1]
            },
            Favorites: {
                "type": "number",
                "number": item[2]
            }
        },
    });
}

/**
 * 
 * @param {Array[]} rows - unsorted array of [book title, person's name, rating]; may contain duplicates 
 * @returns an array of arrays that contain [book title, average rating, # of times it was favorited]
 * Takes in a list of strings that contains book titles, names, and ratings and sorts, removes duplicate rows, 
 * calculates average ratings per book, and number of times it was favorites
 */
function processRows(rows) {
    // Normalize and sort rows
    rows.sort(function(a, b) {
        const normalizedA0 = a[0].toLowerCase().trim();
        const normalizedB0 = b[0].toLowerCase().trim();
        
        if (normalizedA0 < normalizedB0) return -1;
        if (normalizedA0 > normalizedB0) return 1;

        const normalizedA1 = a[1].toLowerCase().trim();
        const normalizedB1 = b[1].toLowerCase().trim();

        if (normalizedA1 < normalizedB1) return -1;
        if (normalizedA1 > normalizedB1) return 1;

        return a[2] - b[2]; // Assuming you still want the original sorting by item[2] as a tiebreaker
    });

    // Filter to keep only the highest item[2] value for each [item[0], item[1]] combination
    let filteredList = rows.filter((item, index, array) => {
        let currentItemNormalized = item[0].toLowerCase().trim();
        let nextItem = array[index + 1];
        if (nextItem) {
            let nextItemNormalized = nextItem[0].toLowerCase().trim();
            if (currentItemNormalized === nextItemNormalized && item[1].toLowerCase().trim() === nextItem[1].toLowerCase().trim()) {
                return false; // Skip this item because the next one has the same title and category but potentially a higher item[2]
            }
        }
        return true;
    });

    // Aggregate sums, counts, and favorites
    let sumsAndCounts = {};
    filteredList.forEach(item => {
        const key = item[0].toLowerCase().trim(); // Normalize key
        const value = item[2];

        if (!sumsAndCounts[key]) {
            sumsAndCounts[key] = { sum: 0, count: 0, favorite: 0 };
        }

        sumsAndCounts[key].sum += value;
        sumsAndCounts[key].count += 1;
        if (value == 5) {
            sumsAndCounts[key].favorite += 1;
        }
    });

    // Calculate averages and prepare result array
    let resultArr = Object.keys(sumsAndCounts).map(key => {
        return [key, Math.round((sumsAndCounts[key].sum / sumsAndCounts[key].count) * 100) / 100, sumsAndCounts[key].favorite];
    });

    // If you want to sort the result array by title for presentation
    resultArr.sort((a, b) => b[0].localeCompare(a[0]));

    // Log and return the result
    return resultArr;
}

/**
 * 
 * @param {String} databaseName 
 * @param {String} csvFilePath 
 * Creates a database named "databaseName" with the current date and time on the page using the env var NOTION_PAGE_ID
 * Reads the CSV file at the csvFilePath by row and calls processRows to clean the entries
 * Adds each item in the clean entries list to the database that was created 
 */
async function processCsvAndUpload(databaseName, csvFilePath) {
    let databaseId = null;

    // Check if a database with the given name exists 
    // If not, create it
    if (!databaseId) {
        // adding current Date to distinguish between various databses
        let now = Date();
        console.log("time created: " + now);
        databaseName = databaseName + " " + now
        const database = await createDatabase(databaseName);
        databaseId = database.id;
        console.log(`Created database "${databaseName}" with ID: ${databaseId}`);
    }

    // Process CSV file and upload each row as a page

    // array to store all lines read from the CSV file
    rows = []
    const fileStream = fs.createReadStream(csvFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        // Skip empty lines or add other checks here as needed
        if (!line) continue;
        const item = line.split(','); // Split CSV line into array
        // trim blank spaces of book titles
        item[0] = item[0].trim();
        // trim blank spaces of names
        item[1] = item[1].trim();
        // convert ratings to int
        item[2] = parseInt(item[2], 10);
        rows.push(item);
    }

    // rows done processing -> should only contain one entry per book title 
    // cleanedRows is an array containing an array of book title, average rating, # of times that book was favorited 
    cleanedRows = processRows(rows);

    /**
     * Considered edge cases (not explicitly covered in the code)
     * 1. One of the columns in a row is empty (no book title, no person name, no rating)
     * 2. Rating is negative 
     * 3. Book title is minorly misspelled (below is a partial list of possible misspelling (not an exhaustive list))
     *  - 1~2 letters are wrong
     *  - There is an extra space in between words
     *  - There is no space between words where there should be 
     *  - Missing or extra punctuation 
     * 4. More than one person has the same first name and last inital and reviewed the same books
     * 5. Book title, name, and rating are in wrong places 
     * 6. Incorrect CSV formatting (empty column in the middle etc.)
     */

    // add each row to the created database
    for (let i = 0; i < cleanedRows.length; i++) {
        await addItemToDatabase(databaseId, cleanedRows[i]);
    }
    console.log('CSV file has been processed and uploaded to Notion.');
}

// Replace 'My CSV Database' with the desired database name and ensure csvFilePath is set correctly
processCsvAndUpload('CSV database', csvFilePath).catch(console.error);

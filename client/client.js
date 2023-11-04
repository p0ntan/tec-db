const qs = require('qs');
const baseUrl = 'http://localhost:1337/users';

async function fetchAll() {
    const response = await fetch(baseUrl);
    const users = await response.json();
    console.log("All data", users);
}

async function fetchName() {
    const query = qs.stringify(
        {
            fields: ['name']
        },
        {
            encodeValuesOnly: true
        }
    )

    const response = await fetch(baseUrl + `?${query}`);
    const users = await response.json();

    console.log("Query with name", users);
}

async function fetchNameAndAge() {
    const query = qs.stringify(
        {
            fields: ['name','age']
        },
        {
            encodeValuesOnly: true
        }
    )

    const response = await fetch(baseUrl + `?${query}`);
    const users = await response.json();

    console.log("Query with name and age filtered by Bob", users);
}

async function fetchAgeAndHometown() {
    const query = qs.stringify(
        {
            fields: ['hometown','age']
        },
        {
            encodeValuesOnly: true
        }
    )

    console.log(query);

    const response = await fetch(baseUrl + `?${query}`);
    const users = await response.json();

    console.log("Query with hometown and age", users);
}

async function fetchAllPlumbers() {
    const query = qs.stringify(
        {
            fields: ['age', 'occupation'],
            filters: {
                occupation: {
                    $eq: 'Plumber'
                },
                age: {
                    $gt: 16
                }
            }
        },
        {
            encodeValuesOnly: true
        }
    )

    const response = await fetch(baseUrl + `?${query}`);
    const users = await response.json();

    console.log("Fetch all plumbers age and occupation with age over 18", users);
}


async function fetchNonExisingKey() {
    const query = qs.stringify(
        {
            fields: ['hej','agg']
        },
        {
            encodeValuesOnly: true
        }
    )

    const response = await fetch(baseUrl + `?${query}`);
    const users = await response.json();

    console.log("Query with unexisting keys", users);
}

fetchAll()
fetchName()
fetchNameAndAge()
fetchAgeAndHometown()
fetchAllPlumbers()
fetchNonExisingKey()

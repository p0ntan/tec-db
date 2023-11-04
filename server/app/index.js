const express = require('express');
const app = express();
const port = 1337;
const cors = require('cors');
const dbModel = require('./database');

app.use(cors());

app.get('/', async (req, res) => {
    res.json(['root is for comparing a "clean" route withouth db-requests'])
})

app.get('/mariadb/users', async (req, res) => {
    const result = await dbModel.mariaDbGetData(dbModel.queries.allUsers);

    res.json(result);
})

app.get('/mariadb/users/:id', async (req, res) => {
    const id = req.params.id;
    const result = await dbModel.mariaDbGetData(dbModel.queries.singleUser, [id]);

    res.json(result);
})

// app.get('/mariadb/', (req, res) => {
//     const fieldsParam = req.query.fields;
//     const filterParam = req.query.filters;
//     let newData = [...data];

//     // Start with filter data when param is specified
//     if (filterParam) {
//         newData = filterData(newData, filterParam);
//     }

//     // Then map data if specified, only sending wanted data (if specified)
//     if (fieldsParam) {
//         newData = mapKeyWithFields(newData, fieldsParam);
//     }

//     res.json(newData);
// });

// // Map data and keep only wanted keys from
// const mapKeyWithFields = (data, fieldsParam) => {
//     data = data.map(item => {
//         const newItem = {};
//         for (const key of fieldsParam) {
//             if (key in item) {
//                 newItem[key] = item[key];
//             }
//         }

//         return newItem;
//     });

//     return data;
// }

// // Filter data, keep only the wanted items based on filter
// const filterData = (newData, filterParam) => {
//     for (const key of Object.keys(filterParam)) {
//         newData = newData.filter(item => {
//             if (key in item && evaluateCondition(filterParam[key], item[key])) {
//                 return item;
//             }
//         });
//     }

//     return newData;
// }

// // Helper function to evaluate condition
// const evaluateCondition = (operatorObj, value2) => {
//     const operator = Object.keys(operatorObj)[0];
//     const value1 = operatorObj[operator];
    
//     switch (operator) {
//         case '$eq':
//             return value1 == value2; // Using == to compare string and number
//         case '$lt':
//             return value1 > value2; // Works with string and number
//         case '$gt':
//             return value1 < value2; // Works with string and number
//         default:
//             throw new Error(`Unknown operator: ${operator}`);
//     }
// };

app.listen(port, console.log(`App is listening on port ${port}`));


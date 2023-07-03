const Record = require('./Connect');
const express = require('express');
const app = express();
const axios = require('axios');
let x = Math.floor(Math.random() * 7);

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Express Page</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f2f2f2;
          }
          
          h1 {
            margin-bottom: 20px;
            color: #333;
          }
          
          button {
            padding: 10px 20px;
            font-size: 16px;
            margin-top: 20px;
            background-color: #007bff;
            color: #fff;
            border: none;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <h1>TheMealDB to MongoDB</h1>
        <br>
        <br>
        <h1>Add Meal</h1>
        <button onclick="handleButtonClick(1)">Get Chicken Meal</button>
        <br>
        <br>
        <button onclick="handleButtonClick(2)">Get Fish Meal</button>
        <br>
        <br>
        <button onclick="handleButtonClick(6)">Get Lamb Meal</button>
        <br>
        <br>
        <button onclick="handleButtonClick(7)">Get Pork Meal</button>
        <br>
        <br>
        <h1>Retrieve Data</h1>
        <button onclick="handleButtonClick(5)">Retrieve Data from Database</button>
        <h1>Update Meal</h1>
        <form id="updateForm" action="/updateMeal" method="POST" style="display: flex; flex-direction: column; align-items: center;">
        <label for="mealName">Meal Name:</label>
        <input type="text" id="mealName" name="mealName" required style="margin-bottom: 20px;">
      
        <label for="mealArea">Meal Area:</label>
        <input type="text" id="mealArea" name="mealArea" required style="margin-bottom: 20px;">
      
        <label for="mealYoutube">Meal YouTube:</label>
        <input type="text" id="mealYoutube" name="mealYoutube" required>
      
        <button type="submit">Update</button>
        </form>
        <br>
        <br>
        <h1>Delete Meal</h1>
        <button onclick="handleButtonClick(3)">Delete One Meal</button>
        <br>
        <br>
        <button onclick="handleButtonClick(4)">Delete All Meals</button>
        <br>
        <br>

        <script>
          function handleButtonClick(buttonNumber) {
            if (buttonNumber === 1) {
              window.location.href = '/getMeals?title=Chicken';
            } else if (buttonNumber === 2) {
              window.location.href = '/getMeals?title=Fish';
            } else if (buttonNumber === 3) {
              window.location.href = '/deleteMeal';
            } else if (buttonNumber === 4) {
              window.location.href = '/deleteAllMeals';
            } else if (buttonNumber === 5) {
              window.location.href = '/retrieveData';
            }
            else if (buttonNumber === 6) {
              window.location.href = '/getMeals?title=Lamb';
            }
            else if (buttonNumber === 7) {
              window.location.href = '/getMeals?title=Pork';
            }
          }
        </script>
      </body>
    </html>
  `);
});

// Rest of the code


// Get meals
app.get('/getMeals', (req, res) => {
  const title = req.query.title;
  const querystr = `http://www.themealdb.com/api/json/v1/1/search.php?s=${title}`;

  axios
    .get(querystr)
    .then((response) => {
      const meals = response.data.meals;
      if (!meals || meals.length === 0) {
        throw new Error('Meal not found');
      }

      const meal = meals[x];
      const StrMeal = meal.strMeal;
      const StrArea = meal.strArea;
      const StrYoutube = meal.strYoutube;

      const mealsValue = new Record({
        mealsStrMeal: StrMeal,
        mealsStrArea: StrArea,
        mealsStrYoutube: StrYoutube,
      });

      return mealsValue.save();
    })
    .then((result) => {
      console.log('Meal saved:', result);
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Meal Details</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                background-color: #f2f2f2;
              }
              
              h1 {
                margin-bottom: 20px;
                color: #333;
              }
              
              button {
                padding: 10px 20px;
                font-size: 16px;
                margin-bottom: 10px;
                background-color: #007bff;
                color: #fff;
                border: none;
                cursor: pointer;
              }
              
              .meal-details {
                margin: 20px auto;
                width: 400px;
                background-color: #fff;
                border: 1px solid #ccc;
                padding: 20px;
                text-align: left;
              }
              
              .meal-details h2 {
                margin-bottom: 10px;
                color: #333;
              }
              
              .record-saved {
                margin-top: 20px;
                color: green;
              }
            </style>
          </head>
          <body>
            <h1>Meal Details</h1>
            <div class="meal-details">
              <h2>${result.mealsStrMeal}</h2>
              <p><strong>Area:</strong> ${result.mealsStrArea}</p>
              <p><strong>YouTube:</strong> ${result.mealsStrYoutube}</p>
            </div>
            <p class="record-saved">Record saved</p>
            <button onclick="handleReturnButtonClick()">Return to Homepage</button>
            <script>
              function handleReturnButtonClick() {
                window.location.href = 'http://localhost:3000/';
              }
            </script>
          </body>
        </html>
      `);
    })
    .catch((error) => {
      console.log('Error saving meal:', error);
      res.status(500).send('Error saving meal');
    });

  x = Math.floor(Math.random() * 7);
});


// Delete a single meal by strMeal
app.get('/deleteMeal', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Delete Meal</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f2f2f2;
          }
          
          h1 {
            margin-bottom: 20px;
            color: #333;
          }
          
          form {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 50px;
          }
          
          label {
            margin-bottom: 10px;
            color: #555;
          }
          
          input[type="text"] {
            padding: 10px;
            font-size: 16px;
            border-radius: 4px;
            border: 1px solid #ccc;
            width: 300px;
            margin-bottom: 20px;
          }
          
          button {
            padding: 10px 20px;
            font-size: 16px;
            background-color: #007bff;
            color: #fff;
            border: none;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <h1>Delete Meal</h1>
        <form action="/deleteMeal" method="POST">
          <label for="mealName">Meal Name:</label>
          <input type="text" id="mealName" name="mealName" required>
          <button type="submit">Delete</button>
        </form>
        <button onclick="handleReturnButtonClick()">Return to Homepage</button>
        <script>
          function handleReturnButtonClick() {
            window.location.href = 'http://localhost:3000/';
          }
        </script>
      </body>
    </html>
  `);
});app.post('/deleteMeal', (req, res) => {
  const mealName = req.body.mealName;

  Record.deleteOne({ mealsStrMeal: mealName })
    .then((result) => {
      if (result.deletedCount === 0) {
        console.log('Meal not found');
        res.status(404).send(`
          <html>
            <head>
              <title>Delete Meal</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  text-align: center;
                  background-color: #f2f2f2;
                }
                
                h1 {
                  margin-bottom: 20px;
                  color: #333;
                }
                
                p {
                  margin-bottom: 10px;
                  color: #555;
                }
                
                button {
                  padding: 10px 20px;
                  font-size: 16px;
                  margin-top: 20px;
                  background-color: #007bff;
                  color: #fff;
                  border: none;
                  cursor: pointer;
                }
              </style>
            </head>
            <body>
              <h1>Delete Meal</h1>
              <p>Meal not found</p>
              <button onclick="handleReturnButtonClick()">Return to Homepage</button>
              <script>
                function handleReturnButtonClick() {
                  window.location.href = 'http://localhost:3000/';
                }
              </script>
            </body>
          </html>
        `);
      } else {
        console.log('Meal deleted successfully');
        res.send(`
          <html>
            <head>
              <title>Delete Meal</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  text-align: center;
                  background-color: #f2f2f2;
                }
                
                h1 {
                  margin-bottom: 20px;
                  color: #333;
                }
                
                p {
                  margin-bottom: 10px;
                  color: #555;
                }
                
                button {
                  padding: 10px 20px;
                  font-size: 16px;
                  margin-top: 20px;
                  background-color: #007bff;
                  color: #fff;
                  border: none;
                  cursor: pointer;
                }
              </style>
            </head>
            <body>
              <h1>Delete Meal</h1>
              <p>Meal deleted successfully</p>
              <button onclick="handleReturnButtonClick()">Return to Homepage</button>
              <script>
                function handleReturnButtonClick() {
                  window.location.href = 'http://localhost:3000/';
                }
              </script>
            </body>
          </html>
        `);
      }
    })
    .catch((error) => {
      console.error('Error deleting meal:', error);
      res.status(500).send(`
        <html>
          <head>
            <title>Delete Meal</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                background-color: #f2f2f2;
              }
              
              h1 {
                margin-bottom: 20px;
                color: #333;
              }
              
              p {
                margin-bottom: 10px;
                color: #555;
              }
              
              button {
                padding: 10px 20px;
                font-size: 16px;
                margin-top: 20px;
                background-color: #007bff;
                color: #fff;
                border: none;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            <h1>Delete Meal</h1>
            <p>Error deleting meal</p>
            <button onclick="handleReturnButtonClick()">Return to Homepage</button>
            <script>
              function handleReturnButtonClick() {
                window.location.href = 'http://localhost:3000/';
              }
            </script>
          </body>
        </html>
      `);
    });
});




app.get('/deleteAllMeals', (req, res) => {
  Record.deleteMany({}, (err) => {
    if (err) {
      console.log('Error deleting documents:', err);
      res.status(500).send(`
        <html>
          <head>
            <title>Delete All Meals</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                background-color: #f2f2f2;
              }
              
              h1 {
                margin-bottom: 20px;
                color: #333;
              }
              
              p {
                margin-bottom: 10px;
                color: #555;
              }
              
              button {
                padding: 10px 20px;
                font-size: 16px;
                margin-top: 20px;
                background-color: #007bff;
                color: #fff;
                border: none;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            <h1>Delete All Meals</h1>
            <p>Error deleting documents from the database</p>
            <button onclick="handleReturnButtonClick()">Return to Homepage</button>
            <script>
              function handleReturnButtonClick() {
                window.location.href = 'http://localhost:3000/';
              }
            </script>
          </body>
        </html>
      `);
    } else {
      console.log('All documents deleted successfully');
      res.send(`
        <html>
          <head>
            <title>Delete All Meals</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                background-color: #f2f2f2;
              }
              
              h1 {
                margin-bottom: 20px;
                color: #333;
              }
              
              p {
                margin-bottom: 10px;
                color: #555;
              }
              
              button {
                padding: 10px 20px;
                font-size: 16px;
                margin-top: 20px;
                background-color: #007bff;
                color: #fff;
                border: none;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            <h1>Delete All Meals</h1>
            <p>All meals deleted successfully</p>
            <button onclick="handleReturnButtonClick()">Return to Homepage</button>
            <script>
              function handleReturnButtonClick() {
                window.location.href = 'http://localhost:3000/';
              }
            </script>
          </body>
        </html>
      `);
    }
  });
});


app.post('/updateMeal', (req, res) => {
  const { mealName, mealArea, mealYoutube } = req.body;

  const updatedMeal = {
    mealsStrArea: mealArea,
    mealsStrYoutube: mealYoutube,
  };

  Record.updateOne({ mealsStrMeal: mealName }, updatedMeal, (err, result) => {
    if (err) {
      console.error('Error updating meal:', err);
      res.status(500).send('Error updating meal');
    } else {
      console.log('Meal updated successfully');
      res.send(`
        <html>
          <head>
            <title>Update Meal</title>
            <style>
              /* CSS styles for the entire page */

              body {
                font-family: Arial, sans-serif;
                text-align: center;
                background-color: #f2f2f2;
              }
              
              h1 {
                margin-bottom: 20px;
                color: #333;
              }
              
              /* CSS styles for the success message */

              .success-message {
                margin-top: 40px;
                color: #28a745;
                font-size: 18px;
              }
              
              /* CSS styles for the return button */

              .return-button {
                margin-top: 20px;
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                transition: background-color 0.3s ease;
              }
              
              .return-button:hover {
                background-color: #0056b3;
              }
            </style>
          </head>
          <body>
            <h1>Update Meal</h1>
            <div class="success-message">Meal updated successfully</div>
            <a href="/" class="return-button">Return to Homepage</a>
          </body>
        </html>
      `);
    }
  });
});



app.get('/retrieveData', (req, res) => {
  Record.find({}, (err, data) => {
    if (err) {
      console.log('Error retrieving data:', err);
      res.status(500).send(`
        <html>
          <head>
            <title>Retrieve Data</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                background-color: #f2f2f2;
              }
              
              h1 {
                margin-bottom: 20px;
                color: #333;
              }
              
              p {
                margin-bottom: 10px;
                color: #555;
              }
              
              button {
                padding: 10px 20px;
                font-size: 16px;
                margin-top: 20px;
                background-color: #007bff;
                color: #fff;
                border: none;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            <h1>Retrieve Data</h1>
            <p>Error retrieving data from the database</p>
            <button onclick="handleReturnButtonClick()">Return to Homepage</button>
            <script>
              function handleReturnButtonClick() {
                window.location.href = 'http://localhost:3000/';
              }
            </script>
          </body>
        </html>
      `);
    } else {
      console.log('Data retrieved successfully');
      res.send(`
        <html>
          <head>
            <title>Retrieve Data</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                background-color: #f2f2f2;
              }
              
              h1 {
                margin-bottom: 20px;
                color: #333;
              }
              
              p {
                margin-bottom: 10px;
                color: #555;
              }
              
              button {
                padding: 10px 20px;
                font-size: 16px;
                margin-top: 20px;
                background-color: #007bff;
                color: #fff;
                border: none;
                cursor: pointer;
              }
              
              table {
                margin: 0 auto;
                border-collapse: collapse;
              }
              
              th, td {
                padding: 8px;
                border: 1px solid #ddd;
              }
              
              th {
                background-color: #007bff;
                color: #fff;
              }
            </style>
          </head>
          <body>
            <h1>Retrieve Data</h1>
            <table>
              <tr>
                <th>Meal Name</th>
                <th>Meal Area</th>
                <th>Meal YouTube</th>
              </tr>
              ${data.map((item) => `
                <tr>
                  <td>${item.mealsStrMeal}</td>
                  <td>${item.mealsStrArea}</td>
                  <td>${item.mealsStrYoutube}</td>
                </tr>
              `).join('')}
            </table>
            <button onclick="handleReturnButtonClick()">Return to Homepage</button>
            <script>
              function handleReturnButtonClick() {
                window.location.href = 'http://localhost:3000/';
              }
            </script>
          </body>
        </html>
      `);
    }
  });
});

app.listen(3000);

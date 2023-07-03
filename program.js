const axios = require('axios');

const title = 'lamb';

const querystr = `http://www.themealdb.com/api/json/v1/1/search.php?s=${title}`;

axios.get(querystr).then( (response) =>{


console.log(response.data.meals[2].strMeal);
console.log(response.data.meals[2].strArea);


}
);
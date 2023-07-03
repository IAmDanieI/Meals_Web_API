const mongoose = require ('mongoose');
mongoose.set('strictQuery', false);

const db = "mongodb+srv://Daniel:KuUq5RxxoSVDeyJc@cluster0.86f3fpp.mongodb.net/WebAPI"

mongoose.connect(db).then(()=>{
    console.log("Connected to database");
})
.catch(()=>{
    console.log("Can't connect to database");
}
)

const mealsSchema = new mongoose.Schema({

    mealsStrMeal: {type: String},
    mealsStrArea: {type: String},
    mealsStrYoutube: {type: String}
});

const Meals = mongoose.model('meals', mealsSchema);

module.exports = Meals;

//npm install express --save
//npm install axios
//npm install mongoose@6.10.0
//npm install mongodb
//npm install react
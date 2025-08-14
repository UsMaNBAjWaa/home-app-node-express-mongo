

/*
 this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photo = photo;
    this.description = description;
    if(_id)
    {

      this._id = _id;
    }
       save()
 find(callback)
 findById(homeId)
 deleteById(homeId) 
*/

const {ObjectId}=require ('mongodb')
const mongoose = require('mongoose');

const homeSchema = mongoose.Schema({
  houseName: {
        type: String,
        required: [true, 'House name is required'],
    },
      price: {
        type: Number,
        required: [true, 'Price is required'],
       
      },
      location: {
        type: String,
        required: [true, 'Location is required'],
      },
      rating: {
        type: Number,
        required: [true, 'Rating is required'],
      },
     photo: {
        type: String,
      },
      description: {
       type: String,
      }
    });

    // homeSchema.pre('findOneAndDelete',async function(next) {
      console.log("In pre hook")
      //means give me the home id which are going to delete 
    //   const homeid=this.getQuery()._id;
    //   await favourite.deleteMany({houseId:homeid})
    //   next();
      
    // })
    // homeSchema sa ak model bana du jiska name home hai
module.exports = mongoose.model('Home', homeSchema);

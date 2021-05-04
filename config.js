module.exports = {
  ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  URL : process.env.BASE_URL || 'http://localhost:3000',
  MONGODB_URI:
    //Add new mongoDB_URI here
    process.env.MONGODB_URI ||  'mongodb+srv://gamesiteadmin:adminpassword123@cluster0.nfzr7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
};

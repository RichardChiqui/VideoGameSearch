const pool = require("./db");
const queries = require("./queries");

const {User} = require('./Models/UserModel');

const validateUser = async (req,res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: 'No user found with this email' });
      }
  
      const isMatch = await password === user.password;
      if (!isMatch) {
        return res.status(400).json({ error: 'Incorrect password' });
      }
  
    //   const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    //   res.json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

const addUser = async (req,res) =>{
    const { username, email, password } = req.body;
    try {
        const user = await User.create({ username, email, password });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports ={
    validateUser,
    addUser
}
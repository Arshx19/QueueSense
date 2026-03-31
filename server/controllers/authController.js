const User=require("../models/user");
const bcrypt=require("bcryptjs");

exports.registerUser= async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({msg:"User already exists"});

        }
        const salt= await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=new User({
            name,
            email,
            password:hashedPassword
        });
        await newUser.save();
        res.status(201).json({
            msg:"User registered successfully",
            user:{
                id: newUser._id,
                name:newUser.name,
                email:newUser.email
            }
        });
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        res.json({
            msg: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role:user.role
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


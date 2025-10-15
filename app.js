const express=require('express');
const app=express();
const mongoose=require('mongoose');
require ('dotenv').config();

const port=process.env.PORT;
const Mongo_Url=process.env.MONGO_URL;

mongoose.connect(Mongo_Url)
.then(()=>{
  console.log('MongoDb is connected');
})
.catch((err)=>console.log(err));

const TodoSchema=new mongoose.Schema({
  task:{type:String,required:true},
  completed:{type:Boolean,default:false}
});

const Todo=mongoose.model('Todo',TodoSchema);

app.set('view engine','ejs');
app.set('views','views');

app.use(express.urlencoded({extended:false}));

app.get('/',(req,res)=>{
  res.redirect('/home');
});
app.get('/home',async(req,res)=>{
  const tasks=await Todo.find();
  res.render('home',{tasks:tasks});
});
app.get('/add-task',(req,res)=>{
  res.render('add-task');
});
app.post('/add-task',async(req,res)=>{
  const {task}=req.body;
  await Todo.create({task:task});
  res.redirect('/');
});
app.post('/complete/:id', async (req, res) => {
  await Todo.findByIdAndUpdate(req.params.id, { completed: true });
  res.redirect('/home');
});

app.get('/update/:id',async(req,res)=>{
  const task=await Todo.findById(req.params.id);
  res.render('update',{task});
});
app.post('/update/:id',async(req,res)=>{
  const {task}=req.body;
  await Todo.findByIdAndUpdate(req.params.id,{task:task});
  res.redirect('/');
});
app.get('/delete/:id',async(req,res)=>{
  await Todo.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.listen(port,()=>{
  console.log(`server is connected to http://localhost:${port}`);
})
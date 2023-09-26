import express from 'express';
import serverless from 'serverless-http'


const app = express();
app.use(express.json());

const todoItems = [];

let itemCounter = 1;

/**Endpoint to save an item */
app.post("/add", (req, res, next)=>{
  const {item} = req.body;

  const newTodoItem = {
    id: itemCounter++,
    item,
    dateCreated: new Date(),
    dateUpdated: null,
  };

  todoItems.push(newTodoItem);
  return res.status(201).json({
    message: "Item Added Successfully",
    itemId: newTodoItem.id,
  });
})

/** Endpoint to get all items */
 app.get("/all", (req, res, next)=>{
  return res.status(200).json({
    todos:todoItems
  });
 });

 /**Endpoint to update an item */
 app.put("/update/:id", (req, res, next)=>{
  const {id} = req.params;
  const {item} = req.body;
  const todoItemsToUpdate = todoItems.find((todo)=>todo.id === Number(id));

  if(!todoItemsToUpdate){
    return res.status(404).json({
      error: "Item was not found",
    });
  }

    todoItemsToUpdate.item = item;
    todoItemsToUpdate.dateUpdated = new Date();
    return res.status(200).json({
      message: "Item was Successfully Updated"
    });
 });

 /***Detele endpoint */
 app.delete("/delete/:id", (req, res, next)=>{
  const {id} = req.params;
  const todoItemsToDeleteIndex = todoItems.findIndex((todo)=>todo.id === Number(id));

  if(todoItemsToDeleteIndex === -1){
    return res.status(404).json({
      error: "Item was not found",
    });
  }
  todoItems.splice(todoItemsToDeleteIndex, 1);
  return res.status(200).json({
    message: "Item was successfully deleted"
  });
 });



app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);

const jwt = require('jsonwebtoken');
const Task = require('../Model/task'); // Adjust the path as needed
require("dotenv").config()


// const mongoose = require('mongoose');
const { paginate } = require('mongoose-paginate-v2')
// Middleware for JWT authentication
exports.authenticateToken = (req, res, next) => {
    const token =
    req.cookies.token ||
    req.body.token ||
    req.header("Authorization").replace("Bearer ", "");
console.log("token: ", token)

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET , (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden - Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Controller for creating a task
exports.createTask = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;

    // Assuming you have a user ID in the JWT payload
    const userId = req.user.id;

    // Create a new task
    const newTask = new Task({
      title,
      priority:1,
      description,
      due_date,
      user: userId, // Assuming your Task model has a 'user' field for the user who created the task
    });

    // Save the task to the database
    await newTask.save();

    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// module.exports = { authenticateToken, createTask };

// =========================>>

// Controller for getting all user tasks with filters and pagination
exports.getAllUserTasks = async (req, res) => {
  try {
   
    const userId = req.user?.id; // Assuming your user ID is available in req.user.id
    // console.log("id: ",userId)
    // Extract filters from query parameters
    const { priority, due_date, page, limit } = req.params;

    // Construct the filter object based on the provided parameters
    const filter = { user: userId };

    if (priority !== undefined) {
      filter.priority = priority;
    }

    if (due_date !== undefined) {
      filter.due_date = { $gte: new Date(due_date) };
    }

    // Pagination
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };

    // Fetch tasks with the applied filters and pagination
    const tasks = await Task.paginate(filter, options);

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// module.exports = getAllUserTasks;

// ============>



// ================>


// Controller for updating a task
exports.updateTask = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming your user ID is available in req.user.id
    const taskId = req.params.taskId; // Assuming the task ID is provided in the URL params
    // console.log("taskid:", userId, taskId)
    // Find the task by ID and user ID
    const task = await Task.findOne({ _id: taskId});
console.log("task: ",task)
    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    // Extract fields to update from request body
    const { due_date, status } = req.body;

    // Update task fields if provided
    if (due_date !== undefined) {
      task.due_date = due_date;
    }

    if (status !== undefined) {
      task.status = status;
    }

    // Save the updated task to the database
    await task.save();

    res.status(200).json({ message: 'Task updated successfully', updatedTask: task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// module.exports = updateTask;



// ============>

// Controller for soft deleting a task
exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming your user ID is available in req.user.id
    const taskId = req.params.taskId; // Assuming the task ID is provided in the URL params

    // Find the task by ID and user ID
    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    // Soft delete: Set the deleted_at field to the current date
    task.deleted_at = new Date();
    
    // Save the updated task to the database
    await task.save();

    res.status(200).json({ message: 'Task deleted successfully', deletedTask: task });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// module.exports = deleteTask;
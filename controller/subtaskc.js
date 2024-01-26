const SubTask = require('../Model/subTask'); // Adjust the path as needed
const Task = require('../Model/task'); // Adjust the path as needed

// Controller for creating a subtask
const createSubTask = async (req, res) => {
  try {
    const { task_id } = req.body;

    // Check if the task with the provided task_id exists
    const task = await Task.findById(task_id);
    console.log("task: ", task)
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Create a new subtask
    const newSubTask = new SubTask({
      task_id,
    });

    // Save the subtask to the database
    await newSubTask.save();

    // Update the task's sub_tasks array with the new subtask
    task.sub_tasks.push(newSubTask._id);
    await task.save();

    res.status(201).json({ message: 'SubTask created successfully', subTask: newSubTask });
  } catch (error) {
    console.error('Error creating subtask:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = createSubTask;


// =========?
// Controller for getting all user subtasks with a filter
const getAllUserSubTasks = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming your user ID is available in req.user.id

    // Extract the task_id filter from query parameters
    const { task_id } = req.params.task_id;

    // Construct the filter object based on the provided parameters
    const filter = { user: userId };

    if (task_id !== undefined) {
      filter.task_id = task_id;
    }

    // Fetch subtasks with the applied filter
    const subtasks = await SubTask.find(filter);

    res.status(200).json({ subtasks });
  } catch (error) {
    console.error('Error fetching user subtasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = getAllUserSubTasks;


// ==========>

// Controller for soft deleting a subtask
const deleteSubTask = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming your user ID is available in req.user.id
    const subTaskId = req.params.subTaskId; // Assuming the subtask ID is provided in the URL params

    // Find the subtask by ID and user ID
    const subTask = await SubTask.findOne({ _id: subTaskId, user: userId });

    if (!subTask) {
      return res.status(404).json({ error: 'SubTask not found or unauthorized' });
    }

    // Soft delete: Set the deleted_at field to the current date
    subTask.deleted_at = new Date();
    
    // Save the updated subtask to the database
    await subTask.save();

    res.status(200).json({ message: 'SubTask deleted successfully', deletedSubTask: subTask });
  } catch (error) {
    console.error('Error deleting subtask:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = deleteSubTask;
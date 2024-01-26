const express = require("express")
const router = express.Router()
const {authenticateToken,createTask,getAllUserTasks, updateTask,deleteTask} = require("../controller/taskc")


router.post("/createtask", authenticateToken,createTask)
router.get("/getallusertasks",authenticateToken ,getAllUserTasks)
router.post("/updatetask/:taskId", authenticateToken,updateTask)
router.delete("/deletetask/:taskId",authenticateToken, deleteTask)

module.exports = router

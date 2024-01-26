const express = require("express")
const router = express.Router()
const{authenticateToken}=require("../controller/taskc")
const {createSubTask,getAllUserSubTasks, deleteSubTask } = require("../controller/subtaskc")


router.post("/createsubtask", authenticateToken,createSubTask)
router.get("/getallusersubtasks",authenticateToken, getAllUserSubTasks)
router.delete("/deletesubtask",authenticateToken, deleteSubTask)

module.exports = router

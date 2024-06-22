import express from "express";
const router = express.Router();
import {
  pullImage,
  getMachineInfo,
  getDockerInfo,
  listContainers,
  listImages,
  getContainerStats,
} from "../controllers/controller.js";
import { getCommitMessage } from "../controllers/Gemini.js";
import {
  startContainer,
  runContainer,
  stopContainer,
  pushImageToHub,
  deleteContainerById,
  openDocker,
  ChatCmds,
  searchResults
} from "../controllers/manageController.js";


router.get("/start/:id", startContainer);


router.get("/stop/:id", stopContainer);

router.get("/allContainers", listContainers);

router.get("/allImages", listImages);

router.post("/createContainer", runContainer);

router.get("/machineInfo", getMachineInfo);

router.get("/dockerInfo", getDockerInfo);

router.post("/pullImage", pullImage);

router.get("/stats/:containerId", getContainerStats);

router.post("/push", pushImageToHub);

router.post("/Gpt", getCommitMessage);


router.delete('/Rmcontainers/:containerID', deleteContainerById);

router.post('/open-docker', openDocker);

router.post('/chatbot', ChatCmds);

router.get('/search',searchResults);

export default router;

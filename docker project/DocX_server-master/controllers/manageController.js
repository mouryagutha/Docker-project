import Docker from "dockerode";
import os from "os";
import { exec } from "child_process";
import { spawn } from "child_process";
import { logger } from "../Logs/logger.js";


const docker = new Docker();

export const startContainer = (req, res) => {
  const containerId = req.params.id;
  const container = docker.getContainer(containerId);
  logger.info(`Starting container ${containerId}`);
  container.start((err, data) => {
    if (err) {
      logger.error(`Error starting container ${containerId}: ${err.message}`);
      if (err.statusCode === 404) {
        res.status(404).json({ error: `Container ${containerId} not found` });
      } else {
        logger.error(`Error starting container ${containerId}: ${err.message}`);
        res.status(500).json({
          error: `Failed to start container ${containerId}: ${err.message}`,
        });
      }
    } else {
      logger.info(`Container ${containerId} started successfully`);
      res.json({ message: "Container started successfully" });
    }
  });
};

export const stopContainer = (req, res) => {
  const containerId = req.params.id;
  const container = docker.getContainer(containerId);
  container.stop((err, data) => {
    if (err) {
      logger.error(`Error stopping container ${containerId}: ${err.message}`);
      res.status(500).json({
        error: `Failed to stop container ${containerId}: ${err.message}`,
      });
    } else {
      logger.info(`Container ${containerId} stopped successfully`);
      res.json({ message: "Container stopped successfully" });
    }
  });
};

export const runContainer = (req, res) => {
  const imagename = req.body.imagename;
  const createOptions = {
    Image: imagename,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
  };
  docker.createContainer(createOptions, function (err, container) {
    if (err) {
      logger.error(
        `Error creating container for image ${imagename}: ${err.message}`
      );
      res.status(500).json({
        error: `Failed to create container for image ${imagename}: ${err.message}`,
      });
      return;
    }
    container.start(function (err, data) {
      if (err) {
        logger.error(
          `Error starting container for image ${imagename}: ${err.message}`
        );
        res.status(500).json({
          error: `Failed to start container for image ${imagename}: ${err.message}`,
        });
        return;
      }
      logger.info(`Container for image ${imagename} started successfully`);
      res.send({ message: "Container started successfully" });
    });
  });
};



export const pushImageToHub = async (req, res) => {
  const { imageName, tag, username, password } = req.body;
  const repository = `${username}/${imageName}:${tag}`;
  logger.info(`Pushing image to Docker Hub: ${repository}`);
  try {
    // Tag the Docker image
    const tagCmd = spawn('docker', ['tag', imageName, repository]);

    tagCmd.on('error', (err) => {
      console.error("Docker tag error:", err);
      res.status(500).json({ error: "Failed to tag Docker image" });
    });
    logger.info(`Tagging image: ${imageName} as ${repository}`);
    tagCmd.on('close', (code) => {
      if (code !== 0) {
        logger.error(`Docker tag process exited with code: ${code}`);
        console.error("Docker tag process exited with code:", code);
        res.status(500).json({ error: "Failed to tag Docker image" });
        return;
      }

      // Docker login command
      const loginCmd = spawn('docker', ['login', '--username', username, '--password-stdin']);

      // Pass password to the login command
      loginCmd.stdin.write(password);
      loginCmd.stdin.end();

      loginCmd.on('error', (err) => {
        logger.error(`Docker login error: ${err}`);
        console.error("Docker login error:", err);
        res.status(500).json({ error: "Failed to login to Docker Hub" });
      });

      loginCmd.on('close', (code) => {
        if (code !== 0) {
          logger.error(`Docker login process exited with code: ${code}`);
          res.status(500).json({ error: "Failed to login to Docker Hub" });
          return;
        }

        const pushCmd = spawn('docker', ['push', repository]);

        pushCmd.on('error', (err) => {
          console.error("Docker push error:", err);
          logger.error(`Docker push error: ${err}`);
          res.status(500).json({ error: "Failed to push image to Docker Hub" });
        });

        pushCmd.on('close', (code) => {
          if (code !== 0) {
            logger.error(`Docker push process exited with code: ${code}`);
            res.status(500).json({ error: "Failed to push image to Docker Hub" });
            return;
          }

          console.log("Image pushed to Docker Hub successfully");
          logger.info(`Image pushed to Docker Hub successfully: ${repository}`);
          res.status(200).json({ message: "Image pushed to Docker Hub successfully" });
        });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    logger.error(`Error pushing image to Docker Hub: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const deleteContainerById = async (req, res) => {
  try {
    const { containerID } = req.params;
    const container = docker.getContainer(containerID);
    const containerInfo = await container.inspect();
    if (containerInfo.State.Running) {
      logger.info(`Stopping container ${containerID}`);
      await container.stop();
    }
    await container.remove();
    logger.info(`Container ${containerID} deleted successfully`);
    res.json({ message: `Container ${containerID} deleted successfully` });
  } catch (error) {
    logger.error(`Failed to delete container ${containerID}: ${error.message}`);
    res
      .status(500)
      .json({ error: `Failed to delete container ${containerID}` });
  }
};

export const openDocker = (req, res) => {
  const openDocker = () => {
    const command =
      process.platform === "win32" ? "start Docker" : "open -a Docker";

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Error opening Docker:", error);
        console.error("stderr:", stderr);
        return;
      }
      console.log("Docker opened successfully");
    });
  };

  openDocker();
};
export const processPrompt = (prompt) => {
  if (typeof prompt !== "undefined") {
    const words = prompt.split(" ");
    const action = words[0];
    const imageName = words[words.length - 1];
    console.log(imageName + "fhdb");
    if (action && imageName) {
      return { action, imageName };
    }
  }
  return null;
};

export const ChatCmds = (req, res) => {
  const { prompt } = req.body;

  const processedPrompt = processPrompt(prompt);

  if (!processedPrompt) {
    logger.info("Invalid prompt: Action or image name/ID not provided");
    return res
      .status(400)
      .json({ error: "Invalid prompt: Action or image name/ID not provided" });
  }

  const { action, imageName } = processedPrompt;

  switch (action) {
    case "run":
      spawn("docker", ["run", "-d", imageName, "sleep", "infinity"], {
        stdio: "inherit",
      });
      logger.info(`Docker container for '${imageName}' started successfully`);
      return res
        .status(200)
        .json({
          message: `Docker container for '${imageName}' started successfully`,
        });

    case "stop":
      const stopProcess = spawn("docker", ["stop", imageName], {
        stdio: "inherit",
      });

      stopProcess.on("exit", (code) => {
        if (code === 0) {
          return res
            .status(200)
            .json({
              message: `Docker container '${imageName}' stopped successfully`,
            });
        } else {
          return res
            .status(500)
            .json({ error: `Failed to stop Docker container '${imageName}'` });
        }
      });
      break;

    case "push":
      const pushProcess = spawn("docker", ["push", imageName], {
        stdio: "inherit",
      });

      pushProcess.on("exit", (code) => {
        if (code === 0) {
          return res
            .status(200)
            .json({
              message: `Docker image '${imageName}' pushed successfully`,
            });
        } else {
          return res
            .status(500)
            .json({ error: `Failed to push Docker image '${imageName}'` });
        }
      });
      break;

    case "pull":
      const pullProcess = spawn("docker", ["pull", imageName], {
        stdio: "inherit",
      });

      pullProcess.on("exit", (code) => {
        if (code === 0) {
          return res
            .status(200)
            .json({
              message: `Docker image '${imageName}' pulled successfully`,
            });
        } else {
          return res
            .status(500)
            .json({ error: `Failed to pull Docker image '${imageName}'` });
        }
      });
      break;

    default:
      return res.status(400).json({ error: "Invalid action" });
  }
};

export const getMachineInfo = (req, res) => {
  const machineInfo = {
    platform: os.platform(),
    architecture: os.arch(),
    hostname: os.hostname(),
    cpus: os.cpus(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    uptime: os.uptime(),
  };

  res.json(machineInfo);
};
export const getDockerInfo = (req, res) => {
  docker.info(function (err, data) {
    if (err) {
      console.error("Error getting docker info:", err);
      return;
    }
    res.json(data);
  });
};

export const searchResults = (req, res) => {
  const { query } = req.body;
  const url = `https://hub.docker.com/v2/search/repositories?query=${query}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error("Error fetching search results:", error);
      res.status(500).json({ error: "Failed to fetch search results" });
    });
};

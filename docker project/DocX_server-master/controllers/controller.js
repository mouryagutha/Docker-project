import Docker from "dockerode";
import os from "os";
import { exec } from "child_process";
import { spawn } from "child_process";
import { logger } from "../Logs/logger.js";

const docker = new Docker();

export const listRunningContainers = (docker) => {
  return new Promise((resolve, reject) => {
    docker.listContainers(
      { all: true, filters: { status: ["running"] } },
      (err, containers) => {
        if (err) {
          reject(err);
        } else {
          const runningContainers = containers.map((container) => ({
            ID: container.Id,
            Names: container.Names[0].replace("/", ""),
            Image: container.Image,
            State: container.State,
            Status: container.Status,
            Created: container.Created,
            
            Command: container.Command,
          }));
          resolve(runningContainers);
        }
      }
    );
  });
};

export const listExitedContainers = () => {
  return new Promise((resolve, reject) => {
    const dockerPs = spawn("docker", ["ps", "-a", "--format", "{{json .}}"]);

    let exitedContainers = "";

    dockerPs.stdout.on("data", (data) => {
      exitedContainers += data.toString();
    });

    dockerPs.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Failed to execute 'docker ps -a' command`));
      } else {
        const containers = exitedContainers.trim().split("\n").map(JSON.parse);
        resolve(containers);
      }
    });
  });
};

export const listContainers = async (req, res) => {
  try {
    const [runningContainers, exitedContainers] = await Promise.all([
      listRunningContainers(docker),
      listExitedContainers(),
    ]);

    res.json({ runningContainers, exitedContainers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listImages = (req, res) => {
  docker.listImages({ all: true }, (err, images) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const processedImages = images.map((image) => ({
        id: image.Id.split(":")[1].substring(0, 12),
        repoTags: image.RepoTags,
        size: image.Size,
        created: new Date(image.Created * 1000),
        labels: image.Labels,
      }));
      res.json(processedImages);
    }
  });
};

export const getMachineInfo = (req, res) => {
  const cpu = os.cpus();
  const ram = os.totalmem();
  const freeRam = os.freemem();
  const cpuUsage = os.loadavg();
  const machineInfo = {
    cpu: cpu,
    ram: ram,
    freeRam: freeRam,
    cpuUsage: cpuUsage,
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

export const pullImage = (req, res) => {
  const imagename = req.body.imagename;
  docker.pull(imagename, function (err, stream) {
    if (err) {
      logger.error(`Error pulling image ${imagename}: ${err.message}`);
      res.status(500).json({ error: `Failed to pull image ${imagename}` });
      return;
    }
    docker.modem.followProgress(stream, onFinished, onProgress);
    function onFinished(err, output) {
      if (err) {
        logger.error(`Error pulling image ${imagename}: ${err.message}`);
        res.status(500).json({ error: `Failed to pull image ${imagename}` });
        return;
      }
      logger.info(`Image ${imagename} pulled successfully`);
      res.send({ message: "Image pulled successfully" });
    }
    function onProgress(event) {
      console.log(event);
    }
  });
};

export const getContainerStats = async (req, res) => {
  const { containerId } = req.params;

  try {
    const container = docker.getContainer(containerId);
    const stats = await container.stats({ stream: false });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

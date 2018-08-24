var process = require('child_process');
var ipAlive = new Map();
var ipMap = new Map();
var pidMap = new Map();
var port = 8000;

function checkAlive(ip_add) {
  if (ipMap.has(ip_add)) {
    if (ipAlive.get(ip_add) == true) {
      ipAlive.set(ip_add, false);
      setTimeout(checkAlive, 30000, ip_add);
    } else {
      if (ipMap.has(ip_add)) {
        simulatorProcess = pidMap.get(ip_add);
        simulatorProcess.kill('SIGHUP');
        pidMap.delete(ip_add);
        ipMap.delete(ip_add);
        ipAlive.delete(ip_add);
      }
    }
  }
}

exports.getIndex = async (req, res, next) => {
  res.render('simulator');
};

exports.getTasks = async (req, res, next) => {
  res.json({ result: { tasks: "测试测试ssss" } });
};

exports.getKeep = async (req, res, next) => {
  let clientIp = getIp(req);
  if (ipMap.has(clientIp)) {
    ipAlive.set(clientIp, true);
    res.sendStatus(200);
  }
}

exports.getStart = async (req, res, next) => {
  let clientIp = getIp(req);
  if (ipMap.has(clientIp)) {
    res.sendStatus(406);
  } else {
    ipAlive.set(clientIp, true);
    ipMap.set(clientIp, port);

    simulatorProcess = process.spawn("ttyd", ["-p", port.toString(), "docker", "run", "-it", "--rm", "ubuntu"]);
    pidMap.set(clientIp, simulatorProcess);
    res.json({ result: { port: port } });
    port = port + 1;
    setTimeout(checkAlive, 30000, clientIp);
  }
};

exports.getStop = async (req, res, next) => {
  let clientIp = getIp(req);
  if (ipMap.has(clientIp)) {
    simulatorProcess = pidMap.get(clientIp);
    simulatorProcess.kill('SIGHUP');
    pidMap.delete(clientIp);
    ipMap.delete(clientIp);
    res.sendStatus(200);
  } else {
    res.sendStatus(406);
  }
};

var getIp = function (req) {
  var ip = req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress || '';
  if (ip.split(',').length > 0) {
    ip = ip.split(',')[0];
  }
  return ip;
};

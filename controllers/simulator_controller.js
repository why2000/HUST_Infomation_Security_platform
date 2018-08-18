var process = require('child_process');
var ipMap = new Map();
var pidMap = new Map();
var port=8000;

exports.getIndex = async (req, res, next) => {
  res.render('simulator');
};

exports.getTasks = async (req, res, next) => {
  res.json({result:{tasks:"测试测试ssss"}});
};

exports.getStart = async (req, res, next) => {
  let clientIp = getIp(req);
  if(ipMap.has(clientIp)){
    res.sendStatus(406); 
  }else{
    ipMap.set(clientIp,port);
    simulatorProcess = process.spawn("ttyd", ["-p", port.toString(), "docker", "run", "-it", "--rm", "ubuntu"]);
    pidMap.set(clientIp,simulatorProcess);
    res.json({ result: { port: port } });
    port=port+1;
  }
};

exports.getStop = async (req, res, next) => {
  let clientIp = getIp(req);
  if(ipMap.has(clientIp)){
    simulatorProcess = pidMap.get(clientIp);
    simulatorProcess.kill('SIGHUP');
    pidMap.delete(clientIp);
    ipMap.delete(clientIp);
    res.sendStatus(200); 
  }else{
    res.sendStatus(406); 
  }
};

var getIp = function(req) {
  var ip = req.headers['x-real-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress || '';
  if(ip.split(',').length>0){
      ip = ip.split(',')[0];
  }
  return ip;
};

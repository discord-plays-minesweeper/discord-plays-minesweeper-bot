const path = require("path");
const Globber = require("./Globber");

class MissionsList extends Globber {
  constructor(basedir) {
    super(path.join(basedir, 'missions'), '*/*.js');
    this.missions = [];
  }

  error(err) {
    console.error("Error loading missions");
    console.error(err);
  }

  import(p) {
    console.log(p);
    this.missions.push(p);
  }

  getMissionName(p) {
    return p.split('/').splice(-1,1)[0].replace(/\.js$/,'');
  }

  find(name) {
    var z = this.missions.filter(x => this.getMissionName(x) == name);
    if (z.length != 1) return null;
    return z[0];
  }
}

module.exports = MissionsList;


const recurseTree = async (obj, level) => {
  let keys = Object.keys(obj).sort();
  for (let key of keys) {
    let line = '';
    for (let i = 0; i < level; i++) {
      line += ' ';
    }
    line += key;
    console.log(line);
    recurseTree(obj[key], level+1);
  }
};

class FileTree {
  constructor() {
    this.tree = {};
  }

  async create(pathStr, value = {}) {
    const path = pathStr.split('/');
    let obj = this.tree;
    for (let i = 0; i < path.length; i++) {
      if(!(path[i] in obj)) {
        obj[path[i]] = value;
      }
      obj = obj[path[i]];
    }
  }

  async delete(pathStr) {
    const path = pathStr.split('/');
    let obj = this.tree;
    let returnObj;
    for (let i = 0; i < path.length; i++) {
      if(!(path[i] in obj)) {
        throw `Cannot delete ${pathStr} - ${path[i]} does not exist`;
      }
      if(i < path.length - 1) {
        obj = obj[path[i]];
      } else {
        returnObj = obj[path[i]];
        delete obj[path[i]];
        return returnObj;
      }
    }
  }

  async move(fromStr, toStr) {

    let removed;
    try {
      removed = await this.delete(fromStr);
    } catch(e) {
      return;
    }

    await this.create([ ...toStr.split('/'), fromStr.split('/').slice(-1)].join('/'), removed);
  }

  async list() {
    await recurseTree(this.tree, 0);
  }
}

module.exports = FileTree;
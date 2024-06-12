export class StageModel {
    constructor() {
      this.stages = {};
    }
  
    addStage(stage) {
      this.stages[stage.id] = stage;
    }
  
    getStage(id) {
      return this.stages[id];
    }
  }
  
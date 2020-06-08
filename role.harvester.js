var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
        }
        if(!creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
        }
        if(creep.store[RESOURCE_ENERGY] > 0 && creep.room.energyCapacityAvailable == creep.room.energyAvailable && creep.memory.upgrading == true) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            if(creep.room.controller.sign['text'] != "Warning! Matt's Territory") {
                if(creep.signController(creep.room.controller, "Warning! Matt's Territory") == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        } else if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES_ACTIVE);
            if(creep.memory.hnum == 1 && sources.length > 1) {
                if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                    creep.memory.upgrading = true;
                }

            }else {
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    creep.memory.upgrading = true;
                }

            }
        }
        else {
            var home = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN);
                    }
            });
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION
                            || structure.structureType == STRUCTURE_SPAWN
                            || structure.structureType == STRUCTURE_TOWER
                            || structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                //creep.moveTo(home[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
};

module.exports = roleHarvester;
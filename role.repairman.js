var roleRepair = {

    /** @param {Creep} creep **/
    run: function(creep) {
            var home = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN);
                    }
            });
	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

        if(creep.memory.building) {
            var roadToRepair = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_ROAD
                            || structure.structureType == STRUCTURE_CONTAINER
                            || structure.structureType == STRUCTURE_TOWER
                            || structure.structureType == STRUCTURE_RAMPART)
                            && structure.hits < structure.hitsMax;
                    }
                }
            );
            var StructureToRepair = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_WALL
                            || structure.structureType == STRUCTURE_TOWER
                            || structure.structureType == STRUCTURE_RAMPART)
                            && structure.hits < structure.hitsMax
                            && structure.hits < 30000;
                    }
                }
            );
            //console.log(roadToRepair);
            if(roadToRepair.length > 0) {
                console.log('Roads need repair:'+ roadToRepair.length)
                creep.moveTo(roadToRepair[0]);
                creep.repair(roadToRepair[0]);
            } else if(StructureToRepair.length > 0) {
                console.log('No Roads, Structures need repair:'+ StructureToRepair.length)
                creep.moveTo(StructureToRepair[0]);
                creep.repair(StructureToRepair[0]);
            } else {
                creep.moveTo(home[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES_ACTIVE);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleRepair;
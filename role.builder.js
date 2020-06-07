var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
            var home = creep.room.find(FIND_MY_STRUCTURES, {
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
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var roadToRepair = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_ROAD
                                || structure.structureType == STRUCTURE_WALL
                                || structure.structureType == STRUCTURE_TOWER
                                || structure.structureType == STRUCTURE_RAMPART
                                || structure.structureType == STRUCTURE_CONTAINER)
                                && structure.hits < structure.hitsMax
                                && structure.hits < 30000;
                        }
                    }
                );
                //console.log(roadToRepair);
                if(roadToRepair.length > 0) {
                    creep.moveTo(roadToRepair[0]);
                    creep.repair(roadToRepair[0]);
                }
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

module.exports = roleBuilder;
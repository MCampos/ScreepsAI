var roleDrepair = {

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
            var StructureToRepair = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_WALL
                            || structure.structureType == STRUCTURE_TOWER
                            || structure.structureType == STRUCTURE_RAMPART)
                            && structure.hits < structure.hitsMax
                            && structure.hits < 5000;
                    }
                }
            );
            var StructureToRepair2 = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_RAMPART
                            || structure.structureType == STRUCTURE_TOWER
                            || structure.structureType == STRUCTURE_WALL)
                            && structure.hits < structure.hitsMax
                            && structure.hits < 100000;
                    }
                }
            );
            var StructureToRepair3 = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_RAMPART
                            || structure.structureType == STRUCTURE_TOWER
                            || structure.structureType == STRUCTURE_WALL)
                            && structure.hits < structure.hitsMax
                            && structure.hits < 500000;
                    }
                }
            );
            var StructureToRepair4 = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_RAMPART
                            || structure.structureType == STRUCTURE_TOWER
                            || structure.structureType == STRUCTURE_WALL)
                            && structure.hits < structure.hitsMax
                            && structure.hits < 1000000;
                    }
                }
            );
            var StructureToRepair5 = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_RAMPART
                            || structure.structureType == STRUCTURE_TOWER
                            || structure.structureType == STRUCTURE_WALL)
                            && structure.hits < structure.hitsMax
                            && structure.hits < 3000000;
                    }
                }
            );
            if(StructureToRepair.length > 0) {
                console.log('Structures need repair:'+ StructureToRepair.length)
                creep.moveTo(StructureToRepair[0]);
                creep.repair(StructureToRepair[0]);
            } else if (StructureToRepair2.length > 0) {

                console.log('Structures2 need repair:'+ StructureToRepair2.length)
                creep.moveTo(StructureToRepair2[0]);
                creep.repair(StructureToRepair2[0]);
            } else if (StructureToRepair3.length > 0) {

                console.log('Structures3 need repair:'+ StructureToRepair3.length)
                creep.moveTo(StructureToRepair3[0]);
                creep.repair(StructureToRepair3[0]);
            } else if (StructureToRepair4.length > 0) {
                console.log('Structures4 need repair:'+ StructureToRepair4.length)
                creep.moveTo(StructureToRepair4[0]);
                creep.repair(StructureToRepair4[0]);
            } else if (StructureToRepair5.length > 0) {
                console.log('Structures need repair5:'+ StructureToRepair5.length)
                creep.moveTo(StructureToRepair5[0]);
                creep.repair(StructureToRepair5[0]);
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

module.exports = roleDrepair;
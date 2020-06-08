var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repairman');
var roleDrepair = require('role.drepair');
var roleClaimer = require('role.claimer');

module.exports.loop = function () {
    // Clean Memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }


 for(var room_name in Game.rooms) {
    console.log('[-=-=-=-=-=-=-=- Examining ' + room_name + '-=-=-=-=-=-=-=--]');
    for(var spawn_name in Game.spawns) {
      var spawn = Game.spawns[spawn_name];
      if(Object.is(spawn.room['name'], room_name)) {
        console.log('Examining ' + spawn_name + ':');
        console.log('Energy Available: ' + spawn.room.energyAvailable);

        this[room_name + '_creeps'] = spawn.room.find(FIND_MY_CREEPS);
        this[room_name + '_harvesters'] = _.filter(this[room_name + '_creeps'], (creep) => creep.memory.role == 'harvester');
        this[room_name + '_upgraders'] = _.filter(this[room_name + '_creeps'], (creep) => creep.memory.role == 'upgrader');
        this[room_name + '_builders'] = _.filter(this[room_name + '_creeps'], (creep) => creep.memory.role == 'builder');
        this[room_name + '_repair'] = _.filter(this[room_name + '_creeps'], (creep) => creep.memory.role == 'repair');
        this[room_name + '_drepair'] = _.filter(this[room_name + '_creeps'], (creep) => creep.memory.role == 'drepair');
        this[room_name + '_claimer'] = _.filter(this[room_name + '_creeps'], (creep) => creep.memory.role == 'claimer');


//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-( Tower Code }-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
          var towers = spawn.room.find(FIND_MY_STRUCTURES, {
                  filter: (structure) => {
                      return (structure.structureType == STRUCTURE_TOWER);
                  }
              }
          );

          for (var id in towers) {
              var tower = towers[id];
              if (tower) {
                  var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                  var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                      filter: (structure) => {
                          return (structure.hits < (structure.hitsMax - 1000)
                              && structure.hits < 5000)
                      }
                  });

                  if (closestHostile) {
                      tower.attack(closestHostile);
                  } else if (closestDamagedStructure) {
                      tower.repair(closestDamagedStructure);
                  }
              }
          }
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-( Role Spawn Code }-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
          //Harvesters
          if(this[room_name + '_harvesters'].length < 4) {
              var newName = 'Harvester' + Game.time;
              console.log('Spawning new harvester: ' + newName + 'in Room:' + room_name);
              if(spawn.room.memory.hnum == 0) {
                  spawn.room.memory.hnum = 1;
              } else {
                  spawn.room.memory.hnum = 0;
              }
              spawn.spawnCreep([WORK,CARRY,MOVE], newName,
                  {memory: {role: 'harvester', hnum: spawn.room.memory.hnum, target: room_name}})

          }
          //Builders
          var builds = spawn.room.find(FIND_CONSTRUCTION_SITES);
          if(builds.length > 10 &&  builds.length <= 20) {
              var blength = 2;
          } else if(builds.length > 20) {
              var blength = 3;
          } else {
              var blength = 1;
          }
          if(spawn.room.memory.bnum == 0) {
              spawn.room.memory.bnum = 1;
          } else {
              spawn.room.memory.bnum = 0;
          }
          console.log('Room Name: '+room_name+ 'builds: ' + builds.length + ' Room Builders' +this[room_name + '_builders'].length + ' belngth:' + blength);
          if(this[room_name + '_builders'].length < blength && this[room_name + '_harvesters'].length > 1) {
              if(builds.length > 0)
              {
                  var newName = 'Builder' + Game.time;
                  console.log('Spawning new Builder: ' + newName + 'in Room:' + room_name);
                  spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], newName,
                      {memory: {role: 'builder', bnum: spawn.room.memory.bnum, target: room_name}});
              }
          }

          //Upgraders
          if(this[room_name + '_upgraders'].length < 1 && this[room_name + '_harvesters'].length > 1) {
              var newName = 'Upgrader' + Game.time;
              console.log('Spawning new Upgrader: ' + newName + 'in Room:' + room_name);
              spawn.spawnCreep([WORK,WORK,CARRY,CARRY,MOVE], newName,
                  {memory: {role: 'upgrader', target: room_name}});
          }
          //Repairmen
          if(this[room_name + '_repair'].length < 1 && this[room_name + '_harvesters'].length > 1) {
              var RoadsBuilt = spawn.room.find(FIND_STRUCTURES, {
                      filter: (structure) => {
                          return (structure.structureType == STRUCTURE_ROAD
                              || structure.structureType == STRUCTURE_CONTAINER);
                      }
                  }
              );
              console.log('-=-=-'+ RoadsBuilt)
              if(RoadsBuilt.length > 0) {
                  var newName = 'Repairmen' + Game.time;
                  console.log('Spawning new Repair Man: ' + newName + 'in Room:' + room_name);
                  spawn.spawnCreep([WORK, CARRY, MOVE], newName,
                      {memory: {role: 'repair', target: room_name}});
              }
          }

          //Defense Repairman
          var StructuresBuilt = spawn.room.find(FIND_STRUCTURES, {
                  filter: (structure) => {
                      return (structure.structureType == STRUCTURE_WALL
                          || structure.structureType == STRUCTURE_TOWER
                          || structure.structureType == STRUCTURE_RAMPART) &&
                          structure.hits < structure.hitsMax;
                  }
              }
          );
          if(StructuresBuilt.length >= 5) {
              var drepair_need = 2
          } else if(StructuresBuilt.length > 0) {
              var drepair_need = 1
          }
          console.log('Defense need: '+drepair_need);
          console.log('StructuresBuilt: '+ StructuresBuilt.length);
          if(this[room_name + '_drepair'].length < drepair_need && this[room_name + '_harvesters'].length > 1) {
              if(StructuresBuilt.length > 0) {
                  var newName = 'Defense Repairmen' + Game.time;
                  console.log('Spawning new Repair Man: ' + newName + 'in Room:' + room_name);
                  spawn.spawnCreep([WORK, CARRY, MOVE], newName,
                      {memory: {role: 'drepair', target: room_name}});
              }
          }

          //Claimers
          if(spawn.memory.claimRoom != undefined) {
              var newName = 'Claimer' + Game.time;
              console.log('Spawning new Claimer: ' + newName + 'in Room:' + room_name);
              claim_spawn = spawn.spawnCreep([CLAIM,MOVE], newName,
                  {memory: {role: 'claimer', target: spawn.memory.claimRoom}});
              if(!(claim_spawn < 0)) {
                  delete spawn.memory.claimRoom;
              }
          }
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-( Spawn Code }-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
          //Spawn Code
          if(spawn.spawning) {
              var spawningCreep = Game.creeps[spawn.spawning.name];
              spawn.room.visual.text(
                  '🛠️' + spawningCreep.memory.role,
                  spawn.pos.x + 1,
                  spawn.pos.y,
                  {align: 'left', opacity: 0.8});
          }
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-( Log }-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

          console.log('Room '+room_name+' Builders: ' + this[room_name + '_builders'].length
              + '| Upgraders: ' + this[room_name + '_upgraders'].length
              + ' | Harvesters: ' + this[room_name + '_harvesters'].length
              + ' | Repairmen: ' + this[room_name + '_repair'].length
              + ' | Defense Repairmen: ' + this[room_name + '_drepair'].length
              + ' | Claimer: ' + this[room_name + '_claimer'].length
          );
      }
    }
  }

console.log('[][][][[][][][] End Room Loop [][]][][][][][][][][[');
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repair = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');
    var drepair = _.filter(Game.creeps, (creep) => creep.memory.role == 'drepair');
    var claimer = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');


    console.log('Total Builders: ' + builders.length
        + '| Upgraders: ' + upgraders.length
        + ' | Harvesters: ' + harvesters.length
        + ' | Repairmen: ' + repair.length
        + ' | Defense Repairmen: ' + drepair.length
        + ' | Claimers: ' + claimer.length
    );

    //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-( Run R0les }-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repair') {
            roleRepair.run(creep);
        }
        if(creep.memory.role == 'drepair') {
            roleDrepair.run(creep);
        }
        if(creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
    }
}
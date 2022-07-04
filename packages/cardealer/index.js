let colshapeDEALER = mp.colshapes.newRectangle(-47.7, -1096, 1.5, 1.5);
let DBHANDLE = require("../dbconnection.js")
//FACTS
///     marker
mp.markers.new(1, new mp.Vector3(-47.7, -1096, 25.42), 1.2, {
    "color": [0, 255, 0, 150],
    "dimension": 0
})
///     ped
mp.peds.new(
    mp.joaat('cs_drfriedlander'),
    [-46.7, -1095, 26.42, 1],
    {
        dynamic: false,
        frozen: true,
        invincible: true
    }
);

///     blip
mp.blips.new(125, [-46.7, -1095, 28.42],
    {
        name: "Car dealer",
        scale: 1,
        color: 60,
});


//events
mp.events.add("playerEnterColshape", (player, shape) => {
    if(shape == colshapeDEALER){
        player.call('showDealerBrowser')

        DBHANDLE.connection.query("SELECT * FROM cardealeroffer", [], function(error, results){
            if(!results[0].CarName) return
            player.call("playerShowDealerList", [results])
            console.log(results)
        })
    }
})

mp.events.add('playerExitColshape', (player, shape) => {
    if(shape == colshapeDEALER){
        player.call('hideDealerBrowser')
    }
})



//СВЕРСТАТЬ АВТОСАЛОН, ТЕСТ ДРАЙВ, ВЫВОД БОЛЬШЕ ДАННЫХ


const SPAWN_POSITION = new mp.Vector3({ x: -39.8, y: -1100, z: 26.08 });
let VEHICLE_TO_BUY_NAME;
let VEHICLE_PREVIEW_SPAWNED;
let CAR_DB_SPAWN_MODEL;
let PLAYER_MONEY;
let CAR_PRICE_FROM_DB;
let CAR_PRICE_NUMBER;
let CAR_DB_NAME_NORMAL;
let PREVIEW_AVAILABLE = false;


//DELETE PREVIEW CAR TO CHANGE
mp.events.add("deleteSPAWNEDCARdealer", () => {
    if(PREVIEW_AVAILABLE = true){
        VEHICLE_PREVIEW_SPAWNED.destroy()
        PREVIEW_AVAILABLE = false;
    }
})


//Car buy in dealer (Button "BUY")
mp.events.add('buyDEALERCARSERVER', (player) => {

    console.log("buyDEALERCARSERVER przekazano")

    if(CAR_PRICE_NUMBER > PLAYER_MONEY){
        console.log("No enough money")
    }else{
        let PLAYER_MONEY_AFTER_BUY = PLAYER_MONEY - CAR_PRICE_NUMBER;

        player.setVariable('cash', PLAYER_MONEY_AFTER_BUY)

        VEHICLE_PREVIEW_SPAWNED.destroy();
        PREVIEW_AVAILABLE = false;

        mp.vehicles
        .new(mp.joaat(CAR_DB_SPAWN_MODEL), SPAWN_POSITION, {
          numberPlate: "BOUGHT",
          color: [
            [1, 148, 3],
            [1, 148, 3],
          ],
        })

        console.log("Sold " + CAR_DB_SPAWN_MODEL + " za " + CAR_PRICE_FROM_DB)

        let USER_ID = player.getVariable('UserID'); //UID игрока, по нём идёт запись в таблицу и Т/С привязано к UID

        let plateRandomizer = getRandomInt(5000, 99999999)

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min)
        }

        DBHANDLE.connection.query("INSERT players_cars SET CarOwnerUID = ?, CarName = ?, CarSpawn = ?, CarPlate = ?, IsSpawned = ?", [USER_ID, CAR_DB_NAME_NORMAL, CAR_DB_SPAWN_MODEL, plateRandomizer, 1], function(error, results){

        })
    }
})

//SPAWN USER CAR FROM DB
let RESULT_CarID;
let RESULT_CarName;
let RESULT_CarSpawn;
let RESULT_CarPlate;
let USER_ID;
let SPAWNED_CAR;

mp.events.addCommand("CMC", (player) => {
    USER_ID = player.getVariable('UserID');

    DBHANDLE.connection.query("SELECT * FROM players_cars WHERE CarOwnerUID = ?", [USER_ID], function(error, results){
        RESULT_CarID = results[0].CarID;
        RESULT_CarName = results[0].CarName;
        RESULT_CarSpawn = results[0].CarSpawn;
        RESULT_CarPlate = results[0].CarPlate;

        player.outputChatBox("Twoje pojazdy: " + RESULT_CarID + " " + RESULT_CarName + " " + RESULT_CarSpawn + " " + RESULT_CarPlate)
    })
})

mp.events.addCommand("SMC", (player, vehicle) => {
    SPAWNED_CAR = mp.vehicles
        .new(mp.joaat(RESULT_CarSpawn), player.position, {
          numberPlate: RESULT_CarPlate,
          color: [
            [12, 12, 12],
            [12, 12, 12],
          ],
        }).setVariable('OwnerIDCAR', USER_ID)
  
})


//SPAWN TEST DRIVE

let TESTDRIVE_VEHICLE_SPAWNED;
mp.events.add("DealerTESTDRIVESERVER", (player) => {

    VEHICLE_PREVIEW_SPAWNED.destroy() //DELETE PREVIEW CAR
    player.call("hideDealerBrowser")

    let dimensionRandomizer = getRandomInt(100000, 199999)

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min)
    }

    TESTDRIVE_VEHICLE_SPAWNED = mp.vehicles
    .new(mp.joaat(CAR_DB_SPAWN_MODEL), SPAWN_POSITION, {
      dimension: dimensionRandomizer,
      numberPlate: "TEST DRIVE",
      color: [
        [12, 12, 12],
        [12, 12, 12],
      ],
      
    }).setDirtLevel(0);


    player.dimension = dimensionRandomizer//CHANGE DIMENSION FOR TEST DRIVE.

    
    player.putIntoVehicle(TESTDRIVE_VEHICLE_SPAWNED, 0)//PUT PLAYER INTO CAR || 0 = Driver seat (1.1 RAGEMP) || -1 = Driver seat (0.3.7 RAGEMP)

    setTimeout(function(){ //TIMEOUT FOR CAR TEST DRIVE
        TESTDRIVE_VEHICLE_SPAWNED.destroy()
        player.position = new mp.Vector3(-50.2, -1102, 26.50)
        player.dimension = 0;
    }, 5000)

})


//SPAWN PREVIEW CAR FOR DEALER MENU
mp.events.add("spawnCarDEALERSERVER", (player, vehicleName) => {
    console.log("SPAWNED IN DEALER " + vehicleName)

    DBHANDLE.connection.query("SELECT * FROM cardealeroffer WHERE CarName = ?", [vehicleName], function(error, results){
        CAR_DB_SPAWN_MODEL = results[0].CarSpawn;
        PLAYER_MONEY = player.getVariable('cash')
        CAR_PRICE_FROM_DB = results[0].Price;
        VEHICLE_TO_BUY_NAME = results[0].CarSpawn;
        CAR_DB_NAME_NORMAL = results[0].CarName;
        CAR_PRICE_NUMBER = Number(CAR_PRICE_FROM_DB); //Convert money to numbers

        VEHICLE_PREVIEW_SPAWNED = mp.vehicles
        .new(mp.joaat(CAR_DB_SPAWN_MODEL), SPAWN_POSITION, {
          numberPlate: "Dealer",
          color: [
            [12, 12, 12],
            [12, 12, 12],
          ],
        }).setDirtLevel(0);

        PREVIEW_AVAILABLE = true;

        //Car money withdraw

/*        if(CAR_PRICE_NUMBER > PLAYER_MONEY){
            console.log("No enough money")
        }else{
            let PLAYER_MONEY_AFTER_BUY = PLAYER_MONEY - CAR_PRICE_NUMBER;

            player.setVariable('cash', PLAYER_MONEY_AFTER_BUY)

            mp.vehicles
            .new(mp.joaat(CAR_DB_SPAWN_MODEL), SPAWN_POSITION, {
              numberPlate: "TAXINVD",
              color: [
                [251, 148, 3],
                [251, 148, 3],
              ],
            })
        }*/
    })

});

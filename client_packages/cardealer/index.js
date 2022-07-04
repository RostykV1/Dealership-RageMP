let browser = null;
let sceneryCamera;

mp.events.add("showDealerBrowser", () => {
    if(browser == null){
        browser = mp.browsers.new('package://cardealer/index.html')
        browser.execute("mp.invoke('focus', true)")
        mp.gui.chat.activate(false)
        mp.gui.cursor.show(true, true)  

        //CAMERA
        sceneryCamera = mp.cameras.new('default', new mp.Vector3(-33, -1097, 27.08), new mp.Vector3(0, 0, 110), 40);
    //    sceneryCamera.pointAtCoord(-485, 1095.75, 323.85)
        sceneryCamera.isRendering(true);
        mp.game.cam.renderScriptCams(true, true, 2000, true, false);
    }
})

mp.events.add("hideDealerBrowser", () => {
    if(browser != null){
        mp.gui.chat.activate(true)
        mp.gui.cursor.show(false, false)  
        browser.destroy()
        browser = null;
        mp.game.cam.renderScriptCams(false, true, 2, true, false);
        mp.events.callRemote("deleteSPAWNEDCARdealer");
    }
})

mp.events.add("DealerTESTDRIVE", () => {
    mp.events.callRemote("DealerTESTDRIVESERVER")
})


mp.events.add("playerShowDealerList", (results) => {
//    browser.execute(`cardealerLIST("${results[0].CarName}", "${results[0].Price}")`)

    for (let i = 0; i < results.length; i++) {

        browser.execute(`cardealerLIST("${results[i].CarName}", "${results[i].Price}")`)
    }
    mp.game.ui.displayHud(true);
})

mp.events.add("spawnCarDEALER", (carName) => {
    mp.events.callRemote("deleteSPAWNEDCARdealer");
    mp.events.callRemote("spawnCarDEALERSERVER", carName);
});

mp.events.add("buyDEALERcar", () => {
    mp.events.callRemote("buyDEALERCARSERVER")
})

//===========================================================================================================

/*______________________________________Functions HTML_____________________________________________________*/

//===========================================================================================================

function testCAR(){
    mp.trigger("DealerTESTDRIVE")
}

function buyCAR(){
    mp.trigger("buyDEALERcar")
}

function closeCAR(){
    mp.trigger("hideDealerBrowser")
}
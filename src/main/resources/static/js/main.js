import * as DAMap from './Map'
import * as Header from './header'

($( ()=> {
    DAMap.init();
    Header.init();

    var host = window.location.host;
    DAMap.getData(`http://${host}/api/doubleAgents`);
}));
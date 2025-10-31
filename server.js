import { doc } from "./controller/mongo.controller.js";
import { chat } from "./controller/chatAI.controller.js";
import pkg from 'terminal-kit';
const { terminal } = pkg;


async function ShowMenu() {
    
    var itemsMenu = [
        'Insert a Product',
        'Use the Vector Search',
        'Use de SalesMan',
        'exit'
    ]

    terminal.clear();

    terminal.cyan("Welcome!!\n")

    terminal.singleColumnMenu(itemsMenu, async(err, response) =>  {
        terminal('\n').eraseLineAfter();
        
        switch(response.selectedText){
            case 'Insert a Product':
                
                terminal.blue("\nDigite el nombre del Producto: ");
                var nombreProducto = await terminal.inputField().promise ;
                var descripcion = await chat.generateDescrip(nombreProducto) ;
                terminal.blue("\nDigite el stock del Producto: ");
                var stock = await terminal.inputField().promise ;
                terminal("\n")
                await doc.insert(nombreProducto, descripcion, stock)
                setTimeout(ShowMenu, 1000);
                break;

            case 'Use the Vector Search':

                terminal.blue("\nDigite la descripcion a Buscar: ");
                var descripSearch = await terminal.inputField().promise ;
                terminal("\n")
                await doc.smartSearch(descripSearch)
                terminal.yellow("\nQuieres Volver al Menu Principal?: y or n\n")
                var decision = await terminal.inputField().promise ;
                if(decision != "y") process.exit();
                setTimeout(ShowMenu, 1000);
                break;
            
            case 'Use de SalesMan':
                terminal.blue("\nDigite la descripcion a Buscar: ");
                var requestClient = await terminal.inputField().promise ;
                terminal("\n")
                var description = await chat.extractDescrip(requestClient);
                await chat.miniBot(description);
                terminal.yellow("\nQuieres Volver al Menu Principal?: y or n\n")
                var decision = await terminal.inputField().promise ;
                if(decision != "y") process.exit();
                setTimeout(ShowMenu, 1000);
                break;
                
            case 'exit':
                terminal.green("\nSaliendo del Programa\n")
                process.exit();
                
        }
    })
}

ShowMenu();

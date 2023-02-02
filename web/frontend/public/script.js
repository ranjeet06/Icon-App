

console.log("***********************************************************");
const host = "https://0507-182-64-82-93.in.ngrok.io";


    async function getIconBar (){
        const token = "Bearer "
        let shape = '';
        const method = "GET";
        const responseShop = await fetch(`${host}/api/media_icons/shops`, {
            method,
            headers:{ "ngrok-skip-browser-warning":"xyz", "authorization": token }
        });
        if (responseShop.ok){
            const data = await responseShop.json();
            console.log(data)
            barPosition(data[0].position, data[0].appStatus);
            shape = data[0].shape;
        }else {
            console.log(responseShop);
        }

        const responseIcons = await fetch(`${host}/api/media_icons/links`, {
            method,
            headers:{ "ngrok-skip-browser-warning":"xyz", "authorization": token }
        });
        if (responseIcons.ok){
            const data = await responseIcons.json()
            console.log(data)
            for (const key in data)
            {
                if (data.hasOwnProperty(key))
                {
                    const url = data[key].link;
                    const title = data[key].title;
                    const color = data[key].color;
                    list(url, title, color, shape);
                }
            }
        }else {
            console.log(responseIcons);
        }

    }

    _ = getIconBar();

    document.body.style.position = "relative";
    function create(htmlStr) {
        const frag = document.createDocumentFragment(),
            temp = document.createElement('div');
        temp.innerHTML = htmlStr;
        while (temp.firstChild) {
            frag.appendChild(temp.lastChild);
        }
        return frag;
    }


    function barPosition(position, status){

        if(status === "App enabled"){
            let fragment;
            switch(position) {
                case "Top Left":
                    fragment = create('<div id = mediaIcon style=" line-height:0; position: fixed; z-index:3; margin:3px; left:40px;"></div>');
                    const  topLeft = document.getElementById("MainContent")
                    topLeft.insertBefore(fragment, topLeft.children[0]);
                    break;
                case "Top Right":
                    fragment = create('<div id = mediaIcon style=" line-height:0; position: fixed; z-index:3; margin: 3px; right:40px;"></div>');
                    const  topRight = document.getElementById("MainContent")
                    topRight.insertBefore(fragment, topRight.children[0]);
                    break;
                case "Bottom Left":
                    fragment = create('<div id = mediaIcon style=" line-height:0; position: fixed; z-index:2; bottom:50px; left:70px;"></div>');
                    document.body.append(fragment);
                    break;
                default:
                    fragment = create('<div id = mediaIcon style=" line-height:0; position: fixed; z-index:2; bottom:50px; right:70px;"></div>');
                    document.body.append(fragment);
            }
        }
    }

    function list(url, title, color, shape) {

        let media = create('');

        if(shape === "rectangle"){
            const style = "background-color:" + color + ";"
            switch (title) {
                case "facebook":
                    media = create('<div style='+style+'><a href='+ url +' target= "_blank" rel="noreferrer noopener"><img src='+ host +'/icons8-facebook-f.svg width="40" height="40"  alt=""/></a></div><br>');
                    break
                case "instagram":
                    media = create('<div style='+style+'><a href='+ url +' target= "_blank" rel="noreferrer noopener" ><img src='+ host +'/icons8-instagram.svg width="40" height="40" alt=""></a></div><br>');
                    break
                case "twitter":
                    media = create('<div style='+style+'><a href='+ url +' target= "_blank" rel="noreferrer noopener" ><img src='+ host +'/icons8-twitter.svg width="40" height=40" alt=""></a></div><br>');
                    break
                case "youtube":
                    media = create('<div style='+style+'><a href='+ url +' target= "_blank" rel="noreferrer noopener" ><img src='+ host +'/icons8-youtube-logo.svg width="40" height="40" alt=""></a></div><br>');
                    break
                default :
            }
        }else if(shape === "circle"){
            const style = "background-color:"+  color + ";" + "border-radius:" + "20px;" + "margin:" + "2px;" + "width:" + "40px;" + "height:" + "40px;" + "text-align:" + "center;" + "padding:" + "5px 0 0 0;"
            switch (title){
                case "facebook":
                    media = create('<div style='+ style +'><a href='+ url +' target = "_blank" rel="noreferrer noopener"><div><img src='+ host +'/icons8-facebook-f.svg width="30" height="30" alt=""></div></a></div><br>');
                    break
                case "instagram":
                    media = create('<div style='+style+'><a href='+ url +' target = "_blank" rel="noreferrer noopener"><img src='+ host +'/icons8-instagram.svg width="30" height="30" alt=""></a></div><br>');
                    break
                case "twitter":
                    media = create('<div style='+style+'><a href='+ url +' target = "_blank" rel="noreferrer noopener"><img src='+ host +'/icons8-twitter.svg width="30" height="30" alt=""></a></div><br>');
                    break
                case "youtube":
                    media = create('<div style='+style+'><a href='+ url +' target = "_blank" rel="noreferrer noopener"><img src='+ host +'/icons8-youtube-logo.svg width="30" height="30" alt=""></a></div><br>');
                    break
                default :
            }
        }

        const icon = document.getElementById("mediaIcon");
        icon.append(media);
    }
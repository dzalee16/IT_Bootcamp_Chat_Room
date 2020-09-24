import {Chatroom} from "./modules/chat.js";
import {ChatUI} from "./modules/ui.js";

//DOM
let form1 = document.querySelector("#form1");
let form2 = document.querySelector("#form2");
let usernameUpdate = document.querySelector("#usernameUpdate");
let nav = document.querySelector("nav");
let ulChatList = document.querySelector("ul");
let links = document.querySelectorAll("a");
let arrLinks = Array.from(links)

//Setovanje defoltnog username
let defaultUsername = () => {
    if(localStorage.Username) {
        return localStorage.Username;
    } else {
        return "anonymous";
    }
}
//Setovanje deflotne sobe
let defaultRoom = () => {
    if(localStorage.roomLS) {
        return localStorage.roomLS;
    } else {
        return "general";
    }
}

//Kreiranje objekta klase Chatroom
let cr = new Chatroom(defaultRoom(), defaultUsername());
// Kreiranje objekta klase ChatUI
let chatUI1 = new ChatUI(ulChatList);
//Ispis poruka na stranici
cr.getChats(data => {chatUI1.templateLI(data)});

//Promena soba
nav.addEventListener('click', event => {
    if(event.target.tagName === "A"){  
        //Promeniti sobu
        let newRoom = event.target.getAttribute("id");
        //dugme background
        arrLinks.forEach(link => {
            if(link.id === newRoom){
                link.setAttribute("class", "click");
            } else {
                link.setAttribute("class", "noclick");
            }
        });

        cr.updateRoom(newRoom);
        chatUI1.clear();
        cr.getChats(data => {
            chatUI1.templateLI(data);
        });
    }
});

// Slanje poruka
form1.addEventListener('submit', function(event) {
    event.preventDefault();
    let inputMessage = this.message.value;
    if(inputMessage === "" || inputMessage === null) {
        alert("Message must contains some text, can't send empty message!!!");
    } else {
        cr.addChat(inputMessage)
            .then( () => {
                form1.reset();
            })
            .catch(err => {
                console.log("Greska" + err);
            });
    }
});

// Update korisnickog imena
form2.addEventListener('submit', function(event) {
    event.preventDefault();
    let inputUsername = this.username.value;
    console.log(inputUsername);
    cr.updateUsername(inputUsername);
    console.log(inputUsername);
    usernameUpdate.textContent = inputUsername;
    usernameUpdate.classList.toggle("showUsername");
    setTimeout( () => {
        usernameUpdate.classList.toggle("showUsername");
        usernameUpdate.textContent = "";
    }, 3000);
    form2.reset();
});


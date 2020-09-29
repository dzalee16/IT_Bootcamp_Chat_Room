import {Chatroom} from "./modules/chat.js";
import {ChatUI} from "./modules/ui.js";

//DOM
let form1 = document.querySelector("#form1");
let form2 = document.querySelector("#form2");
let form3 = document.querySelector("#form3");
let form4 = document.querySelector("#form4");
let usernameUpdate = document.querySelector("#usernameUpdate");
let nav = document.querySelector("nav");
let ulChatList = document.querySelector("ul");
let links = document.querySelectorAll("a");
let arrLinks = Array.from(links)
let inputColor = document.getElementById("color");
let btnResetColor = document.getElementById("resetBtn");
let firstDate = document.getElementById("firstDate");
let secondDate = document.getElementById("secondDate");

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
cr.getChats((data,dataId) => {
    chatUI1.templateLI(data,dataId);
});

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
        cr.getChats((data, dataId) => {
            chatUI1.templateLI(data, dataId);
        });
    }
});

// Slanje poruka
form1.addEventListener('submit', function(event) {
    event.preventDefault();
    let inputMessage = this.message.value;
    inputMessage =  inputMessage.trim();
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

//BRISANJE PORUKE
ulChatList.addEventListener('click', function(event) {
    if(event.target.tagName === "IMG"){
        let parentNodeOfImage = event.target.parentNode;
        let dataId = parentNodeOfImage.parentNode.getAttribute("data-id");
        //Hvatam odredjeni element koji zelim da brisem
        let li = document.querySelector(`li[data-id="${dataId}"]`);
        if(li.getAttribute("class") === "user"){
            li.remove();
            //brisem iz baze
            db.collection('chats').doc(dataId)
            .delete()
            .then(() => console.log("Uspesno obrisano iz baze"))
            .catch(err => console.log("Greska" + err));
        } else {
            let conf = confirm("Do you want to permanently delete messag???");
            if(conf) {
                li.remove();
                db.collection('chats').doc(dataId)
                .delete()
                .then(() => console.log("Uspesno obrisano iz baze"))
                .catch(err => console.log("Greska" + err));
            } else {
                alert("You don't delete message!!!");
            }
        }
    }
});


//LOCAL STORAGE COLOR
if(localStorage.getItem("Color")) {
    inputColor.value = localStorage.getItem("Color");
    ulChatList.style.backgroundColor = localStorage.getItem("Color");   
}

// Update color
// OVDE IDE MENJANJE BOJE
form3.addEventListener('submit', function(event) {
    event.preventDefault();
    setTimeout(() => {
        ulChatList.style.backgroundColor = inputColor.value;
        localStorage.setItem("Color", inputColor.value);
    }, 500);
});

//Reset Color
btnResetColor.addEventListener('click', event => {
    event.preventDefault();
    localStorage.setItem("Color", "#c2aa0f");
    ulChatList.style.backgroundColor = "#c2aa0f";
});

//Set dates
form4.addEventListener('submit', function(event) {
    event.preventDefault();
    let date = new Date();
    let date1 = new Date(firstDate.value);
    let date2 = new Date(secondDate.value);

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    day = String(day);
    month = String(month);
    year = String(year);

    let day1 = date1.getDate();
    let month1 = date1.getMonth() + 1;
    let year1 = date1.getFullYear();
    let hours1 = date1.getHours();
    let min1 = date1.getMinutes();

    day1 = String(day1);
    month1 = String(month1);
    year1 = String(year1);
    hours1 = String(hours1);
    min1 = String(min1);

    let day2 = date2.getDate();
    let month2 = date2.getMonth() + 1;
    let year2 = date2.getFullYear();
    let hours2 = date2.getHours();
    let min2 = date2.getMinutes();

    day2 = String(day2);
    month2 = String(month2);
    year2 = String(year2);
    hours2 = String(hours2);
    min2 = String(min2);    

    let d = `${day.padStart(2,"0")}.${month.padStart(2,"0")}.${year}`;
    let d1 = `${day1.padStart(2,"0")}.${month1.padStart(2,"0")}.${year1} - ${hours1.padStart(2,"0")}:${min1.padStart(2,"0")}`;
    let d2 = `${day2.padStart(2,"0")}.${month2.padStart(2,"0")}.${year2} - ${hours2.padStart(2,"0")}:${min2.padStart(2,"0")}`;
    
    //OVDE CES DA UPOREDJUJES POSLE DATUME TJ DA FILTRIRAS
    let divAll = document.querySelectorAll("div[class=date]");
    divAll.forEach(div => {
        let date = div.textContent; 
        if(date.length === 18) {
            if(d1 > date) {
                div.parentNode.remove();
                console.log(date);
            }
            if(d2 < date) {
                div.parentNode.remove();
                console.log(date);
            }
        } else if(date.length === 5) {
            date = `${d} - ${date}`;
            if(d1 > date) {
                div.parentNode.remove();
                console.log(date);
            }
            if(d2 < date) {
                div.parentNode.remove();
                console.log(date);
            }
        }
    });
});

//Background za sobu u kojoj se nalazimo
let defaultRoomLS = localStorage.getItem("roomLS");
let defaultRoomHtml = document.getElementById(`${defaultRoomLS}`);
defaultRoomHtml.setAttribute('class', 'click');

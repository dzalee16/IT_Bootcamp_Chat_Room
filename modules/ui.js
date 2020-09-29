export class ChatUI {
    constructor(showMessages) {
        this.showMessages = showMessages;
    }
    set showMessages(m) {
        this._showMessages = m;
    }
    get showMessages() {
        return this._showMessages;
    }
    //methods

    clear() {
        this.showMessages.innerHTML = "";
    }

    //Trenutno vreme
    currentDate() {
        let currDate = new Date();
        let currDay = currDate.getDate();
        let currMonth = currDate.getMonth() + 1;
        let currYear = currDate.getFullYear();
        if(currDay < 10) {
            currDay = "0" + currDay;
        }
        if(currMonth < 10) {
            currMonth = "0" + currMonth;
        }
        let currentDate = `${currDay}.${currMonth}.${currYear}`;
        return currentDate;
    }
    //Formatiranje datuma i vremena iz baze
    formatDate(data) {
        //Datumi iz baze za sve poruke
        let date = data.created_at.toDate();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hours = date.getHours();
        let min = date.getMinutes();
        if(day < 10) {
            day = "0" + day;
        }
        if(month < 10) {
            month = "0" + month;
        }
        if(hours < 10) {
            hours = "0" + hours;
        }
        if(min < 10) {
            min = "0" + min;
        }
        let dateFromBase = `${day}.${month}.${year}`;
        let timeFromBase = `${hours}:${min}`;

        //Trenutno vreme
        let currDate = this.currentDate();
        if(currDate !== dateFromBase){
            return `${dateFromBase} - ${timeFromBase}`;
        } else {
            return  timeFromBase;
        }        
    }
    //Metod za ispis poruka na stranici
    templateLI(data, dataId) {
        let date = this.formatDate(data);

        let li = document.createElement("li");
        let spanUsername = document.createElement("span");
        spanUsername.setAttribute("class", "username");
        spanUsername.innerHTML += `${data.username}`;
        let spanTwoDot = document.createElement("span");
        spanTwoDot.innerHTML += " : ";
        let spanMessage = document.createElement("span");
        spanMessage.setAttribute("class", "message");
        spanMessage.innerHTML += data.message;
        let divDate = document.createElement("div");
        divDate.setAttribute("class", "date");
        divDate.innerHTML += date;
        let spanImage = document.createElement("span");
        spanImage.setAttribute("class", "image");
        let img = document.createElement("img");
        img.setAttribute("src", "images/trash.png");
        spanImage.appendChild(img);

        li.appendChild(spanUsername);
        li.appendChild(spanTwoDot);
        li.appendChild(spanMessage);
        li.appendChild(divDate);
        li.appendChild(spanImage);
        li.setAttribute("data-id", dataId);


        //Proveravam jednakost sa local storidzom
        if(data.username === localStorage.getItem("Username")) {
            let allUser = document.querySelectorAll("li");
            allUser.forEach(user => {
                if(data.username === user.firstChild.textContent){
                    user.classList.add("user");
                } else {
                    user.classList.remove("user");
                }
            });
            li.classList.add("user");
            this.showMessages.appendChild(li);
        } else {
            this.showMessages.appendChild(li);
        }

        document.getElementById("chat-area").scrollTop = document.getElementById("chat-area").scrollHeight;
    }
}
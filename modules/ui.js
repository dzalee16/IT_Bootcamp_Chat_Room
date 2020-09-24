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
    templateLI(data) {
        let date = this.formatDate(data);

        let htmlLIUser = 
        `<li class="user">
            <span class="username">${data.username} : </span>
            <span class="message">${data.message}</span>
            <div class="date">${date}</div>
        </li>`;

        let htmlLI = 
        `<li>
            <span class="username">${data.username} : </span>
            <span class="message">${data.message}</span>
            <div class="date">${date}</div>
        </li>`;

        if(data.username == localStorage.getItem("Username")){
            this.showMessages.innerHTML += htmlLIUser;
        } else {
            this.showMessages.innerHTML += htmlLI;
        }
        
    }
}
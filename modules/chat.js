export class Chatroom {
    constructor(room, username) {
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub; //na pocetku je undefined
    }
    //seters
    set room(r) {
        this._room = r;
        localStorage.setItem("roomLS", r);
    }
    set username(u) {
        if(!/\S/.test(u)) {
            alert("Whitespaces is not alowed!!!");
        } else if(u.length >= 2 && u.length <= 10) {
            localStorage.setItem("Username", u);
            this._username = u;
        } else {
            alert("You must enter valid username, 2 to 10 caracters!!!");
        }
    }
    //geters
    get room() { 
        return this._room;
    }
    get username() {
        return this._username;
    }
    //methods
    async addChat(message) {
        let date = new Date(); 
        let chat = {
            message: message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(date)
        };
        
        //da sacuvam objekat u bazi
        let response = await this.chats.add(chat);
        return response; //Vraca Promise()
    }
    //calback method
    getChats(callback) {
        this.unsub = this.chats
        .where('room', '==', this.room)
        .orderBy('created_at', 'asc')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                let type = change.type;
                let doc = change.doc;
                let dataId = doc.id;
                if(type === "added"){
                    let data = doc.data();
                    callback(data, dataId);
                }
            });
        });
    }
    //update username
    updateUsername(updUsername) {
        this.username = updUsername;
    }
    //update room
    updateRoom(updRoom) {
        this.room = updRoom;
        if(this.unsub) {
            this.unsub(); 
        }
    }
}
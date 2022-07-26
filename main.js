
const tableSenate = document.querySelector("#senate-data");
const tableHouse = document.querySelector("#house-data");
const checkboxesHouse = document.querySelector("#checkboxesHouse");
const selectHouse = document.querySelector("#selectHouse");
const checkboxesSenate = document.querySelector("#checkboxesSenate");
const selectSenate = document.querySelector("#selectSenate");
const caption = document.querySelector("#caption");
const goToTop = document.querySelector("#go-to-top");
let targeted = [];
let select = " ";
// const urlHouse = "https://api.propublica.org/congress/v1/117/house/members.json";
// const urlSenate = "https://api.propublica.org/congress/v1/117/senate/members.json";
const options = {
  method: "GET",
  headers: {
    "X-API-Key": "IQjTDD8UFLjZoGY0vmbNKlh6mmSykBT3NzYKz7aP"
  }
}

//     printTable(copiaSenate, tableSenate);
//     listenerCheck(copiaSenate, tableSenate, checkboxesSenate);
//     listenerSelect(copiaSenate, tableSenate, selectSenate);
let urlChamber;
if(document.title == "House") {
urlChamber = "https://api.propublica.org/congress/v1/117/house/members.json"
} 
if(document.title == "Senate") {
urlChamber = "https://api.propublica.org/congress/v1/117/senate/members.json"
}

const { createApp } = Vue

createApp({
  data() {
    return {
      membersChamber: [],
      filtered: [],
      select: "",
      checkboxes: ["D","R","ID"]
    }
  },
  created() {
    fetch(urlChamber, options)
      .then(res => res.json())
      .then(datos => {
        this.membersChamber = Array.from(datos.results[0].members)
        this.filtered = Array.from(datos.results[0].members)
      })
      .catch(error => console.log(error));
  },
  methods: {
    
  },
  computed: {
    filterByParty: function(){
      this.filtered = this.membersChamber.filter(member => {
         return this.checkboxes.includes(member.party)
         && this.select.includes(member.state);
      });
    }
  }
}).mount('#main')














const options = {
  method: "GET",
  headers: {
    "X-API-Key": "IQjTDD8UFLjZoGY0vmbNKlh6mmSykBT3NzYKz7aP"
  }
}

let urlChamber;
if (document.title == "House") {
  urlChamber = "https://api.propublica.org/congress/v1/117/house/members.json"
}
if (document.title == "Senate") {
  urlChamber = "https://api.propublica.org/congress/v1/117/senate/members.json"
}

const { createApp } = Vue

createApp({
  data() {
    return {
      membersChamber: [],
      filtered: [],
      select: "",
      checkboxes: []
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
    filterByParty: function () {
      this.filtered = this.membersChamber.filter(member => {
        if(this.select === "" && this.checkboxes.length === 0) {
        return this.membersChamber;
        }
        else if (this.select === "") {
          return this.checkboxes.includes(member.party);
        } else if (this.checkboxes.length === 0) {
          return this.select.includes(member.state);
        }
        else {
          return this.checkboxes.includes(member.party)
            && this.select.includes(member.state);
        }
      });
    }
  }
}).mount('#main')














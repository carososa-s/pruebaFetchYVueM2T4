
let urlChamber;
if (document.title.includes("House")) {
    urlChamber = "https://api.propublica.org/congress/v1/117/house/members.json"
}
if (document.title.includes("Senate")) {
    urlChamber = "https://api.propublica.org/congress/v1/117/senate/members.json"
}

const options = {
    method: "GET",
    headers: {
        "X-API-Key": "IQjTDD8UFLjZoGY0vmbNKlh6mmSykBT3NzYKz7aP"
    }
}

const { createApp } = Vue

createApp({
    data() {
        return {

            memberChamber: [],
            statistics: {
                D: "Democrats",
                R: "Republicans",
                ID: "Independents",
                AllMembers: "Total",
                numberOfAllMembers: 0,
                numberOfD: 0,
                numberOfR: 0,
                numberOfID: 0,
                votesAllMembers: 0,
                votesD: 0,
                votesR: 0,
                votesID: 0,
                lessLoyal: [],
                mostLoyal: [],
                mostEngaged: [],
                lessEngaged: [],
            }
        }
    },
    methods: {
        filtered: function (typeOfVotes, boolean) {
            let sorted = this.memberChamber.filter(member => member.total_votes).sort((a, b) => boolean ? a[typeOfVotes] - b[typeOfVotes] : b[typeOfVotes] - a[typeOfVotes]);/*.slice(0, (this.memberChamber.length * 0.1))*/
            let tenPerCent = Math.ceil(this.memberChamber.length * 0.1);
            let reference = sorted[tenPerCent - 1][typeOfVotes];
            if (boolean) {
                return sorted.filter(member => member[typeOfVotes] <= reference);
            } else {
                return sorted.filter(member => member[typeOfVotes] >= reference);
            }
        },
        average: function (numberOfMember, party) {
            let sum = this.memberChamber.filter(member => member.votes_with_party_pct !== undefined).filter(member => member.party === party).map(member => member.votes_with_party_pct).reduce((acc, act) => acc + act, 0);
            if (sum) {
                return (sum / numberOfMember).toFixed(2);
            } else {
                return 0
            }
        },
        makeStatistics: function () {
            this.statistics.numberOfAllMembers = this.memberChamber.length;
            this.statistics.numberOfD = this.memberChamber.filter(member => member.party === "D").length;
            this.statistics.numberOfR = this.memberChamber.filter(member => member.party === "R").length;
            this.statistics.numberOfID = this.memberChamber.filter(member => member.party === "ID").length;
            this.statistics.votesAllMembers = (this.memberChamber.filter(member => member.votes_with_party_pct !== undefined).map(member => member.votes_with_party_pct).reduce((acc, act) => acc + act,0) / this.statistics.numberOfAllMembers).toFixed(2);
            this.statistics.votesD = this.average(this.statistics.numberOfD, "D");
            this.statistics.votesR = this.average(this.statistics.numberOfR, "R");
            this.statistics.votesID = this.average(this.statistics.numberOfID, "ID");
            this.statistics.mostLoyal = this.filtered("votes_with_party_pct", false);
            this.statistics.lessLoyal = this.filtered("votes_with_party_pct", true);
            this.statistics.mostEngaged = this.filtered("missed_votes_pct", true);
            this.statistics.lessEngaged = this.filtered("missed_votes_pct", false);
        }

    },

    created() {
        fetch(urlChamber, options)
            .then(res => res.json())
            .then(datos => {
                this.memberChamber = Array.from(datos.results[0].members);
                this.makeStatistics();
                
            })
            .catch(error => console.log(error));
    },
    computed: {
        
    }


}).mount('#mainTwo');










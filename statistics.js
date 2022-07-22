let statistics = {
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

const membersSenate = Array.from(senate.results[0].members);
const membersHouse = Array.from(house.results[0].members);
let tableOne = document.querySelector("#table-one");
let tableLessLoyal = document.querySelector("#table-less-loyal");
let tableMostLoyal = document.querySelector("#table-most-loyal");
let tableLessEngaged = document.querySelector("#table-less-engaged");
let tableMostEngaged = document.querySelector("#table-most-engaged");
let party = [];

printAllTables("Attedance: Senate","Party Loyalty: Senate", membersSenate);
printAllTables("Attendance: House","Party Loyalty: House", membersHouse);

//Imprime las tablas correspondientes a cada chamber
function printAllTables(documentTitleOne, documentTitleTwo, chamber) {
    if (document.title === documentTitleOne || document.title === documentTitleTwo) {
            party = partys(chamber);
            makeStatistics(party, chamber);
            tableGlance(tableOne, party);
            printMembers("lessLoyal", "loyal", tableLessLoyal);
            printMembers("mostLoyal", "loyal", tableMostLoyal);
            printMembers("lessEngaged", "engaged", tableLessEngaged);
            printMembers("mostEngaged", "engaged", tableMostEngaged);
        } 
}

//Crea los valores pedidos de estadisticas
function makeStatistics(partys, members) {
    for (i = 0; i < partys.length; i++) {
        let membersParty = partyMembers(members, partys[i]);
        statistics[`numberOf${partys[i]}`] = (numberMembers(membersParty)).toString();
        statistics[`votes${partys[i]}`] = (averageOfVotes(statistics[`numberOf${partys[i]}`], membersParty)).toFixed(2);
    }
    statistics.lessLoyal = pctVotes(members, "votes_with_party_pct", true);
    statistics.mostLoyal = pctVotes(members, "votes_with_party_pct", false);
    statistics.mostEngaged = pctVotes(members, "missed_votes_pct",true);
    statistics.lessEngaged = pctVotes(members, "missed_votes_pct", false);
}

//Creates an array with partys of a chamber and all members
function partys(members) {
    let partys = [];
    members.map(member => {
        if (!partys.includes(member.party)) {
            partys.push(member.party);
        }
    })
    partys.push("AllMembers")
    return partys;
}

//Imprime la cantidad de miembros de cada partido y de todos los miembros y el porcentaje de voto de cada uno.
function tableGlance(table, partys) {
    let fragment = document.createDocumentFragment();
    let tableBody = table.children[1];
    for (i = 0; i < partys.length; i++) {
        let tr = document.createElement("tr");
        let tdParty = document.createElement("td");
        tdParty.textContent = statistics[`${partys[i]}`];
        let tdNumMembers = document.createElement("td");
        tdNumMembers.textContent = statistics[`numberOf${partys[i]}`];
        let tdVotes = document.createElement("td");
        tdVotes.textContent = `${statistics[`votes${partys[i]}`]}%`;
        tr.append(tdParty, tdNumMembers, tdVotes);
        fragment.appendChild(tr);
    }
    tableBody.appendChild(fragment);
}

//Prints loyalty or attenddance
function printMembers(mostOrLeast, loyalOrEngaged, table) {
    let fragment = document.createDocumentFragment();
    let tableBody;
    if (table !== null) {
        tableBody = table.children[1];
        let votes = statistics[mostOrLeast];
        votes.forEach(member => {
            let tr = document.createElement("tr");
            let tdName = document.createElement("td");
            let middle_name;
            if (member.middle_name) {
                middle_name = member.middle_name;
            } else {
                middle_name = "";
            }
            tdName.textContent = `${member.first_name} ${middle_name} ${member.last_name}`
            let tdNumPartyVotes = document.createElement("td");
            let tdPctVotes = document.createElement("td");
            if (loyalOrEngaged === "loyal") {
                tdNumPartyVotes.textContent = member.total_votes;
                tdPctVotes.textContent = `${member.votes_with_party_pct}%`;
            } else if (loyalOrEngaged === "engaged") {
                tdNumPartyVotes.textContent = member.missed_votes;
                tdPctVotes.textContent = `${member.missed_votes_pct}%`;
            }
            tr.append(tdName, tdNumPartyVotes, tdPctVotes);
            fragment.appendChild(tr);
        })
        tableBody.appendChild(fragment);
    }
}

//Array with members of a party
function partyMembers(members, p4rty) {
    if (p4rty == "AllMembers") {
        return members;
    }
    return members.filter(member => member.party === p4rty);
}

//Calcula el promedio de votos
function averageOfVotes(numOfMembers, members) {
    let votes = members.filter(member => member.votes_with_party_pct !== undefined).map(member => member.votes_with_party_pct);
    let sum = votes.reduce((acc, act) => acc + act);
    let avg = sum / parseInt(numOfMembers);
    return avg;
}

//Cuenta la cantidad de miembros
function numberMembers(partyMembers) {
    let numberMembers = partyMembers.length;
    return numberMembers;
}

//Analiza el 10% de miembros que tienen la mayor o menor cantidad de un tipo de votos
function pctVotes(members, typeOfVotes, boolean) {
    let sorted = members.filter(member => member.total_votes).sort((a, b) => boolean ? a[typeOfVotes] - b[typeOfVotes] : b[typeOfVotes] - a[typeOfVotes]);
    let tenPerCent = Math.ceil(numberMembers(members) * 0.10);
    let reference = sorted[tenPerCent - 1][typeOfVotes];
    if (boolean) {
        return sorted.filter(member => member[typeOfVotes] <= reference);
    } else {
        return sorted.filter(member => member[typeOfVotes] >= reference);
    }
}
 

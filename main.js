// const copiaSenate = Array.from(senate.results[0].members);
const tableSenate = document.querySelector("#senate-data");
// const copiaHouse = Array.from(house.results[0].members);
const tableHouse = document.querySelector("#house-data");
const checkboxesHouse = document.querySelector("#checkboxesHouse");
const selectHouse = document.querySelector("#selectHouse");
const checkboxesSenate = document.querySelector("#checkboxesSenate");
const selectSenate = document.querySelector("#selectSenate");
const caption = document.querySelector("#caption");
const goToTop = document.querySelector("#go-to-top");
let targeted = [];
let select = " ";
const urlHouse = "https://api.propublica.org/congress/v1/117/house/members.json";
const urlSenate = "https://api.propublica.org/congress/v1/117/senate/members.json";
const options = {
method: "GET",
headers : {
  "X-API-Key" : "IQjTDD8UFLjZoGY0vmbNKlh6mmSykBT3NzYKz7aP"
}
}

fetch(urlHouse,options)
function getData() {

}
//imprime la tabla en la página que corresponda
// if (document.title === "Senate") {
//   printTable(copiaSenate, tableSenate);
//   listenerCheck(copiaSenate, tableSenate, checkboxesSenate);
//   listenerSelect(copiaSenate, tableSenate, selectSenate);

// } else if (document.title === "House") {
//   printTable(copiaHouse, tableHouse);
//   listenerCheck(copiaHouse, tableHouse, checkboxesHouse);
//   listenerSelect(copiaHouse, tableHouse, selectHouse);
// };

function printTable(members, table) {
  if (members.length === 0) {
    caption.textContent = "No results found";
  } else {
    caption.textContent = undefined;
  }
  if (members.length < 15) {
    goToTop.classList.remove("d-block");
    goToTop.classList.add("d-none");
  } else if (members.length >= 15) {
    goToTop.classList.remove("d-none");
    goToTop.classList.add("d-block");
  }
  let tableBody = table.children[3];
  tableBody.innerHTML = " ";
  let information = document.createDocumentFragment();
  members.forEach(member => {
    let tdUno = document.createElement("td");
    let name = member.first_name;
    if (member.middle_name != null) {
      name += ` ${member.middle_name}`;
    }
    name += ` ${member.last_name}`;
    name = name.replace("?", ". ");
    nameLink = document.createElement("a");
    nameLink.setAttribute("href", `${member.url}`);
    nameLink.setAttribute("target", "_blank");
    nameLink.setAttribute("class", "font-green bold")
    nameLink.textContent = name;
    tdUno.appendChild(nameLink);
    let tdDos = document.createElement("td");
    tdDos.textContent = member.party;
    let tdTres = document.createElement("td");
    tdTres.textContent = member.state;
    let tdCuatro = document.createElement("td");
    tdCuatro.textContent = member.seniority;
    let tdCinco = document.createElement("td");
    member.votes_with_party_pct === undefined ? tdCinco.textContent = "-" : tdCinco.textContent = `${member.votes_with_party_pct}%`;
    let tr = document.createElement("tr");
    tr.append(tdUno, tdDos, tdTres, tdCuatro, tdCinco);
    information.appendChild(tr);
  })
  tableBody.appendChild(information);
}

//filtra por partido
function filterByParty(members, values) {
  let filter = [];
  switch (targeted.length) {
    case 1: filter = members.filter(member => member.party === values[0]);
      break;
    case 2: filter = members.filter(member => member.party === values[0] || member.party === values[1]);
      break;
    case 3: filter = members;
      break;
  }
  return filter;
}

//escucha los checkboxes
function listenerCheck(members, table, checkboxes) {
  checkboxes.addEventListener("change", (event) => {
    if (!targeted.includes(`${event.target.value}`)) {
      targeted.push(`${event.target.value}`);
    } else if (targeted.includes(`${event.target.value}`)) {
      let index = targeted.indexOf(`${event.target.value}`);
      targeted.splice(index, 1);
    }
    if (select === " " || select === "States") {
      if (targeted.length === 0) {
        printTable(members, table);
      } else {
        const filtered = filterByParty(members, targeted);
        printTable(filtered, table);
      }
    }
    else {
      if (targeted.length === 0) {
        const filtered = filterByState(members, select);
        printTable(filtered, table);
      }
      const filteredState = filterByState(members, select)
      const filtered = filterByParty(filteredState, targeted);
      printTable(filtered, table);
    }
  })
}

//filtra por estado
function filterByState(members, value) {
  const filterByState = members.filter(member => member.state === value);
  return filterByState;
}

//escucha el select
function listenerSelect(members, table, element) {
  element.addEventListener("change", (event) => {
    if (targeted.length === 0) {
      if (event.target.value === "States") {
        printTable(members, table);
      } else {
        let filteredState = filterByState(members, event.target.value);
        printTable(filteredState, table);
      }
    } else if (targeted.length !== 0) {
      if (event.target.value === "States") {
        let filtered = filterByParty(members, targeted);
        printTable(filtered, table);
      } else {
        let filtered = filterByParty(members, targeted);
        let filteredState = filterByState(filtered, event.target.value);
        printTable(filteredState, table);
      }
    }
    select = event.target.value;
  })
}











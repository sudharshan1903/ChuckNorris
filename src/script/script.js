console.log("linked");
let mainDiv = document.createElement("div");
mainDiv.classList.add("container");
document.body.append(mainDiv);

let secDiv = document.createElement("div");
secDiv.classList.add("second-div");
mainDiv.append(secDiv);

let urlRandom = "https://api.chucknorris.io/jokes/random";
let urlCat = "https://api.chucknorris.io/jokes/categories";

let urlFetch = async () => {
  try {
    let res = await fetch(urlRandom);
    let data = await res.json();
    let res2 = await fetch(urlCat);
    let data2 = await res2.json();
    return { random: data, categories: data2 };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

urlFetch().then(({ random, categories }) => {
  workHtml(random, categories);
}).catch(error => console.log(error));

let workHtml = (random, categories) => {
  let getRegInnerHtml = `
    <div class="card text-center mt-5">
        <div class="card-header d-flex justify-content-center">
            <div class="dropdown">
                <button id="dropButton" class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Chuck Norris Random Joke Categories
                </button>
                <ul class="dropdown-menu">
                    ${categories.map(data => `<li><a class="dropdown-item" onClick="dropButton('${data}')" href="#">${data}</a></li>`).join("")}
                </ul>
            </div>
        </div>
        <div class="card-body">
            <p id="headingCont" class="card-text">${random.value}</p>
            <a id="clickMe" href="#" class="btn btn-primary">Click for Random Jokes</a>
            <a id="refresh" href="#" class="btn btn-secondary">Refresh<i class="bi bi-arrow-clockwise"></i></a>
        </div>
        <div id="updateTime" class="card-footer text-body-secondary">${random.updated_at}</div>
    </div>`;
  
  secDiv.innerHTML = getRegInnerHtml;

  let refresh = document.getElementById("refresh");
  refresh.addEventListener("click", () => {
    let getReg = document.querySelector(".dropdown-menu");
    getReg.innerHTML = categories.map(data => `<li><a class="dropdown-item" onClick="dropButton('${data}')" href="#">${data}</a></li>`).join("");
  });

  let selClickMe = document.getElementById("clickMe");
  selClickMe.addEventListener("click", () => {
    urlFetch().then(({ random }) => {
      let updateTime = document.getElementById("updateTime");
      updateTime.innerText = random.updated_at;
      let selHeadingCont = document.getElementById("headingCont");
      selHeadingCont.innerText = random.value;
    });
  });
};

let dropButton = (data) => {
  let btnSel = document.querySelector("#dropButton");
  let dropDnBtn = `Chuck Norris Random ${data} Joke`;
  btnSel.innerText = dropDnBtn;
  let genButton = document.getElementById("clickMe");
  genButton.setAttribute("onClick", `genButtonClickme('${data}')`);
  genButton.innerText = `Click for Random ${data} Jokes`;
};

let genButtonClickme = async (data) => {
  let dataUrl = `https://api.chucknorris.io/jokes/random?category=${data}`;
  try {
    let urlSelCat = await fetch(dataUrl);
    let jsonData = await urlSelCat.json();
    let updateTime = document.getElementById("updateTime");
    updateTime.innerText = jsonData.updated_at;
    let headingCont = document.getElementById("headingCont");
    headingCont.innerText = `${jsonData.value}`;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

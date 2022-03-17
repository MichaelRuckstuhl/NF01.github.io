
const domOn = (selector, event, callback) => {
    document.querySelectorAll(selector).forEach(el => el.addEventListener(event, callback))
}

const win = (score) => {
    let rang = ""
    if (score < 10 ) {
        rang = "SILVER"
    } else if (score < 20) {
        rang = "GOLD"
    }else if (score < 38) {
        rang = "PLATINE"
    } else {
        rang = "MASTER"
    }

    return rang
}

localStorage.setItem('question', 0);
localStorage.setItem('total', 0);
const TEMP_QUESTION = document.querySelector(".question");
const TEMP_RESPONSE = document.querySelector(".response");

const finish = new Event("finish")


const test = [
    {
        question: "Tu es plutôt ... ",
        response: [
            {
                script: "GIFTBOOSTER",
                point: 10
            },
            {
                script: "GHOSTBUSTER",
                point: 5
            },
        ]
    },
    {
        question: "Combien de commerçants existent dans la Suisse romande ? ",
        response: [
            {
                script: "Aucun, je suis survivaliste ",
                point: 3
            },
            {
                script: "1 à 10’000 ",
                point: 20
            },
            {
                script: "10’001 à 100’000 ",
                point: 1
            },
            {
                script: "Je n’ai pas assez de doigts pour tous les compter  ",
                point: 10
            },
        ]
    },
    {
        question: "« BOOSTER » pour toi, c’est quoi ? ",
        response: [
            {
                script: "Amplificateur ",
                point: 5
            },
            {
                script: "Réducteur ",
                point: 0
            },
            {
                script: "Accélérateur ",
                point: 10
            },
            {
                script: "C’est pas une carte Pokémon ? ",
                point: 10
            },
        ]
    },
    {
        question: "Tu préfères aider une personne qui en a besoin, ou profiter d’une super offre proposée par un commerçant de ta région?",
        response: [
            {
                script: "Aider",
                point: 5
            },
            {
                script: "Profiter",
                point: 0
            },
            {
                script: "J'aimerais qu'une platerforme me donne la possibilité de faire les deux ",
                point: 10
            },
        ]
    },
]



domOn("#begin", "click", async (evt) => {
    document.querySelector("#startPage").classList.add("hidden")
    document.querySelector("#quizz").classList.remove("hidden")

    let nbquestion = localStorage.getItem("question")
    TEMP_QUESTION.textContent = test[nbquestion].question;
    document.querySelectorAll(".response").forEach(el => el.remove())



    for (const response of test[nbquestion].response) {
        let cloneResponse = TEMP_RESPONSE.cloneNode(true)
        cloneResponse.textContent = response.script
        cloneResponse.classList.remove("blue")
        cloneResponse.setAttribute('data-point', response.point)
        document.querySelector("#globalresponse").appendChild(cloneResponse)


    }

    localStorage.setItem("question", parseInt(nbquestion) + 1)
})




domOn("#next", "click", async (evt) => {





    let givenresponses = document.querySelectorAll(".response");
    for (const iterator of givenresponses) {
        if (parseInt(iterator.getAttribute("data-bool")) === 1) {
            localStorage.setItem("total", (parseInt(localStorage.getItem("total")) + parseInt(iterator.getAttribute("data-point"))))
        }
    }

    let nbquestion = localStorage.getItem("question")
    if (nbquestion > Object.keys(test).length - 1) {
        return document.dispatchEvent(finish);

    }


    document.querySelectorAll(".response").forEach(el => el.remove())




    TEMP_QUESTION.textContent = test[nbquestion].question;



    for (const response of test[nbquestion].response) {

        let cloneResponse = TEMP_RESPONSE.cloneNode(true)
        cloneResponse.textContent = response.script
        cloneResponse.classList.remove("blue")
        cloneResponse.setAttribute('data-point', response.point)
        document.querySelector("#globalresponse").appendChild(cloneResponse)


    }






    localStorage.setItem("question", parseInt(nbquestion) + 1)






})



domOn("#globalresponse", "click", async (evt) => {
    const target = evt.target;
    if (!target.classList.contains('response')) return;
    if (!target.classList.contains('blue')) {
        document.querySelectorAll(".response").forEach(el => {
            el.classList.remove("blue")
            el.setAttribute('data-bool', 0)
        })
        target.classList.add("blue")
        target.setAttribute('data-bool', 1)
    }
})



document.addEventListener("finish", async (evt) => {
    document.querySelector("#startPage").classList.add("hidden")
    document.querySelector("#quizz").classList.add("hidden")
    document.querySelector("#end").classList.remove("hidden")
    const grade = win(localStorage.getItem("total"))
    document.querySelector("#number").textContent = localStorage.getItem("total")
    document.querySelector("#level").textContent = grade
    document.getElementById("stringmail").focus();
})


domOn("#submitemail", "click", async (evt) => {
    const email = document.querySelector("#stringmail").value

    if (email.length > 0) {
        try {
            const response = await fetch("https://calm-headland-16602.herokuapp.com/", {
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
                body: JSON.stringify({ email: email })

            })
        } catch (err) {
            return console.log(err)
        }


        document.querySelector("#email").remove();
        document.querySelector("#congrats").textContent = "Un tout GRAND Merci pour ta participation ! "


    }




})




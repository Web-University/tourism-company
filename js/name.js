window.addEventListener('DOMContentLoaded', () => {
    let name = localStorage.getItem("name")
    if (!name){
        setTimeout(() => {
            name = prompt("Як ми можемо до вас звертатись?", "")
            if(name){
                localStorage.setItem("name", name);
                document.querySelector("#UserName").innerHTML = `Ми вже чекаємо на ваш дзвінок : ${name.toUpperCase()}`;
            }
        }, 2000)
    }
    document.querySelector("#UserName").innerHTML = `Ми вже чекаємо на ваш дзвінок : ${name.toUpperCase()||""}`;
    toUpperCase
});

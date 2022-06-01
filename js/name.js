window.addEventListener('DOMContentLoaded', () => {
    let name = localStorage.getItem("name")
    if (!name){
        setTimeout(() => {
            name = prompt("Як ми можемо до вас звертатись?", "")
            if(name){
                localStorage.setItem("name", name);
                document.querySelector("#UserName").innerHTML = `${name.toUpperCase()}: ми чекаємо на ваш дзвінок!`;
            }
        }, 2000)
    }
    document.querySelector("#UserName").innerHTML = `${name.toUpperCase()||""}: ми чекаємо на ваш дзвінок!`;
});

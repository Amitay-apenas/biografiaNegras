const menuToShow = document.querySelector(".menuNav");
const button = document.getElementById("menuButton");

button.addEventListener('click', ()=>{
    menuToShow.classList.toggle('active')
    button.classList.toggle('moved')
    console.log("fui molestado")
})

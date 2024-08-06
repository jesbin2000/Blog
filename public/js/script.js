document.addEventListener('DOMContentLoaded',()=>{
    const allButtons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');
    for(var i=0; i<allButtons.length;i++){
            allButtons[i].addEventListener('click',function(){
                searchBar.style.visibility='visible';
                searchBar.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
                searchInput.focus();

            })
    }
            searchClose.addEventListener('click',function(){
                searchBar.style.visibility='hidden';
                searchBar.classList.remove('open');
                this.setAttribute('aria-expanded', 'false');
                searchInput.focus();
                header.style.paddingTop = '20px';
            })
});


const header = document.querySelector('.header');
const searchBtns = document.getElementsByClassName("searchBtn");
for (let i = 0; i < searchBtns.length; i++) {
    searchBtns[i].addEventListener('click', () => {
        header.style.paddingTop = '60px';
    });
}

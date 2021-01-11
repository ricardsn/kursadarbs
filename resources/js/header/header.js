const header = document.getElementById('main-header');
const url = window.location.pathname.split('/');
const jumbotron = document.getElementsByClassName('jumbotron')[0];

if (url[1] === '') { //changing text and image depending on module
    header.innerText = 'Makšķerēšanas klubs';
    jumbotron.classList.add('Pike');
} else if (url[1] === 'reservoir') {
    header.innerText = 'Ūdenstilpne';
    jumbotron.classList.add('Zander');
} else if (url[1] === 'forum') {
    header.innerText = 'Diskusija';
    jumbotron.classList.add('Pike');
} else if (url[1] === 'fish') {
    header.innerText = 'Zivs suga';
    jumbotron.classList.add('Zander');
} else {
    header.innerText = 'Profils';
    jumbotron.classList.add('Pike');
}

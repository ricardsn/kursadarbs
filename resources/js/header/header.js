const header = document.getElementById('main-header');
const url = window.location.pathname.split('/');
const jumbotron = document.getElementsByClassName('jumbotron')[0];

if (url[1] === '') {
    header.innerText = 'Makšķerēšanas klubs';
    jumbotron.classList.add('Pike');
} else if (url[1] === 'reservoir') {
    header.innerText = 'Karte';
    jumbotron.classList.add('Zander');
} else {
    header.innerText = 'Default';
    jumbotron.classList.add('Default');
}

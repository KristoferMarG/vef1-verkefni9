//const API_URL = '/example.json?domain=';
const API_URL = 'http://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {

	var input;
	var output;

  function submitSearch(e) {

  	e.preventDefault();
  	var txt = input.value

  	//athugum hvort inntak sé tómt
  	if(txt.length == 0) { 
  		errorMessage('Lén verður að vera strengur ');}
    else { search(input.value);}

  }


  function search(domain) {

  	//Skilgreina url fyrir API
  	var url = API_URL + domain;
  	var request = new XMLHttpRequest();

  	//sýna loading img
  	loading();

  	request.open('GET', url, true);


  	request.onload=function() {
  		var file = JSON.parse(request.response);

  		//athugar hvort niðurstöður séu til staðar
  		if(file.results[0] != null){
  			results(file.results[0]);}
  		else {errorMessage('Lén er ekki skráð');}
  	};

  	request.onerror = function () {
  		errorMessage('Villa við að sækja gögn');
  	};

  	request.send();
  }


  function create(name,child){

  	 var el = document.createElement(name);

    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (typeof child === 'object') {
      el.appendChild(child)
    }

    return el;
  }


  function empty(create){
  	  while(create.firstChild) {
      create.removeChild(create.firstChild);
    }
  }


  function loading() {
  	empty(output);
    var loading = create('div');
    loading.classList.add('loading');

    var img = create('img');
    img.setAttribute('src', 'loading.gif');

    loading.appendChild(img);
    output.appendChild(loading);
  }


  function errorMessage (error){
  	empty(output);
    output.appendChild(create('h3', error));
  }


  function results (data) {

    empty(output);

    var domain = data.domain;
    var registered = data.registered;
    var lastChange = data.lastChange;
    var expires = data.expires;
    var registerName = data.registrantname;
    var email = data.email;
    var address = data.address;
    var country = data.country;


    // Svo dagsetningar sé (yyyy-mm-dd)
    var re = new Date(registered);
	var reg = re.toISOString();
	var las = new Date(lastChange);
	var last = las.toISOString();
	var ex = new Date(expires);
	var exp = ex.toISOString();


	//sýnir allar upplýsingar sem þurfa vera til staðar 
    var list = create('dl');
    list.appendChild(create('dt', 'Lén'));
    list.appendChild(create('dd', domain));

    list.appendChild(create('dt', 'Skráð'));
    list.appendChild(create('dd', reg.substring(0,10)));

    list.appendChild(create('dt', 'Seinast Breytt'));
    list.appendChild(create('dd', last.substring(0,10)));

    list.appendChild(create('dt', 'Rennur út'));
    list.appendChild(create('dd', exp.substring(0,10)));

    //athuga ef upplýsingar eru til staðar þá sýna þær
    if(data.registrantname != "") {
    list.appendChild(create('dt', 'Skráningaraðili'));
    list.appendChild(create('dd', registerName));}

    if(data.email != "") {
    list.appendChild(create('dt', 'Netfang'));
    list.appendChild(create('dd', email));}

    if(data.address != "") {
    list.appendChild(create('dt', 'Heimilisfang'));
    list.appendChild(create('dd', address));}

	if(data.country != "") {
    list.appendChild(create('dt', 'Land'));
    list.appendChild(create('dd', country)); }


    //bæta öllum upplýsingum sem eru til staðar við output
    output.appendChild(list);

  }

  function init(domains) {

  	var form = domains.querySelector('form');
    input =    domains.querySelector('input');
    output =   domains.querySelector('.results');
    form.addEventListener('submit', submitSearch);

  }


  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {

  // Sækji öll domains með querySelector
  var domains = document.querySelector('.domains');
  program.init(domains);
});

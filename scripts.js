const API_URL = 'http://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let input;
  let output;

  function create(name, child) {
    const el = document.createElement(name);

    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (typeof child === 'object') {
      el.appendChild(child);
    }

    return el;
  }

  function empty(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function results(data) {
    empty(output);

    const { domain } = data;
    const { registered } = data;
    const { lastChange } = data;
    const { expires } = data;
    const { registrantname } = data;
    const { email } = data;
    const { address } = data;
    const { country } = data;


    // Svo dagsetningar sé (yyyy-mm-dd)
    const re = new Date(registered);
    const reg = re.toISOString();
    const las = new Date(lastChange);
    const last = las.toISOString();
    const ex = new Date(expires);
    const exp = ex.toISOString();


    // sýnir allar upplýsingar sem þurfa vera til staðar
    const list = create('dl');
    list.appendChild(create('dt', 'Lén'));
    list.appendChild(create('dd', domain));

    list.appendChild(create('dt', 'Skráð'));
    list.appendChild(create('dd', reg.substring(0, 10)));

    list.appendChild(create('dt', 'Seinast Breytt'));
    list.appendChild(create('dd', last.substring(0, 10)));

    list.appendChild(create('dt', 'Rennur út'));
    list.appendChild(create('dd', exp.substring(0, 10)));

    // athuga ef upplýsingar eru til staðar þá sýna þær
    if (data.registrantname !== '') {
      list.appendChild(create('dt', 'Skráningaraðili'));
      list.appendChild(create('dd', registrantname));
    }

    if (data.email !== '') {
      list.appendChild(create('dt', 'Netfang'));
      list.appendChild(create('dd', email));
    }

    if (data.address !== '') {
      list.appendChild(create('dt', 'Heimilisfang'));
      list.appendChild(create('dd', address));
    }

    if (data.country !== '') {
      list.appendChild(create('dt', 'Land'));
      list.appendChild(create('dd', country));
    }

    // bæta öllum upplýsingum sem eru til staðar við output
    output.appendChild(list);
  }

  function errorMessage(error) {
    empty(output);
    output.appendChild(create('h3', error));
  }

  function loading() {
    const load = create('div');
    const img = create('img');
    empty(output);
    load.classList.add('load');

    img.setAttribute('src', 'loading.gif');

    load.appendChild(img);
    output.appendChild(load);
  }

  function search(domain) {
    // Skilgreina url fyrir API
    const url = API_URL + domain;
    const request = new XMLHttpRequest();

    // sýna loading img
    loading();

    request.open('GET', url, true);

    request.onload = function f1() {
      const file = JSON.parse(request.response);

      // athugar hvort niðurstöður séu til staðar
      if (file.results[0] != null) {
        results(file.results[0]);
      } else {
        errorMessage('Lén er ekki skráð');
      }
    };

    request.onerror = function f2() {
      errorMessage('Villa við að sækja gögn');
    };

    request.send();
  }


  function submitSearch(e) {
    const txt = input.value;
    e.preventDefault();

    // athugum hvort inntak sé tómt
    if (txt.length === 0) {
      errorMessage('Lén verður að vera strengur ');
    } else {
      search(input.value);
    }
  }

  function init(domains) {
    const form = domains.querySelector('form');
    input = domains.querySelector('input');
    output = domains.querySelector('.results');
    form.addEventListener('submit', submitSearch);
  }


  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  // Sækji öll domains með querySelector
  const domains = document.querySelector('.domains');
  program.init(domains);
});

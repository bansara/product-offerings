const app = document.getElementById('app');
const create = type => document.createElement(type);

const URL = 'https://acme-users-api-rev.herokuapp.com/';

const apiFetch = (endpoint) =>  {
   return fetch(`${URL}${endpoint}`)
    .then(res => res.json())
    .then(data => data)
}

let offerings, companies, products;

Promise.all([
    apiFetch('api/products'),
    apiFetch('api/offerings'),
    apiFetch('api/companies'),
]).then(response => {
    products = response[0];
    offerings = response[1];
    companies = response[2];
    console.log(products,offerings,companies)
}).then(stuff => {
    render();
}).catch(e => console.error(e))

const getCompanyById = id => {
    return companies.reduce((a,c) => {
        if (c.id === id) a = c.name;
        return a;
    }, '')
}

const createProductCard = (product) => {
    const div = create('div');
    div.classList.add('productCard');
    const a = create('a');
    a.innerText = `${product.name}`;
    a.style['text-decoration'] = 'underline';
    a.setAttribute('href', `#${product.name}`)
    const h3 = create('h3');
    h3.innerText = `${product.description}`;
    const p = create('p');
    p.innerText = `msrp: $${product.suggestedPrice}`;
    const ul = create('ul');

    
    

    const offerers = offerings.filter(offer => {
        return offer.productId === product.id
    }).map(offer => {
        return `<li>Offered by: ${getCompanyById(offer.companyId)} at $${offer.price}</li>`
    }).join('');
    
    
    ul.innerHTML = offerers;
    
    div.append(a);
    div.append(h3);
    div.append(p);
    div.append(ul);
    app.append(div);
}

let singleProduct = false;
let selectedProduct = null;

window.addEventListener('hashchange', () => {
    selectedProduct = window.location.hash.slice(1);
    singleProduct = true;
    render()
})

const buttonCreator = () => {
    const button = create('button');
    button.innerText = 'Home';
    button.addEventListener('click', (e) => {
        singleProduct = false;
        window.location = '';
    })
    return button;
}

const render = () => {
    app.innerHTML = '';
    const activeProduct = products.filter(product => product.name === selectedProduct)[0];
    if(singleProduct) {
        app.append(buttonCreator())
        app.style['flex-direction'] = 'column';
        app.style['align-items'] = 'center';
        createProductCard(activeProduct);
    } else {
        app.style['flex-direction'] = 'row';
        products.forEach(product => createProductCard(product));
    }
    console.log()
}

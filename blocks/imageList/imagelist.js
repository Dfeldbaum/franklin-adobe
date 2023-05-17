function getMetadata(name, doc) {
    const attr = name && name.includes(':') ? 'property' : 'name';
    const meta = [...doc.head.querySelectorAll(`meta[${attr}="${name}"]`)].map((m) => m.content).join(', ');
    return meta || '';
  }
  
  async function loadFragment(path) {
    if (path && path.startsWith('/')) {
      const resp = await fetch(path);
      if (resp.ok) {
        const parser = new DOMParser();
        return parser.parseFromString(await resp.text(), 'text/html');
      }
    }
    return null;
  }
  
  export default async function decorate(block) {
    [...block.children].forEach(async (div) => { // find imagelist block 
      const link = div.querySelector('div>div>a'); // build divs
      const path = link ? link.getAttribute('href') : block.textContent.trim(); // load the fragment
      const doc = await loadFragment(path); // add fragment to doc variable
      div.remove();
  
      const heroPicture = doc.querySelector('picture');
      const title = getMetadata('og:title', doc);
      const desc = getMetadata('og:description', doc);
  
      const card = document.createElement('div');
      card.classList.add('card');
  
      const h2 = document.createElement('h2');
      h2.textContent = title;
  
      const p = document.createElement('p');
      p.textContent = desc;
  
      card.appendChild(heroPicture);
      card.appendChild(h2);
      card.appendChild(p);
  
      const a = document.createElement('a');  
      a.href = doc.querySelector('link').href;
      a.appendChild(card);
  
      block.appendChild(a); //put everything inside a link and append 
    });
  }
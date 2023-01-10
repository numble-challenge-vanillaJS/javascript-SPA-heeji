function component() {
  const element = document.createElement('div');

  element.innerHTML = `<p>Heeji TS 호잇? 뀨..</p>`;

  return element;
}

document.body.appendChild(component());

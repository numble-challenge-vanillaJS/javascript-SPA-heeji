const postCreateHTML = () => {
  return `
      <main>
        <h1>글 작성 페이지</h1>
      </main>
      `;
};

interface IPostCreatePage {
  render: () => void;
}

interface IPostCreatePageConstructor {
  new ($parent: Element): IPostCreatePage;
}

// ****************************************************************************

/**
 * 글 작성 페이지
 */
export const PostCreatePage = function (
  this: IPostCreatePage,
  $parent: Element
) {
  const $el = document.createElement('main');
  $el.className = 'PostCreatePage';
  $el.innerHTML = postCreateHTML();

  this.render = () => {
    $parent.appendChild($el);
  };

  this.render();
} as unknown as IPostCreatePageConstructor;

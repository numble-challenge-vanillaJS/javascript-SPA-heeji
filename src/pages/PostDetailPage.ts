const postDetailHTML = (postID: string) => {
  return `
      <main>
        <h1>글 상세 페이지</h1>
        <p>${postID}</p>
      </main>
      `;
};

interface IPostDetailPage {
  render: () => void;
}

interface IPostDetailPageConstructor {
  new ($parent: Element, postID: string): IPostDetailPage;
}

// ****************************************************************************

/**
 * 글 상세 페이지
 * @param postID
 */
export const PostDetailPage = function (
  this: IPostDetailPage,
  $parent: Element,
  postID: string
) {
  const $el = document.createElement('main');
  $el.className = 'PostDetailPage';
  $el.innerHTML = postDetailHTML(postID);

  this.render = () => {
    $parent.appendChild($el);
  };

  this.render();
} as unknown as IPostDetailPageConstructor;

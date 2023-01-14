import { navigate } from '../router';

const postListHTML = () => {
  return `
      <main>
        <h1>글 목록 페이지</h1>

        <ul>
          <li data-post-id="1">
            <p>1</p>
          </li>
          <li data-post-id="2">
            <p>2</p>
          </li>
        </ul>
      </main>
      `;
};

interface IPostListPage {
  render: () => void;
}

interface IPostListPageConstructor {
  new ($parent: Element): IPostListPage;
}

// ****************************************************************************

/**
 * 글 목록 페이지
 */
export const PostListPage = function (this: IPostListPage, $parent: Element) {
  const $el = document.createElement('main');
  $el.className = 'PostListPage';
  $el.innerHTML = postListHTML();

  this.render = () => {
    $parent.appendChild($el);
  };

  this.render();

  $el.addEventListener('click', (ev: MouseEvent) => {
    const target = ev?.target as HTMLElement;
    const $li = target.closest('li');

    const { postId } = $li.dataset;

    if (postId) {
      navigate(`/post/${postId}`, null);
    }
  });
} as unknown as IPostListPageConstructor;

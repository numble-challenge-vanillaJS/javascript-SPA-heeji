import { navigate } from '../router';
import { Post } from '../types/Post';

interface IPostList {
  state: Post[];
  setState: (value: Post[]) => void;
  render: () => void;
}

interface IPostListConstructor {
  new ($parent: Element, postList: Post[]): IPostList;
}

// ****************************************************************************

/**
 * 글 목록 컴포넌트
 */
export const PostList = function (
  this: IPostList,
  $parent: Element,
  postList: Post[]
) {
  const $postList = document.createElement('ul');

  this.state = postList;

  this.setState = (value: Post[]) => {
    this.state = value;
    this.render();
  };

  this.render = () => {
    if (!this.state) {
      return;
    }

    $postList.innerHTML = '';

    $postList.innerHTML = `
      ${this.state
        .map(
          item => `
            <li class="product" data-post-id="${item.postId}">
              <div>
                <img 
                  src="${item.image}" 
                  alt="${item.postId} image" 
                  onError="this.src='https://img.freepik.com/premium-vector/magnifying-glass-404-isolated-white-background-vector-illustration_230920-1218.jpg?w=826';"
                  width="100px" 
                  height="100px" 
                />
                <p>
                  <h4>${item.title}</h4>
                  <p>${item.content}</p>

                </p>
              </div>
            </li>
          `
        )
        .join('')}
    `;

    $parent.appendChild($postList);
  };

  this.render();

  $postList.addEventListener('click', (ev: MouseEvent) => {
    const target = ev?.target as HTMLElement;
    const $li = target.closest('li');

    const { postId } = $li.dataset;

    if (postId) {
      navigate(`/post/${postId}`, null);
    }
  });
} as unknown as IPostListConstructor;

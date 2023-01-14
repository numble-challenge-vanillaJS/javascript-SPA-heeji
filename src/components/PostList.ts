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
  $parent.appendChild($postList);

  this.state = postList;

  this.setState = (value: Post[]) => {
    this.state = value;
    this.render();
  };

  this.render = () => {
    if (!this.state) {
      return;
    }

    $postList.innerHTML = `
      ${this.state
        .map(
          item => `
            <li class="product">
              <div>
                <img src="${item.image}" width="100px" height="100px" />
                <p>
                  <h4>${item.title}</h4>
                </p>
              </div>
            </li>
          `
        )
        .join('')}
    `;
  };

  this.render();
} as unknown as IPostListConstructor;

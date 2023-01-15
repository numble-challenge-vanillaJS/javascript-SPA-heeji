import { Post } from '../types/Post';
import { formatDate } from '../utils/dateUtil';

interface IPostDetail {
  state: Post;
  setState: (value: Post) => void;
  render: () => void;
}

interface IPostDetailConstructor {
  new ($parent: Element, post: Post): IPostDetail;
}

// ****************************************************************************

/**
 * 글 상세 컴포넌트
 */
export const PostDetail = function (
  this: IPostDetail,
  $parent: Element,
  post: Post
) {
  const $postDetail = document.createElement('section');

  this.state = {
    title: '',
    content: '',
    image: '',
    postId: '',
    createdAt: '',
    updatedAt: '',
  };

  this.setState = (value: Post) => {
    this.state = value;
    this.render();
  };

  this.render = () => {
    if (!this.state) {
      return;
    }

    $postDetail.innerHTML = '';
    $postDetail.innerHTML = `
      <img 
        src="${post.image}" 
        alt="${post.postId} image" 
        onError="this.src='https://img.freepik.com/premium-vector/magnifying-glass-404-isolated-white-background-vector-illustration_230920-1218.jpg?w=826';"
        width="640px" 
        height="320px"
      />
      <h3>${post.title}</h3>
      <p>${formatDate(new Date(post.createdAt))}</p>
      <p>${post.content}</p>

      <button>수정하기</button>
      <button>삭제하기</button>
    `;

    $parent.appendChild($postDetail);
  };

  this.render();
} as unknown as IPostDetailConstructor;
